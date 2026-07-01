import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// DELETE /api/user/data - Delete all user data (keeps account)
export async function DELETE() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Nie jesteś zalogowany" },
        { status: 401 }
      );
    }

    // Get all object IDs first
    const { data: objects } = await supabase
      .from("objects")
      .select("id")
      .eq("user_id", user.id);

    const objectIds = objects?.map((r) => r.id) || [];

    // Delete interpretations for user's objects
    if (objectIds.length > 0) {
      const { error: interpError } = await supabase
        .from("interpretations")
        .delete()
        .in("object_id", objectIds);

      if (interpError) {
        console.error("Delete interpretations error:", interpError);
      }
    }

    // Delete all reports
    const { error: reportsError } = await supabase
      .from("objects")
      .delete()
      .eq("user_id", user.id);

    if (reportsError) {
      console.error("Delete reports error:", reportsError);
      return NextResponse.json(
        { error: "Nie udało się usunąć raportów" },
        { status: 500 }
      );
    }

    // Reset profile counters
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        object_count: 0,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (profileError) {
      console.error("Reset profile error:", profileError);
    }

    // Log the data deletion in consents table for audit
    // consent_type CHECK constraint allows: 'structural', 'safety', 'data', 'age'
    await supabase
      .from("consent_logs")
      .insert({
        user_id: user.id,
        consent_type: "data",
        consent_version: "1.0",
        granted: false,
        granted_at: new Date().toISOString(),
      });

    return NextResponse.json({
      success: true,
      message: "Wszystkie dane zostały usunięte",
      deleted: {
        objects: objectIds.length,
      },
    });
  } catch (error) {
    console.error("Delete data error:", error);
    return NextResponse.json(
      { error: "Nie udało się usunąć danych" },
      { status: 500 }
    );
  }
}

// GET /api/user/data - Get summary of user data
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

    // Count reports
    const { count: reportsCount } = await supabase
      .from("objects")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    // Count consents
    const { count: consentsCount } = await supabase
      .from("consent_logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    return NextResponse.json({
      data_summary: {
        reports_count: reportsCount || 0,
        consents_count: consentsCount || 0,
        account_created: user.created_at,
      },
    });
  } catch (error) {
    console.error("Get data summary error:", error);
    return NextResponse.json(
      { error: "Nie udało się pobrać informacji o danych" },
      { status: 500 }
    );
  }
}
