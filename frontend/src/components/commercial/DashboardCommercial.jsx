import React, { useState, useEffect } from 'react';
import { authService } from '../../services/auth';
import { customerService, salesOrderService } from '../../services/api';
import CustomerManagement from './CustomerManagement';
import SalesForecast from './SalesForecast';
import QuotationsOrders from './QuotationsOrders';
import PricingContracts from './PricingContracts';
import SalesReporting from './SalesReporting';

const DashboardCommercial = ({ onLogout }) => {  // ← AJOUT de onLogout dans les props
  const [currentView, setCurrentView] = useState('dashboard');
  const [userInfo, setUserInfo] = useState(null);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeOrders: 0,
    pendingQuotations: 0,
    monthlyTarget: 0,
    achievedSales: 0
  });

  useEffect(() => {
    const user = authService.getCurrentUser();
    setUserInfo(user);
    loadCommercialStats();
  }, []);

  const loadCommercialStats = async () => {
    try {
      const [customersRes, ordersRes] = await Promise.all([
        customerService.getAll(),
        salesOrderService.getAll()
      ]);
      
      const customers = customersRes.data.results || customersRes.data;
      const orders = ordersRes.data.results || ordersRes.data;
      
      setStats({
        totalCustomers: customers.length,
        activeOrders: orders.filter(o => o.status === 'confirmed').length,
        pendingQuotations: orders.filter(o => o.status === 'quotation').length,
        monthlyTarget: 500000, // À connecter avec votre système
        achievedSales: 350000  // À connecter avec votre système
      });
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'customers':
        return <CustomerManagement />;
      case 'forecast':
        return <SalesForecast />;
      case 'quotations':
        return <QuotationsOrders />;
      case 'pricing':
        return <PricingContracts />;
      case 'reporting':
        return <SalesReporting />;
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <h1 style={{ color: '#2c3e50', margin: 0 }}>Tableau de Bord Commercial</h1>
          <p style={{ color: '#7f8c8d', margin: '5px 0 0 0' }}>
            Bienvenue, <strong>{userInfo?.name}</strong> | {userInfo?.email}
          </p>
        </div>
        
        {/* MODIFICATION ICI - Ajout du bouton déconnexion */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            COMMERCIAL
          </div>
          
          {/* BOUTON DÉCONNEXION */}
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

      {/* Métriques rapides */}
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
          <h3 style={{ color: '#2c3e50', margin: '0 0 10px 0' }}>Clients</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3498db' }}>
            {stats.totalCustomers}
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#2c3e50', margin: '0 0 10px 0' }}>Commandes Actives</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2ecc71' }}>
            {stats.activeOrders}
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2x 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#2c3e50', margin: '0 0 10px 0' }}>Devis en Attente</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f39c12' }}>
            {stats.pendingQuotations}
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#2c3e50', margin: '0 0 10px 0' }}>CA Réalisé</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9b59b6' }}>
            {stats.achievedSales.toLocaleString()} MAD
          </div>
          <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
            Sur {stats.monthlyTarget.toLocaleString()} MAD
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Actions Rapides</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          <button 
            onClick={() => setCurrentView('customers')}
            style={{
              padding: '15px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ fontWeight: 'bold' }}>➕ Nouveau Client</div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>Créer une fiche client</div>
          </button>

          <button 
            onClick={() => setCurrentView('quotations')}
            style={{
              padding: '15px',
              backgroundColor: '#2ecc71',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ fontWeight: 'bold' }}>📄 Nouveau Devis</div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>Créer un devis client</div>
          </button>

          <button 
            onClick={() => setCurrentView('forecast')}
            style={{
              padding: '15px',
              backgroundColor: '#9b59b6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ fontWeight: 'bold' }}>📊 Prévisions</div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>Saisir les prévisions</div>
          </button>

          <button 
            onClick={() => setCurrentView('reporting')}
            style={{
              padding: '15px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ fontWeight: 'bold' }}>📈 Reporting</div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>Voir les performances</div>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Navigation latérale */}
      <div style={{
        width: '250px',
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '20px 0'
      }}>
        <div style={{ padding: '0 20px 20px 20px', borderBottom: '1px solid #34495e' }}>
          <h3 style={{ margin: 0 }}>ADV Commercial</h3>
        </div>
        
        <nav style={{ marginTop: '20px' }}>
          {[
            { id: 'dashboard', label: '📊 Tableau de Bord', icon: '📊' },
            { id: 'customers', label: '👥 Référentiel Client', icon: '👥' },
            { id: 'forecast', label: '📈 Prévisionnel', icon: '📈' },
            { id: 'quotations', label: '📄 Devis & Commandes', icon: '📄' },
            { id: 'pricing', label: '💰 Tarification & Contrats', icon: '💰' },
            { id: 'reporting', label: '📋 Suivi & Reporting', icon: '📋' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              style={{
                width: '100%',
                padding: '12px 20px',
                backgroundColor: currentView === item.id ? '#3498db' : 'transparent',
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

export default DashboardCommercial;