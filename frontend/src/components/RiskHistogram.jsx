import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function RiskHistogram({ data }) {
  const formatted = Object.entries(data).map(([range, count]) => ({
    range,
    count,
  }));

  return (
    <div className="my-6">
      <h2 className="text-xl font-bold mb-2">Risk Score Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#f97316" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
