import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import CustomerHeader from './CustomerHeader';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, userType } = useAuth();

  if (!user) {
    return children;
  }

  if (userType === 'customer') {
    return (
      <div className="app-layout customer-layout">
        <CustomerHeader />
        <main className="customer-content">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Header />
        <main className="content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;