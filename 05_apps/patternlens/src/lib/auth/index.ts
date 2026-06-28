// ===========================================
// SILENCE.OBJECTS - Authentication Module
// ===========================================

export {
  authenticateRequest,
  getAuthenticatedUser,
  isProUser,
  getUserObjectCount,
  canCreateObject,
  incrementObjectCount,
  completeOnboarding,
  checkRateLimit,
  type AuthenticatedUser,
  type AuthResult,
  type AuthError,
  type AuthOutcome,
  type ProfileData,
} from "./session";
