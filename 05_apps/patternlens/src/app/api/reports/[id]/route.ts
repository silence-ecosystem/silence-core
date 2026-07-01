import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: report, error: reportError } = await supabase
      .from("objects")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (reportError) {
      if (reportError.code === "PGRST116") {
        return NextResponse.json({ error: "Report not found" }, { status: 404 });
      }
      return NextResponse.json(
        { error: "Failed to fetch report" },
        { status: 500 }
      );
    }

    const { data: interpretations, error: interpError } = await supabase
      .from("interpretations")
      .select("*")
      .eq("object_id", id)
      .order("lens", { ascending: true });

    if (interpError) {
      return NextResponse.json(
        { error: "Failed to fetch interpretations" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      report,
      interpretations,
    });
  } catch (error) {
    console.error("Report GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
