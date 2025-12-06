import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ open, onToggle }) => {
  const location = useLocation();
  const { hasPermission } = useAuth();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊', permission: 'view_dashboard' },
    { path: '/clients', label: 'Clients', icon: '👥', permission: 'view_clients' },
    { path: '/commandes', label: 'Commandes', icon: '📦', permission: 'view_commandes' },
    { path: '/contrats', label: 'Contrats', icon: '📄', permission: 'view_contrats' },
    { path: '/tarification', label: 'Tarification', icon: '💰', permission: 'view_tarification' },
    { path: '/recouvrement', label: 'Recouvrement', icon: '💳', permission: 'view_recouvrement' },
    { path: '/rapports', label: 'Rapports', icon: '📈', permission: 'view_rapports' },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  return (
    <div className={`sidebar ${open ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h2>ADV System</h2>
        <button onClick={onToggle} className="toggle-btn">
          {open ? '◀' : '▶'}
        </button>
      </div>
      <nav className="sidebar-nav">
        {filteredMenuItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {open && <span className="nav-label">{item.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;