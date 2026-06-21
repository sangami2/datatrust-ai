import Link from "next/link";
import {
  ArrowRight,
  Database,
  AlertTriangle,
  TrendingUp,
  Users,
  ShieldCheck,
  Activity,
  ChevronRight,
  TrendingDown,
  AlertCircle,
} from "lucide-react";
import { dataProducts } from "@/lib/mock-data";
import { ReadinessBadge } from "@/components/ui/ReadinessBadge";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { ReadinessBarChart } from "@/components/dashboard/ReadinessBarChart";

const kpiCards = [
  {
    label: "Total Data Products",
    value: "6",
    icon: Database,
    iconColor: "#b45309",
    iconBg: "#fef3c7",
    sub: "Across 5 business domains",
    movement: null,
  },
  {
    label: "AI / Conditionally Ready",
    value: "4 of 6",
    icon: ShieldCheck,
    iconColor: "#16a34a",
    iconBg: "#dcfce7",
    sub: "67% of catalog",
    movement: { label: "↑1 this week", positive: true },
  },
  {
    label: "Open Quality Incidents",
    value: "8",
    icon: AlertTriangle,
    iconColor: "#c2410c",
    iconBg: "#ffedd5",
    sub: "1 critical, 4 high severity",
    movement: { label: "+2 new this week", positive: false },
  },
  {
    label: "AI Initiatives Blocked",
    value: "3",
    icon: Activity,
    iconColor: "#dc2626",
    iconBg: "#fee2e2",
    sub: "Personalization, attribution, forecasting",
    movement: { label: "unchanged", positive: null },
  },
  {
    label: "Avg AI Readiness Score",
    value: "79 / 100",
    icon: TrendingUp,
    iconColor: "#b45309",
    iconBg: "#fef3c7",
    sub: "Weighted across 9 dimensions",
    movement: { label: "+2 pts this quarter", positive: true },
  },
  {
    label: "Active Data Consumers",
    value: "142",
    icon: Users,
    iconColor: "#0f766e",
    iconBg: "#ccfbf1",
    sub: "Across 12 analytics teams",
    movement: { label: "+8 this month", positive: true },
  },
];

const topIssues = [
  {
    rank: 1,
    severity: "critical" as const,
    title: "Member 360 Freshness SLA Breached — 5h 42m Delay",
    dataset: "Member 360",
    datasetId: "member-360",
    blockedUseCases: ["Churn Prediction", "Personalized Offers"],
    owner: "Priya Sharma",
    nextStep: "Release ETL lock and trigger manual refresh. Add lock timeout automation.",
    businessImpact: "Churn scoring ran on 6-hour-old profiles; personalization pipelines served stale offers to all 38 active consumers.",
  },
  {
    rank: 2,
    severity: "high" as const,
    title: "Retail Media Campaign Taxonomy Mismatch Across Channels",
    dataset: "Retail Media Campaign Performance",
    datasetId: "retail-media-campaign",
    blockedUseCases: ["ROAS Analysis", "Campaign Attribution"],
    owner: "Sofia Reyes",
    nextStep: "Create unified taxonomy mapping table. Apply retroactively to Q1 2026 campaigns.",
    businessImpact: "Cross-channel ROAS comparisons unreliable for Q2; blocking launch of AI-driven campaign optimization product.",
  },
  {
    rank: 3,
    severity: "high" as const,
    title: "Android session_id Missing for 18% of Scan & Go Events",
    dataset: "Scan & Go Events",
    datasetId: "scan-go-events",
    blockedUseCases: ["Funnel Analysis", "A/B Experiment Analysis"],
    owner: "Marcus Chen",
    nextStep: "Ship Android SDK v4.3.0 with fixed session_id logic. Backfill via device_id join.",
    businessImpact: "8 live experiments are biased; Scan & Go adoption metrics used for roadmap decisions are understated by 12-15%.",
  },
  {
    rank: 4,
    severity: "high" as const,
    title: "Inventory SKU Hierarchy Changes Not Versioned",
    dataset: "Inventory Signals",
    datasetId: "inventory-signals",
    blockedUseCases: ["Replenishment Forecasting"],
    owner: "Raj Patel",
    nextStep: "Implement semantic versioning. Patch 1,842 affected SKUs immediately.",
    businessImpact: "Replenishment models generating incorrect order quantities for SKUs across ~23% of club revenue for 3 weeks.",
  },
];

const highValueLowReadiness = [
  {
    id: "retail-media-campaign",
    name: "Retail Media Campaign Performance",
    score: 69,
    impact: "High",
    why: "Improving campaign taxonomy consistency and attribution documentation could unlock accurate cross-channel ROAS reporting and advertiser-facing AI measurement tools.",
  },
  {
    id: "inventory-signals",
    name: "Inventory Signals",
    score: 73,
    impact: "High",
    why: "SKU hierarchy versioning and robot scan gap resolution would unblock AI-driven replenishment forecasting at scale across all clubs.",
  },
];

const recentChanges = [
  {
    type: "down",
    product: "Scan & Go Events",
    productId: "scan-go-events",
    change: "Score dropped 90 → 86",
    reason: "Android session_id gaps introduced after SDK v4.2.0 release.",
    time: "3 weeks ago",
  },
  {
    type: "up",
    product: "Member 360",
    productId: "member-360",
    change: "Governance score improved",
    reason: "Consent metadata backfill completed for 60% of affected members.",
    time: "2 weeks ago",
  },
  {
    type: "alert",
    product: "Exit Experience Events",
    productId: "exit-experience-events",
    change: "CV confidence drift detected",
    reason: "vision_confidence_score below threshold at clubs 4821 and 5103.",
    time: "8 days ago",
  },
  {
    type: "down",
    product: "Retail Media Campaign Performance",
    productId: "retail-media-campaign",
    change: "Schema stability score dropped",
    reason: "Breaking change to attribution_window field format broke 4 downstream reports.",
    time: "5 weeks ago",
  },
];

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8 max-w-[1400px]">
      {/* Hero */}
      <div className="rounded-xl p-8 relative overflow-hidden"
        style={{ background: "#1c1917", color: "#f5f5f4" }}>
        {/* Subtle texture — no gradients */}
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.3) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.3) 40px)" }} />
        <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium mb-4"
              style={{ background: "rgba(180,83,9,0.2)", color: "#fcd34d", border: "1px solid rgba(180,83,9,0.3)" }}>
              <Activity size={11} />
              Live Quality Monitoring · Evaluated {new Date("2026-06-20T09:42:00Z").toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
            </div>
            <h1 className="text-[26px] font-bold tracking-tight mb-4 max-w-xl leading-snug">
              AI-ready data is a competitive advantage. Track yours.
            </h1>
            {/* Hero stats */}
            <div className="flex items-center gap-0 mb-5">
              <div className="pr-6">
                <div className="text-xs font-medium mb-1" style={{ color: "#a8a29e" }}>AI / Conditionally Ready</div>
                <div className="text-2xl font-bold" style={{ color: "#fcd34d" }}>4 of 6</div>
              </div>
              <div className="px-6" style={{ borderLeft: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="text-xs font-medium mb-1" style={{ color: "#a8a29e" }}>Open Incidents</div>
                <div className="text-2xl font-bold text-white">8</div>
              </div>
              <div className="px-6" style={{ borderLeft: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="text-xs font-medium mb-1" style={{ color: "#a8a29e" }}>Avg Readiness Score</div>
                <div className="text-2xl font-bold text-white">79 / 100</div>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/catalog"
                className="btn-amber inline-flex items-center gap-2 font-semibold px-4 py-2.5 rounded text-sm"
              >
                Explore Data Catalog
                <ArrowRight size={14} />
              </Link>
              <Link href="/use-case-fit"
                className="inline-flex items-center gap-2 font-semibold px-4 py-2.5 rounded text-sm transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#d6d3d1" }}
              >
                Evaluate a Use Case
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs — 3×2 grid */}
      <div className="grid grid-cols-3 gap-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl p-5 shadow-sm flex items-start gap-4" style={{ border: "1px solid #e7e5e4" }}>
              <div className="w-9 h-9 rounded flex items-center justify-center shrink-0"
                style={{ background: card.iconBg }}>
                <Icon size={16} style={{ color: card.iconColor }} />
              </div>
              <div>
                <div className="text-2xl font-bold leading-none mb-1" style={{ color: "#1c1917" }}>{card.value}</div>
                <div className="text-xs font-semibold mb-0.5" style={{ color: "#44403c" }}>{card.label}</div>
                <div className="text-xs leading-tight" style={{ color: "#a8a29e" }}>{card.sub}</div>
                {card.movement && (
                  <div className="text-xs font-medium mt-1.5"
                    style={{ color: card.movement.positive === true ? "#16a34a" : card.movement.positive === false ? "#dc2626" : "#a8a29e" }}>
                    {card.movement.label}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart + Snapshot */}
      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-3 bg-white rounded-xl p-6 shadow-sm" style={{ border: "1px solid #e7e5e4" }}>
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold" style={{ color: "#1c1917" }}>AI Readiness by Data Product</h2>
            <Link href="/catalog" className="text-xs font-medium flex items-center gap-1 transition-colors"
              style={{ color: "#b45309" }}>
              View catalog <ChevronRight size={12} />
            </Link>
          </div>
          <p className="text-xs mb-5" style={{ color: "#a8a29e" }}>Score out of 100 · Weighted across 9 quality dimensions</p>
          <ReadinessBarChart products={dataProducts} />
        </div>

        <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm" style={{ border: "1px solid #e7e5e4" }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: "#1c1917" }}>Portfolio Snapshot</h2>
          <div className="space-y-3">
            {dataProducts
              .sort((a, b) => b.aiReadinessScore - a.aiReadinessScore)
              .map((p) => (
                <Link key={p.id} href={`/catalog/${p.id}`} className="flex items-center gap-3 group">
                  <ScoreRing score={p.aiReadinessScore} size={38} strokeWidth={4} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate leading-tight mb-1 transition-colors group-hover:text-amber-700"
                      style={{ color: "#1c1917" }}>
                      {p.name}
                    </div>
                    <ReadinessBadge level={p.readinessLevel} size="sm" />
                  </div>
                  {p.weeklyTrend !== undefined && p.weeklyTrend !== 0 && (
                    <span className="text-xs font-semibold shrink-0"
                      style={{ color: p.weeklyTrend > 0 ? "#16a34a" : "#dc2626" }}>
                      {p.weeklyTrend > 0 ? `▲${p.weeklyTrend}` : `▼${Math.abs(p.weeklyTrend)}`}
                    </span>
                  )}
                </Link>
              ))}
          </div>
        </div>
      </div>

      {/* Top Priority Issues */}
      <div className="bg-white rounded-xl shadow-sm" style={{ border: "1px solid #e7e5e4" }}>
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #f5f5f4" }}>
          <div>
            <h2 className="text-sm font-semibold" style={{ color: "#1c1917" }}>Top Priority Issues</h2>
            <p className="text-xs mt-0.5" style={{ color: "#a8a29e" }}>Ranked by severity × downstream impact × blocked AI use cases</p>
          </div>
          <Link href="/incidents" className="text-xs font-medium flex items-center gap-1 transition-colors"
            style={{ color: "#b45309" }}>
            All incidents <ChevronRight size={12} />
          </Link>
        </div>
        <div style={{ borderColor: "#f5f5f4" }} className="divide-y">
          {topIssues.map((issue) => (
            <div key={issue.rank} className="px-6 py-4 flex items-start gap-4 transition-colors hover:bg-stone-50">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                style={{ background: "#f5f5f4", color: "#78716c" }}>
                {issue.rank}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <SeverityBadge severity={issue.severity} size="sm" />
                  <span className="text-sm font-medium" style={{ color: "#1c1917" }}>{issue.title}</span>
                </div>
                <div className="flex items-center gap-4 text-xs mb-2" style={{ color: "#a8a29e" }}>
                  <span>Dataset: <Link href={`/catalog/${issue.datasetId}`} className="font-medium hover:underline" style={{ color: "#b45309" }}>{issue.dataset}</Link></span>
                  <span>Owner: {issue.owner}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {issue.blockedUseCases.map((uc) => (
                    <span key={uc} className="inline-flex items-center px-2 py-0.5 rounded text-xs"
                      style={{ background: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca" }}>
                      Blocks: {uc}
                    </span>
                  ))}
                </div>
                {issue.businessImpact && (
                  <div className="text-xs rounded px-3 py-2 mb-1.5" style={{ background: "#fef3c7", color: "#92400e", border: "1px solid #fde68a" }}>
                    <span className="font-semibold">Business impact: </span>{issue.businessImpact}
                  </div>
                )}
                <div className="text-xs rounded px-3 py-2" style={{ background: "#f5f5f4", color: "#57534e", border: "1px solid #e7e5e4" }}>
                  <span className="font-semibold" style={{ color: "#1c1917" }}>Next step: </span>{issue.nextStep}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* High Value Low Readiness + Recent Changes */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm" style={{ border: "1px solid #e7e5e4" }}>
          <div className="px-6 py-4" style={{ borderBottom: "1px solid #f5f5f4" }}>
            <h2 className="text-sm font-semibold" style={{ color: "#1c1917" }}>High Value, Low Readiness</h2>
            <p className="text-xs mt-0.5" style={{ color: "#a8a29e" }}>Datasets where quality investment has the highest business leverage</p>
          </div>
          <div style={{ borderColor: "#f5f5f4" }} className="divide-y">
            {highValueLowReadiness.map((item) => (
              <div key={item.id} className="p-6 flex items-start gap-4">
                <ScoreRing score={item.score} size={48} strokeWidth={5} />
                <div className="flex-1">
                  <Link href={`/catalog/${item.id}`} className="text-sm font-semibold hover:text-amber-700 transition-colors"
                    style={{ color: "#1c1917" }}>
                    {item.name}
                  </Link>
                  <div className="flex items-center gap-2 mt-1 mb-2">
                    <span className="text-xs" style={{ color: "#a8a29e" }}>Business Impact:</span>
                    <span className="text-xs font-medium rounded px-1.5 py-0.5"
                      style={{ background: "#ffedd5", color: "#c2410c", border: "1px solid #fed7aa" }}>{item.impact}</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "#78716c" }}>{item.why}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm" style={{ border: "1px solid #e7e5e4" }}>
          <div className="px-6 py-4" style={{ borderBottom: "1px solid #f5f5f4" }}>
            <h2 className="text-sm font-semibold" style={{ color: "#1c1917" }}>Recent AI Readiness Changes</h2>
            <p className="text-xs mt-0.5" style={{ color: "#a8a29e" }}>Quality events that affected readiness scores</p>
          </div>
          <div className="px-6 py-4 space-y-4">
            {recentChanges.map((change, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: change.type === "up" ? "#dcfce7" : change.type === "down" ? "#fee2e2" : "#fef3c7" }}>
                  {change.type === "up" ? <TrendingUp size={13} style={{ color: "#16a34a" }} /> :
                   change.type === "down" ? <TrendingDown size={13} style={{ color: "#dc2626" }} /> :
                   <AlertCircle size={13} style={{ color: "#b45309" }} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link href={`/catalog/${change.productId}`} className="text-sm font-medium hover:text-amber-700 transition-colors"
                      style={{ color: "#1c1917" }}>
                      {change.product}
                    </Link>
                    <span className="text-xs font-medium"
                      style={{ color: change.type === "up" ? "#16a34a" : change.type === "down" ? "#dc2626" : "#b45309" }}>
                      {change.change}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "#78716c" }}>{change.reason}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#a8a29e" }}>{change.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-xs text-slate-400">
          Demo built with synthetic retail data for portfolio purposes. No proprietary company data used.
        </p>
      </div>
    </div>
  );
}
