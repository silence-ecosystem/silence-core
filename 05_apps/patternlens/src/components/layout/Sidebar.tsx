"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, layout, nav, text, card } from "@/constants/design-system";
import { FREE_OBJECT_LIMIT } from "@/constants";

interface SidebarProps {
  objectCount: number;
  tier: string;
}

const NAV_ITEMS = [
  { id: "dashboard", href: "/dashboard", label: "Panel", d: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" },
  { id: "archive", href: "/archive", label: "Archiwum", d: "M21 8v13H3V8M1 3h22v5H1zM10 12h4" },
  { id: "settings", href: "/settings", label: "Ustawienia", d: "M12 15a3 3 0 100-6 3 3 0 000 6z" },
  { id: "emergency", href: "/emergency", label: "Zasoby kryzysowe", d: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" },
];

export function Sidebar({ objectCount, tier }: SidebarProps) {
  const pathname = usePathname();
  const progress = (objectCount / FREE_OBJECT_LIMIT) * 100;

  return (
    <aside className={cn(layout.sidebar, "hidden lg:flex border-r border-zinc-800")}>
      <div className="flex items-center gap-2.5 px-4 py-6">
        <div className="w-6 h-6 bg-[var(--primary)] rounded flex items-center justify-center">
          <span className="text-white text-xs font-semibold">S</span>
        </div>
        <span className="text-sm font-semibold text-zinc-400">SILENCE</span>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map(({ id, href, label, d }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={id} href={href} className={cn(nav.item, "py-3", isActive ? nav.itemActive : nav.itemInactive)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d={d}/></svg>
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3">
        <div className={cn(card.base, "p-4")}>
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Wykorzystane</div>
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-2xl font-semibold">{objectCount}</span>
            <span className={text.secondary}>/ {FREE_OBJECT_LIMIT}</span>
          </div>
          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-[var(--primary)] rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }}/>
          </div>
          {tier === "FREE" && (
            <Link href="/pricing" className="mt-4 w-full inline-flex items-center justify-center py-3 border border-[var(--primary)] text-[var(--primary)] text-sm font-medium rounded-md hover:bg-[var(--primary-muted)] transition-colors">
              Przejdź na PRO
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
