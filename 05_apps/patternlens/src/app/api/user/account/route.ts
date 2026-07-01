import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

// Lazy initialization for Supabase admin client (needed to delete auth users)
function getSupabaseAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase environment variables not set");
  }
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// DELETE /api/user/account - Delete entire user account
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

    const userId = user.id;

    // Get all object IDs first
    const { data: objects } = await supabase
      .from("objects")
      .select("id")
      .eq("user_id", userId);

    const objectIds = objects?.map((r) => r.id) || [];

    // Delete interpretations
    if (objectIds.length > 0) {
      await supabase
        .from("interpretations")
        .delete()
        .in("object_id", objectIds);
    }

    // Delete reports
    await supabase
      .from("objects")
      .delete()
      .eq("user_id", userId);

    // Note: consent_logs are preserved as audit trail (GDPR requirement)
    // They use ON DELETE SET NULL so user_id becomes NULL but records remain

    // Delete profile
    await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);

    // Delete auth user using admin client
    const supabaseAdmin = getSupabaseAdmin();
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteUserError) {
      console.error("Delete auth user error:", deleteUserError);
      return NextResponse.json(
        { error: "Nie udało się usunąć konta" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Konto zostało usunięte",
    });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { error: "Nie udało się usunąć konta" },
      { status: 500 }
    );
  }
}
