import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#4CAF50", "#F44336"];

export default function ApprovalPie({ data }) {
  const formatted = Object.entries(data).map(([name, value]) => ({ name, value }));

  return (
    <div className="my-6">
      <h2 className="text-xl font-bold mb-2">Approval Distribution</h2>
      <PieChart width={400} height={300}>
        <Pie
          data={formatted}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {formatted.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
