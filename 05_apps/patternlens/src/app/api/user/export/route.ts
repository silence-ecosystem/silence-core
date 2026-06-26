import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

    // Fetch user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    // Fetch all user reports
    const { data: reports } = await supabase
      .from("objects")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    // Fetch all interpretations for user's objects
    const objectIds = reports?.map((r) => r.id) || [];
    let interpretations: Array<{
      id: string;
      object_id: string;
      lens: string;
      context_phase: string;
      tension_phase: string;
      meaning_phase: string;
      function_phase: string;
      confidence: number | null;
      risk_level: string;
      created_at: string;
    }> = [];

    if (objectIds.length > 0) {
      const { data: interpData } = await supabase
        .from("interpretations")
        .select("*")
        .in("object_id", objectIds);
      interpretations = interpData || [];
    }

    // Fetch consent logs
    const { data: consents } = await supabase
      .from("consent_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("granted_at", { ascending: false });

    // Build export data
    const exportData = {
      export_info: {
        exported_at: new Date().toISOString(),
        format_version: "1.0",
        service: "SILENCE.OBJECTS",
      },
      user_profile: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        profile: profile ? {
          tier: profile.tier,
          object_count: profile.object_count,
          onboarding_completed: profile.onboarding_completed,
          onboarding_completed_at: profile.onboarding_completed_at,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
        } : null,
      },
      objects: reports?.map((obj) => ({
        id: obj.id,
        input_text: obj.input_text,
        input_source: obj.input_source,
        selected_lens: obj.selected_lens,
        theme: obj.theme,
        created_at: obj.created_at,
        interpretations: interpretations
          .filter((i) => i.object_id === obj.id)
          .map((i) => ({
            id: i.id,
            lens: i.lens,
            context_phase: i.context_phase,
            tension_phase: i.tension_phase,
            meaning_phase: i.meaning_phase,
            function_phase: i.function_phase,
            confidence: i.confidence,
            risk_level: i.risk_level,
            created_at: i.created_at,
          })),
      })) || [],
      consent_logs: consents?.map((consent) => ({
        consent_type: consent.consent_type,
        consent_version: consent.consent_version,
        granted: consent.granted,
        granted_at: consent.granted_at,
      })) || [],
    };

    // Generate filename with date
    const date = new Date().toISOString().split("T")[0];
    const filename = `silence-export-${date}.json`;

    // Return as downloadable JSON file
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Nie udało się wyeksportować danych" },
      { status: 500 }
    );
  }
}
