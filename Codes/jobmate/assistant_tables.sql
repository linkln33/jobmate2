-- Create Assistant tables
CREATE TABLE IF NOT EXISTS "AssistantPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "proactivityLevel" INTEGER NOT NULL DEFAULT 2,
    "preferredModes" TEXT[],
    "dismissedSuggestions" TEXT[],
    "lastInteraction" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AssistantPreference_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "AssistantMemoryLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "interactionType" TEXT NOT NULL,
    "context" JSONB,
    "routePath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AssistantMemoryLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "AssistantSuggestion" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "actionType" TEXT,
    "actionPayload" JSONB,
    "priority" INTEGER NOT NULL DEFAULT 2,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AssistantSuggestion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "AssistantAnalytics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalInteractions" INTEGER NOT NULL DEFAULT 0,
    "suggestionsShown" INTEGER NOT NULL DEFAULT 0,
    "suggestionsAccepted" INTEGER NOT NULL DEFAULT 0,
    "suggestionsDismissed" INTEGER NOT NULL DEFAULT 0,
    "manualQueries" INTEGER NOT NULL DEFAULT 0,
    "modeChanges" INTEGER NOT NULL DEFAULT 0,
    "timeSpentSeconds" INTEGER NOT NULL DEFAULT 0,
    "mostUsedMode" TEXT,
    CONSTRAINT "AssistantAnalytics_pkey" PRIMARY KEY ("id")
);

-- Create indexes
CREATE UNIQUE INDEX IF NOT EXISTS "AssistantPreference_userId_key" ON "AssistantPreference"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "AssistantAnalytics_userId_date_key" ON "AssistantAnalytics"("userId", "date");

-- Add foreign key constraints
ALTER TABLE "AssistantPreference" 
ADD CONSTRAINT "AssistantPreference_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AssistantMemoryLog" 
ADD CONSTRAINT "AssistantMemoryLog_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AssistantSuggestion" 
ADD CONSTRAINT "AssistantSuggestion_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AssistantAnalytics" 
ADD CONSTRAINT "AssistantAnalytics_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
