// ===========================================
// SILENCE.OBJECTS - Supabase Module
// ===========================================

// Client exports
export { createClient } from "./client";
export { createClient as createServerClient } from "./server";

// Admin client (server-side only)
export {
  supabaseAdmin,
  logCrisisEvent,
  updateUserTier,
  deleteAllUserData,
} from "./admin";
