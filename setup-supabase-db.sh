#!/bin/bash
# Supabase Database Setup Script

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "Setting up Supabase database tables..."

# SQL to create tables
SQL="
-- Table for tracking articles read
CREATE TABLE IF NOT EXISTS user_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  article_slug TEXT NOT NULL,
  last_read_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, article_slug)
);

-- Table for tracking podcasts watched
CREATE TABLE IF NOT EXISTS user_podcasts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  episode_slug TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  last_watched_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, episode_slug)
);

-- Enable Row Level Security
ALTER TABLE user_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_podcasts ENABLE ROW LEVEL SECURITY;

-- Security policies: Users can only see/edit their own data
CREATE POLICY \"Users can view own articles\" ON user_articles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY \"Users can insert own articles\" ON user_articles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY \"Users can update own articles\" ON user_articles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY \"Users can view own podcasts\" ON user_podcasts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY \"Users can insert own podcasts\" ON user_podcasts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY \"Users can update own podcasts\" ON user_podcasts
  FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_articles_user_id ON user_articles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_podcasts_user_id ON user_podcasts(user_id);
"

# Use curl to execute SQL via Supabase REST API
curl -X POST "https://bkmvkbxjwndkjhjzlrtu.supabase.co/rest/v1/rpc/exec_sql" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrbXZrYnh2d25ka2poanpscnR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1NzM3NjEsImV4cCI6MjA0ODE0OTc2MX0.rdjI_f1nGKl3AURbzK3VLQ_ofpwC3SP" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"$SQL\"}"

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Database tables created successfully!${NC}"
else
  echo -e "${RED}✗ Failed to create tables. Please check the SQL Editor in Supabase dashboard.${NC}"
  echo -e "  Go to: https://app.supabase.com/project/bkmvkbxjwndkjhjzlrtu/sql"
  exit 1
fi
