"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import type { DataProduct } from "@/types/data-product";

interface Props {
  products: DataProduct[];
}

function getBarColor(score: number): string {
  if (score >= 90) return "#10b981";
  if (score >= 75) return "#f59e0b";
  if (score >= 60) return "#f97316";
  return "#ef4444";
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: DataProduct; value: number }> }) => {
  if (active && payload && payload.length) {
    const product = payload[0].payload;
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs">
        <div className="font-semibold text-slate-800 mb-1">{product.name}</div>
        <div className="text-slate-500 mb-1">{product.domain}</div>
        <div className="font-bold text-base" style={{ color: getBarColor(product.aiReadinessScore) }}>
          {product.aiReadinessScore} / 100
        </div>
        <div className="text-slate-500">{product.readinessLevel}</div>
      </div>
    );
  }
  return null;
};

export function ReadinessBarChart({ products }: Props) {
  const data = [...products].sort((a, b) => b.aiReadinessScore - a.aiReadinessScore);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 4 }} barSize={32}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          tickLine={false}
          axisLine={false}
          interval={0}
          tickFormatter={(v: string) => {
            const short: Record<string, string> = {
              "Member 360": "Member 360",
              "Scan & Go Events": "Scan & Go",
              "Exit Experience Events": "Exit Exp.",
              "Inventory Signals": "Inventory",
              "Retail Media Campaign Performance": "Retail Media",
              "Experiment Registry": "Exp. Registry",
            };
            return short[v] ?? v;
          }}
        />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
        <ReferenceLine y={90} stroke="#10b981" strokeDasharray="4 4" strokeWidth={1} label={{ value: "AI Ready", position: "right", fontSize: 10, fill: "#10b981" }} />
        <ReferenceLine y={75} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={1} />
        <ReferenceLine y={60} stroke="#f97316" strokeDasharray="4 4" strokeWidth={1} />
        <Bar dataKey="aiReadinessScore" radius={[4, 4, 0, 0]}>
          {data.map((entry) => (
            <Cell key={entry.id} fill={getBarColor(entry.aiReadinessScore)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
