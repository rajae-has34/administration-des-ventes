import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const CustomerHeader = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="customer-header">
      <div className="header-left">
        <h1 className="page-title">Mon Espace Client</h1>
      </div>
      
      <div className="header-right">
        <div className="user-info">
          <span className="user-welcome">Bonjour, {user.name}</span>
          <div 
            className="user-avatar customer"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            {user.name?.[0] || 'C'}
          </div>
          
          {showUserMenu && (
            <div className="user-menu">
              <div className="user-details">
                <strong>{user.name}</strong>
                <span className="user-email">{user.email}</span>
                <span className="user-phone">{user.phone}</span>
              </div>
              
              <div className="user-menu-actions">
                <button className="menu-item">
                  Mes Informations
                </button>
                <button className="menu-item">
                  Mes Documents
                </button>
                <button 
                  className="menu-item logout"
                  onClick={logout}
                >
                  Déconnexion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default CustomerHeader;