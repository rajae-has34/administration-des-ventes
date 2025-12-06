import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, userType, hasPermission } = useAuth();

  const getWelcomeMessage = () => {
    if (userType === 'customer') {
      return `Bienvenue dans votre espace client, ${user.name}`;
    }
    return `Bienvenue ${user.first_name}, vous êtes connecté en tant que ${user.job_title}`;
  };

  const getQuickActions = () => {
    if (userType === 'customer') {
      return [
        { label: 'Mes Commandes', icon: '📦', path: '/mes-commandes' },
        { label: 'Mes Factures', icon: '🧾', path: '/mes-factures' },
        { label: 'Suivi Livraison', icon: '🚚', path: '/suivi' },
        { label: 'Support', icon: '📞', path: '/support' }
      ];
    }

    const actions = [
      { label: 'Vue d\'ensemble', icon: '📊', permission: 'view_dashboard' }
    ];

    if (hasPermission('view_clients')) {
      actions.push({ label: 'Gestion Clients', icon: '👥', permission: 'view_clients' });
    }
    if (hasPermission('view_commandes')) {
      actions.push({ label: 'Commandes', icon: '📦', permission: 'view_commandes' });
    }
    if (hasPermission('view_recouvrement')) {
      actions.push({ label: 'Recouvrement', icon: '💳', permission: 'view_recouvrement' });
    }
    if (hasPermission('view_rapports')) {
      actions.push({ label: 'Rapports', icon: '📈', permission: 'view_rapports' });
    }

    return actions;
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>{getWelcomeMessage()}</h1>
        <p>Que souhaitez-vous faire aujourd'hui ?</p>
      </div>

      <div className="quick-actions">
        {getQuickActions().map((action, index) => (
          <div key={index} className="action-card">
            <div className="action-icon">{action.icon}</div>
            <h3>{action.label}</h3>
          </div>
        ))}
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>📊 Aperçu du système</h3>
          <p>Interface adaptée à votre profil : <strong>{user.job_title || 'Client'}</strong></p>
          <p>Permissions activées : <strong>{userType === 'employee' ? user.job_title : 'Client standard'}</strong></p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;