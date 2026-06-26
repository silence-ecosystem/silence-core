-- ============================================
-- PATTERNLENS PRODUCTION SCHEMA
-- Version: 4.0.0 | SILENCE.OBJECTS Compliant
-- Deploy: psql $DATABASE_URL < schema.sql
-- ============================================

-- Extension setup
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABLE: profiles (User data)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL DEFAULT 'FREE' CHECK (tier IN ('FREE', 'PRO')),
  object_count INTEGER DEFAULT 0,
  locale TEXT DEFAULT 'pl' CHECK (locale IN ('pl', 'en')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: objects (Core user content)
-- ============================================
CREATE TABLE IF NOT EXISTS objects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  input_text TEXT NOT NULL CHECK (LENGTH(input_text) >= 50 AND LENGTH(input_text) <= 5000),
  input_method TEXT DEFAULT 'text' CHECK (input_method IN ('text', 'voice')),
  selected_lens TEXT CHECK (selected_lens IN ('A', 'B')),
  detected_theme TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- ============================================
-- TABLE: interpretations (AI analysis results)
-- ============================================
CREATE TABLE IF NOT EXISTS interpretations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  object_id UUID NOT NULL REFERENCES objects(id) ON DELETE CASCADE,
  lens TEXT NOT NULL CHECK (lens IN ('A', 'B')),
  phase1_context JSONB NOT NULL,
  phase2_tension JSONB NOT NULL,
  phase3_meaning JSONB NOT NULL,
  phase4_function JSONB NOT NULL,
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0),
  risk_level TEXT DEFAULT 'none' CHECK (risk_level IN ('none', 'low', 'medium', 'high')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: patterns (Detected behavioral patterns)
-- ============================================
CREATE TABLE IF NOT EXISTS patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  pattern_name TEXT NOT NULL,
  pattern_theme TEXT,
  object_count INTEGER DEFAULT 0,
  first_detected TIMESTAMPTZ DEFAULT NOW(),
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: consent_logs (GDPR compliance)
-- ============================================
CREATE TABLE IF NOT EXISTS consent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL,
  granted BOOLEAN NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: crisis_incidents (Anonymous safety logging)
-- ============================================
CREATE TABLE IF NOT EXISTS crisis_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  incident_type TEXT CHECK (incident_type IN ('hard_keyword', 'soft_keyword', 'claude_risk')),
  risk_score DECIMAL(3,2),
  action_taken TEXT CHECK (action_taken IN ('blocked', 'warned', 'proceeded')),
  keywords_matched TEXT[],
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE interpretations ENABLE ROW LEVEL SECURITY;
ALTER TABLE patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE crisis_incidents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "profiles_own_data" ON profiles;
DROP POLICY IF EXISTS "objects_own_data" ON objects;
DROP POLICY IF EXISTS "interpretations_own_data" ON interpretations;
DROP POLICY IF EXISTS "patterns_own_data" ON patterns;
DROP POLICY IF EXISTS "consent_logs_own_data" ON consent_logs;
DROP POLICY IF EXISTS "crisis_incidents_own_data" ON crisis_incidents;

-- Create policies: Users see only their data
CREATE POLICY "profiles_own_data" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "objects_own_data" ON objects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "interpretations_own_data" ON interpretations FOR ALL USING (
  auth.uid() = (SELECT user_id FROM objects WHERE id = object_id)
);
CREATE POLICY "patterns_own_data" ON patterns FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "consent_logs_own_data" ON consent_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "crisis_incidents_own_data" ON crisis_incidents FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- INDEXES (Performance optimization)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_objects_user_id ON objects(user_id);
CREATE INDEX IF NOT EXISTS idx_objects_created_at ON objects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_interpretations_object_id ON interpretations(object_id);
CREATE INDEX IF NOT EXISTS idx_patterns_user_id ON patterns(user_id);
CREATE INDEX IF NOT EXISTS idx_crisis_incidents_timestamp ON crisis_incidents(timestamp DESC);

-- ============================================
-- FUNCTIONS (Business logic)
-- ============================================

-- Update object count when new object created
CREATE OR REPLACE FUNCTION update_object_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles 
  SET object_count = object_count + 1,
      updated_at = NOW()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate trigger for idempotency
DROP TRIGGER IF EXISTS trigger_update_object_count ON objects;
CREATE TRIGGER trigger_update_object_count
AFTER INSERT ON objects
FOR EACH ROW
EXECUTE FUNCTION update_object_count();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, tier, locale)
  VALUES (NEW.id, 'FREE', COALESCE(NEW.raw_user_meta_data->>'locale', 'pl'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these after deployment to verify:
--
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
-- SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public';
-- SELECT indexname FROM pg_indexes WHERE schemaname = 'public';
