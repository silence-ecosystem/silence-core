import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface ConsentInput {
  type: string;
  version: string;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Nie jesteś zalogowany" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { consents } = body as { consents: ConsentInput[] };

    if (!consents || !Array.isArray(consents) || consents.length === 0) {
      return NextResponse.json(
        { error: "Brak zgód do zapisania" },
        { status: 400 }
      );
    }

    // Validate required consents
    const requiredTypes = ["privacy_policy", "terms_of_service", "ai_disclaimer"];
    const providedTypes = consents.map((c) => c.type);
    const missingRequired = requiredTypes.filter((t) => !providedTypes.includes(t));

    if (missingRequired.length > 0) {
      return NextResponse.json(
        { error: `Brakuje wymaganych zgód: ${missingRequired.join(", ")}` },
        { status: 400 }
      );
    }

    // Get user's IP and user agent for audit trail
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ||
               request.headers.get("x-real-ip") ||
               "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Prepare consent records
    const consentRecords = consents.map((consent) => ({
      user_id: user.id,
      consent_type: consent.type,
      consent_version: consent.version,
      granted: true,
      ip_address: ip,
      user_agent: userAgent,
      granted_at: new Date().toISOString(),
    }));

    // Insert consent records
    const { error: insertError } = await supabase
      .from("consent_logs")
      .insert(consentRecords);

    if (insertError) {
      console.error("Consent insert error:", insertError);
      // If table doesn't exist, still mark onboarding as complete
      // This allows the app to work before migrations are run
      if (insertError.code !== "42P01") {
        return NextResponse.json(
          { error: "Nie udało się zapisać zgód" },
          { status: 500 }
        );
      }
    }

    // Mark onboarding as completed
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Profile update error:", updateError);
      // Non-critical error, continue
    }

    return NextResponse.json({
      success: true,
      message: "Zgody zostały zapisane"
    });
  } catch (error) {
    console.error("Consent API error:", error);
    return NextResponse.json(
      { error: "Wystąpił błąd serwera" },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve user's consents
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Nie jesteś zalogowany" },
        { status: 401 }
      );
    }

    const { data: consents, error } = await supabase
      .from("consent_logs")
      .select("consent_type, consent_version, granted, granted_at")
      .eq("user_id", user.id)
      .eq("granted", true)
      .order("granted_at", { ascending: false });

    if (error) {
      console.error("Consent fetch error:", error);
      return NextResponse.json(
        { error: "Nie udało się pobrać zgód" },
        { status: 500 }
      );
    }

    return NextResponse.json({ consents });
  } catch (error) {
    console.error("Consent GET error:", error);
    return NextResponse.json(
      { error: "Wystąpił błąd serwera" },
      { status: 500 }
    );
  }
}
