import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PatternsContent } from "./PatternsContent";

export default async function PatternsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("tier, object_count")
    .eq("id", user.id)
    .single();

  const tier = profile?.tier || "FREE";
  const objectCount = profile?.object_count || 0;

  return (
    <div className="min-h-screen bg-[#0f1419] flex flex-col">
      {/* Header */}
      <header className="bg-[#161b22] border-b border-[#2d3748]">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-[#8b949e] hover:text-[#f5f7fa] mb-4 transition-colors min-h-[44px]"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Powrót
          </Link>
          <h1 className="text-[32px] font-semibold tracking-[-0.5px] text-[#f5f7fa] leading-tight">
            Wzorce
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto px-4 py-8 w-full">
        <PatternsContent tier={tier} objectCount={objectCount} />
      </main>
    </div>
  );
}
