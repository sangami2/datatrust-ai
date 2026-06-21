"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, X, ChevronRight, Clock, Users, Lightbulb, CheckSquare } from "lucide-react";
import type { Incident, IncidentSeverity, IncidentStatus } from "@/types/incident";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatRelativeTime } from "@/lib/utils";

interface Props {
  incidents: Incident[];
}

const severities: IncidentSeverity[] = ["critical", "high", "medium", "low"];
const statuses: IncidentStatus[] = ["open", "investigating", "in-progress", "resolved"];

export function IncidentsClient({ incidents }: Props) {
  const [selectedSeverities, setSelectedSeverities] = useState<IncidentSeverity[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<IncidentStatus[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const products = [...new Set(incidents.map((i) => i.dataProductName))];

  const filtered = incidents.filter((inc) => {
    if (selectedSeverities.length > 0 && !selectedSeverities.includes(inc.severity)) return false;
    if (selectedStatuses.length > 0 && !selectedStatuses.includes(inc.status)) return false;
    if (selectedProduct && inc.dataProductName !== selectedProduct) return false;
    return true;
  });

  const criticalCount = incidents.filter((i) => i.severity === "critical").length;
  const highCount = incidents.filter((i) => i.severity === "high").length;
  const openCount = incidents.filter((i) => i.status !== "resolved").length;

  return (
    <div className="flex h-full">
      {/* Main content */}
      <div className={`flex-1 p-8 transition-all ${selectedIncident ? "mr-[480px]" : ""}`}>
        <div className="max-w-[900px]">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Incident Center</h1>
            <p className="text-sm text-slate-500">
              Track and resolve data quality incidents affecting AI readiness and downstream consumers.
            </p>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm text-center">
              <div className="text-2xl font-bold text-slate-800">{openCount}</div>
              <div className="text-xs text-slate-500 mt-0.5">Open Incidents</div>
            </div>
            <div className="bg-red-50 rounded-xl border border-red-100 p-4 shadow-sm text-center">
              <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
              <div className="text-xs text-red-500 mt-0.5">Critical</div>
            </div>
            <div className="bg-orange-50 rounded-xl border border-orange-100 p-4 shadow-sm text-center">
              <div className="text-2xl font-bold text-orange-600">{highCount}</div>
              <div className="text-xs text-orange-500 mt-0.5">High Severity</div>
            </div>
            <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-4 shadow-sm text-center">
              <div className="text-2xl font-bold text-emerald-600">{incidents.filter((i) => i.slaBreached).length}</div>
              <div className="text-xs text-emerald-600 mt-0.5">SLA Breaches</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 mb-5 shadow-sm flex flex-wrap items-center gap-4">
            <div>
              <div className="text-xs font-semibold text-slate-500 mb-1.5">Severity</div>
              <div className="flex gap-1.5">
                {severities.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSeverities((prev) =>
                      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
                    )}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors capitalize ${
                      selectedSeverities.includes(s)
                        ? "bg-slate-800 text-white border-slate-800"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 mb-1.5">Status</div>
              <div className="flex gap-1.5">
                {statuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedStatuses((prev) =>
                      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
                    )}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                      selectedStatuses.includes(s)
                        ? "bg-slate-800 text-white border-slate-800"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    {s === "in-progress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 mb-1.5">Data Product</div>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-slate-700"
              >
                <option value="">All products</option>
                {products.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            {(selectedSeverities.length > 0 || selectedStatuses.length > 0 || selectedProduct) && (
              <button
                onClick={() => { setSelectedSeverities([]); setSelectedStatuses([]); setSelectedProduct(""); }}
                className="text-xs text-slate-400 hover:text-red-500 transition-colors ml-auto"
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="text-xs text-slate-400 mb-3">Showing {filtered.length} of {incidents.length} incidents</div>

          {/* Incident list */}
          <div className="space-y-3">
            {filtered.map((incident) => (
              <button
                key={incident.id}
                onClick={() => setSelectedIncident(selectedIncident?.id === incident.id ? null : incident)}
                className={`w-full text-left bg-white rounded-xl border shadow-sm p-5 hover:border-amber-300 hover:shadow-md transition-all ${
                  selectedIncident?.id === incident.id
                    ? "border-amber-500 shadow-md ring-2 ring-amber-500/20"
                    : "border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <SeverityBadge severity={incident.severity} size="sm" />
                      <StatusBadge status={incident.status} size="sm" />
                      {incident.slaBreached && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-600 border border-red-200">
                          SLA Breached
                        </span>
                      )}
                      <span className="text-xs text-slate-400 font-mono">{incident.id}</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-800 mb-1.5">{incident.title}</div>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <AlertTriangle size={11} />
                        <Link href={`/catalog/${incident.dataProductId}`} className="text-amber-700 hover:underline" onClick={e => e.stopPropagation()}>
                          {incident.dataProductName}
                        </Link>
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={11} />
                        {incident.downstreamUsers} users affected
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {formatRelativeTime(incident.detectedAt)}
                      </span>
                      <span>Owner: {incident.owner}</span>
                    </div>
                    {incident.affectedUseCases.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {incident.affectedUseCases.slice(0, 3).map((uc) => (
                          <span key={uc} className="text-xs px-1.5 py-0.5 rounded bg-red-50 text-red-500 border border-red-100">
                            {uc}
                          </span>
                        ))}
                        {incident.affectedUseCases.length > 3 && (
                          <span className="text-xs text-slate-400">+{incident.affectedUseCases.length - 3} more</span>
                        )}
                      </div>
                    )}
                  </div>
                  <ChevronRight size={16} className="text-slate-300 shrink-0 mt-1" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="text-center py-8 mt-4">
          <p className="text-xs text-slate-400">
            Demo built with synthetic retail data for portfolio purposes. No proprietary company data used.
          </p>
        </div>
      </div>

      {/* Detail drawer */}
      {selectedIncident && (
        <div className="fixed top-14 right-0 bottom-0 w-[480px] bg-white border-l border-slate-200 overflow-y-auto shadow-xl z-10">
          <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-start justify-between z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <SeverityBadge severity={selectedIncident.severity} size="sm" />
                <StatusBadge status={selectedIncident.status} size="sm" />
              </div>
              <div className="text-sm font-bold text-slate-900 leading-snug">{selectedIncident.title}</div>
            </div>
            <button onClick={() => setSelectedIncident(null)} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
              <X size={18} />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Meta */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                <div className="text-slate-400 mb-0.5">Data Product</div>
                <Link href={`/catalog/${selectedIncident.dataProductId}`} className="font-semibold text-amber-700 hover:underline">
                  {selectedIncident.dataProductName}
                </Link>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                <div className="text-slate-400 mb-0.5">Owner</div>
                <div className="font-semibold text-slate-800">{selectedIncident.owner}</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                <div className="text-slate-400 mb-0.5">Detected</div>
                <div className="font-semibold text-slate-800">{formatRelativeTime(selectedIncident.detectedAt)}</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                <div className="text-slate-400 mb-0.5">Affected Users</div>
                <div className="font-semibold text-slate-800">{selectedIncident.downstreamUsers}</div>
              </div>
              {selectedIncident.expectedValue && (
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <div className="text-slate-400 mb-0.5">Expected</div>
                  <div className="font-semibold text-slate-800 text-xs">{selectedIncident.expectedValue}</div>
                </div>
              )}
              {selectedIncident.actualValue && (
                <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                  <div className="text-red-400 mb-0.5">Actual</div>
                  <div className="font-semibold text-red-700 text-xs">{selectedIncident.actualValue}</div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Description</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{selectedIncident.description}</p>
            </div>

            {/* Affected fields */}
            {selectedIncident.affectedFields.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Affected Fields</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedIncident.affectedFields.map((f) => (
                    <span key={f} className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">{f}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Business Impact */}
            {selectedIncident.businessImpact && (
              <div className="rounded-xl p-4" style={{ background: "#1c1917" }}>
                <h4 className="text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: "#fcd34d" }}>
                  <AlertTriangle size={13} /> Business Impact
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: "#d6d3d1" }}>{selectedIncident.businessImpact}</p>
              </div>
            )}

            {/* AI Summary */}
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
              <h4 className="text-xs font-semibold text-amber-700 mb-2 flex items-center gap-1.5">
                <Lightbulb size={13} /> AI Summary
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed">{selectedIncident.aiSummary}</p>
            </div>

            {/* Root cause */}
            <div>
              <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Root Cause Hypothesis</h4>
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-lg p-3 border border-slate-100">
                {selectedIncident.rootCauseHypothesis}
              </p>
            </div>

            {/* Remediation */}
            <div>
              <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckSquare size={13} /> Remediation Steps
              </h4>
              <ol className="space-y-2">
                {selectedIncident.remediationSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Downstream teams */}
            <div>
              <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Downstream Teams Affected</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedIncident.downstreamTeams.map((team) => (
                  <span key={team} className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">{team}</span>
                ))}
              </div>
            </div>

            {/* Blocked use cases */}
            {selectedIncident.affectedUseCases.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Blocked AI Use Cases</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedIncident.affectedUseCases.map((uc) => (
                    <span key={uc} className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded border border-red-100">{uc}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
