/**
 * [PATH]: 04_packages/@silence/attention-profiles/src/index.ts
 * @silence/attention-profiles
 * Attention pattern profiling for neurodiversity-affirming design.
 *
 * This module recognizes diverse attention styles as valid variations,
 * not deficits or dysfunctions. All terminology follows S11 compliance
 * guidelines to avoid pathologizing language.
 */

/**
 * Attention styles represent different ways of engaging with tasks and information.
 * These are descriptive categories, not pathologizing classifications.
 */
export type AttentionStyle =
  | 'sustained-focus'      // Deep, prolonged concentration on single tasks
  | 'dynamic-switching'    // Frequent, adaptive task switching
  | 'interest-driven'      // Engagement varies with intrinsic motivation
  | 'rhythmic-cycling'     // Natural fluctuation in attention capacity
  | 'sensory-sensitive';   // Attention influenced by environmental stimuli

/**
 * Attention profile configuration for personalized interaction design.
 * Preferences, not prescriptions.
 */
export interface AttentionProfile {
  /** User identifier */
  userId: string;

  /** Primary attention style(s) - users may exhibit multiple patterns */
  primaryStyles: AttentionStyle[];

  /** Preferred notification timing patterns */
  preferredTimingWindows?: {
    morningPeak?: boolean;
    afternoonDip?: boolean;
    eveningRise?: boolean;
  };

  /** Environmental preferences for optimal engagement */
  environmentalPreferences?: {
    quietSpaces?: boolean;
    visualMinimalism?: boolean;
    structuredRoutines?: boolean;
  };

  /** Self-reported engagement patterns */
  engagementMetadata?: {
    optimalSessionLength?: number; // minutes
    breakFrequency?: number;       // minutes between breaks
    deepWorkPeriods?: string[];    // time ranges in HH:MM format
  };
}

/**
 * Service interface for attention profiling.
 * Implementation will integrate with cognitive-load and intervention-timing modules.
 */
export interface AttentionProfiler {
  /**
   * Retrieve user's attention profile.
   */
  getProfile(userId: string): Promise<AttentionProfile | null>;

  /**
   * Update user's attention profile based on preferences or observed patterns.
   */
  updateProfile(profile: AttentionProfile): Promise<void>;

  /**
   * Suggest optimal intervention timing based on attention profile.
   * Returns ISO 8601 timestamp or null if no suitable time found.
   */
  suggestOptimalTiming(userId: string, urgency: 'low' | 'medium' | 'high'): Promise<string | null>;
}
