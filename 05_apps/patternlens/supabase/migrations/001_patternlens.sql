-- PatternLens Database Schema v1.1
-- SILENCE.OBJECTS Framework
-- Last updated: 2026-01-28

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT DEFAULT 'FREE' CHECK (tier IN ('FREE','PRO')),
  object_count INTEGER DEFAULT 0,
  locale TEXT DEFAULT 'pl',
  stripe_customer_id TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- OBJECTS TABLE (Primary user content)
-- ============================================
CREATE TABLE IF NOT EXISTS objects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  input_text TEXT NOT NULL CHECK (LENGTH(input_text) >= 50 AND LENGTH(input_text) <= 5000),
  input_method TEXT DEFAULT 'text' CHECK (input_method IN ('text','voice')),
  selected_lens TEXT CHECK (selected_lens IN ('A','B')),
  detected_theme TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- ============================================
-- INTERPRETATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS interpretations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  object_id UUID REFERENCES objects(id) ON DELETE CASCADE NOT NULL,
  lens TEXT NOT NULL CHECK (lens IN ('A','B')),
  phase_1_context JSONB NOT NULL,
  phase_2_tension JSONB NOT NULL,
  phase_3_meaning JSONB NOT NULL,
  phase_4_function JSONB NOT NULL,
  confidence_score DECIMAL(3,2),
  risk_level TEXT DEFAULT 'none',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PATTERNS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pattern_name TEXT NOT NULL,
  pattern_theme TEXT,
  object_count INTEGER DEFAULT 0,
  first_detected TIMESTAMPTZ DEFAULT NOW(),
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CONSENT LOGS TABLE (GDPR Compliant - Append Only)
-- ============================================
CREATE TABLE IF NOT EXISTS consent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  consent_type TEXT NOT NULL CHECK (consent_type IN ('structural', 'safety', 'data', 'age')),
  consent_version TEXT DEFAULT '1.0',
  granted BOOLEAN NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  -- Note: No revoked_at - create new record with granted=false for revocation
  CONSTRAINT unique_consent_per_type UNIQUE (user_id, consent_type, granted_at)
);

-- ============================================
-- CRISIS INCIDENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS crisis_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  incident_type TEXT,
  risk_score DECIMAL(3,2),
  action_taken TEXT,
  keywords_matched TEXT[],
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Objects indexes
CREATE INDEX IF NOT EXISTS idx_objects_user ON objects(user_id);
CREATE INDEX IF NOT EXISTS idx_objects_created ON objects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_objects_user_created ON objects(user_id, created_at DESC);

-- Interpretations indexes
CREATE INDEX IF NOT EXISTS idx_interp_object ON interpretations(object_id);
CREATE INDEX IF NOT EXISTS idx_interp_object_lens ON interpretations(object_id, lens);

-- Patterns indexes
CREATE INDEX IF NOT EXISTS idx_patterns_user ON patterns(user_id);
CREATE INDEX IF NOT EXISTS idx_patterns_user_updated ON patterns(user_id, last_updated DESC);

-- Consent logs indexes (for audit queries)
CREATE INDEX IF NOT EXISTS idx_consent_user ON consent_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_consent_user_type ON consent_logs(user_id, consent_type);
CREATE INDEX IF NOT EXISTS idx_consent_timestamp ON consent_logs(granted_at DESC);

-- Crisis incidents indexes
CREATE INDEX IF NOT EXISTS idx_crisis_user ON crisis_incidents(user_id);
CREATE INDEX IF NOT EXISTS idx_crisis_timestamp ON crisis_incidents(timestamp DESC);

-- ============================================
-- TRIGGER: Auto-create profile on user signup
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================
-- TRIGGER: Update updated_at on profile change
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE interpretations ENABLE ROW LEVEL SECURITY;
ALTER TABLE patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE crisis_incidents ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only access their own profile
DROP POLICY IF EXISTS "own_profiles" ON profiles;
CREATE POLICY "own_profiles" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Objects: Users can only access their own objects
DROP POLICY IF EXISTS "own_objects" ON objects;
CREATE POLICY "own_objects" ON objects
  FOR ALL USING (auth.uid() = user_id);

-- Interpretations: Users can only access interpretations for their objects
DROP POLICY IF EXISTS "own_interp" ON interpretations;
CREATE POLICY "own_interp" ON interpretations
  FOR ALL USING (
    EXISTS(
      SELECT 1 FROM objects
      WHERE objects.id = interpretations.object_id
      AND objects.user_id = auth.uid()
    )
  );

-- Patterns: Users can only access their own patterns
DROP POLICY IF EXISTS "own_patterns" ON patterns;
CREATE POLICY "own_patterns" ON patterns
  FOR ALL USING (auth.uid() = user_id);

-- Consent logs: APPEND-ONLY (GDPR compliant audit trail)
-- Users can INSERT their own consent records
-- Users can SELECT their own consent records
-- NO UPDATE or DELETE allowed
DROP POLICY IF EXISTS "own_consents" ON consent_logs;
DROP POLICY IF EXISTS "insert_own_consents" ON consent_logs;
DROP POLICY IF EXISTS "select_own_consents" ON consent_logs;

CREATE POLICY "insert_own_consents" ON consent_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "select_own_consents" ON consent_logs
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Crisis incidents: Users can access their own incidents, system can access NULL user incidents
DROP POLICY IF EXISTS "own_crisis" ON crisis_incidents;
DROP POLICY IF EXISTS "insert_crisis" ON crisis_incidents;
DROP POLICY IF EXISTS "select_crisis" ON crisis_incidents;

CREATE POLICY "insert_crisis" ON crisis_incidents
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "select_crisis" ON crisis_incidents
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to safely increment object count
CREATE OR REPLACE FUNCTION increment_object_count(p_user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET object_count = object_count + 1, updated_at = NOW()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has completed onboarding
CREATE OR REPLACE FUNCTION check_onboarding_complete(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_complete BOOLEAN;
BEGIN
  SELECT onboarding_completed INTO is_complete
  FROM profiles
  WHERE id = p_user_id;
  RETURN COALESCE(is_complete, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's consent status
CREATE OR REPLACE FUNCTION get_user_consents(p_user_id UUID)
RETURNS TABLE (
  consent_type TEXT,
  granted BOOLEAN,
  granted_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (cl.consent_type)
    cl.consent_type,
    cl.granted,
    cl.granted_at
  FROM consent_logs cl
  WHERE cl.user_id = p_user_id
  ORDER BY cl.consent_type, cl.granted_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
