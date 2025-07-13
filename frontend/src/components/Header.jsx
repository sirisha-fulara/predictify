import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header className="absolute inset-x-0 top-0 z-10 w-full">
            <div className="px-4 mx-auto sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    <div className="flex-shrink-0">
                        <a href="#" title="" className="flex">
                            <p className="text-2xl font-cute text-white">Predictify</p>
                        </a>
                    </div>
                    <div className="lg:flex lg:items-center lg:justify-end lg:space-x-6 sm:ml-auto">

                        <Link to="/login" title="" className="hidden text-base text-white transition-all duration-200 lg:inline-flex hover:text-opacity-80"> Log in </Link>


                        <Link to="/logout" title="" className="inline-flex items-center justify-center px-3 sm:px-5 py-2.5 text-sm sm:text-base font-semibold transition-all duration-200 text-white bg-white/20 hover:bg-white/40 focus:bg-white/40 rounded-lg" role="button"> Logout </Link>
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