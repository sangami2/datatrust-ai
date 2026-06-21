"use client";

import { useState, useMemo } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Lightbulb, TrendingUp, Users, Zap, User, CalendarClock, ChevronDown } from "lucide-react";

type EffortLevel = "Low" | "Medium" | "High";
type ImpactLevel = "High" | "Medium" | "Low";

interface BacklogItem {
  rank: number;
  issue: string;
  dataProduct: string;
  baseScore: number;
  businessImpact: ImpactLevel;
  usersAffected: number;
  aiUseCasesBlocked: number;
  defaultEffort: EffortLevel;
  defaultTime: string;
  owner: string;
  quarter: string;
  impactLabel: string;
  pmRationale: string;
}

const BASE_BACKLOG: BacklogItem[] = [
  {
    rank: 1,
    issue: "Backfill Member 360 consent metadata",
    dataProduct: "Member 360",
    baseScore: 94,
    businessImpact: "High",
    usersAffected: 38,
    aiUseCasesBlocked: 3,
    defaultEffort: "Medium",
    defaultTime: "2–3 wks",
    owner: "Priya Sharma",
    quarter: "Q3 2026",
    impactLabel: "3.2M members unblocked for personalization",
    pmRationale: "The highest-leverage fix in the catalog: resolving 3.2M consent gaps directly unblocks churn scoring and personalization without any model changes. No other item delivers this much coverage per engineering week.",
  },
  {
    rank: 2,
    issue: "Fix Android Scan & Go session tracking (SDK v4.3.0)",
    dataProduct: "Scan & Go Events",
    baseScore: 87,
    businessImpact: "High",
    usersAffected: 24,
    aiUseCasesBlocked: 3,
    defaultEffort: "Low",
    defaultTime: "1 wk",
    owner: "Marcus Chen",
    quarter: "Q3 2026",
    impactLabel: "Restores 18% of Android events, unblocks 8 experiments",
    pmRationale: "Best ROI item: low effort, ships in one sprint. Every day this is open, 8 running experiments carry biased Funnel Analysis results. Fix it this week to stop the bleeding.",
  },
  {
    rank: 3,
    issue: "Standardize Retail Media campaign taxonomy",
    dataProduct: "Retail Media Campaign Performance",
    baseScore: 81,
    businessImpact: "High",
    usersAffected: 19,
    aiUseCasesBlocked: 3,
    defaultEffort: "Medium",
    defaultTime: "3–4 wks",
    owner: "Sofia Reyes",
    quarter: "Q3 2026",
    impactLabel: "Enables cross-channel ROAS and advertiser attribution",
    pmRationale: "Taxonomy standardization is a prerequisite for the Q4 AI campaign optimization product. Without it, the entire cross-channel roadmap is blocked. Resolving this in Q3 creates the critical path.",
  },
  {
    rank: 4,
    issue: "Implement SKU hierarchy versioning for Inventory Signals",
    dataProduct: "Inventory Signals",
    baseScore: 74,
    businessImpact: "High",
    usersAffected: 22,
    aiUseCasesBlocked: 2,
    defaultEffort: "High",
    defaultTime: "6–8 wks",
    owner: "Raj Patel",
    quarter: "Q4 2026",
    impactLabel: "Prevents silent model breakage from unversioned taxonomy changes",
    pmRationale: "High effort but non-negotiable: unversioned SKU changes will silently break replenishment models again. Start design now to land in Q4 before the next peak season inventory build.",
  },
  {
    rank: 5,
    issue: "Document attribution window methodology for Retail Media",
    dataProduct: "Retail Media Campaign Performance",
    baseScore: 68,
    businessImpact: "High",
    usersAffected: 19,
    aiUseCasesBlocked: 2,
    defaultEffort: "Low",
    defaultTime: "< 1 wk",
    owner: "Sofia Reyes",
    quarter: "Q3 2026",
    impactLabel: "Restores advertiser trust in ROAS reporting",
    pmRationale: "No-code, no-engineering, just decision-making and documentation. This is a Q3 must-do: one Google Doc eliminates the biggest advertiser trust risk in the platform.",
  },
  {
    rank: 6,
    issue: "Recalibrate Exit Experience CV models at clubs 4821 & 5103",
    dataProduct: "Exit Experience Events",
    baseScore: 62,
    businessImpact: "Medium",
    usersAffected: 18,
    aiUseCasesBlocked: 2,
    defaultEffort: "Medium",
    defaultTime: "3 wks",
    owner: "Tanisha Williams",
    quarter: "Q3 2026",
    impactLabel: "Restores CV queue prediction accuracy at affected clubs",
    pmRationale: "Localized to 2 clubs; medium effort. Deprioritized relative to items 1–5 due to narrower scope, but should close in Q3 before holiday traffic volume amplifies the accuracy gap.",
  },
  {
    rank: 7,
    issue: "Add guardrail metric requirement to Experiment Registry",
    dataProduct: "Experiment Registry",
    baseScore: 55,
    businessImpact: "Medium",
    usersAffected: 21,
    aiUseCasesBlocked: 2,
    defaultEffort: "Low",
    defaultTime: "1–2 wks",
    owner: "Jordan Kim",
    quarter: "Q3 2026",
    impactLabel: "Enables automated governance for all future experiments",
    pmRationale: "Small product change with compounding long-term value — every experiment shipped after this fix will have built-in governance. Low effort means it should be bundled into a Q3 sprint alongside item #2.",
  },
  {
    rank: 8,
    issue: "Create Inventory Signals documentation and data contract",
    dataProduct: "Inventory Signals",
    baseScore: 48,
    businessImpact: "Medium",
    usersAffected: 22,
    aiUseCasesBlocked: 1,
    defaultEffort: "Medium",
    defaultTime: "2–3 wks",
    owner: "Raj Patel",
    quarter: "Q4 2026",
    impactLabel: "Reduces onboarding time and establishes quality guarantees",
    pmRationale: "Low priority score but addresses a long-tail pain point: every new downstream consumer currently takes 3–5 days to onboard due to undocumented fields. Q4 is the right window after item #4 lands.",
  },
];

const effortOrder: Record<EffortLevel, number> = { Low: 1, Medium: 2, High: 3 };
const impactOrder: Record<ImpactLevel, number> = { High: 3, Medium: 2, Low: 1 };
const effortAdj: Record<EffortLevel, number> = { Low: 10, Medium: 0, High: -14 };

function computeScore(item: BacklogItem, effort: EffortLevel): number {
  const adj = effortAdj[effort] - effortAdj[item.defaultEffort];
  return Math.min(99, Math.max(10, item.baseScore + adj));
}

function getScope(effort: EffortLevel, impact: ImpactLevel): { label: string; color: string; bg: string; border: string } {
  const e = effortOrder[effort];
  const i = impactOrder[impact];
  if (e === 1 && i === 3) return { label: "Quick Win", color: "#15803d", bg: "#dcfce7", border: "#86efac" };
  if (e === 1 && i === 2) return { label: "Easy Pick", color: "#0d9488", bg: "#ccfbf1", border: "#5eead4" };
  if (e === 2 && i === 3) return { label: "High Value", color: "#b45309", bg: "#fef3c7", border: "#fcd34d" };
  if (e === 2 && i === 2) return { label: "Medium Lift", color: "#b45309", bg: "#fef3c7", border: "#fcd34d" };
  if (e === 3 && i === 3) return { label: "Big Bet", color: "#1d4ed8", bg: "#dbeafe", border: "#93c5fd" };
  return { label: "Consider Later", color: "#dc2626", bg: "#fee2e2", border: "#fca5a5" };
}

const impactColors: Record<ImpactLevel, string> = {
  High: "text-orange-600 bg-orange-50 border-orange-100",
  Medium: "text-amber-600 bg-amber-50 border-amber-100",
  Low: "text-slate-500 bg-slate-50 border-slate-100",
};

const CustomDot = (props: { cx?: number; cy?: number; payload?: { rank: number; score: number } }) => {
  const { cx = 0, cy = 0, payload } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r={12} fill="#b45309" fillOpacity={0.12} stroke="#b45309" strokeWidth={1.5} />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight="700" fill="#1c1917">
        #{payload?.rank}
      </text>
    </g>
  );
};

export function PrioritizationClient() {
  const [itemState, setItemState] = useState<Record<number, { effort: EffortLevel; time: string }>>(() =>
    Object.fromEntries(BASE_BACKLOG.map((item) => [item.rank, { effort: item.defaultEffort, time: item.defaultTime }]))
  );

  const sortedBacklog = useMemo(() =>
    [...BASE_BACKLOG].sort((a, b) =>
      computeScore(b, itemState[b.rank].effort) - computeScore(a, itemState[a.rank].effort)
    ), [itemState]);

  const displayRankMap = useMemo(() =>
    Object.fromEntries(sortedBacklog.map((item, idx) => [item.rank, idx + 1]))
  , [sortedBacklog]);

  const matrixData = useMemo(() => {
    const posCount: Record<string, number> = {};
    const posIdx: Record<string, number> = {};
    BASE_BACKLOG.forEach((item) => {
      const key = `${effortOrder[itemState[item.rank].effort]},${impactOrder[item.businessImpact]}`;
      posCount[key] = (posCount[key] || 0) + 1;
    });
    return BASE_BACKLOG.map((item) => {
      const effort = itemState[item.rank].effort;
      const x = effortOrder[effort];
      const y = impactOrder[item.businessImpact];
      const key = `${x},${y}`;
      posIdx[key] = (posIdx[key] || 0) + 1;
      const count = posCount[key];
      const idx = posIdx[key] - 1;
      const yOffset = count > 1 ? (idx - (count - 1) / 2) * 0.45 : 0;
      return {
        name: item.issue.slice(0, 36) + "…",
        x,
        y: y + yOffset,
        score: computeScore(item, effort),
        rank: displayRankMap[item.rank] ?? item.rank,
      };
    });
  }, [itemState, displayRankMap]);

  function updateItem(rank: number, field: "effort" | "time", value: string) {
    setItemState((prev) => ({ ...prev, [rank]: { ...prev[rank], [field]: value } }));
  }

  return (
    <div className="p-8 max-w-[1400px]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">PM Prioritization Dashboard</h1>
        <p className="text-sm text-slate-500">
          Set effort and time per item based on your engineering team — priority scores and the matrix update automatically.
        </p>
      </div>

      {/* AI Recommendation */}
      <div className="bg-amber-50 rounded-xl border border-amber-200 p-5 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
            <Lightbulb size={16} className="text-amber-700" />
          </div>
          <div>
            <div className="text-sm font-semibold text-amber-800 mb-1 flex items-center gap-2">
              <TrendingUp size={14} />
              Recommended Next Quarter Focus (Q3 2026)
            </div>
            <p className="text-sm text-amber-700 leading-relaxed">
              Prioritize <strong>Member 360 consent metadata backfill</strong> and <strong>Scan & Go Android session tracking fix</strong> — together, these two initiatives unblock three high-value AI use cases: churn modeling, personalized offers, and adoption experimentation. Add <strong>Retail Media attribution documentation</strong> as a quick-win for the analytics and advertiser success teams.
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
        <h2 className="text-sm font-semibold text-slate-800 mb-1">Effort vs. Business Impact Matrix</h2>
        <p className="text-xs text-slate-400 mb-4">Y-axis: Business Impact · X-axis: Effort (set by you) · Top-left = Quick Wins · Top-right = Big Bets</p>
        <ResponsiveContainer width="100%" height={260}>
          <ScatterChart margin={{ top: 20, right: 40, bottom: 36, left: 55 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              type="number"
              dataKey="x"
              domain={[0.5, 3.5]}
              ticks={[1, 2, 3]}
              tickFormatter={(v: number) => (["", "Low", "Medium", "High"][v] ?? "")}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              label={{ value: "Effort (set by you)", position: "insideBottom", offset: -20, fontSize: 11, fill: "#94a3b8" }}
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={[0.5, 3.5]}
              ticks={[1, 2, 3]}
              tickFormatter={(v: number) => (["", "Low", "Medium", "High"][v] ?? "")}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              label={{ value: "Business Impact", angle: -90, position: "insideLeft", dx: -35, dy: 55, fontSize: 11, fill: "#94a3b8" }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload as { name: string; score: number };
                  return (
                    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs max-w-60">
                      <div className="font-semibold text-slate-800 mb-1">{d.name}</div>
                      <div className="text-slate-500">Priority score: <span className="font-bold text-amber-700">{d.score}</span></div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter data={matrixData} shape={<CustomDot />} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Backlog */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ border: "1px solid #e7e5e4" }}>
        <div className="px-6 py-4" style={{ borderBottom: "1px solid #f5f5f4" }}>
          <h2 className="text-sm font-semibold" style={{ color: "#1c1917" }}>Prioritized Fix List</h2>
          <p className="text-xs mt-0.5" style={{ color: "#a8a29e" }}>
            Edit effort and time based on your engineering team · List re-ranks automatically
          </p>
        </div>
        <div className="divide-y" style={{ borderColor: "#f5f5f4" }}>
          {sortedBacklog.map((item, idx) => {
            const effort = itemState[item.rank].effort;
            const time = itemState[item.rank].time;
            const score = computeScore(item, effort);
            const scope = getScope(effort, item.businessImpact);
            const displayRank = idx + 1;

            return (
              <div key={item.rank} className="px-6 py-4 transition-colors hover:bg-stone-50">
                <div className="flex items-start gap-4">
                  {/* Rank bubble */}
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                    style={{ background: displayRank <= 3 ? "#b45309" : "#f5f5f4", color: displayRank <= 3 ? "#fff" : "#78716c" }}>
                    {displayRank}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Title row */}
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="text-sm font-semibold" style={{ color: "#1c1917" }}>{item.issue}</div>
                        <div className="text-xs mt-0.5" style={{ color: "#78716c" }}>{item.impactLabel}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-sm font-bold" style={{ color: "#b45309" }}>{score}</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium ${impactColors[item.businessImpact]}`}>
                          {item.businessImpact} impact
                        </span>
                        {/* Scope badge — auto-assigned */}
                        <span className="inline-flex items-center px-2 py-0.5 rounded border text-xs font-semibold"
                          style={{ color: scope.color, background: scope.bg, border: `1px solid ${scope.border}` }}>
                          {scope.label}
                        </span>
                      </div>
                    </div>

                    {/* Editable effort + time */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium" style={{ color: "#78716c" }}>Effort:</span>
                        <div className="relative">
                          <select
                            value={effort}
                            onChange={(e) => updateItem(item.rank, "effort", e.target.value)}
                            className="text-xs font-semibold appearance-none pl-2 pr-6 py-1 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
                            style={{ background: "#f5f5f4", color: "#1c1917", border: "1px solid #e7e5e4" }}
                          >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                          </select>
                          <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#78716c" }} />
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium" style={{ color: "#78716c" }}>Time:</span>
                        <input
                          type="text"
                          value={time}
                          onChange={(e) => updateItem(item.rank, "time", e.target.value)}
                          className="text-xs font-semibold w-20 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
                          style={{ background: "#f5f5f4", color: "#1c1917", border: "1px solid #e7e5e4" }}
                          placeholder="e.g. 2 wks"
                        />
                      </div>
                    </div>

                    {/* Metadata chips */}
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium"
                        style={{ background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" }}>
                        <Users size={11} />
                        {item.usersAffected} downstream users
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium"
                        style={{ background: "#fee2e2", color: "#b91c1c", border: "1px solid #fecaca" }}>
                        <Zap size={11} />
                        {item.aiUseCasesBlocked} AI use case{item.aiUseCasesBlocked > 1 ? "s" : ""} blocked
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium"
                        style={{ background: "#f5f5f4", color: "#44403c", border: "1px solid #e7e5e4" }}>
                        <User size={11} />
                        {item.owner}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold"
                        style={{ background: "rgba(180,83,9,0.08)", color: "#92400e", border: "1px solid rgba(180,83,9,0.2)" }}>
                        <CalendarClock size={11} />
                        {item.quarter}
                      </span>
                    </div>

                    {/* PM Rationale */}
                    <div className="rounded-lg px-3 py-2 text-xs leading-relaxed"
                      style={{ background: "rgba(180,83,9,0.04)", border: "1px solid rgba(180,83,9,0.1)", color: "#1c1917" }}>
                      <span className="font-semibold" style={{ color: "#92400e" }}>PM rationale: </span>
                      {item.pmRationale}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center py-8 mt-4">
        <p className="text-xs text-slate-400">
          Demo built with synthetic retail data for portfolio purposes. No proprietary company data used.
        </p>
      </div>
    </div>
  );
}
