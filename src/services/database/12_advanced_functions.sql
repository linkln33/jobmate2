-- JobMate Supabase Configuration: Advanced Functions and Triggers
-- This file defines advanced database functions and triggers for enhanced functionality

-- Create function to search listings with full-text search
CREATE OR REPLACE FUNCTION search_listings(
  search_term TEXT DEFAULT NULL,
  category_id UUID DEFAULT NULL,
  min_budget DECIMAL DEFAULT NULL,
  max_budget DECIMAL DEFAULT NULL,
  location TEXT DEFAULT NULL,
  max_distance INTEGER DEFAULT NULL,
  user_location POINT DEFAULT NULL,
  status TEXT[] DEFAULT ARRAY['open'],
  tags TEXT[] DEFAULT NULL,
  sort_by TEXT DEFAULT 'created_at',
  sort_direction TEXT DEFAULT 'desc',
  page_size INTEGER DEFAULT 10,
  page_number INTEGER DEFAULT 1
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  user_id UUID,
  category_id UUID,
  budget_min DECIMAL,
  budget_max DECIMAL,
  budget_type TEXT,
  location TEXT,
  location_lat DECIMAL,
  location_lng DECIMAL,
  status TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  distance DECIMAL,
  total_count BIGINT
) AS $$
DECLARE
  query TEXT;
  count_query TEXT;
  where_clauses TEXT[] := ARRAY['status = ANY($7)'];
  params TEXT[] := ARRAY[
    COALESCE(search_term, ''),
    COALESCE(category_id::TEXT, ''),
    COALESCE(min_budget::TEXT, ''),
    COALESCE(max_budget::TEXT, ''),
    COALESCE(location, ''),
    COALESCE(max_distance::TEXT, ''),
    ARRAY_TO_STRING(status, ',')
  ];
  param_count INTEGER := 7;
  total BIGINT;
BEGIN
  -- Add search term condition if provided
  IF search_term IS NOT NULL AND search_term <> '' THEN
    param_count := param_count + 1;
    where_clauses := where_clauses || format('(title ILIKE $%s OR description ILIKE $%s)', param_count, param_count);
    params := params || ('%' || search_term || '%');
  END IF;
  
  -- Add category condition if provided
  IF category_id IS NOT NULL THEN
    param_count := param_count + 1;
    where_clauses := where_clauses || format('category_id = $%s', param_count);
    params := params || category_id::TEXT;
  END IF;
  
  -- Add budget range conditions if provided
  IF min_budget IS NOT NULL THEN
    param_count := param_count + 1;
    where_clauses := where_clauses || format('budget_max >= $%s', param_count);
    params := params || min_budget::TEXT;
  END IF;
  
  IF max_budget IS NOT NULL THEN
    param_count := param_count + 1;
    where_clauses := where_clauses || format('budget_min <= $%s', param_count);
    params := params || max_budget::TEXT;
  END IF;
  
  -- Add location-based search if provided
  IF user_location IS NOT NULL AND max_distance IS NOT NULL THEN
    param_count := param_count + 1;
    where_clauses := where_clauses || format(
      'ST_DWithin(ST_SetSRID(ST_MakePoint(location_lng, location_lat), 4326)::geography, ST_SetSRID(ST_MakePoint($%s::FLOAT, $%s::FLOAT), 4326)::geography, $%s)',
      param_count, param_count + 1, param_count + 2
    );
    params := params || user_location[0]::TEXT || user_location[1]::TEXT || (max_distance * 1000)::TEXT;
    param_count := param_count + 2;
  END IF;
  
  -- Add tags filter if provided
  IF tags IS NOT NULL AND array_length(tags, 1) > 0 THEN
    param_count := param_count + 1;
    where_clauses := where_clauses || format(
      'EXISTS (SELECT 1 FROM listing_tags WHERE listing_id = listings.id AND tag = ANY($%s))',
      param_count
    );
    params := params || ARRAY_TO_STRING(tags, ',');
  END IF;
  
  -- Build the WHERE clause
  query := 'SELECT l.*, ';
  
  -- Add distance calculation if user location provided
  IF user_location IS NOT NULL THEN
    query := query || format(
      'ST_Distance(ST_SetSRID(ST_MakePoint(l.location_lng, l.location_lat), 4326)::geography, ST_SetSRID(ST_MakePoint(%s, %s), 4326)::geography) / 1000 AS distance, ',
      user_location[0], user_location[1]
    );
  ELSE
    query := query || 'NULL AS distance, ';
  END IF;
  
  -- Add count over for pagination
  query := query || 'COUNT(*) OVER() AS total_count ';
  query := query || 'FROM listings l ';
  
  -- Add WHERE clause
  IF array_length(where_clauses, 1) > 0 THEN
    query := query || 'WHERE ' || array_to_string(where_clauses, ' AND ');
  END IF;
  
  -- Add ORDER BY clause
  IF sort_by = 'distance' AND user_location IS NOT NULL THEN
    query := query || ' ORDER BY distance ' || sort_direction;
  ELSE
    query := query || ' ORDER BY ' || sort_by || ' ' || sort_direction;
  END IF;
  
  -- Add pagination
  query := query || format(' LIMIT %s OFFSET %s', page_size, (page_number - 1) * page_size);
  
  -- Execute the query
  RETURN QUERY EXECUTE query USING params;
END;
$$ LANGUAGE plpgsql;

-- Create function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(target_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_listings', (SELECT COUNT(*) FROM listings WHERE user_id = target_user_id),
    'active_listings', (SELECT COUNT(*) FROM listings WHERE user_id = target_user_id AND status = 'open'),
    'total_applications', (SELECT COUNT(*) FROM applications WHERE applicant_id = target_user_id),
    'accepted_applications', (SELECT COUNT(*) FROM applications WHERE applicant_id = target_user_id AND status = 'accepted'),
    'average_rating', (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE reviewee_id = target_user_id),
    'total_reviews', (SELECT COUNT(*) FROM reviews WHERE reviewee_id = target_user_id),
    'member_since', (SELECT created_at FROM profiles WHERE id = target_user_id),
    'completion_rate', (
      SELECT 
        CASE 
          WHEN COUNT(*) = 0 THEN 0
          ELSE ROUND((COUNT(*) FILTER (WHERE status = 'completed')::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
        END
      FROM applications 
      WHERE applicant_id = target_user_id AND status IN ('completed', 'cancelled')
    ),
    'response_time', (
      SELECT 
        EXTRACT(EPOCH FROM AVG(m.created_at - c.created_at)) / 3600
      FROM conversations c
      JOIN messages m ON m.conversation_id = c.id
      WHERE m.sender_id = target_user_id
      AND m.id IN (
        SELECT MIN(id) FROM messages
        WHERE sender_id = target_user_id
        GROUP BY conversation_id
      )
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create function to get listing statistics
CREATE OR REPLACE FUNCTION get_listing_stats(target_listing_id UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'view_count', (SELECT metadata->>'view_count' FROM listings WHERE id = target_listing_id)::INTEGER,
    'application_count', (SELECT COUNT(*) FROM applications WHERE listing_id = target_listing_id),
    'average_bid', (
      SELECT COALESCE(AVG((proposal_data->>'bid_amount')::NUMERIC), 0)
      FROM applications
      WHERE listing_id = target_listing_id
      AND proposal_data->>'bid_amount' IS NOT NULL
    ),
    'days_active', (
      SELECT EXTRACT(DAY FROM (CURRENT_TIMESTAMP - created_at))
      FROM listings
      WHERE id = target_listing_id
    ),
    'days_remaining', (
      SELECT EXTRACT(DAY FROM (expires_at - CURRENT_TIMESTAMP))
      FROM listings
      WHERE id = target_listing_id
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create function to increment listing view count
CREATE OR REPLACE FUNCTION increment_listing_view(listing_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE listings
  SET metadata = jsonb_set(
    COALESCE(metadata, '{}'::jsonb),
    '{view_count}',
    ((COALESCE(metadata->>'view_count', '0'))::INTEGER + 1)::TEXT::jsonb
  )
  WHERE id = listing_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to get recommended listings for a user
CREATE OR REPLACE FUNCTION get_recommended_listings(
  for_user_id UUID,
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  budget_min DECIMAL,
  budget_max DECIMAL,
  budget_type TEXT,
  location TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  relevance_score DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  WITH user_skills AS (
    SELECT skill_id
    FROM user_skills
    WHERE user_id = for_user_id
  ),
  user_categories AS (
    SELECT DISTINCT category
    FROM skills s
    JOIN user_skills us ON s.id = us.skill_id
    WHERE us.user_id = for_user_id
  ),
  user_applications AS (
    SELECT listing_id
    FROM applications
    WHERE applicant_id = for_user_id
  ),
  listing_scores AS (
    SELECT 
      l.id,
      l.title,
      l.description,
      l.budget_min,
      l.budget_max,
      l.budget_type,
      l.location,
      l.status,
      l.created_at,
      (
        -- Base score
        10 +
        -- Skill match bonus
        (SELECT COUNT(*) * 5 FROM listing_tags lt
         JOIN skills s ON lt.tag = s.name
         JOIN user_skills us ON s.id = us.skill_id
         WHERE lt.listing_id = l.id AND us.user_id = for_user_id) +
        -- Category match bonus
        (SELECT COUNT(*) * 3 FROM skills s
         WHERE s.category IN (SELECT category FROM user_categories)
         AND s.name IN (SELECT tag FROM listing_tags WHERE listing_id = l.id)) +
        -- Recency bonus (0-10 points)
        LEAST(10, EXTRACT(DAY FROM (CURRENT_TIMESTAMP - l.created_at)) * -0.5 + 10)
      ) AS relevance_score
    FROM listings l
    WHERE 
      l.status = 'open' AND
      l.expires_at > CURRENT_TIMESTAMP AND
      l.id NOT IN (SELECT listing_id FROM user_applications) AND
      l.user_id != for_user_id
  )
  SELECT * FROM listing_scores
  ORDER BY relevance_score DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to get similar listings
CREATE OR REPLACE FUNCTION get_similar_listings(
  listing_id UUID,
  limit_count INTEGER DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  budget_min DECIMAL,
  budget_max DECIMAL,
  budget_type TEXT,
  location TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  similarity_score DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  WITH source_listing AS (
    SELECT 
      l.category_id,
      l.budget_min,
      l.budget_max,
      l.location_lat,
      l.location_lng,
      ARRAY(SELECT tag FROM listing_tags WHERE listing_id = l.id) AS tags
    FROM listings l
    WHERE l.id = listing_id
  ),
  listing_scores AS (
    SELECT 
      l.id,
      l.title,
      l.description,
      l.budget_min,
      l.budget_max,
      l.budget_type,
      l.location,
      l.status,
      l.created_at,
      (
        -- Base score
        10 +
        -- Category match
        (CASE WHEN l.category_id = (SELECT category_id FROM source_listing) THEN 10 ELSE 0 END) +
        -- Budget similarity (0-10 points)
        (10 - LEAST(10, ABS(l.budget_min - (SELECT budget_min FROM source_listing)) / 100)) +
        -- Tag overlap (0-20 points)
        (
          SELECT COUNT(*) * 5
          FROM listing_tags lt
          WHERE lt.listing_id = l.id
          AND lt.tag = ANY(SELECT unnest(tags) FROM source_listing)
        ) +
        -- Location proximity if available (0-10 points)
        (
          CASE 
            WHEN l.location_lat IS NOT NULL AND l.location_lng IS NOT NULL AND
                 (SELECT location_lat FROM source_listing) IS NOT NULL AND
                 (SELECT location_lng FROM source_listing) IS NOT NULL
            THEN
              LEAST(10, 10 - (
                ST_Distance(
                  ST_SetSRID(ST_MakePoint(l.location_lng, l.location_lat), 4326),
                  ST_SetSRID(ST_MakePoint(
                    (SELECT location_lng FROM source_listing),
                    (SELECT location_lat FROM source_listing)
                  ), 4326)
                ) / 10000
              ))
            ELSE 0
          END
        )
      ) AS similarity_score
    FROM listings l
    WHERE 
      l.id != listing_id AND
      l.status = 'open' AND
      l.expires_at > CURRENT_TIMESTAMP
  )
  SELECT * FROM listing_scores
  ORDER BY similarity_score DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to automatically expire listings
CREATE OR REPLACE FUNCTION auto_expire_listings()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE listings
  SET status = 'expired'
  WHERE expires_at < NOW() AND status = 'open';
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to run auto_expire_listings daily
CREATE OR REPLACE FUNCTION create_expire_listings_job()
RETURNS VOID AS $$
BEGIN
  -- Note: This is a placeholder. In Supabase, you would use pg_cron extension
  -- or set up a scheduled function through the Supabase dashboard
  PERFORM auto_expire_listings();
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate user reputation score
CREATE OR REPLACE FUNCTION calculate_reputation_score(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  review_score DECIMAL;
  completion_rate DECIMAL;
  account_age INTEGER;
  total_score INTEGER;
BEGIN
  -- Get average review rating (0-5)
  SELECT COALESCE(AVG(rating), 0) INTO review_score
  FROM reviews
  WHERE reviewee_id = user_id;
  
  -- Get completion rate (0-1)
  SELECT 
    CASE 
      WHEN COUNT(*) = 0 THEN 0
      ELSE COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / COUNT(*)::DECIMAL
    END INTO completion_rate
  FROM applications 
  WHERE applicant_id = user_id AND status IN ('completed', 'cancelled');
  
  -- Get account age in months (capped at 24)
  SELECT 
    LEAST(24, EXTRACT(MONTH FROM AGE(NOW(), created_at)) + 
    EXTRACT(YEAR FROM AGE(NOW(), created_at)) * 12)::INTEGER INTO account_age
  FROM profiles
  WHERE id = user_id;
  
  -- Calculate total score (0-100)
  total_score := (
    -- Reviews contribute up to 50 points
    (review_score * 10) +
    -- Completion rate contributes up to 30 points
    (completion_rate * 30) +
    -- Account age contributes up to 20 points
    (account_age * 0.8)
  )::INTEGER;
  
  RETURN GREATEST(0, LEAST(100, total_score));
END;
$$ LANGUAGE plpgsql;
