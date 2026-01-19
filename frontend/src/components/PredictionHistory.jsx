// PredictionHistory.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function PredictionHistory() {
    const [history, setHistory] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
                const res = await axios.get(`${API_URL}/user/history`, {
                    withCredentials: true
                });
                setHistory(res.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch history');
            }
        };

        fetchHistory();
    }, []);

    return (
        <div className="p-4 " id='history-section'>
            <h2 className="text-xl font-bold mb-4">Prediction History</h2>
            {error && <p className="text-red-500">{error}</p>}
            {!error && history.length === 0 && <p>No predictions found.</p>}
            {history.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900 text-slate-400 uppercase text-xs tracking-wider border-b border-slate-700">
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold">Prediction</th>
                                <th className="px-6 py-4 font-semibold">Risk Score</th>
                                <th className="px-6 py-4 font-semibold">CIBIL Score</th>
                                <th className="px-6 py-4 font-semibold">Income</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {history.map((entry, i) => (
                                <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 text-slate-300">{new Date(entry.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${entry.prediction === 'Approved'
                                            ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-900/50'
                                            : 'bg-red-900/30 text-red-400 border border-red-900/50'
                                            }`}>
                                            {entry.prediction}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-300">{entry.risk_score}%</td>
                                    <td className="px-6 py-4 text-slate-300">{entry.cibil_score}</td>
                                    <td className="px-6 py-4 text-slate-300">{entry.income_annum?.toLocaleString() || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
