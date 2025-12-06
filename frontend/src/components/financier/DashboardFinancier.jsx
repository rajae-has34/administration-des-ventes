import React, { useState, useEffect } from 'react';
import { authService } from '../../services/auth';
import { customerService, salesOrderService, invoiceService } from '../../services/api';
import ClientFinancialReview from './ClientFinancialReview';
import OrderFinancialControl from './OrderFinancialControl';
import BillingRecovery from './BillingRecovery';
import FinancialReporting from './FinancialReporting';
import CreditManagement from './CreditManagement';

const DashboardFinancier = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [userInfo, setUserInfo] = useState(null);
  const [financialStats, setFinancialStats] = useState({
    totalInvoices: 0,
    pendingPayments: 0,
    overdueInvoices: 0,
    creditLimitAlerts: 0,
    recoveryRate: 0
  });

  useEffect(() => {
    const user = authService.getCurrentUser();
    setUserInfo(user);
    loadFinancialStats();
  }, []);

  const loadFinancialStats = async () => {
    try {
      // Simulation de données financières
      setFinancialStats({
        totalInvoices: 45,
        pendingPayments: 1250000,
        overdueInvoices: 320000,
        creditLimitAlerts: 3,
        recoveryRate: 87.5
      });
    } catch (error) {
      console.error('Erreur chargement stats financières:', error);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'clients':
        return <ClientFinancialReview />;
      case 'orders':
        return <OrderFinancialControl />;
      case 'billing':
        return <BillingRecovery />;
      case 'reporting':
        return <FinancialReporting />;
      case 'credit':
        return <CreditManagement />;
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
          <h1 style={{ color: '#2c3e50', margin: 0 }}>Tableau de Bord Financier</h1>
          <p style={{ color: '#7f8c8d', margin: '5px 0 0 0' }}>
            Bienvenue, <strong>{userInfo?.name}</strong> | {userInfo?.email}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            padding: '8px 16px',
            backgroundColor: '#9b59b6',
            color: 'white',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            FINANCIER
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

      {/* Métriques financières */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '15px',
        marginBottom: '30px'
      }}>
        <MetricCard
          title="Factures Total"
          value={financialStats.totalInvoices}
          format="number"
          color="#3498db"
          icon="🧾"
        />
        <MetricCard
          title="Encaissements en Attente"
          value={financialStats.pendingPayments}
          format="currency"
          color="#f39c12"
          icon="⏳"
        />
        <MetricCard
          title="Impayés"
          value={financialStats.overdueInvoices}
          format="currency"
          color="#e74c3c"
          icon="⚠️"
        />
        <MetricCard
          title="Alertes Crédit"
          value={financialStats.creditLimitAlerts}
          format="number"
          color="#d35400"
          icon="🚨"
        />
        <MetricCard
          title="Taux Recouvrement"
          value={financialStats.recoveryRate}
          format="percentage"
          color="#2ecc71"
          icon="📈"
        />
      </div>

      {/* Alertes urgentes */}
      <div style={{
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '30px'
      }}>
        <h3 style={{ color: '#856404', margin: '0 0 15px 0' }}>🚨 Alertes Requérant une Action</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ fontSize: '24px' }}>⏰</div>
            <div>
              <div style={{ fontWeight: 'bold' }}>3 Clients en dépassement de crédit</div>
              <div style={{ fontSize: '14px', color: '#856404' }}>Validation requise pour nouvelles commandes</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ fontSize: '24px' }}>💸</div>
            <div>
              <div style={{ fontWeight: 'bold' }}>5 Factures en retard &gt; 60 jours</div>
              <div style={{ fontSize: '14px', color: '#856404' }}>Relance urgente nécessaire</div>
            </div>
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
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Actions Prioritaires</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '15px'
        }}>
          <button 
            onClick={() => setCurrentView('credit')}
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
            <div style={{ fontWeight: 'bold' }}>🚨 Gestion Crédit</div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>Approbation limites de crédit</div>
          </button>

          <button 
            onClick={() => setCurrentView('billing')}
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
            <div style={{ fontWeight: 'bold' }}>💳 Recouvrement</div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>Suivi des impayés et relances</div>
          </button>

          <button 
            onClick={() => setCurrentView('orders')}
            style={{
              padding: '15px',
              backgroundColor: '#f39c12',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ fontWeight: 'bold' }}>📋 Contrôle Commandes</div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>Validation financière des commandes</div>
          </button>

          <button 
            onClick={() => setCurrentView('reporting')}
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
            <div style={{ fontWeight: 'bold' }}>📊 Reporting</div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>Analyse risques et performances</div>
          </button>
        </div>
      </div>

      {/* Dernières activités */}
      <div style={{
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginTop: '30px'
      }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>📋 Activités Récentes</h3>
        <div style={{ display: 'grid', gap: '10px' }}>
          {[
            { action: 'Validation limite crédit', client: 'Entreprise A', amount: '+50,000 MAD', time: 'Il y a 2h', status: 'approved' },
            { action: 'Refus commande', client: 'Société B', amount: '25,000 MAD', time: 'Il y a 4h', status: 'rejected' },
            { action: 'Relance impayé', client: 'Groupe C', amount: '15,000 MAD', time: 'Il y a 6h', status: 'pending' }
          ].map((activity, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: activity.status === 'approved' ? '#2ecc71' : activity.status === 'rejected' ? '#e74c3c' : '#f39c12'
                }}></div>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{activity.action}</div>
                  <div style={{ fontSize: '12px', color: '#7f8c8d' }}>{activity.client}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold' }}>{activity.amount}</div>
                <div style={{ fontSize: '12px', color: '#7f8c8d' }}>{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Navigation latérale financière */}
      <div style={{
        width: '280px',
        backgroundColor: '#8e44ad',
        color: 'white',
        padding: '20px 0'
      }}>
        <div style={{ padding: '0 20px 20px 20px', borderBottom: '1px solid #9b59b6' }}>
          <h3 style={{ margin: 0 }}>Direction Financière</h3>
          <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '5px' }}>Comptabilité & Credit Management</div>
        </div>
        
        <nav style={{ marginTop: '20px' }}>
          {[
            { id: 'dashboard', label: '📊 Tableau de Bord', icon: '📊' },
            { id: 'clients', label: '👥 Référentiel Client', icon: '👥' },
            { id: 'orders', label: '📋 Contrôle Commandes', icon: '📋' },
            { id: 'billing', label: '💳 Facturation & Recouvrement', icon: '💳' },
            { id: 'credit', label: '🚨 Gestion Crédit', icon: '🚨' },
            { id: 'reporting', label: '📈 Pilotage & Reporting', icon: '📈' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              style={{
                width: '100%',
                padding: '12px 20px',
                backgroundColor: currentView === item.id ? '#9b59b6' : 'transparent',
                color: 'white',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '14px'
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

// Composant de carte métrique
const MetricCard = ({ title, value, format, color, icon }) => {
  const formatValue = (val, fmt) => {
    if (!val) return '0';
    switch (fmt) {
      case 'currency':
        return `${val.toLocaleString()} MAD`;
      case 'percentage':
        return `${val}%`;
      case 'number':
        return val.toLocaleString();
      default:
        return val;
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '24px', marginBottom: '10px' }}>{icon}</div>
      <h3 style={{ color: '#2c3e50', margin: '0 0 10px 0', fontSize: '14px' }}>{title}</h3>
      <div style={{ fontSize: '20px', fontWeight: 'bold', color: color }}>
        {formatValue(value, format)}
      </div>
    </div>
  );
};

export default DashboardFinancier;