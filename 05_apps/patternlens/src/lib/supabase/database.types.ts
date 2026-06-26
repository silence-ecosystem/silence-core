// ===========================================
// SILENCE.OBJECTS - Database Types
// ===========================================
// Types matching schema in supabase/migrations/001_patternlens.sql
// Last updated: 2026-01-28
//
// IMPORTANT: This file must stay in sync with the database schema.
// After schema changes, regenerate with:
//   npx supabase gen types typescript --local > src/lib/supabase/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ===========================================
// PHASE CONTENT (JSONB Structure)
// ===========================================
// Used in interpretations table for structured analysis phases

export interface PhaseContent {
  summary: string;
  details?: string;
  keywords?: string[];
  confidence?: number;
}

// Type guard for PhaseContent
export function isPhaseContent(value: unknown): value is PhaseContent {
  return (
    typeof value === "object" &&
    value !== null &&
    "summary" in value &&
    typeof (value as PhaseContent).summary === "string"
  );
}

// Extract summary from phase content (handles both JSONB and legacy string)
export function getPhaseContentSummary(phase: Json | PhaseContent | string | null | undefined): string {
  if (!phase) return "";
  if (typeof phase === "string") return phase;
  if (isPhaseContent(phase)) return phase.summary;
  if (typeof phase === "object" && phase !== null && "summary" in phase) {
    return String((phase as { summary: unknown }).summary);
  }
  return "";
}

// ===========================================
// DATABASE SCHEMA
// ===========================================

export interface Database {
  public: {
    Tables: {
      // --------------------------------------
      // PROFILES - User account information
      // --------------------------------------
      profiles: {
        Row: {
          id: string;
          tier: "FREE" | "PRO";
          object_count: number;
          locale: string;
          stripe_customer_id: string | null;
          onboarding_completed: boolean;
          onboarding_completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          tier?: "FREE" | "PRO";
          object_count?: number;
          locale?: string;
          stripe_customer_id?: string | null;
          onboarding_completed?: boolean;
          onboarding_completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tier?: "FREE" | "PRO";
          object_count?: number;
          locale?: string;
          stripe_customer_id?: string | null;
          onboarding_completed?: boolean;
          onboarding_completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      // --------------------------------------
      // OBJECTS - Primary user content (formerly "reports")
      // --------------------------------------
      objects: {
        Row: {
          id: string;
          user_id: string;
          input_text: string;
          input_method: "text" | "voice";
          selected_lens: "A" | "B" | null;
          detected_theme: string | null;
          created_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          input_text: string;
          input_method?: "text" | "voice";
          selected_lens?: "A" | "B" | null;
          detected_theme?: string | null;
          created_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          input_text?: string;
          input_method?: "text" | "voice";
          selected_lens?: "A" | "B" | null;
          detected_theme?: string | null;
          created_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "objects_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      // --------------------------------------
      // INTERPRETATIONS - AI-generated analysis
      // --------------------------------------
      interpretations: {
        Row: {
          id: string;
          object_id: string;
          lens: "A" | "B";
          phase_1_context: Json;
          phase_2_tension: Json;
          phase_3_meaning: Json;
          phase_4_function: Json;
          confidence_score: number | null;
          risk_level: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          object_id: string;
          lens: "A" | "B";
          phase_1_context: Json;
          phase_2_tension: Json;
          phase_3_meaning: Json;
          phase_4_function: Json;
          confidence_score?: number | null;
          risk_level?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          object_id?: string;
          lens?: "A" | "B";
          phase_1_context?: Json;
          phase_2_tension?: Json;
          phase_3_meaning?: Json;
          phase_4_function?: Json;
          confidence_score?: number | null;
          risk_level?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "interpretations_object_id_fkey";
            columns: ["object_id"];
            referencedRelation: "objects";
            referencedColumns: ["id"];
          }
        ];
      };

      // --------------------------------------
      // PATTERNS - Detected recurring structures
      // --------------------------------------
      patterns: {
        Row: {
          id: string;
          user_id: string;
          pattern_name: string;
          pattern_theme: string | null;
          object_count: number;
          first_detected: string;
          last_updated: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          pattern_name: string;
          pattern_theme?: string | null;
          object_count?: number;
          first_detected?: string;
          last_updated?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          pattern_name?: string;
          pattern_theme?: string | null;
          object_count?: number;
          first_detected?: string;
          last_updated?: string;
        };
        Relationships: [
          {
            foreignKeyName: "patterns_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      // --------------------------------------
      // CONSENT_LOGS - GDPR audit trail (APPEND-ONLY)
      // --------------------------------------
      consent_logs: {
        Row: {
          id: string;
          user_id: string | null;
          consent_type: "structural" | "safety" | "data" | "age";
          consent_version: string;
          granted: boolean;
          ip_address: string | null;
          user_agent: string | null;
          granted_at: string;
        };
        Insert: {
          id?: string;
          user_id: string | null;
          consent_type: "structural" | "safety" | "data" | "age";
          consent_version?: string;
          granted: boolean;
          ip_address?: string | null;
          user_agent?: string | null;
          granted_at?: string;
        };
        Update: {
          // IMPORTANT: consent_logs is append-only per GDPR requirements
          // No updates allowed - RLS policy enforces INSERT + SELECT only
          id?: never;
          user_id?: never;
          consent_type?: never;
          consent_version?: never;
          granted?: never;
          ip_address?: never;
          user_agent?: never;
          granted_at?: never;
        };
        Relationships: [
          {
            foreignKeyName: "consent_logs_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      // --------------------------------------
      // CRISIS_INCIDENTS - Safety event logging
      // --------------------------------------
      crisis_incidents: {
        Row: {
          id: string;
          user_id: string | null;
          incident_type: string | null;
          risk_score: number | null;
          action_taken: string | null;
          keywords_matched: string[] | null;
          timestamp: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          incident_type?: string | null;
          risk_score?: number | null;
          action_taken?: string | null;
          keywords_matched?: string[] | null;
          timestamp?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          incident_type?: string | null;
          risk_score?: number | null;
          action_taken?: string | null;
          keywords_matched?: string[] | null;
          timestamp?: string;
        };
        Relationships: [
          {
            foreignKeyName: "crisis_incidents_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };

    Views: {
      [_ in never]: never;
    };

    Functions: {
      increment_object_count: {
        Args: {
          p_user_id: string;
        };
        Returns: undefined;
      };
      check_onboarding_complete: {
        Args: {
          p_user_id: string;
        };
        Returns: boolean;
      };
      get_user_consents: {
        Args: {
          p_user_id: string;
        };
        Returns: {
          consent_type: string;
          granted: boolean;
          granted_at: string;
        }[];
      };
    };

    Enums: {
      [_ in never]: never;
    };

    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// ===========================================
// TYPE HELPERS
// ===========================================

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

// ===========================================
// ROW TYPE ALIASES
// ===========================================

export type Profile = Tables<"profiles">;
export type PatternLensObject = Tables<"objects">;
export type Interpretation = Tables<"interpretations">;
export type Pattern = Tables<"patterns">;
export type ConsentLog = Tables<"consent_logs">;
export type CrisisIncident = Tables<"crisis_incidents">;

// ===========================================
// INSERT TYPE ALIASES
// ===========================================

export type ProfileInsert = InsertTables<"profiles">;
export type ObjectInsert = InsertTables<"objects">;
export type InterpretationInsert = InsertTables<"interpretations">;
export type PatternInsert = InsertTables<"patterns">;
export type ConsentLogInsert = InsertTables<"consent_logs">;
export type CrisisIncidentInsert = InsertTables<"crisis_incidents">;

// ===========================================
// UPDATE TYPE ALIASES
// ===========================================

export type ProfileUpdate = UpdateTables<"profiles">;
export type ObjectUpdate = UpdateTables<"objects">;
export type InterpretationUpdate = UpdateTables<"interpretations">;
export type PatternUpdate = UpdateTables<"patterns">;
// Note: ConsentLog updates not allowed (append-only)

// ===========================================
// COMPOSITE/JOINED TYPES
// ===========================================

// Object with its interpretations (common query result)
export interface ObjectWithInterpretations extends PatternLensObject {
  interpretations: Interpretation[];
}

// Strongly-typed interpretation with PhaseContent
export interface TypedInterpretation {
  id: string;
  object_id: string;
  lens: "A" | "B";
  phase_1_context: PhaseContent;
  phase_2_tension: PhaseContent;
  phase_3_meaning: PhaseContent;
  phase_4_function: PhaseContent;
  confidence_score: number | null;
  risk_level: string;
  created_at: string;
}

// User consent status (result of get_user_consents function)
export interface UserConsentStatus {
  structural: boolean;
  safety: boolean;
  data: boolean;
  age: boolean;
  all_granted: boolean;
}

// ===========================================
// ENUMS
// ===========================================

export type Tier = "FREE" | "PRO";
export type Lens = "A" | "B";
export type InputMethod = "text" | "voice";
export type ConsentType = "structural" | "safety" | "data" | "age";

// ===========================================
// BACKWARD COMPATIBILITY
// ===========================================

// Aliases for legacy code that uses "Report" instead of "Object"
export type Report = PatternLensObject;
export type ReportInsert = ObjectInsert;
export type ReportUpdate = ObjectUpdate;
