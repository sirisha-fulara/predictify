import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ApprovalPie from "./ApprovalPie";
import CibilLineChart from "./CibilLineChart";
import IncomeRiskScatter from "./IncomeRiskScatter";
import RiskHistogram from "./RiskHistogram";

export default function StatsDashboard() {
    const [metrics, setMetrics] = useState({});
    const [approvalDist, setApprovalDist] = useState({});
    const [cibilTrend, setCibilTrend] = useState([]);
    const [incomeVsRisk, setIncomeVsRisk] = useState([]);
    const [riskDist, setRiskDist] = useState({});
    const [shapData, setShapData] = useState([]);
    const [error, setError] = useState(null);

    const fetchStatsData = async () => {
        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const results = await Promise.allSettled([
                axios.get(`${API_URL}/user/stats/metrics`, { withCredentials: true }),
                axios.get(`${API_URL}/user/stats/approval-distribution`, { withCredentials: true }),
                axios.get(`${API_URL}/user/stats/cibil-trend`, { withCredentials: true }),
                axios.get(`${API_URL}/user/stats/income-vs-risk`, { withCredentials: true }),
                axios.get(`${API_URL}/user/stats/risk-distribution`, { withCredentials: true }),
                axios.get(`${API_URL}/user/shap/global`, { withCredentials: true })
            ]);

            // Helper to get data or default
            const getData = (result, defaultVal) => result.status === 'fulfilled' ? result.value.data : defaultVal;

            if (results.some(r => r.status === 'rejected')) {
                console.warn("Some stats endpoints failed:", results.filter(r => r.status === 'rejected'));
            }

            setMetrics(getData(results[0], {}));
            setApprovalDist(getData(results[1], {}));
            setCibilTrend(getData(results[2], []));
            setIncomeVsRisk(getData(results[3], []));
            setRiskDist(getData(results[4], { "0-20": 0, "21-40": 0, "41-60": 0, "61-80": 0, "81-100": 0 }));
            setShapData(getData(results[5], []));

        } catch (err) {
            setError("Unexpected error loading stats.");
            console.error(err);
        }
    };

    useEffect(() => {
        fetchStatsData();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-200 p-6 pt-24">
            <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">📊 Global Statistics & Insights</h1>
            {error && <p className="text-red-400 text-center bg-red-900/20 py-2 rounded-lg border border-red-800 mx-auto max-w-lg mb-6">{error}</p>}

            <div className="max-w-7xl mx-auto">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <MetricCard label="Approval Rate" value={metrics.approval_rate ? metrics.approval_rate + " %" : "-"} icon="✅" />
                    <MetricCard label="Avg Risk Score" value={metrics.avg_risk_score || "-"} icon="⚠️" />
                    <MetricCard label="Avg Income" value={metrics.avg_income ? "₹ " + metrics.avg_income.toLocaleString() : "-"} icon="💰" />
                    <MetricCard label="Avg CIBIL Score" value={metrics.avg_cibil_score || "-"} icon="📊" />
                </div>

                {/* Global SHAP Analysis */}
                <div className="bg-slate-800/50 p-6 rounded-2xl shadow-xl border border-slate-700/50 backdrop-blur-sm mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-center text-emerald-400">🤖 Global Feature Importance (SHAP)</h2>
                    <p className="text-slate-400 text-center mb-6">Which features matter most for loan approval?</p>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={shapData} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" horizontal={false} />
                                <XAxis type="number" stroke="#fff" />
                                <YAxis dataKey="feature" type="category" width={150} stroke="#fff" tick={{ fontSize: 12 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                                <Bar dataKey="importance" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Existing Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gray-800 p-4 rounded-xl"><ApprovalPie data={approvalDist} /></div>
                    <div className="bg-gray-800 p-4 rounded-xl"><CibilLineChart data={cibilTrend} /></div>
                    <div className="bg-gray-800 p-4 rounded-xl"><IncomeRiskScatter data={incomeVsRisk} /></div>
                    <div className="bg-gray-800 p-4 rounded-xl"><RiskHistogram data={riskDist} /></div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, icon }) {
    return (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-5 rounded-2xl shadow-lg border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wide">{label}</h4>
                    <p className="text-2xl font-bold text-white mt-1 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">{value}</p>
                </div>
                <div className="text-3xl filter drop-shadow-md">{icon}</div>
            </div>
        </div>
    );
}
