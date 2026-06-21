"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Clock } from "lucide-react";
import { dataProducts } from "@/lib/mock-data";

export function TopBar() {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  const results = query.length > 1
    ? dataProducts.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.domain.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <header className="fixed top-0 left-60 right-0 h-14 flex items-center px-6 gap-4 z-20"
      style={{ background: "#faf9f6", borderBottom: "1px solid #e7e5e4" }}>
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowResults(true); }}
          onBlur={() => setTimeout(() => setShowResults(false), 150)}
          placeholder="Search data products, use cases..."
          className="w-full pl-9 pr-4 py-1.5 text-sm rounded-md focus:outline-none focus:ring-2 transition-all placeholder:text-stone-400 text-stone-700"
          style={{ border: "1px solid #e7e5e4", background: "#ffffff" }}
        />
        {showResults && results.length > 0 && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-lg shadow-lg overflow-hidden z-50"
            style={{ border: "1px solid #e7e5e4" }}>
            {results.map((p) => (
              <button
                key={p.id}
                onMouseDown={() => router.push(`/catalog/${p.id}`)}
                className="w-full text-left px-4 py-2.5 transition-colors last:border-0"
                style={{ borderBottom: "1px solid #f5f5f4" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#faf9f6")}
                onMouseLeave={e => (e.currentTarget.style.background = "")}
              >
                <div className="text-sm font-medium text-stone-800">{p.name}</div>
                <div className="text-xs text-stone-500">{p.domain} · Score: {p.aiReadinessScore}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-xs text-stone-400 ml-auto">
        <Clock size={12} />
        <span>Last evaluated: Today, 9:42 AM</span>
      </div>

      {/* Demo badge */}
      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium"
        style={{ background: "#fef3c7", color: "#92400e", border: "1px solid #fde68a" }}>
        Synthetic Demo
      </span>

    </header>
  );
}
