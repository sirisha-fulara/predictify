// PredictionHistory.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function PredictionHistory() {
    const [history, setHistory] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                
                const res = await axios.get('https://predictify-1.onrender.com/user/history', {
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
                <table className="w-full table-auto border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2">Date</th>
                            <th className="border border-gray-300 px-4 py-2">Prediction</th>
                            <th className="border border-gray-300 px-4 py-2">Risk Score</th>
                            <th className="border border-gray-300 px-4 py-2">CIBIL Score</th>
                            <th className="border border-gray-300 px-4 py-2">Income</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((entry, i) => (
                            <tr key={i} className="text-center">
                                <td className="border border-gray-300 px-4 py-2">{new Date(entry.date).toLocaleDateString()}</td>
                                <td className="border border-gray-300 px-4 py-2">{entry.prediction}</td>
                                <td className="border border-gray-300 px-4 py-2">{entry.risk_score}%</td>
                                <td className="border border-gray-300 px-4 py-2">{entry.cibil_score}</td>
                                <td className="border border-gray-300 px-4 py-2">{entry.income_annum}</td> {/* income_annum not sent */}
                            </tr>
                        ))}
                    </tbody>

                </table>
            )}
        </div>
    );
}
