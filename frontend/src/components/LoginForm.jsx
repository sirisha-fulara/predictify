import React, { useState } from 'react';
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
            const res = await axios.post(
                'http://localhost:5000/auth/login',
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#101212] relative to-[#08201D]">
            <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-80">
                <h2 className="text-xl font-semibold mb-4">Login</h2>
                {error && <p className="text-red-500 mb-3">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 border rounded mb-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 border rounded mb-3"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
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
