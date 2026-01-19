import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header className="absolute inset-x-0 top-0 z-10 w-full backdrop-blur-sm bg-slate-900/30 border-b border-white/5">
            <div className="px-4 mx-auto sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    <div className="flex-shrink-0">
                        <Link to="/" title="" className="flex items-center">
                            {/* Optional: Add a logo icon here if available, else just text */}
                            <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 font-sans">Predictify</p>
                        </Link>
                    </div>
                    <div className="lg:flex lg:items-center lg:justify-end lg:space-x-8 sm:ml-auto">
                        <Link to="/stats" title="" className="text-base font-medium text-slate-300 transition-all duration-200 hover:text-emerald-400"> Stats </Link>
                        <Link to="/model-comparison" title="" className="text-base font-medium text-slate-300 transition-all duration-200 hover:text-emerald-400"> Model Comparison </Link>
                        <Link to="/login" title="" className="hidden text-base font-medium text-slate-300 transition-all duration-200 hover:text-emerald-400 lg:inline-flex"> Log in </Link>
                        <Link to="/logout" title="" className="inline-flex items-center justify-center px-5 py-2.5 text-base font-semibold transition-all duration-200 text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-full shadow-lg hover:shadow-emerald-500/30" role="button"> Logout </Link>
                    </div>

                    <button type="button" className="inline-flex p-2 ml-1 text-white transition-all duration-200 rounded-md sm:ml-4 lg:hidden focus:bg-gray-800 hover:bg-gray-800">
                        {/* Menu open: "hidden", Menu closed: "block"  */}
                        <svg className="block w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>

                        {/* <!-- Menu open: "block", Menu closed: "hidden" --> */}
                        <svg className="hidden w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Header;