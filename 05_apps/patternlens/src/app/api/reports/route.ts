import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { inputText, lensA, lensB, selectedLens, riskLevel } = body;

  
    // Columns match 001_patternlens.sql (no risk_level on objects table)
    const { data: report, error: reportError } = await supabase
      .from("objects")
      .insert({
        user_id: user.id,
        input_text: inputText,
        selected_lens: selectedLens,
      })
      .select()
      .single();

    if (reportError) {
      console.error("Report insert error:", reportError);
      return NextResponse.json({ error: "Failed to save report" }, { status: 500 });
    }

    // Insert interpretations with TEXT phase fields (REAL schema)
    const interpretations = [
      {
        object_id: report.id,
        lens: "A",
        context_phase: lensA.context,
        tension_phase: lensA.tension,
        meaning_phase: lensA.meaning,
        function_phase: lensA.function,
        confidence: lensA.confidence || 0.5,
        risk_level: riskLevel || "NONE",
      },
      {
        object_id: report.id,
        lens: "B",
        context_phase: lensB.context,
        tension_phase: lensB.tension,
        meaning_phase: lensB.meaning,
        function_phase: lensB.function,
        confidence: lensB.confidence || 0.5,
        risk_level: riskLevel || "NONE",
      },
    ];

    const { error: interpError } = await supabase
      .from("interpretations")
      .insert(interpretations);

    if (interpError) {
      console.error("Interpretations insert error:", interpError);
    }

    // Increment object count
    await supabase.rpc("increment_object_count", { p_user_id: user.id });

    return NextResponse.json({ success: true, reportId: report.id });

  } catch (error) {
    console.error("Reports API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // REAL schema columns
    const { data: reports, error } = await supabase
      .from("objects")
      .select("id, input_text, selected_lens, theme, created_at")
      .eq("user_id", user.id)
      .eq("is_archived", false)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
    }

    return NextResponse.json(reports);

  } catch (error) {
    console.error("Reports GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
