// PatternLens v4.1 - Complete Type System
// NUCLEAR FIX: Zero 'any' tolerance

// ============================================
// CORE DOMAIN TYPES
// ============================================

export type TierType = 'FREE' | 'PRO' | 'ENTERPRISE';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type LensType = 'structural' | 'temporal' | 'relational' | 'emotional';
export type InputMode = 'voice' | 'text';
export type ThemeMode = 'light' | 'dark' | 'system';
export type AuthMode = 'login' | 'register';

// ============================================
// USER & AUTH
// ============================================

export interface User {
  readonly id: string;
  readonly email: string;
  readonly displayName: string | null;
  readonly avatarUrl: string | null;
  readonly tier: TierType;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly consentGiven: boolean;
  readonly consentDate: string | null;
  readonly emailVerified: boolean;
}

export interface AuthState {
  readonly user: User | null;
  readonly isLoading: boolean;
  readonly isAuthenticated: boolean;
  readonly error: AuthError | null;
}

export interface AuthError {
  readonly code: string;
  readonly message: string;
  readonly recoverable: boolean;
}

export interface Consent {
  readonly dataProcessing: boolean;
  readonly crisisProtocol: boolean;
  readonly privacyPolicy: boolean;
  readonly termsOfService: boolean;
  readonly marketingOptIn: boolean;
  readonly timestamp: string;
}

// ============================================
// PATTERN ANALYSIS
// ============================================

export interface AnalysisObject {
  readonly id: string;
  readonly userId: string;
  readonly content: string;
  readonly inputMode: InputMode;
  readonly lens: LensType;
  readonly analysis: Analysis;
  readonly metadata: ObjectMetadata;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly archivedAt: string | null;
}

export interface Analysis {
  readonly structuralPatterns: readonly Pattern[];
  readonly temporalMarkers: readonly TemporalMarker[];
  readonly riskAssessment: RiskAssessment;
  readonly confidence: number; // 0-100
  readonly processingTime: number; // ms
  readonly modelVersion: string;
}

export interface Pattern {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: PatternCategory;
  readonly strength: number; // 0-100
  readonly evidence: readonly string[];
  readonly relatedPatterns: readonly string[];
}

export type PatternCategory = 
  | 'behavioral'
  | 'cognitive'
  | 'relational'
  | 'temporal'
  | 'emotional'
  | 'defensive';

export interface TemporalMarker {
  readonly type: 'past' | 'present' | 'future' | 'recurring';
  readonly reference: string;
  readonly context: string;
  readonly significance: number; // 0-100
}

export interface RiskAssessment {
  readonly level: RiskLevel;
  readonly score: number; // 0-100
  readonly triggers: readonly CrisisTrigger[];
  readonly requiresIntervention: boolean;
  readonly assessedAt: string;
}

export interface CrisisTrigger {
  readonly keyword: string;
  readonly context: string;
  readonly severity: RiskLevel;
  readonly category: CrisisCategory;
}

export type CrisisCategory = 
  | 'self_harm'
  | 'suicide_ideation'
  | 'violence'
  | 'substance_abuse'
  | 'severe_distress'
  | 'dissociation';

export interface ObjectMetadata {
  readonly wordCount: number;
  readonly characterCount: number;
  readonly recordingDuration: number | null; // seconds
  readonly audioQuality: AudioQuality | null;
  readonly locale: string;
  readonly deviceType: DeviceType;
  readonly sessionId: string;
}

export type AudioQuality = 'excellent' | 'good' | 'fair' | 'poor';
export type DeviceType = 'desktop' | 'mobile' | 'tablet';

// ============================================
// GHOST PATTERNS (PRO)
// ============================================

export interface GhostPattern {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly similarity: number; // 0-100
  readonly occurrences: number;
  readonly firstSeen: string;
  readonly lastSeen: string;
  readonly relatedObjects: readonly string[];
  readonly theme: BehavioralTheme;
}

export type BehavioralTheme = 
  | 'protector'
  | 'avoider'
  | 'perfectionist'
  | 'people_pleaser'
  | 'controller'
  | 'rescuer'
  | 'critic'
  | 'victim';

// ============================================
// VOICE RECORDING
// ============================================

export interface RecordingState {
  readonly isRecording: boolean;
  readonly isPaused: boolean;
  readonly isProcessing: boolean;
  readonly duration: number; // seconds
  readonly audioQuality: AudioQuality;
  readonly error: RecordingError | null;
  readonly permissionStatus: PermissionStatus;
}

export type PermissionStatus = 'granted' | 'denied' | 'prompt' | 'unsupported';

export interface RecordingError {
  readonly code: RecordingErrorCode;
  readonly message: string;
  readonly recoverable: boolean;
}

export type RecordingErrorCode = 
  | 'PERMISSION_DENIED'
  | 'DEVICE_NOT_FOUND'
  | 'BROWSER_UNSUPPORTED'
  | 'RECORDING_FAILED'
  | 'PROCESSING_FAILED'
  | 'TIMEOUT'
  | 'NETWORK_ERROR';

export interface AudioConfig {
  readonly sampleRate: number;
  readonly channels: number;
  readonly mimeType: string;
  readonly maxDuration: number; // seconds
  readonly minDuration: number; // seconds
}

// ============================================
// USAGE & LIMITS
// ============================================

export interface UsageState {
  readonly objectsUsed: number;
  readonly objectsLimit: number;
  readonly weeklyUsage: readonly DailyUsage[];
  readonly periodStart: string;
  readonly periodEnd: string;
  readonly tier: TierType;
  readonly canCreate: boolean;
  readonly remainingObjects: number;
}

export interface DailyUsage {
  readonly date: string;
  readonly count: number;
  readonly voiceCount: number;
  readonly textCount: number;
}

export interface TierLimits {
  readonly objectsPerWeek: number;
  readonly archiveDays: number;
  readonly ghostPatterns: boolean;
  readonly timeCapsules: boolean;
  readonly advancedAnalytics: boolean;
  readonly priorityProcessing: boolean;
  readonly apiAccess: boolean;
}

export const TIER_LIMITS: Record<TierType, TierLimits> = {
  FREE: {
    objectsPerWeek: 7,
    archiveDays: 30,
    ghostPatterns: false,
    timeCapsules: false,
    advancedAnalytics: false,
    priorityProcessing: false,
    apiAccess: false,
  },
  PRO: {
    objectsPerWeek: Infinity,
    archiveDays: Infinity,
    ghostPatterns: true,
    timeCapsules: true,
    advancedAnalytics: true,
    priorityProcessing: true,
    apiAccess: false,
  },
  ENTERPRISE: {
    objectsPerWeek: Infinity,
    archiveDays: Infinity,
    ghostPatterns: true,
    timeCapsules: true,
    advancedAnalytics: true,
    priorityProcessing: true,
    apiAccess: true,
  },
} as const;

// ============================================
// CRISIS RESOURCES
// ============================================

export interface CrisisResource {
  readonly country: CountryCode;
  readonly name: string;
  readonly phone: string;
  readonly url: string | null;
  readonly available: string; // e.g., "24/7"
  readonly languages: readonly string[];
  readonly type: CrisisResourceType;
}

export type CrisisResourceType = 
  | 'hotline'
  | 'text_line'
  | 'chat'
  | 'emergency';

export type CountryCode = 'PL' | 'US' | 'UK' | 'DE' | 'FR';

export const CRISIS_RESOURCES: Record<CountryCode, readonly CrisisResource[]> = {
  PL: [
    {
      country: 'PL',
      name: 'Telefon Zaufania dla Dorosłych',
      phone: '116 123',
      url: 'https://116123.pl',
      available: '24/7',
      languages: ['pl'],
      type: 'hotline',
    },
    {
      country: 'PL',
      name: 'Centrum Wsparcia dla Osób Dorosłych w Kryzysie Psychicznym',
      phone: '800 70 2222',
      url: null,
      available: '24/7',
      languages: ['pl'],
      type: 'hotline',
    },
  ],
  US: [
    {
      country: 'US',
      name: 'National Suicide Prevention Lifeline',
      phone: '988',
      url: 'https://988lifeline.org',
      available: '24/7',
      languages: ['en', 'es'],
      type: 'hotline',
    },
    {
      country: 'US',
      name: 'Crisis Text Line',
      phone: 'Text HOME to 741741',
      url: 'https://www.crisistextline.org',
      available: '24/7',
      languages: ['en'],
      type: 'text_line',
    },
  ],
  UK: [
    {
      country: 'UK',
      name: 'Samaritans',
      phone: '116 123',
      url: 'https://www.samaritans.org',
      available: '24/7',
      languages: ['en'],
      type: 'hotline',
    },
    {
      country: 'UK',
      name: 'Shout Crisis Text Line',
      phone: 'Text SHOUT to 85258',
      url: 'https://giveusashout.org',
      available: '24/7',
      languages: ['en'],
      type: 'text_line',
    },
  ],
  DE: [
    {
      country: 'DE',
      name: 'Telefonseelsorge',
      phone: '0800 111 0 111',
      url: 'https://online.telefonseelsorge.de',
      available: '24/7',
      languages: ['de'],
      type: 'hotline',
    },
  ],
  FR: [
    {
      country: 'FR',
      name: 'SOS Amitié',
      phone: '09 72 39 40 50',
      url: 'https://www.sos-amitie.com',
      available: '24/7',
      languages: ['fr'],
      type: 'hotline',
    },
  ],
} as const;

// ============================================
// SETTINGS & PREFERENCES
// ============================================

export interface UserPreferences {
  readonly theme: ThemeMode;
  readonly language: string;
  readonly accessibility: AccessibilityPreferences;
  readonly notifications: NotificationPreferences;
  readonly privacy: PrivacyPreferences;
  readonly analysis: AnalysisPreferences;
}

export interface AccessibilityPreferences {
  readonly highContrast: boolean;
  readonly reducedMotion: boolean;
  readonly largeText: boolean;
  readonly screenReaderOptimized: boolean;
  readonly dyslexiaFont: boolean;
}

export interface NotificationPreferences {
  readonly crisisAlerts: boolean;
  readonly weeklyDigest: boolean;
  readonly patternDiscovery: boolean;
  readonly productUpdates: boolean;
}

export interface PrivacyPreferences {
  readonly analyticsEnabled: boolean;
  readonly crashReporting: boolean;
  readonly personalization: boolean;
}

export interface AnalysisPreferences {
  readonly defaultLens: LensType;
  readonly confidenceThreshold: number; // 0-100
  readonly autoSaveDrafts: boolean;
  readonly showRiskIndicators: boolean;
}

// ============================================
// API TYPES
// ============================================

export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data: T | null;
  readonly error: ApiError | null;
  readonly timestamp: string;
  readonly requestId: string;
}

export interface ApiError {
  readonly code: string;
  readonly message: string;
  readonly details: Record<string, unknown> | null;
  readonly retryable: boolean;
}

export interface PaginatedResponse<T> {
  readonly items: readonly T[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly hasMore: boolean;
}

// ============================================
// FILTERS & SEARCH
// ============================================

export interface ArchiveFilters {
  readonly category: PatternCategory | null;
  readonly lens: LensType | null;
  readonly riskLevel: RiskLevel | null;
  readonly dateRange: DateRange | null;
  readonly searchQuery: string;
  readonly sortBy: SortField;
  readonly sortOrder: 'asc' | 'desc';
}

export interface DateRange {
  readonly start: string;
  readonly end: string;
}

export type SortField = 'createdAt' | 'updatedAt' | 'risk' | 'confidence';

// ============================================
// COMMAND PALETTE
// ============================================

export interface Command {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly shortcut: string | null;
  readonly category: CommandCategory;
  readonly action: () => void | Promise<void>;
  readonly isAvailable: () => boolean;
}

export type CommandCategory = 
  | 'navigation'
  | 'creation'
  | 'analysis'
  | 'settings'
  | 'help';

// ============================================
// STRIPE / PAYMENTS
// ============================================

export interface SubscriptionState {
  readonly status: SubscriptionStatus;
  readonly tier: TierType;
  readonly currentPeriodStart: string;
  readonly currentPeriodEnd: string;
  readonly cancelAtPeriodEnd: boolean;
  readonly trialEnd: string | null;
}

export type SubscriptionStatus = 
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'incomplete';

export interface PricingPlan {
  readonly id: string;
  readonly tier: TierType;
  readonly name: string;
  readonly description: string;
  readonly prices: readonly Price[];
  readonly features: readonly string[];
  readonly highlighted: boolean;
}

export interface Price {
  readonly id: string;
  readonly currency: 'USD' | 'GBP' | 'PLN';
  readonly amount: number;
  readonly interval: 'month' | 'year';
  readonly formattedPrice: string;
}

// ============================================
// COMPONENT PROPS
// ============================================

export interface ButtonProps {
  readonly variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  readonly size: 'sm' | 'md' | 'lg';
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly fullWidth?: boolean;
  readonly children: React.ReactNode;
  readonly onClick?: () => void;
  readonly type?: 'button' | 'submit' | 'reset';
  readonly ariaLabel?: string;
}

export interface InputProps {
  readonly id: string;
  readonly label: string;
  readonly type?: 'text' | 'email' | 'password' | 'tel' | 'url';
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly error?: string;
  readonly disabled?: boolean;
  readonly required?: boolean;
  readonly autoComplete?: string;
  readonly maxLength?: number;
  readonly minLength?: number;
}

export interface ModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly title: string;
  readonly children: React.ReactNode;
  readonly size?: 'sm' | 'md' | 'lg' | 'xl';
  readonly closeOnOverlayClick?: boolean;
  readonly showCloseButton?: boolean;
}

// ============================================
// UTILITY TYPES
// ============================================

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

export type Nullable<T> = T | null;

export type AsyncState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };
