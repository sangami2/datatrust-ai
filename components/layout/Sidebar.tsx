"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  Target,
  AlertTriangle,
  ListOrdered,
  Info,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/catalog", label: "Data Catalog", icon: Database },
  { href: "/use-case-fit", label: "AI Use-Case Fit", icon: Target },
  { href: "/incidents", label: "Incidents", icon: AlertTriangle },
  { href: "/prioritization", label: "Prioritization", icon: ListOrdered },
  { href: "/about", label: "About", icon: Info },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 h-full w-60 flex flex-col z-30"
      style={{ background: "#18120e", borderRight: "1px solid rgba(255,255,255,0.05)" }}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 group">
          {/* Wordmark mark */}
          <div className="w-8 h-8 shrink-0 flex items-center justify-center">
            <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
              <rect x="8" y="8" width="16" height="16" rx="2" fill="#b45309" transform="rotate(45 16 16)" />
              <circle cx="16" cy="16" r="2.5" fill="white" fillOpacity="0.85" />
            </svg>
          </div>
          <div>
            <div className="text-stone-100 font-bold text-sm tracking-tight leading-tight">DataTrust</div>
            <div className="text-stone-500 text-xs font-medium leading-tight">AI Platform</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`sidebar-link ${isActive ? "active" : ""}`}
            >
              <Icon size={15} strokeWidth={isActive ? 2.2 : 1.75} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/5">
        <div
          className="text-xs leading-relaxed"
          style={{ color: "#57534e" }}
        >
          Synthetic demo data.
          <br />
          No proprietary data used.
        </div>
      </div>
    </aside>
  );
}
