import React from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function IncomeRiskScatter({ data }) {
  return (
    <div className="my-6">
      <h2 className="text-xl font-bold mb-2">Income vs Risk Score</h2>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid />
          <XAxis dataKey="income" name="Annual Income" unit=" ₹" />
          <YAxis dataKey="risk_score" name="Risk Score" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Applicants" data={data} fill="#82ca9d" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
