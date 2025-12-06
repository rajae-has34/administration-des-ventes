import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() || 'U';
  };

  const getUserDisplayName = () => {
    if (!user) return 'Utilisateur';
    return `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email;
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="page-title">ADV System</h1>
      </div>
      
      <div className="header-right">
        <div className="user-info">
          <span className="user-welcome">Bonjour, {user.first_name}</span>
          <div 
            className="user-avatar"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            {getUserInitials()}
          </div>
          
          {showUserMenu && (
            <div className="user-menu">
              <div className="user-details">
                <strong>{getUserDisplayName()}</strong>
                <span className="user-role">{user.job_title} - {user.department}</span>
                <span className="user-email">{user.email}</span>
              </div>
              
              <div className="user-menu-actions">
                <button className="menu-item">
                  Mon Profil
                </button>
                <button className="menu-item">
                  Paramètres
                </button>
                <button 
                  className="menu-item logout"
                  onClick={handleLogout}
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

export default Header;