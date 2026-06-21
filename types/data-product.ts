export type ReadinessLevel = "AI Ready" | "Conditionally Ready" | "Needs Remediation" | "High Risk";

export type BusinessDomain =
  | "Member & Identity"
  | "Digital Commerce"
  | "Club Operations"
  | "Supply Chain"
  | "Retail Media"
  | "Experimentation";

export type AiUseCase =
  | "Churn Prediction"
  | "Batch Recommendations"
  | "Real-time Personalization"
  | "Scan & Go Adoption Modeling"
  | "Retail Media Audience Targeting"
  | "Campaign Attribution"
  | "Inventory Forecasting"
  | "A/B Experiment Analysis"
  | "Exit-Friction Optimization"
  | "Funnel Analysis"
  | "Segmentation"
  | "Personalized Offers"
  | "ROAS Analysis"
  | "Incrementality Measurement"
  | "Queue Prediction"
  | "Computer Vision Monitoring"
  | "Operational Analytics"
  | "Inventory Anomaly Detection"
  | "Replenishment Forecasting"
  | "Campaign Optimization"
  | "Audience Targeting"
  | "A/B Test Governance"
  | "Launch Readiness"
  | "Post-launch Analysis"
  | "Digital Experience Optimization";

export type FitStatus = "Recommended" | "Recommended with Conditions" | "Not Recommended Yet";

export interface QualityDimension {
  name: string;
  score: number;
  weight: number;
  explanation: string;
  evidence: string;
  businessImpact: string;
  recommendedAction: string;
}

export interface UseCaseFit {
  useCase: AiUseCase;
  fitScore: number;
  status: FitStatus;
  strengths: string[];
  blockers: string[];
  recommendation: string;
  blockerSummary?: string;
  estimatedLiftIfFixed?: string;
}

export interface QualityIssue {
  id: string;
  title: string;
  severity: "high" | "medium" | "low";
  field?: string;
  description: string;
  affectedUseCases: AiUseCase[];
  detectedAt: string;
  status: "open" | "investigating" | "in-progress" | "resolved";
  remediationSteps?: string[];
}

export interface FieldDefinition {
  name: string;
  type: string;
  completeness: number;
  description: string;
  example: string;
  notes?: string;
}

export interface DataProduct {
  id: string;
  name: string;
  description: string;
  domain: BusinessDomain;
  owner: string;
  ownerTeam: string;
  ownerEmail: string;
  escalationContact: string;
  aiReadinessScore: number;
  readinessLevel: ReadinessLevel;
  freshnessSla: string;
  lastUpdated: string;
  lastEvaluated: string;
  activeUsers: number;
  repeatUseRate: number;
  approvedUseCases: AiUseCase[];
  notRecommendedUseCases: AiUseCase[];
  primaryConsumers: string[];
  upstreamDependencies: string[];
  downstreamConsumers: string[];
  refreshCadence: string;
  estimatedBusinessImpact: "High" | "Medium" | "Low";
  qualityDimensions: QualityDimension[];
  qualityIssues: QualityIssue[];
  useCaseFits: UseCaseFit[];
  fieldDefinitions: FieldDefinition[];
  documentationStatus: "Complete" | "Partial" | "Minimal";
  dataContractStatus: "Signed" | "Draft" | "Not Started";
  privacyClassification: "PII" | "Sensitive" | "Internal" | "Public";
  governanceStatus: "Compliant" | "Conditional" | "Non-Compliant";
  knownCaveats: string[];
  topTeams: string[];
  commonUserQuestions: string[];
  feedbackThemes: string[];
  schemaVersion: string;
  lastSchemaChange: string;
  adoptionTrend: { month: string; users: number }[];
  qualityHistory: { date: string; score: number }[];
  pmNarrative?: string;
  weeklyTrend?: number;
  slaBreachRisk?: "high" | "medium" | "low";
}
