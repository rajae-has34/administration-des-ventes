// src/components/client/DashboardClient.jsx
import React, { useState, useEffect } from 'react';
import { authService } from '../../services/auth';
import { salesOrderService, customerService } from '../../services/api';
import ClientInfo from './ClientInfo';
import ClientOrders from './ClientOrders';
import WastePortal from './WastePortal';
import Documentation from './Documentation';
import ClientFinance from './ClientFinance';

const DashboardClient = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [userInfo, setUserInfo] = useState(null);
  const [clientStats, setClientStats] = useState({
    pendingOrders: 0,
    deliveredOrders: 0,
    pendingInvoices: 0,
    totalOrders: 0
  });

  useEffect(() => {
    const user = authService.getCurrentUser();
    setUserInfo(user);
    loadClientStats();
  }, []);

  const loadClientStats = async () => {
    try {
      // Simulation de données pour le moment
      setClientStats({
        pendingOrders: 0,
        deliveredOrders: 0,
        pendingInvoices: 0,
        totalOrders: 0
      });
    } catch (error) {
      console.error('Erreur chargement stats client:', error);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'info':
        return <ClientInfo />;
      case 'orders':
        return <ClientOrders />;
      case 'waste':
        return <WastePortal />;
      case 'docs':
        return <Documentation />;
      case 'finance':
        return <ClientFinance />;
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <h1 style={{ color: '#2c3e50', margin: 0 }}>Portail Client</h1>
          <p style={{ color: '#7f8c8d', margin: '5px 0 0 0' }}>
            Bienvenue, <strong>{userInfo?.name}</strong> | {userInfo?.email}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            padding: '8px 16px',
            backgroundColor: '#2ecc71',
            color: 'white',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            CLIENT
          </div>
          <button 
            onClick={onLogout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            🚪 Déconnexion
          </button>
        </div>
      </div>

      {/* Métriques client */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#2c3e50', margin: '0 0 10px 0' }}>Commandes en Cours</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3498db' }}>
            {clientStats.pendingOrders}
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#2c3e50', margin: '0 0 10px 0' }}>Commandes Livrées</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2ecc71' }}>
            {clientStats.deliveredOrders}
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#2c3e50', margin: '0 0 10px 0' }}>Factures en Attente</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f39c12' }}>
            {clientStats.pendingInvoices}
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#2c3e50', margin: '0 0 10px 0' }}>Total Commandes</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#9b59b6' }}>
            {clientStats.totalOrders}
          </div>
        </div>
      </div>

      {/* Message de bienvenue */}
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#2c3e50' }}>Bienvenue sur votre portail client !</h2>
        <p style={{ color: '#7f8c8d' }}>Utilisez le menu de gauche pour naviguer dans votre espace.</p>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Navigation latérale client */}
      <div style={{
        width: '250px',
        backgroundColor: '#27ae60',
        color: 'white',
        padding: '20px 0'
      }}>
        <div style={{ padding: '0 20px 20px 20px', borderBottom: '1px solid #38257eff' }}>
          <h3 style={{ margin: 0 }}>Portail Client</h3>
        </div>
        
        <nav style={{ marginTop: '20px' }}>
          {[
            { id: 'dashboard', label: '📊 Tableau de Bord', icon: '📊' },
            { id: 'info', label: '👤 Mes Informations', icon: '👤' },
            { id: 'orders', label: '📦 Mes Commandes', icon: '📦' },
            { id: 'waste', label: '♻️ Portail Déchets', icon: '♻️' },
            { id: 'docs', label: '📚 Documentation', icon: '📚' },
            { id: 'finance', label: '💰 Financier', icon: '💰' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              style={{
                width: '100%',
                padding: '12px 20px',
                backgroundColor: currentView === item.id ? '#2ecc71' : 'transparent',
                color: 'white',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu principal */}
      <div style={{ flex: 1, backgroundColor: '#ecf0f1' }}>
        {renderView()}
      </div>
    </div>
  );
};

export default DashboardClient;