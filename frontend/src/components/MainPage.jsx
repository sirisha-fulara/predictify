import React from 'react';
import { Link } from 'react-router-dom';

const MainPage = () => {
    return (
        <div className="bg-gradient-to-b from-slate-950 to-slate-900 h-full relative" >
            <section className="relative min-h-screen pt-20 pb-5 sm:pt-18 sm:pb-16 lg:pb-24">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative z-20">
                    <div className="max-w-xl mx-auto text-center">
                        <h1 className="text-4xl font-bold sm:text-6xl font-sans tracking-tight">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"> Get Loan Clarity Before You Apply </span>
                        </h1>
                        <p className="mt-5 text-base text-slate-300 sm:text-xl font-light">Use our AI-powered predictor to check your loan approval chances — fast, accurate, and secure. No paperwork. No guesswork.</p>

                        <Link to="/register" title="" className="inline-flex items-center px-8 py-4 mt-8 font-semibold text-white transition-all duration-200 bg-emerald-600 rounded-full shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 hover:scale-105 focus:bg-emerald-700" role="button">
                            Check Eligibility Instantly
                            <svg className="w-5 h-5 ml-2 -mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>

                        <div className="grid grid-cols-1 px-12 mt-16 text-left gap-x-12 gap-y-12 sm:grid-cols-3 sm:px-0">
                            <div className="flex items-start">
                                <div className="p-3 bg-slate-800 rounded-lg shrink-0">
                                    <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-white">Instant Check</h3>
                                    <p className="mt-1 text-sm text-slate-400">Get results in seconds with our optimized AI engine.</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="p-3 bg-slate-800 rounded-lg shrink-0">
                                    <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-white">High Accuracy</h3>
                                    <p className="mt-1 text-sm text-slate-400">Powered by advanced machine learning models tailored to you.</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="p-3 bg-slate-800 rounded-lg shrink-0">
                                    <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-white">Secure & Private</h3>
                                    <p className="mt-1 text-sm text-slate-400">Your data is processed securely and never shared with third parties.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
export default MainPage;
