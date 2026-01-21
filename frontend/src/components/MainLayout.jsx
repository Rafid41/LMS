import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      {!hideNavbar && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!hideNavbar && <Footer />}
    </div>
  );
};

export default MainLayout;
