# JobMate Deployment Guide

## 1. Database Setup
1. **Set up your Supabase project**:
   - Go to [Supabase](https://supabase.com) and create a new project or use an existing one
   - Set up the necessary tables and functions using the SQL scripts in the `supabase/migrations` directory
   - Configure authentication settings in the Supabase dashboard

2. **Update your environment variables**:
   - Create a `.env.production` file with the following structure:
   ```
   # Supabase configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # Authentication
   JWT_SECRET=your_secure_secret
   NEXTAUTH_SECRET=your_secure_secret
   NEXTAUTH_URL=https://your-production-domain.com
   
   # App URLs
   NEXT_PUBLIC_APP_URL=https://your-production-domain.com
   ```

## 2. Database Configuration
After setting up the Supabase project:

1. **Import initial data (if needed)**:
   - You can use Supabase's dashboard to import data or run SQL scripts
   - Alternatively, use the Supabase client in a script to seed your database

2. **Set up Row Level Security policies**:
   - Configure RLS policies for your tables in the Supabase dashboard
   - Ensure proper access control for different user roles

## 3. Vercel Deployment

### Option 1: Deploy via Vercel Dashboard
1. Go to [Vercel](https://vercel.com) and sign in
2. Import your GitHub repository
3. Configure the project:
   - Framework preset: Next.js
   - Root directory: ./
   - Build command: npm run build
   - Output directory: .next
4. Add all environment variables from your `.env.production` file
5. Deploy!

### Option 2: Deploy via Vercel CLI
1. Install Vercel CLI: `npm i -g vercel`
2. Login to Vercel: `vercel login`
3. Deploy: `vercel --prod`
4. Follow the prompts and ensure you set all environment variables

## 4. Troubleshooting
- If you encounter build errors, check the Vercel build logs
- Ensure all environment variables are properly set
- Verify that your Supabase project is accessible from Vercel's servers
- Check that your Supabase tables and RLS policies are correctly configured

## 5. Post-Deployment
- Verify all API routes are working
- Test authentication flows
- Check database connections
- Monitor for any client-side errors
