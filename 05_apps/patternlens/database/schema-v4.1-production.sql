-- ============================================================================
-- PATTERNLENS v4.1 - PRODUCTION DATABASE SCHEMA
-- Execute in Supabase SQL Editor
-- ============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    tier TEXT DEFAULT 'FREE' CHECK (tier IN ('FREE', 'PRO')),
    object_count INTEGER DEFAULT 0,
    weekly_objects_used INTEGER DEFAULT 0,
    weekly_reset_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Objects table (user inputs)
CREATE TABLE IF NOT EXISTS objects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    input_text TEXT NOT NULL,
    input_method TEXT DEFAULT 'text' CHECK (input_method IN ('text', 'voice', 'file', 'clipboard')),
    selected_lens TEXT CHECK (selected_lens IN ('A', 'B')),
    processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    error_details JSONB
);

-- Interpretations table (AI analysis results)
CREATE TABLE IF NOT EXISTS interpretations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    object_id UUID NOT NULL REFERENCES objects(id) ON DELETE CASCADE,
    lens TEXT NOT NULL CHECK (lens IN ('A', 'B')),
    phase_1_context JSONB NOT NULL,
    phase_2_tension JSONB NOT NULL,
    phase_3_meaning JSONB NOT NULL,
    phase_4_function JSONB NOT NULL,
    confidence_score DECIMAL(3,2) DEFAULT 0.85,
    risk_level TEXT DEFAULT 'none' CHECK (risk_level IN ('none', 'low', 'medium', 'high', 'crisis')),
    processing_time_ms INTEGER,
    model_version TEXT DEFAULT 'claude-sonnet-4-20250514',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patterns table (detected patterns across objects)
CREATE TABLE IF NOT EXISTS patterns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    frequency INTEGER DEFAULT 1,
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    trend TEXT DEFAULT 'stable' CHECK (trend IN ('rising', 'stable', 'declining')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- NUCLEAR SAFETY TABLES
-- ============================================================================

-- Crisis events log
CREATE TABLE IF NOT EXISTS nuclear_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    session_id TEXT NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('CRISIS_DETECTED', 'INTERVENTION_SHOWN', 'RESOURCE_CLICKED', 'ESCALATION')),
    crisis_level TEXT NOT NULL CHECK (crisis_level IN ('NONE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    crisis_category TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Language violations log
CREATE TABLE IF NOT EXISTS language_violations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL,
    violation_type TEXT NOT NULL CHECK (violation_type IN ('THERAPEUTIC_TERM', 'DIAGNOSIS', 'ADVICE', 'PROMISE')),
    original_text TEXT,
    flagged_phrase TEXT NOT NULL,
    context TEXT,
    severity TEXT DEFAULT 'MEDIUM' CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- COMPLIANCE TABLES
-- ============================================================================

-- Consent logs (GDPR)
CREATE TABLE IF NOT EXISTS consent_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    consent_type TEXT NOT NULL,
    granted BOOLEAN NOT NULL DEFAULT false,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    details JSONB DEFAULT '{}',
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rate limits
CREATE TABLE IF NOT EXISTS rate_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    identifier TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    request_count INTEGER DEFAULT 1,
    window_start TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(identifier, endpoint)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_objects_user_created ON objects(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_objects_status ON objects(processing_status);
CREATE INDEX IF NOT EXISTS idx_interpretations_object ON interpretations(object_id);
CREATE INDEX IF NOT EXISTS idx_patterns_user ON patterns(user_id);
CREATE INDEX IF NOT EXISTS idx_nuclear_events_user ON nuclear_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_nuclear_events_level ON nuclear_events(crisis_level);
CREATE INDEX IF NOT EXISTS idx_consent_user ON consent_logs(user_id, consent_type);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON rate_limits(identifier, endpoint);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email)
    VALUES (NEW.id, NEW.email)
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Update object count
CREATE OR REPLACE FUNCTION update_object_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE profiles 
        SET object_count = object_count + 1,
            weekly_objects_used = weekly_objects_used + 1
        WHERE id = NEW.user_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE profiles 
        SET object_count = GREATEST(0, object_count - 1)
        WHERE id = OLD.user_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for object count
DROP TRIGGER IF EXISTS on_object_change ON objects;
CREATE TRIGGER on_object_change
    AFTER INSERT OR DELETE ON objects
    FOR EACH ROW
    EXECUTE FUNCTION update_object_count();

-- Atomic object creation with interpretation
CREATE OR REPLACE FUNCTION create_object_with_interpretation(
    p_user_id UUID,
    p_input_text TEXT,
    p_input_method TEXT,
    p_selected_lens TEXT
) RETURNS JSON AS $$
DECLARE
    v_object_id UUID;
    v_result JSON;
BEGIN
    INSERT INTO objects (user_id, input_text, input_method, selected_lens, processing_status)
    VALUES (p_user_id, p_input_text, p_input_method, p_selected_lens, 'processing')
    RETURNING id INTO v_object_id;
    
    v_result := json_build_object('object_id', v_object_id);
    RETURN v_result;
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Transaction failed: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Weekly reset function
CREATE OR REPLACE FUNCTION reset_weekly_usage()
RETURNS void AS $$
BEGIN
    UPDATE profiles 
    SET weekly_objects_used = 0,
        weekly_reset_at = NOW()
    WHERE weekly_reset_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE interpretations ENABLE ROW LEVEL SECURITY;
ALTER TABLE patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only see their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Objects: Users can only access their own objects
CREATE POLICY "Users can view own objects" ON objects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own objects" ON objects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own objects" ON objects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own objects" ON objects
    FOR DELETE USING (auth.uid() = user_id);

-- Interpretations: Users can view interpretations of their objects
CREATE POLICY "Users can view interpretations of own objects" ON interpretations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM objects 
            WHERE objects.id = interpretations.object_id 
            AND objects.user_id = auth.uid()
        )
    );

-- Patterns: Users can only access their own patterns
CREATE POLICY "Users can view own patterns" ON patterns
    FOR SELECT USING (auth.uid() = user_id);

-- Consent logs: Users can view and create their own consent logs
CREATE POLICY "Users can view own consent logs" ON consent_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own consent logs" ON consent_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- You can add initial data here if needed

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Run this to verify all tables exist:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
