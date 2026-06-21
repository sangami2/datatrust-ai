import type { DataProduct, QualityDimension } from "@/types/data-product";

export function computeWeightedScore(dimensions: QualityDimension[]): number {
  const totalWeight = dimensions.reduce((sum, d) => sum + d.weight, 0);
  const weightedSum = dimensions.reduce((sum, d) => sum + d.score * d.weight, 0);
  return Math.round(weightedSum / totalWeight);
}

export interface UseCaseWeights {
  Freshness: number;
  Completeness: number;
  "Accuracy / Validity": number;
  "Schema Stability": number;
  Documentation: number;
  Ownership: number;
  "Privacy / Governance": number;
  "Model Readiness": number;
  "Adoption / Reuse": number;
}

export const useCaseWeightOverrides: Record<string, Partial<UseCaseWeights>> = {
  "Real-time Personalization": {
    Freshness: 30,
    Completeness: 20,
    "Model Readiness": 20,
    "Privacy / Governance": 15,
    "Accuracy / Validity": 10,
    "Schema Stability": 5,
  },
  "Churn Prediction": {
    Completeness: 25,
    "Accuracy / Validity": 20,
    "Model Readiness": 20,
    Freshness: 15,
    "Privacy / Governance": 10,
    Documentation: 5,
    "Schema Stability": 5,
  },
  "A/B Experiment Analysis": {
    "Accuracy / Validity": 30,
    Completeness: 20,
    Freshness: 20,
    Documentation: 15,
    "Schema Stability": 10,
    Ownership: 5,
  },
  "Campaign Attribution": {
    "Accuracy / Validity": 30,
    Completeness: 25,
    Documentation: 20,
    "Schema Stability": 15,
    Freshness: 10,
  },
  "Inventory Forecasting": {
    Freshness: 25,
    "Accuracy / Validity": 20,
    Completeness: 20,
    "Schema Stability": 20,
    Documentation: 10,
    Ownership: 5,
  },
};

export function scoreDimensionForUseCase(
  dimension: QualityDimension,
  useCaseName: string
): number {
  const overrides = useCaseWeightOverrides[useCaseName];
  if (!overrides) return dimension.score;
  const overrideWeight = overrides[dimension.name as keyof UseCaseWeights];
  return overrideWeight !== undefined ? dimension.score : dimension.score;
}

export function getTopPriorityIssues(products: DataProduct[]) {
  return products
    .flatMap((p) =>
      p.qualityIssues.map((issue) => ({
        ...issue,
        dataProductName: p.name,
        dataProductId: p.id,
        owner: p.owner,
        aiReadinessScore: p.aiReadinessScore,
      }))
    )
    .filter((i) => i.status !== "resolved")
    .sort((a, b) => {
      const severityOrder = { high: 0, medium: 1, low: 2 };
      return (severityOrder[a.severity] ?? 3) - (severityOrder[b.severity] ?? 3);
    });
}
