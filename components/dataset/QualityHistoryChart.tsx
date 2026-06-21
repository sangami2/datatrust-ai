"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

interface Props {
  data: { date: string; score: number }[];
}

export function QualityHistoryChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
        <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
        <Tooltip
          formatter={(v: unknown) => [`${v}/100`, "AI Readiness Score"]}
          contentStyle={{ fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8 }}
        />
        <ReferenceLine y={90} stroke="#10b981" strokeDasharray="3 3" strokeWidth={1} />
        <ReferenceLine y={75} stroke="#f59e0b" strokeDasharray="3 3" strokeWidth={1} />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#b45309"
          strokeWidth={2}
          dot={{ fill: "#b45309", r: 4 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
