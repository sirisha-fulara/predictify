import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const res = await axios.post(
                `${API_URL}/auth/login`,
                { email, password },
                { withCredentials: true }  // THIS IS THE KEY CHANGE
            );

            // You can store user role from response if needed
            if (res.data.user.role === 'admin') {
                navigate('/admin/');
            } else {
                navigate('/user/dashboard');
            }
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
            <form onSubmit={handleLogin} className="bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-800 w-96 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-6 text-white text-center">Login</h2>
                {error && <p className="text-red-400 mb-4 text-sm bg-red-900/20 p-2 rounded text-center border border-red-900/30">{error}</p>}
                <div className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors placeholder-slate-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors placeholder-slate-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full mt-6 bg-emerald-600 text-white p-3 rounded-lg font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                >
                    Login
                </button>
                <p className="mt-4">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-500 underline">
                        Register here
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default LoginForm;
