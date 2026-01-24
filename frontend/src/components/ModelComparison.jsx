import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

export default function ModelComparison() {
    const [metrics, setMetrics] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                // ✅ Correct way on Vercel (Vite / modern React)
                const API_URL = import.meta.env.VITE_API_URL;

                if (!API_URL) {
                    throw new Error("API URL not defined");
                }

                const res = await axios.get(
                    `${API_URL}/user/metrics`,
                    { withCredentials: true }
                );

                setMetrics(res.data);
            } catch (err) {
                console.error("API error:", err);
                setError(
                    err.response?.data?.msg ||
                    err.message ||
                    "Failed to load model metrics"
                );
            }
        };

        fetchMetrics();
    }, []);

    if (error) {
        return (
            <div className="text-red-500 text-center mt-10">
                {error}
            </div>
        );
    }

    if (Object.keys(metrics).length === 0) {
        return (
            <div className="text-white text-center mt-10">
                Loading metrics...
            </div>
        );
    }

    const data = Object.values(metrics).map(m => ({
        name: m.Model,
        Accuracy: m.Accuracy,
        Precision: m.Precision,
        Recall: m.Recall,
        F1: m["F1 Score"],
        AUC: m["ROC AUC"]
    }));

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white p-6 pt-24">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">
                🤖 Model Comparison
            </h1>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.values(metrics).map(m => (
                    <div
                        key={m.Model}
                        className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
                    >
                        <h2 className="text-xl font-bold mb-4 text-green-400">
                            {m.Model}
                        </h2>
                        <ul className="space-y-2">
                            <li className="flex justify-between">
                                <span>Accuracy:</span>
                                <span className="font-mono">{m.Accuracy}</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Precision:</span>
                                <span className="font-mono">{m.Precision}</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Recall:</span>
                                <span className="font-mono">{m.Recall}</span>
                            </li>
                            <li className="flex justify-between">
                                <span>F1 Score:</span>
                                <span className="font-mono">{m["F1 Score"]}</span>
                            </li>
                            <li className="flex justify-between">
                                <span>ROC AUC:</span>
                                <span className="font-mono">{m["ROC AUC"]}</span>
                            </li>
                        </ul>
                    </div>
                ))}
            </div>

            <div className="mt-12 max-w-6xl mx-auto bg-gray-800 p-6 rounded-xl">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Performance Chart
                </h2>

                <div className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="name" stroke="#fff" />
                            <YAxis stroke="#fff" />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#333", border: "none" }}
                            />
                            <Legend />
                            <Bar dataKey="Accuracy" />
                            <Bar dataKey="F1" />
                            <Bar dataKey="AUC" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
