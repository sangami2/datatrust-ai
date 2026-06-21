"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { QualityDimension } from "@/types/data-product";

interface Props {
  dimensions: QualityDimension[];
}

const shortNames: Record<string, string> = {
  "Freshness": "Freshness",
  "Completeness": "Complete",
  "Accuracy / Validity": "Accuracy",
  "Schema Stability": "Schema",
  "Documentation": "Docs",
  "Ownership": "Ownership",
  "Privacy / Governance": "Privacy",
  "Model Readiness": "ML Ready",
  "Adoption / Reuse": "Adoption",
};

export function QualityChart({ dimensions }: Props) {
  const data = dimensions.map((d) => ({
    dimension: shortNames[d.name] ?? d.name,
    score: d.score,
    fullMark: 100,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <RadarChart data={data}>
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis
          dataKey="dimension"
          tick={{ fontSize: 10, fill: "#64748b" }}
          tickLine={false}
        />
        <Tooltip
          formatter={(value: unknown) => [`${value}/100`, "Score"]}
          contentStyle={{ fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8 }}
        />
        <Radar
          name="Score"
          dataKey="score"
          stroke="#b45309"
          fill="#b45309"
          fillOpacity={0.15}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
