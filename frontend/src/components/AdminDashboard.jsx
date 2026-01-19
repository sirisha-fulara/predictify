import React, { useEffect, useState } from "react";
import axios from "axios";
import ApprovalPie from "./ApprovalPie";
import CibilLineChart from "./CibilLineChart";
import IncomeRiskScatter from "./IncomeRiskScatter";
import RiskHistogram from "./RiskHistogram";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({});
  const [approvalDist, setApprovalDist] = useState({});
  const [cibilTrend, setCibilTrend] = useState([]);
  const [incomeVsRisk, setIncomeVsRisk] = useState([]);
  const [riskDist, setRiskDist] = useState({});
  const [error, setError] = useState(null);

  const fetchAdminData = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const [m, a, c, i, r] = await Promise.all([
        axios.get(`${API_URL}/admin/metrics`, { withCredentials: true }),
        axios.get(`${API_URL}/admin/approval-distribution`, { withCredentials: true }),
        axios.get(`${API_URL}/admin/cibil-trend`, { withCredentials: true }),
        axios.get(`${API_URL}/admin/income-vs-risk`, { withCredentials: true }),
        axios.get(`${API_URL}/admin/risk-distribution`, { withCredentials: true }),
      ]);
      setMetrics(m.data);
      setApprovalDist(a.data);
      setCibilTrend(c.data);
      setIncomeVsRisk(i.data);
      setRiskDist(r.data);
    } catch (err) {
      setError("Failed to fetch admin data");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white p-6">
      <h1 className="text-3xl font-bold mb-6">📊 Admin Dashboard</h1>
      {error && <p className="text-red-400">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <MetricCard label="Approval Rate" value={metrics.approval_rate + " %"} icon="✅" growth={4} />
        <MetricCard label="Avg Risk Score" value={metrics.avg_risk_score} icon="⚠️" growth={-2} />
        <MetricCard label="Avg Income" value={"₹ " + metrics.avg_income?.toLocaleString()} icon="💰" growth={3} />
        <MetricCard label="Avg CIBIL Score" value={metrics.avg_cibil_score} icon="📊" growth={1} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ApprovalPie data={approvalDist} />
        <CibilLineChart data={cibilTrend} />
        <IncomeRiskScatter data={incomeVsRisk} />
        <RiskHistogram data={riskDist} />
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon, growth }) {
  return (
    <div className="bg-gradient-to-r from-indigo-700 to-purple-700 p-5 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm text-white/80">{label}</h4>
          <p className="text-2xl font-bold text-white">{value}</p>
          {growth !== undefined && (
            <p className={`text-sm mt-1 ${growth >= 0 ? "text-green-300" : "text-red-300"}`}>
              {growth >= 0 ? `+${growth}% from last week` : `${growth}% from last week`}
            </p>
          )}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}
