import React, { useState } from 'react';
import './styles/App.css';
import CustomerList from './components/customers/CustomerList';
import ProductList from './components/products/ProductList';
import Dashboard from './components/dashboard/Dashboard';
import Navbar from './components/common/Navbar';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'customers':
        return <CustomerList />;
      case 'products':
        return <ProductList />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="App">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="container">
        {renderView()}
      </div>
    </div>
  );
}

export default App;