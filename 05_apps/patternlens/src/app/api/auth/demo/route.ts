import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Demo account credentials for App Store review
const DEMO_EMAIL = "review@silenceobjects.com";
const DEMO_PASSWORD = process.env.DEMO_ACCOUNT_PASSWORD || "SilenceReview2024!";

// Only allow in development or with explicit flag
const DEMO_ENABLED = process.env.NODE_ENV === "development" || process.env.ENABLE_DEMO_LOGIN === "true";

export async function POST() {
  // Security check - only allow demo login when explicitly enabled
  if (!DEMO_ENABLED) {
    return NextResponse.json(
      { error: "Demo login is deactivated" },
      { status: 403 }
    );
  }

  try {
    // Use service role to manage demo account
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Check if demo user exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const demoUser = existingUsers?.users?.find((u) => u.email === DEMO_EMAIL);

    let userId: string;

    if (!demoUser) {
      // Create demo user if doesn't exist
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
        email_confirm: true,
        user_metadata: {
          is_demo: true,
          name: "App Store Reviewer",
        },
      });

      if (createError || !newUser.user) {
        console.error("Failed to create demo user:", createError);
        return NextResponse.json(
          { error: "Failed to create demo account" },
          { status: 500 }
        );
      }

      userId = newUser.user.id;

      // Create profile for demo user with PRO tier
      await supabaseAdmin.from("profiles").upsert({
        id: userId,
        tier: "PRO",
        object_count: 5,
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
      });

      // Create some sample objects for demo
      await createSampleObjects(supabaseAdmin, userId);
    } else {
      userId = demoUser.id;

      // Ensure demo user has PRO tier
      await supabaseAdmin.from("profiles").upsert({
        id: userId,
        tier: "PRO",
        onboarding_completed: true,
      });
    }

    // Sign in as demo user using regular client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseAnonKey) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });

    if (signInError || !signInData.session) {
      console.error("Demo sign in failed:", signInError);
      return NextResponse.json(
        { error: "Failed to sign in to demo account" },
        { status: 500 }
      );
    }

    // Set auth cookies
    const cookieStore = await cookies();

    cookieStore.set("sb-access-token", signInData.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    cookieStore.set("sb-refresh-token", signInData.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Demo login successful",
      redirect: "/dashboard",
    });
  } catch (error) {
    console.error("Demo login error:", error);
    return NextResponse.json(
      { error: "Demo login failed" },
      { status: 500 }
    );
  }
}

// Create sample objects for App Store reviewer to see
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function createSampleObjects(supabase: any, userId: string) {
  const sampleReports = [
    {
      user_id: userId,
      input_text: "I noticed that whenever my manager assigns me a new project, I immediately feel overwhelmed and start procrastinating. Even if the task is manageable, I delay starting until the last minute.",
      selected_lens: "A",
      risk_level: "low",
    },
    {
      user_id: userId,
      input_text: "During team meetings, I often stay quiet even when I have ideas to contribute. Afterwards, I feel frustrated with myself for not speaking up.",
      selected_lens: "B",
      risk_level: "none",
    },
    {
      user_id: userId,
      input_text: "I keep checking my phone for messages even when I know no one has texted. This happens especially when I'm alone in the evening.",
      selected_lens: "A",
      risk_level: "low",
    },
  ];

  for (const report of sampleReports) {
    const { data: newReport } = await supabase
      .from("objects")
      .insert(report)
      .select()
      .single();

    if (newReport) {
      // Add sample interpretations with TEXT phase fields (REAL schema)
      await supabase.from("interpretations").insert([
        {
          object_id: newReport.id,
          lens: "A",
          context_phase: "Pattern emerges in achievement-related situations",
          tension_phase: "Tension between commitment to deliver and avoidance of high-stakes evaluation",
          meaning_phase: "Maps to internalized early performance expectations as a structural constraint",
          function_phase: "Procrastination serves as a buffer against potential system overload",
          confidence: 0.85,
          risk_level: "NONE",
        },
        {
          object_id: newReport.id,
          lens: "B",
          context_phase: "Pattern activated by task assignment and deadline proximity",
          tension_phase: "Constraint amplification: perceived difficulty exceeds available capacity",
          meaning_phase: "Learned avoidance pattern reinforced by temporary tension reduction",
          function_phase: "Short-term activation reduction maintaining long-term pattern",
          confidence: 0.82,
          risk_level: "NONE",
        },
      ]);
    }
  }

  // Update object count
  await supabase
    .from("profiles")
    .update({ object_count: sampleReports.length })
    .eq("id", userId);
}

// GET endpoint for demo login page redirect
export async function GET() {
  if (!DEMO_ENABLED) {
    return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  }

  // Return simple HTML form for demo login
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Demo Login - SILENCE.OBJECTS</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      background: #0f1419;
      color: #f5f7fa;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    h1 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
    p {
      color: #8b949e;
      margin-bottom: 2rem;
    }
    button {
      background: #4a90e2;
      color: white;
      border: none;
      padding: 1rem 2rem;
      font-size: 1rem;
      border-radius: 8px;
      cursor: pointer;
      min-height: 48px;
    }
    button:hover { background: #3a7bc8; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    .note {
      margin-top: 2rem;
      font-size: 0.875rem;
      color: #6e7681;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>App Store Review Access</h1>
    <p>Click below to access the demo account</p>
    <button onclick="demoLogin()" id="btn">Enter Demo Mode</button>
    <p class="note">This account has PRO features enabled for review purposes.</p>
  </div>
  <script>
    async function demoLogin() {
      const btn = document.getElementById('btn');
      btn.disabled = true;
      btn.textContent = 'Logging in...';
      try {
        const res = await fetch('/api/auth/demo', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          window.location.href = data.redirect;
        } else {
          alert('Login failed: ' + data.error);
          btn.disabled = false;
          btn.textContent = 'Enter Demo Mode';
        }
      } catch (e) {
        alert('Network error');
        btn.disabled = false;
        btn.textContent = 'Enter Demo Mode';
      }
    }
  </script>
</body>
</html>
  `;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}
