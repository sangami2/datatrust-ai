"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MessageSquare,
  Target,
  Users,
  Clock,
  RefreshCw,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Database,
  FileText,
} from "lucide-react";
import type { DataProduct } from "@/types/data-product";
import { ReadinessBadge } from "@/components/ui/ReadinessBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { QualityChart } from "@/components/dataset/QualityChart";
import { AdoptionChart } from "@/components/dataset/AdoptionChart";
import { QualityHistoryChart } from "@/components/dataset/QualityHistoryChart";
import { getScoreColor, getScoreBarColor, formatRelativeTime, getReadinessBg } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Props {
  product: DataProduct;
}

const tabs = ["Overview", "Quality", "AI Use Cases", "Incidents", "Adoption", "Documentation"] as const;
type Tab = typeof tabs[number];

export function DatasetDetail({ product }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab") as Tab | null;
  const [activeTab, setActiveTab] = useState<Tab>(
    tabs.includes(tabParam as Tab) ? (tabParam as Tab) : "Overview"
  );
  const [expandedDimension, setExpandedDimension] = useState<string | null>(null);

  useEffect(() => {
    if (tabParam && tabs.includes(tabParam as Tab)) {
      setActiveTab(tabParam as Tab);
    }
  }, [tabParam]);

  function handleTabChange(tab: Tab) {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="min-h-full">
      {/* Top section */}
      <div className="bg-white border-b border-slate-200 px-8 pt-6 pb-0">
        <div className="max-w-[1400px]">
          <Link href="/catalog" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-amber-700 transition-colors mb-4">
            <ArrowLeft size={13} />
            Data Catalog
          </Link>

          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl shrink-0">
                {domainIcon(product.domain)}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
                  <ReadinessBadge level={product.readinessLevel} />
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span>{product.domain}</span>
                  <span>·</span>
                  <span>{product.owner} · {product.ownerTeam}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    Last evaluated {formatRelativeTime(product.lastEvaluated)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <ScoreRing score={product.aiReadinessScore} size={64} strokeWidth={6} />
              <div className="text-right">
                <div className="text-xs text-slate-400 mb-0.5">AI Readiness</div>
                <div className={`text-2xl font-bold ${getScoreColor(product.aiReadinessScore)}`}>
                  {product.aiReadinessScore}<span className="text-sm text-slate-400 font-normal">/100</span>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <Link href="/copilot"
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-700 bg-amber-50 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors">
                  <MessageSquare size={13} />
                  Ask Copilot
                </Link>
                <Link href="/use-case-fit"
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-700 bg-amber-50 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors">
                  <Target size={13} />
                  Evaluate Use Case
                </Link>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-0 border-b border-transparent -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${
                  activeTab === tab
                    ? "border-amber-600 text-amber-700"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab}
                {tab === "Incidents" && product.qualityIssues.filter(i => i.status !== "resolved").length > 0 && (
                  <span className="ml-1.5 bg-orange-500 text-white text-xs rounded-full px-1.5 py-0.5">
                    {product.qualityIssues.filter(i => i.status !== "resolved").length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-8 py-6 max-w-[1400px]">
        {activeTab === "Overview" && <OverviewTab product={product} />}
        {activeTab === "Quality" && (
          <QualityTab
            product={product}
            expandedDimension={expandedDimension}
            setExpandedDimension={setExpandedDimension}
          />
        )}
        {activeTab === "AI Use Cases" && <UseCasesTab product={product} />}
        {activeTab === "Incidents" && <IncidentsTab product={product} />}
        {activeTab === "Adoption" && <AdoptionTab product={product} />}
        {activeTab === "Documentation" && <DocumentationTab product={product} />}
      </div>
    </div>
  );
}

function domainIcon(domain: string): string {
  const icons: Record<string, string> = {
    "Member & Identity": "👤",
    "Digital Commerce": "📱",
    "Club Operations": "🏪",
    "Supply Chain": "📦",
    "Retail Media": "📢",
    "Experimentation": "🔬",
  };
  return icons[domain] ?? "📊";
}

function OverviewTab({ product }: { product: DataProduct }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-5">
        {product.pmNarrative && (
          <div className="rounded-xl p-5" style={{ background: "#1c1917", color: "#f5f5f4" }}>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: "rgba(180,83,9,0.25)" }}>
                <MessageSquare size={13} style={{ color: "#fcd34d" }} />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#fcd34d" }}>PM Narrative</div>
                <p className="text-sm leading-relaxed" style={{ color: "#d6d3d1" }}>{product.pmNarrative}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Business Description</h3>
          <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Approved AI Use Cases</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {product.approvedUseCases.map((uc) => (
              <span key={uc} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                <CheckCircle size={11} /> {uc}
              </span>
            ))}
          </div>
          {product.notRecommendedUseCases.length > 0 && (
            <>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Not Recommended</h4>
              <div className="flex flex-wrap gap-2">
                {product.notRecommendedUseCases.map((uc) => (
                  <span key={uc} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-red-50 text-red-600 border border-red-100 font-medium">
                    <XCircle size={11} /> {uc}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Data Flow</h3>
          <div className="space-y-4">
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Upstream Sources</div>
              <div className="space-y-1.5">
                {product.upstreamDependencies.map((dep) => (
                  <div key={dep} className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    {dep}
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-slate-100 pt-4">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Downstream Consumers</div>
              <div className="space-y-1.5">
                {product.downstreamConsumers.map((dep) => (
                  <div key={dep} className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-300" />
                    {dep}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {product.knownCaveats.length > 0 && (
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
            <h3 className="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2">
              <AlertCircle size={15} /> Known Caveats
            </h3>
            <ul className="space-y-2">
              {product.knownCaveats.map((caveat, i) => (
                <li key={i} className="text-sm text-amber-800 flex items-start gap-2">
                  <span className="text-amber-400 mt-1">•</span>
                  {caveat}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Dataset Metadata</h3>
          <div className="space-y-3">
            <MetaRow icon={<Users size={13} />} label="Primary Owner" value={product.owner} />
            <MetaRow icon={<Users size={13} />} label="Team" value={product.ownerTeam} />
            <MetaRow icon={<RefreshCw size={13} />} label="Refresh Cadence" value={product.refreshCadence} />
            <MetaRow icon={<Clock size={13} />} label="Freshness SLA" value={product.freshnessSla} />
            <MetaRow icon={<Shield size={13} />} label="Privacy Classification" value={product.privacyClassification} />
            <MetaRow icon={<Shield size={13} />} label="Governance Status" value={product.governanceStatus} />
            <MetaRow icon={<FileText size={13} />} label="Data Contract" value={product.dataContractStatus} />
            <MetaRow icon={<Database size={13} />} label="Schema Version" value={product.schemaVersion} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Primary Consumers</h3>
          <div className="space-y-2">
            {product.primaryConsumers.map((consumer) => (
              <div key={consumer} className="text-sm text-slate-600 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                {consumer}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Adoption</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">Active Users</span>
              <span className="text-sm font-semibold text-slate-800">{product.activeUsers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">Repeat Use Rate</span>
              <span className="text-sm font-semibold text-slate-800">{product.repeatUseRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">Business Impact</span>
              <span className={`text-sm font-semibold ${
                product.estimatedBusinessImpact === "High" ? "text-orange-600" :
                product.estimatedBusinessImpact === "Medium" ? "text-amber-600" : "text-slate-500"
              }`}>{product.estimatedBusinessImpact}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-slate-400 shrink-0 mt-0.5">{icon}</span>
      <div>
        <div className="text-xs text-slate-400">{label}</div>
        <div className="text-sm font-medium text-slate-700">{value}</div>
      </div>
    </div>
  );
}

function QualityTab({
  product,
  expandedDimension,
  setExpandedDimension,
}: {
  product: DataProduct;
  expandedDimension: string | null;
  setExpandedDimension: (d: string | null) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-5">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-slate-800">Quality Dimensions</h3>
            <span className="text-xs text-slate-400">↓ click any row for evidence & recommended action</span>
          </div>
          <p className="text-xs text-slate-400 mb-5">Weighted across 9 dimensions · scores below 75 shown with business impact</p>
          <div className="space-y-2">
            {product.qualityDimensions.map((dim) => {
              const isExpanded = expandedDimension === dim.name;
              const isWeak = dim.score < 75;
              return (
                <div key={dim.name} className="border rounded-xl overflow-hidden transition-colors"
                  style={{ borderColor: isExpanded ? "#b45309" : "#e7e5e4" }}>
                  <button
                    onClick={() => setExpandedDimension(isExpanded ? null : dim.name)}
                    className="w-full flex items-center gap-4 px-4 py-3 hover:bg-stone-50 transition-colors text-left"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="text-sm font-medium" style={{ color: "#1c1917" }}>{dim.name}</span>
                        <span className="text-xs" style={{ color: "#a8a29e" }}>Weight: {dim.weight}%</span>
                        <span className={`text-sm font-bold ${getScoreColor(dim.score)}`}>{dim.score}/100</span>
                        {isWeak && !isExpanded && (
                          <span className="text-xs rounded px-1.5 py-0.5 font-medium"
                            style={{ background: dim.score < 60 ? "#fee2e2" : "#fff7ed", color: dim.score < 60 ? "#dc2626" : "#c2410c", border: `1px solid ${dim.score < 60 ? "#fecaca" : "#fed7aa"}` }}>
                            {dim.score < 60 ? "High Risk" : "Needs attention"}
                          </span>
                        )}
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${getScoreBarColor(dim.score)}`}
                          style={{ width: `${dim.score}%` }}
                        />
                      </div>
                      {isWeak && !isExpanded && (
                        <p className="text-xs mt-1.5 leading-snug" style={{ color: "#78716c" }}>
                          {dim.businessImpact.length > 100 ? dim.businessImpact.slice(0, 97) + "…" : dim.businessImpact}
                        </p>
                      )}
                    </div>
                    {isExpanded ? <ChevronUp size={14} className="text-slate-400 shrink-0" /> : <ChevronDown size={14} className="text-slate-400 shrink-0" />}
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 bg-slate-50 border-t border-slate-100">
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <div className="text-xs font-semibold text-slate-600 mb-1.5">Assessment</div>
                          <p className="text-xs text-slate-600 leading-relaxed">{dim.explanation}</p>
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-600 mb-1.5">Evidence</div>
                          <p className="text-xs text-slate-600 leading-relaxed font-mono bg-white border border-slate-200 rounded p-2">
                            {dim.evidence}
                          </p>
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-amber-700 mb-1.5">Business Impact</div>
                          <p className="text-xs text-amber-800 leading-relaxed bg-amber-50 border border-amber-100 rounded p-2">
                            {dim.businessImpact}
                          </p>
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-amber-700 mb-1.5">Recommended Action</div>
                          <p className="text-xs text-amber-900 leading-relaxed bg-amber-50 border border-amber-200 rounded p-2">
                            {dim.recommendedAction}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Quality Score History</h3>
          <QualityHistoryChart data={product.qualityHistory} />
        </div>
      </div>

      <div className="space-y-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Dimension Radar</h3>
          <QualityChart dimensions={product.qualityDimensions} />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Freshness SLA</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">Target SLA</span>
              <span className="text-sm font-semibold text-slate-800">{product.freshnessSla}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">Last Refreshed</span>
              <span className="text-sm font-semibold text-slate-800">{formatRelativeTime(product.lastUpdated)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">Refresh Cadence</span>
              <span className="text-sm font-medium text-slate-700 text-right max-w-36">{product.refreshCadence}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Schema & Governance</h3>
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">Schema Version</span>
              <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">{product.schemaVersion}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">Last Schema Change</span>
              <span className="text-sm text-slate-700">{product.lastSchemaChange}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">Data Contract</span>
              <StatusBadge status={product.dataContractStatus.toLowerCase()} size="sm" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">Privacy Class</span>
              <span className="text-xs font-medium text-slate-700">{product.privacyClassification}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">Governance</span>
              <StatusBadge status={product.governanceStatus.toLowerCase()} size="sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UseCasesTab({ product }: { product: DataProduct }) {
  const fitColors: Record<string, string> = {
    "Recommended": "bg-emerald-50 border-emerald-200",
    "Recommended with Conditions": "bg-amber-50 border-amber-200",
    "Not Recommended Yet": "bg-red-50 border-red-200",
  };
  const fitBadgeColors: Record<string, string> = {
    "Recommended": "bg-emerald-100 text-emerald-700",
    "Recommended with Conditions": "bg-amber-100 text-amber-700",
    "Not Recommended Yet": "bg-red-100 text-red-600",
  };
  const fitIcons: Record<string, React.ReactNode> = {
    "Recommended": <CheckCircle size={14} className="text-emerald-600" />,
    "Recommended with Conditions": <AlertCircle size={14} className="text-amber-600" />,
    "Not Recommended Yet": <XCircle size={14} className="text-red-500" />,
  };

  return (
    <div className="grid grid-cols-2 gap-5">
      {product.useCaseFits.map((fit) => (
        <div key={fit.useCase} className={cn("rounded-xl border p-5", fitColors[fit.status] ?? "bg-slate-50 border-slate-200")}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {fitIcons[fit.status]}
                <span className="text-sm font-semibold text-slate-800">{fit.useCase}</span>
              </div>
              <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", fitBadgeColors[fit.status])}>
                {fit.status}
              </span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-800">{fit.fitScore}</div>
              <div className="text-xs text-slate-500">fit score</div>
            </div>
          </div>

          {fit.strengths.length > 0 && (
            <div className="mb-3">
              <div className="text-xs font-semibold text-slate-600 mb-1.5">Strengths</div>
              <ul className="space-y-1">
                {fit.strengths.map((s) => (
                  <li key={s} className="text-xs text-slate-600 flex items-start gap-1.5">
                    <CheckCircle size={10} className="text-emerald-500 mt-0.5 shrink-0" /> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {fit.blockers.length > 0 && (
            <div className="mb-3">
              <div className="text-xs font-semibold text-slate-600 mb-1.5">Blockers</div>
              <ul className="space-y-1">
                {fit.blockers.map((b) => (
                  <li key={b} className="text-xs text-slate-600 flex items-start gap-1.5">
                    <AlertCircle size={10} className="text-amber-500 mt-0.5 shrink-0" /> {b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-xs text-slate-700 bg-white/60 rounded-lg px-3 py-2 border border-white/80 mt-2">
            <span className="font-semibold">Recommendation: </span>{fit.recommendation}
          </div>
        </div>
      ))}
    </div>
  );
}

function IncidentsTab({ product }: { product: DataProduct }) {
  return (
    <div className="space-y-4 max-w-3xl">
      {product.qualityIssues.map((issue) => (
        <div key={issue.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <SeverityBadge severity={issue.severity} size="sm" />
                <StatusBadge status={issue.status} size="sm" />
                <span className="text-xs text-slate-400 font-mono">{issue.id}</span>
              </div>
              <div className="text-sm font-semibold text-slate-800">{issue.title}</div>
            </div>
            <div className="text-xs text-slate-400">{formatRelativeTime(issue.detectedAt)}</div>
          </div>

          {issue.field && (
            <div className="text-xs text-slate-500 mb-2">
              Affected field: <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{issue.field}</span>
            </div>
          )}

          <p className="text-sm text-slate-600 mb-3 leading-relaxed">{issue.description}</p>

          {issue.affectedUseCases.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-500 mb-1.5">Blocked AI Use Cases</div>
              <div className="flex flex-wrap gap-1.5">
                {issue.affectedUseCases.map((uc) => (
                  <span key={uc} className="text-xs px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-100">
                    {uc}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {product.qualityIssues.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <CheckCircle size={32} className="mx-auto mb-3 text-emerald-400" />
          <div className="text-sm font-medium text-slate-600">No open quality issues</div>
          <div className="text-xs mt-1">This dataset has no active incidents</div>
        </div>
      )}
    </div>
  );
}

function AdoptionTab({ product }: { product: DataProduct }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-5">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Monthly Active Users</h3>
          <AdoptionChart data={product.adoptionTrend} />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Top Teams Using This Dataset</h3>
          <div className="space-y-2">
            {product.topTeams.map((team, i) => (
              <div key={team} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                  {i + 1}
                </div>
                <div className="text-sm text-slate-700">{team}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Adoption Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">Active Users</span>
              <span className="text-sm font-bold text-slate-800">{product.activeUsers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">Repeat Use Rate</span>
              <span className="text-sm font-bold text-slate-800">{product.repeatUseRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">Business Impact</span>
              <span className={`text-sm font-bold ${product.estimatedBusinessImpact === "High" ? "text-orange-600" : "text-amber-600"}`}>
                {product.estimatedBusinessImpact}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Common User Questions</h3>
          <div className="space-y-2">
            {product.commonUserQuestions.map((q, i) => (
              <div key={i} className="text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                "{q}"
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Feedback Themes</h3>
          <div className="space-y-2">
            {product.feedbackThemes.map((theme, i) => (
              <div key={i} className="text-xs text-slate-600 flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                {theme}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentationTab({ product }: { product: DataProduct }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-5">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-800">Dataset Summary</h3>
            <StatusBadge status={product.documentationStatus.toLowerCase()} size="sm" />
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800">Field Definitions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Field Name</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Type</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Completeness</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Description</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {product.fieldDefinitions.map((field) => (
                  <tr key={field.name} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-slate-800 font-medium">{field.name}</td>
                    <td className="px-4 py-2.5 text-slate-500 font-mono">{field.type}</td>
                    <td className="px-4 py-2.5">
                      <span className={`font-semibold ${
                        field.completeness >= 99 ? "text-emerald-600" :
                        field.completeness >= 90 ? "text-amber-600" : "text-red-500"
                      }`}>{field.completeness}%</span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-600 max-w-xs">{field.description}</td>
                    <td className="px-4 py-2.5 text-slate-500 max-w-xs">{field.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {product.knownCaveats.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Known Caveats & Limitations</h3>
            <ul className="space-y-3">
              {product.knownCaveats.map((caveat, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                  <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                  {caveat}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Documentation Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">Coverage</span>
              <StatusBadge status={product.documentationStatus.toLowerCase()} size="sm" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">Data Contract</span>
              <StatusBadge status={product.dataContractStatus.toLowerCase().replace(" ", "-")} size="sm" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">Fields Documented</span>
              <span className="text-sm font-semibold text-slate-800">{product.fieldDefinitions.length} fields</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Escalation Path</h3>
          <div className="space-y-2.5">
            <div>
              <div className="text-xs text-slate-400">Primary Owner</div>
              <div className="text-sm font-medium text-slate-700">{product.owner}</div>
              <div className="text-xs text-amber-700">{product.ownerEmail}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Team</div>
              <div className="text-sm font-medium text-slate-700">{product.ownerTeam}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Escalation Contact</div>
              <div className="text-sm text-slate-600">{product.escalationContact}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
