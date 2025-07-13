// src/components/Layout.jsx
import React from 'react';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="bg-gradient-to-b from-[#101212] to-[#08201D] min-h-screen relative">
      <Header />
      <main className="pt-20 px-4">{children}</main>
    </div>
  );
};

export default Layout;
