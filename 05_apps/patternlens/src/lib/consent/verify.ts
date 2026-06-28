'use strict';

import { createClient } from '@/lib/supabase/server';

/**
 * Consent Types (must match database enum)
 */
export type ConsentType = 'structural' | 'safety' | 'data' | 'age';

/**
 * Detailed consent status for audit purposes
 */
export interface ConsentStatus {
  consent_type: ConsentType;
  granted: boolean;
  withdrawn: boolean;
  last_granted_at: string | null;
  last_withdrawn_at: string | null;
}

/**
 * Comprehensive consent verification result
 */
export interface ConsentVerificationResult {
  success: boolean;
  user_id: string;
  all_consents_active: boolean;
  verified_at: string;
  consents: Record<ConsentType, ConsentStatus>;
  missing_consents: ConsentType[];
  withdrawn_consents: ConsentType[];
  blocking_reason?: string;
  audit_log: {
    action: 'CONSENT_VERIFIED' | 'CONSENT_VERIFICATION_FAILED';
    details: {
      all_active: boolean;
      missing_count: number;
      withdrawn_count: number;
      reason?: string;
    };
    timestamp: string;
  };
}

/**
 * VERIFY USER CONSENTS - GDPR COMPLIANCE
 * 
 * Purpose:
 *   Comprehensive verification of all 4 required GDPR consents before processing
 *   Ensures user has explicitly granted consent for structural analysis, safety features,
 *   data processing, and age verification.
 * 
 * Checks:
 *   1. All 4 required consents present in consent_logs
 *   2. Each consent is marked as granted (not just provided)
 *   3. No consent has been withdrawn (consent_withdrawals)
 *   4. Consents are currently active (withdrawal check)
 * 
 * Returns:
 *   Detailed status object with granular consent state for each type
 *   Missing/withdrawn consents clearly identified
 *   Audit trail for compliance logging
 * 
 * Blocks Processing:
 *   - Returns success: false if ANY required consent is missing
 *   - Returns success: false if ANY required consent has been withdrawn
 *   - Includes blocking_reason explaining what's missing
 * 
 * Usage:
 *   const result = await verifyUserConsents(userId, supabase);
 *   if (!result.success) {
 *     return NextResponse.json(
 *       { error: result.blocking_reason },
 *       { status: 403 }
 *     );
 *   }
 */
export async function verifyUserConsents(userId: string): Promise<ConsentVerificationResult> {
  const supabase = await createClient();
  const verifiedAt = new Date().toISOString();
  const requiredConsents: ConsentType[] = ['structural', 'safety', 'data', 'age'];

  interface ConsentLogRow { consent_type: string; granted: boolean; timestamp: string; }
  interface WithdrawalRow { consent_type: string; withdrawn_at: string; }

  try {
    // STEP 1: Fetch all consent grants from immutable log
    const { data: consentLogs, error: logsError } = await supabase
      .from('consent_logs')
      .select('consent_type, granted, timestamp')
      .eq('user_id', userId)
      .in('consent_type', requiredConsents);

    if (logsError) {
      console.error('[ConsentVerify] Error fetching consent logs:', logsError);
      throw new Error(`Failed to fetch consent logs: ${logsError.message}`);
    }

    // STEP 2: Fetch all consent withdrawals from immutable log
    const { data: withdrawals, error: withdrawalError } = await supabase
      .from('consent_withdrawals')
      .select('consent_type, withdrawn_at')
      .eq('user_id', userId)
      .in('consent_type', requiredConsents);

    if (withdrawalError) {
      console.error('[ConsentVerify] Error fetching withdrawals:', withdrawalError);
      throw new Error(`Failed to fetch withdrawals: ${withdrawalError.message}`);
    }

    // STEP 3: Build consent status for each type
    const consentStatuses: Record<ConsentType, ConsentStatus> = {} as Record<ConsentType, ConsentStatus>;
    const missingConsents: ConsentType[] = [];
    const withdrawnConsents: ConsentType[] = [];

    for (const consentType of requiredConsents) {
      // Find latest grant
      const grants = (consentLogs as ConsentLogRow[] || [])
        .filter((log: ConsentLogRow) => log.consent_type === consentType && log.granted)
        .sort((a: ConsentLogRow, b: ConsentLogRow) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      const latestGrant = grants[0];

      // Find latest withdrawal
      const withdrawal = (withdrawals as WithdrawalRow[] || []).find((w: WithdrawalRow) => w.consent_type === consentType);

      // Determine if consent is currently active
      const isWithdrawn = withdrawal && latestGrant
        ? new Date(withdrawal.withdrawn_at).getTime() > new Date(latestGrant.timestamp).getTime()
        : !!withdrawal;

      const isGranted = !!latestGrant && !isWithdrawn;

      // Track missing/withdrawn
      if (!latestGrant) {
        missingConsents.push(consentType);
      }
      if (isWithdrawn) {
        withdrawnConsents.push(consentType);
      }

      // Store status
      consentStatuses[consentType] = {
        consent_type: consentType,
        granted: isGranted,
        withdrawn: isWithdrawn,
        last_granted_at: latestGrant?.timestamp || null,
        last_withdrawn_at: withdrawal?.withdrawn_at || null,
      };
    }

    // STEP 4: Determine overall success
    const allActive = missingConsents.length === 0 && withdrawnConsents.length === 0;
    let blockingReason: string | undefined;

    if (missingConsents.length > 0) {
      blockingReason = `Brakuje wymaganych zgód: ${missingConsents.join(', ')}. Zaloguj się ponownie.`;
    } else if (withdrawnConsents.length > 0) {
      blockingReason = `Wycofałeś/aś zgody na: ${withdrawnConsents.join(', ')}. Wymagane jest ponowne zaakceptowanie.`;
    }

    // STEP 5: Log verification to audit trail
    const { error: auditError } = await supabase
      .from('audit_logs')
      .insert({
        user_id: userId,
        action: allActive ? 'CONSENT_VERIFIED' : 'CONSENT_VERIFICATION_FAILED',
        resource_type: 'consent',
        details: {
          all_active: allActive,
          missing_count: missingConsents.length,
          withdrawn_count: withdrawnConsents.length,
          missing: missingConsents,
          withdrawn: withdrawnConsents,
          reason: blockingReason,
        },
      });

    if (auditError) {
      console.warn('[ConsentVerify] Warning: Failed to log audit trail:', auditError);
      // Continue - audit logging is important but shouldn't block verification
    }

    // STEP 6: Build comprehensive result
    const result: ConsentVerificationResult = {
      success: allActive,
      user_id: userId,
      all_consents_active: allActive,
      verified_at: verifiedAt,
      consents: consentStatuses,
      missing_consents: missingConsents,
      withdrawn_consents: withdrawnConsents,
      ...(blockingReason && { blocking_reason: blockingReason }),
      audit_log: {
        action: allActive ? 'CONSENT_VERIFIED' : 'CONSENT_VERIFICATION_FAILED',
        details: {
          all_active: allActive,
          missing_count: missingConsents.length,
          withdrawn_count: withdrawnConsents.length,
          ...(blockingReason && { reason: blockingReason }),
        },
        timestamp: verifiedAt,
      },
    };

    return result;

  } catch (error) {
    console.error('[ConsentVerify] Unhandled error:', error);

    // Return failure result on error (safe default)
    const result: ConsentVerificationResult = {
      success: false,
      user_id: userId,
      all_consents_active: false,
      verified_at: verifiedAt,
      consents: {} as Record<ConsentType, ConsentStatus>,
      missing_consents: requiredConsents,
      withdrawn_consents: [],
      blocking_reason: 'Nie udało się zweryfikować zgód. Spróbuj ponownie.',
      audit_log: {
        action: 'CONSENT_VERIFICATION_FAILED',
        details: {
          all_active: false,
          missing_count: requiredConsents.length,
          withdrawn_count: 0,
          reason: error instanceof Error ? error.message : 'Unknown error',
        },
        timestamp: verifiedAt,
      },
    };

    return result;
  }
}

/**
 * Helper: Get human-readable consent descriptions
 */
export function getConsentDescription(type: ConsentType, locale: 'pl' | 'en' = 'pl'): string {
  const descriptions = {
    pl: {
      structural: 'Rozumiem, że PatternLens to narzędzie analizy strukturalnej, nie terapii',
      safety: 'Rozumiem system detekcji kryzysów i dostęp do zasobów',
      data: 'Wyrażam zgodę na przetwarzanie moich danych zgodnie z polityką prywatności',
      age: 'Mam 18 lat lub więcej',
    },
    en: {
      structural: 'I understand PatternLens is a structural analysis tool, not therapy',
      safety: 'I understand crisis detection and resource access',
      data: 'I consent to data processing per the privacy policy',
      age: 'I am 18 years or older',
    },
  };

  return descriptions[locale][type];
}

/**
 * Helper: Create initial consent grant for new user
 * Used in onboarding flow
 */
export async function createInitialConsents(userId: string, locale: 'pl' | 'en' = 'pl'): Promise<boolean> {
  const supabase = await createClient();
  const requiredConsents: ConsentType[] = ['structural', 'safety', 'data', 'age'];

  try {
    const { error } = await supabase
      .from('consent_logs')
      .insert(
        requiredConsents.map(type => ({
          user_id: userId,
          consent_type: type,
          consent_version: '1.0',
          granted: true,
        }))
      );

    if (error) {
      console.error('[ConsentCreate] Error creating consents:', error);
      return false;
    }

    // Log to audit trail
    await supabase
      .from('audit_logs')
      .insert({
        user_id: userId,
        action: 'INITIAL_CONSENTS_GRANTED',
        resource_type: 'consent',
        details: {
          locale,
          consent_types: requiredConsents,
        },
      });

    return true;

  } catch (error) {
    console.error('[ConsentCreate] Unhandled error:', error);
    return false;
  }
}
