// pages/Register.jsx
import React, { useState } from 'react';
import axios from 'axios';

export default function Register() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [msg, setMsg] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    try {
      await axios.post(`${API_URL}/auth/register`, form);
      setMsg('✅ Registered successfully. Now login!');
    } catch (err) {
      setMsg(err.response?.data?.error || '❌ Registration failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-800 w-96 backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors placeholder-slate-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors placeholder-slate-500"
          />
          <button type="submit" className="w-full bg-emerald-600 text-white p-3 rounded-lg font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
            Register
          </button>
          {msg && <p className="mt-2 text-sm">{msg}</p>}
        </form>
      </div>
    </div>
  );
}
