import type { AiUseCase } from "./data-product";

export type IncidentSeverity = "critical" | "high" | "medium" | "low";
export type IncidentStatus = "open" | "investigating" | "in-progress" | "resolved";

export interface Incident {
  id: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  dataProductId: string;
  dataProductName: string;
  affectedFields: string[];
  affectedUseCases: AiUseCase[];
  detectedAt: string;
  resolvedAt?: string;
  owner: string;
  ownerTeam: string;
  description: string;
  rootCauseHypothesis: string;
  aiSummary: string;
  remediationSteps: string[];
  downstreamUsers: number;
  downstreamTeams: string[];
  slaBreached: boolean;
  expectedValue?: string;
  actualValue?: string;
  businessImpact?: string;
}
