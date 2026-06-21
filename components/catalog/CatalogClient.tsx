"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Filter, Users, Clock, ArrowUpDown } from "lucide-react";
import type { DataProduct, BusinessDomain, ReadinessLevel } from "@/types/data-product";
import { ReadinessBadge } from "@/components/ui/ReadinessBadge";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { getScoreColor } from "@/lib/utils";

interface Props {
  products: DataProduct[];
}

const domains: BusinessDomain[] = [
  "Member & Identity",
  "Digital Commerce",
  "Club Operations",
  "Supply Chain",
  "Retail Media",
  "Experimentation",
];

const readinessLevels: ReadinessLevel[] = [
  "AI Ready",
  "Conditionally Ready",
  "Needs Remediation",
  "High Risk",
];

const sortOptions = [
  { value: "score-desc", label: "AI Readiness (High → Low)" },
  { value: "score-asc", label: "AI Readiness (Low → High)" },
  { value: "impact", label: "Business Impact" },
  { value: "users", label: "Active Users" },
  { value: "updated", label: "Last Updated" },
];

const domainIcons: Record<string, string> = {
  "Member & Identity": "👤",
  "Digital Commerce": "📱",
  "Club Operations": "🏪",
  "Supply Chain": "📦",
  "Retail Media": "📢",
  "Experimentation": "🔬",
};

export function CatalogClient({ products }: Props) {
  const [query, setQuery] = useState("");
  const [selectedDomains, setSelectedDomains] = useState<BusinessDomain[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<ReadinessLevel[]>([]);
  const [sortBy, setSortBy] = useState("score-desc");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...products];

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.domain.toLowerCase().includes(q) ||
          p.owner.toLowerCase().includes(q) ||
          p.approvedUseCases.some((uc) => uc.toLowerCase().includes(q))
      );
    }

    if (selectedDomains.length > 0) {
      result = result.filter((p) => selectedDomains.includes(p.domain));
    }

    if (selectedLevels.length > 0) {
      result = result.filter((p) => selectedLevels.includes(p.readinessLevel));
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "score-desc": return b.aiReadinessScore - a.aiReadinessScore;
        case "score-asc": return a.aiReadinessScore - b.aiReadinessScore;
        case "users": return b.activeUsers - a.activeUsers;
        case "impact": {
          const order = { High: 0, Medium: 1, Low: 2 };
          return order[a.estimatedBusinessImpact] - order[b.estimatedBusinessImpact];
        }
        case "updated": return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        default: return 0;
      }
    });

    return result;
  }, [products, query, selectedDomains, selectedLevels, sortBy]);

  function toggleDomain(d: BusinessDomain) {
    setSelectedDomains((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  }

  function toggleLevel(l: ReadinessLevel) {
    setSelectedLevels((prev) =>
      prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]
    );
  }

  return (
    <div className="p-8 max-w-[1400px]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Data Catalog</h1>
        <p className="text-sm text-slate-500">
          Discover, evaluate, and trust data products across the organization. {products.length} data products available.
        </p>
      </div>

      {/* Search and Toolbar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-lg">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search data products, domains, use cases, owners..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all placeholder:text-slate-400"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors font-medium ${
            showFilters || selectedDomains.length > 0 || selectedLevels.length > 0
              ? "bg-amber-50 border-amber-300 text-amber-700"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Filter size={14} />
          Filters
          {(selectedDomains.length + selectedLevels.length) > 0 && (
            <span className="bg-amber-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {selectedDomains.length + selectedLevels.length}
            </span>
          )}
        </button>
        <div className="flex items-center gap-2">
          <ArrowUpDown size={14} className="text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-slate-700"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5 shadow-sm">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">Business Domain</div>
              <div className="flex flex-wrap gap-2">
                {domains.map((d) => (
                  <button
                    key={d}
                    onClick={() => toggleDomain(d)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      selectedDomains.includes(d)
                        ? "bg-amber-700 text-white border-amber-700"
                        : "bg-white text-slate-600 border-slate-200 hover:border-amber-400 hover:text-amber-700"
                    }`}
                  >
                    {domainIcons[d]} {d}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">AI Readiness Level</div>
              <div className="flex flex-wrap gap-2">
                {readinessLevels.map((l) => (
                  <button
                    key={l}
                    onClick={() => toggleLevel(l)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      selectedLevels.includes(l)
                        ? "bg-amber-700 text-white border-amber-700"
                        : "bg-white text-slate-600 border-slate-200 hover:border-amber-400 hover:text-amber-700"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {(selectedDomains.length > 0 || selectedLevels.length > 0) && (
            <button
              onClick={() => { setSelectedDomains([]); setSelectedLevels([]); }}
              className="mt-3 text-xs text-slate-500 hover:text-red-500 transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Results count */}
      <div className="text-xs text-slate-500 mb-4">
        Showing {filtered.length} of {products.length} data products
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-3 gap-5">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <Database size={32} className="mx-auto mb-3 opacity-30" />
          <div className="text-sm font-medium">No data products match your search</div>
          <div className="text-xs mt-1">Try adjusting your filters or search terms</div>
        </div>
      )}

      <div className="text-center py-8 mt-4">
        <p className="text-xs text-slate-400">
          Demo built with synthetic retail data for portfolio purposes. No proprietary company data used.
        </p>
      </div>
    </div>
  );
}

function Database({ size, className }: { size: number; className: string }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

function ProductCard({ product }: { product: DataProduct }) {
  const openIssues = product.qualityIssues.filter((i) => i.status !== "resolved");
  const topIssue = openIssues[0];

  return (
    <Link href={`/catalog/${product.id}`}
      className="flex flex-col bg-white rounded-xl shadow-sm hover:shadow-md transition-all group overflow-hidden cursor-pointer"
      style={{ border: "1px solid #e7e5e4" }}>
      <div className="p-5 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0"
              style={{ background: "#f5f5f4" }}>
              {domainIcons[product.domain] ?? "📊"}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold leading-tight transition-colors group-hover:text-amber-700 truncate"
                style={{ color: "#1c1917" }}>
                {product.name}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "#a8a29e" }}>{product.domain}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            {product.weeklyTrend !== undefined && product.weeklyTrend !== 0 && (
              <span className="text-xs font-bold"
                style={{ color: product.weeklyTrend > 0 ? "#16a34a" : "#dc2626" }}>
                {product.weeklyTrend > 0 ? `▲${product.weeklyTrend}` : `▼${Math.abs(product.weeklyTrend)}`}
              </span>
            )}
            <ScoreRing score={product.aiReadinessScore} size={44} strokeWidth={4} />
          </div>
        </div>

        {/* Description */}
        <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: "#78716c" }}>
          {product.description}
        </p>

        {/* Status row */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <ReadinessBadge level={product.readinessLevel} size="sm" />
          <span className={`text-xs font-semibold ${getScoreColor(product.aiReadinessScore)}`}>
            {product.aiReadinessScore} / 100
          </span>
          {product.slaBreachRisk === "high" && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold rounded px-1.5 py-0.5"
              style={{ background: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca" }}>
              SLA Risk
            </span>
          )}
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs mb-3" style={{ color: "#a8a29e" }}>
          <span className="flex items-center gap-1">
            <Users size={11} />
            {product.activeUsers} users
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {product.freshnessSla}
          </span>
          {openIssues.length > 0 && (
            <span className="font-semibold" style={{ color: openIssues.length >= 3 ? "#dc2626" : "#b45309" }}>
              {openIssues.length} open {openIssues.length === 1 ? "issue" : "issues"}
            </span>
          )}
        </div>

        {/* Use case tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.approvedUseCases.slice(0, 3).map((uc) => (
            <span key={uc} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-amber-50 text-amber-700 border border-amber-200">
              {uc}
            </span>
          ))}
          {product.approvedUseCases.length > 3 && (
            <span className="text-xs self-center" style={{ color: "#a8a29e" }}>+{product.approvedUseCases.length - 3} more</span>
          )}
        </div>

        {/* Top issue */}
        {topIssue && (
          <div className="rounded-lg px-3 py-2 mb-3"
            style={{ background: topIssue.severity === "high" ? "#fee2e2" : "#fff7ed", border: `1px solid ${topIssue.severity === "high" ? "#fecaca" : "#fed7aa"}` }}>
            <div className="text-xs font-medium flex items-center gap-1.5"
              style={{ color: topIssue.severity === "high" ? "#dc2626" : "#c2410c" }}>
              <span className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: topIssue.severity === "high" ? "#dc2626" : "#f97316" }} />
              {topIssue.title.length > 60 ? topIssue.title.slice(0, 57) + "..." : topIssue.title}
            </div>
          </div>
        )}
      </div>

      <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: "1px solid #f5f5f4" }}>
        <span className="text-xs" style={{ color: "#a8a29e" }}>Owner: {product.owner}</span>
        <span className="text-xs font-semibold transition-colors" style={{ color: "#b45309" }}>
          View Profile →
        </span>
      </div>
    </Link>
  );
}
