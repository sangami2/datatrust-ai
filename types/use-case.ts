import type { AiUseCase, FitStatus } from "./data-product";

export interface UseCaseDefinition {
  id: string;
  name: AiUseCase;
  description: string;
  keyQualityDimensions: string[];
  recommendedDatasets: string[];
  icon: string;
}

export interface UseCaseFitReport {
  useCase: AiUseCase;
  datasets: string[];
  overallFitScore: number;
  recommendation: FitStatus;
  strengths: string[];
  blockers: string[];
  qualityDimensionsAnalysis: {
    dimension: string;
    importance: "Critical" | "Important" | "Helpful";
    score: number;
    status: "Pass" | "Partial" | "Fail";
    note: string;
  }[];
  remediationPlan: {
    priority: number;
    action: string;
    effort: "Low" | "Medium" | "High";
    impact: string;
    owner: string;
  }[];
  explanation: string;
}
