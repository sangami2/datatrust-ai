"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowRight,
  ChevronLeft,
  Target,
  Database,
} from "lucide-react";
import type { DataProduct } from "@/types/data-product";
import type { UseCaseDefinition } from "@/types/use-case";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { ReadinessBadge } from "@/components/ui/ReadinessBadge";
import { cn } from "@/lib/utils";

interface Props {
  products: DataProduct[];
  useCases: UseCaseDefinition[];
}

type Step = 1 | 2 | 3;

const domainIcons: Record<string, string> = {
  "Member & Identity": "👤",
  "Digital Commerce": "📱",
  "Club Operations": "🏪",
  "Supply Chain": "📦",
  "Retail Media": "📢",
  "Experimentation": "🔬",
};

export function UseCaseFitClient({ products, useCases }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [selectedUseCase, setSelectedUseCase] = useState<string | null>(null);
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);

  const selectedUseCaseDef = useCases.find((uc) => uc.id === selectedUseCase);
  const selectedProducts = products.filter((p) => selectedDatasets.includes(p.id));

  function toggleDataset(id: string) {
    setSelectedDatasets((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function reset() {
    setStep(1);
    setSelectedUseCase(null);
    setSelectedDatasets([]);
  }

  return (
    <div className="p-8 max-w-[1200px]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">AI Use-Case Fit Assessment</h1>
        <p className="text-sm text-slate-500">
          Evaluate whether a dataset is suitable for your specific AI or analytics use case.
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-0 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all",
              step === s ? "border-amber-600 bg-amber-700 text-white" :
              step > s ? "border-emerald-500 bg-emerald-500 text-white" :
              "border-slate-200 bg-white text-slate-400"
            )}>
              {step > s ? <CheckCircle size={14} /> : s}
            </div>
            <div className="ml-2 mr-6">
              <div className={cn(
                "text-xs font-semibold",
                step >= s ? "text-slate-800" : "text-slate-400"
              )}>
                {s === 1 ? "Choose Use Case" : s === 2 ? "Select Datasets" : "View Fit Report"}
              </div>
            </div>
            {s < 3 && (
              <div className={cn(
                "w-12 h-0.5 mr-6",
                step > s ? "bg-emerald-500" : "bg-slate-200"
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Choose Use Case */}
      {step === 1 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Select an AI or analytics use case to evaluate</h2>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {useCases.map((uc) => (
              <button
                key={uc.id}
                onClick={() => setSelectedUseCase(uc.id)}
                className={cn(
                  "text-left p-4 rounded-xl border transition-all hover:border-amber-400 hover:shadow-sm",
                  selectedUseCase === uc.id
                    ? "border-amber-500 bg-amber-50 shadow-sm ring-2 ring-amber-500/20"
                    : "border-slate-200 bg-white"
                )}
              >
                <div className="text-sm font-semibold text-slate-800 mb-1">{uc.name}</div>
                <p className="text-xs text-slate-500 leading-relaxed">{uc.description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {uc.keyQualityDimensions.slice(0, 2).map((d) => (
                    <span key={d} className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">{d}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={() => selectedUseCase && setStep(2)}
            disabled={!selectedUseCase}
            className="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 disabled:bg-stone-200 disabled:text-stone-400 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            Next: Select Datasets
            <ArrowRight size={15} />
          </button>
        </div>
      )}

      {/* Step 2: Select Datasets */}
      {step === 2 && (
        <div>
          <button onClick={() => setStep(1)} className="flex items-center gap-1 text-xs text-slate-500 hover:text-amber-700 transition-colors mb-4">
            <ChevronLeft size={13} /> Back
          </button>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
            <div className="text-xs text-amber-700 font-semibold mb-0.5">Selected Use Case</div>
            <div className="text-sm font-bold text-amber-800">{selectedUseCaseDef?.name}</div>
            <div className="text-xs text-amber-700 mt-1">Key quality dimensions: {selectedUseCaseDef?.keyQualityDimensions.join(", ")}</div>
          </div>
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Select one or more datasets to evaluate</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {products.map((p) => {
              const fit = p.useCaseFits.find((f) => f.useCase === selectedUseCaseDef?.name);
              const isRecommended = selectedUseCaseDef?.recommendedDatasets.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => toggleDataset(p.id)}
                  className={cn(
                    "text-left p-4 rounded-xl border transition-all hover:border-amber-300",
                    selectedDatasets.includes(p.id)
                      ? "border-amber-500 bg-amber-50 ring-2 ring-amber-500/20"
                      : "border-slate-200 bg-white"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{domainIcons[p.domain]}</span>
                      <div>
                        <div className="text-sm font-semibold text-slate-800">{p.name}</div>
                        <div className="text-xs text-slate-400">{p.domain}</div>
                      </div>
                    </div>
                    <ScoreRing score={p.aiReadinessScore} size={38} strokeWidth={4} />
                  </div>
                  <div className="flex items-center gap-2">
                    <ReadinessBadge level={p.readinessLevel} size="sm" />
                    {isRecommended && (
                      <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                        Recommended
                      </span>
                    )}
                    {fit && (
                      <span className="text-xs text-slate-500">Fit score: <strong>{fit.fitScore}</strong></span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <button
            onClick={() => selectedDatasets.length > 0 && setStep(3)}
            disabled={selectedDatasets.length === 0}
            className="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 disabled:bg-stone-200 disabled:text-stone-400 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            View Fit Report
            <ArrowRight size={15} />
          </button>
        </div>
      )}

      {/* Step 3: Fit Report */}
      {step === 3 && (
        <div>
          <button onClick={() => setStep(2)} className="flex items-center gap-1 text-xs text-slate-500 hover:text-amber-700 transition-colors mb-4">
            <ChevronLeft size={13} /> Back
          </button>

          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Target size={16} className="text-amber-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Use-Case Fit Report: {selectedUseCaseDef?.name}
                </h2>
              </div>
              <div className="text-xs text-slate-500">Evaluating {selectedProducts.length} dataset{selectedProducts.length > 1 ? "s" : ""}</div>
            </div>
            <button
              onClick={reset}
              className="text-xs text-slate-500 hover:text-amber-700 font-medium border border-slate-200 px-3 py-1.5 rounded-lg hover:border-amber-300 transition-colors"
            >
              Start New Assessment
            </button>
          </div>

          <div className="space-y-5">
            {selectedProducts.map((product) => {
              const fit = product.useCaseFits.find((f) => f.useCase === selectedUseCaseDef?.name);

              if (!fit) {
                return (
                  <div key={product.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-lg">{domainIcons[product.domain]}</span>
                      <div className="text-sm font-bold text-slate-800">{product.name}</div>
                    </div>
                    <p className="text-sm text-slate-500">No specific fit assessment available for this use case and dataset combination. Review the general dataset quality and approved use cases.</p>
                    <div className="mt-3">
                      <div className="text-xs font-semibold text-slate-600 mb-2">Approved Use Cases for this Dataset</div>
                      <div className="flex flex-wrap gap-1.5">
                        {product.approvedUseCases.map((uc) => (
                          <span key={uc} className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">{uc}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              const verdictStyle = {
                "Recommended": { bg: "#f0fdf4", border: "#86efac", titleColor: "#15803d", icon: <CheckCircle size={20} style={{ color: "#16a34a" }} /> },
                "Recommended with Conditions": { bg: "#fffbeb", border: "#fde68a", titleColor: "#b45309", icon: <AlertCircle size={20} style={{ color: "#d97706" }} /> },
                "Not Recommended Yet": { bg: "#fef2f2", border: "#fecaca", titleColor: "#b91c1c", icon: <XCircle size={20} style={{ color: "#dc2626" }} /> },
              }[fit.status] ?? { bg: "#f9fafb", border: "#e5e7eb", titleColor: "#374151", icon: null };

              const openBlockerIssues = product.qualityIssues
                .filter((qi) => qi.status !== "resolved" && fit.blockers.some((b) => qi.title.toLowerCase().includes(b.toLowerCase().split(" ")[0])));

              return (
                <div key={product.id} className="rounded-xl border shadow-sm overflow-hidden"
                  style={{ background: verdictStyle.bg, borderColor: verdictStyle.border }}>
                  {/* Verdict header */}
                  <div className="px-6 py-5 flex items-start justify-between"
                    style={{ borderBottom: `1px solid ${verdictStyle.border}` }}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{domainIcons[product.domain]}</span>
                      <div>
                        <Link href={`/catalog/${product.id}`} className="text-base font-bold hover:underline"
                          style={{ color: "#1c1917" }}>
                          {product.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-1.5">
                          {verdictStyle.icon}
                          <span className="text-sm font-bold" style={{ color: verdictStyle.titleColor }}>{fit.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <ScoreRing score={fit.fitScore} size={60} strokeWidth={5} />
                      <div className="text-xs mt-1" style={{ color: "#78716c" }}>Fit Score</div>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Strengths / Blockers */}
                    <div className="grid grid-cols-2 gap-5">
                      {fit.strengths.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#15803d" }}>Strengths</div>
                          <ul className="space-y-1.5">
                            {fit.strengths.map((s) => (
                              <li key={s} className="text-xs flex items-start gap-2" style={{ color: "#374151" }}>
                                <CheckCircle size={11} style={{ color: "#16a34a" }} className="shrink-0 mt-0.5" />
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {fit.blockers.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#b91c1c" }}>Active Blockers</div>
                          <ul className="space-y-1.5">
                            {fit.blockers.map((b) => (
                              <li key={b} className="text-xs flex items-start gap-2" style={{ color: "#374151" }}>
                                <AlertCircle size={11} style={{ color: "#d97706" }} className="shrink-0 mt-0.5" />
                                {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* BlockerSummary — business impact of blockers */}
                    {fit.blockerSummary && (
                      <div className="rounded-lg p-4" style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.08)" }}>
                        <div className="text-xs font-semibold mb-1.5" style={{ color: "#44403c" }}>Why this matters</div>
                        <p className="text-sm leading-relaxed" style={{ color: "#1c1917" }}>{fit.blockerSummary}</p>
                      </div>
                    )}

                    {/* Recommendation */}
                    <div className="rounded-lg p-4" style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.9)" }}>
                      <div className="text-xs font-semibold mb-1.5" style={{ color: "#44403c" }}>Recommended approach</div>
                      <p className="text-sm leading-relaxed" style={{ color: "#1c1917" }}>{fit.recommendation}</p>
                    </div>

                    {/* EstimatedLiftIfFixed */}
                    {fit.estimatedLiftIfFixed && (
                      <div className="rounded-lg p-4" style={{ background: "rgba(180,83,9,0.06)", border: "1px solid rgba(180,83,9,0.15)" }}>
                        <div className="text-xs font-semibold mb-1.5" style={{ color: "#b45309" }}>Estimated impact if blockers are resolved</div>
                        <p className="text-sm leading-relaxed" style={{ color: "#92400e" }}>{fit.estimatedLiftIfFixed}</p>
                      </div>
                    )}

                    {/* Remediation steps from quality issues */}
                    {openBlockerIssues.length > 0 && openBlockerIssues[0].remediationSteps && (
                      <div>
                        <div className="text-xs font-semibold mb-2" style={{ color: "#44403c" }}>Remediation steps for top blocker</div>
                        <ol className="space-y-2">
                          {openBlockerIssues[0].remediationSteps!.map((step, i) => (
                            <li key={i} className="text-xs flex items-start gap-2" style={{ color: "#374151" }}>
                              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                                style={{ background: "#b45309", color: "#fff" }}>
                                {i + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* Key quality dims */}
                    {selectedUseCaseDef?.keyQualityDimensions && (
                      <div>
                        <div className="text-xs font-semibold mb-2" style={{ color: "#44403c" }}>Key quality dimensions for this use case</div>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedUseCaseDef.keyQualityDimensions.map((dimName) => {
                            const dim = product.qualityDimensions.find((d) => d.name === dimName);
                            if (!dim) return null;
                            return (
                              <div key={dimName} className="flex items-center gap-2 rounded-lg px-3 py-2"
                                style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.9)" }}>
                                <span className="text-xs font-medium flex-1" style={{ color: "#374151" }}>{dimName}</span>
                                <span className="text-xs font-bold" style={{ color: dim.score >= 90 ? "#15803d" : dim.score >= 75 ? "#b45309" : dim.score >= 60 ? "#c2410c" : "#dc2626" }}>
                                  {dim.score}/100
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Link href={`/catalog/${product.id}?tab=quality`}
                        className="text-xs font-semibold flex items-center gap-1 transition-colors"
                        style={{ color: "#b45309" }}>
                        View full quality analysis →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
