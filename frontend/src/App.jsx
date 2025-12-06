// App.jsx - Version originale qui devrait MARCHER maintenant
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import DashboardCommercial from './components/commercial/DashboardCommercial';
import DashboardClient from './components/client/DashboardClient'; // ← AJOUTE CETTE LIGNE
import DashboardFinancier from './components/financier/DashboardFinancier';
import { authService } from './services/auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated);
    
    if (authenticated) {
      setUserInfo(authService.getCurrentUser());
    }
    
    setLoading(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setUserInfo(authService.getCurrentUser());
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUserInfo(null);
  };

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  if (userInfo?.role === 'commercial') {
    return <DashboardCommercial onLogout={handleLogout} />;
  }
  // AJOUTE CE CAS POUR LE CLIENT
if (userInfo?.role === 'client' || userInfo?.role === 'customer') {
  return <DashboardClient onLogout={handleLogout} />;
}
if (userInfo?.role === 'financier') {
  return <DashboardFinancier onLogout={handleLogout} />;
}

  return (
    <div style={{ padding: '20px' }}>
      <h1>Tableau de Bord {userInfo?.role}</h1>
      <p>Interface en cours de développement pour le rôle: {userInfo?.role}</p>
      <button onClick={handleLogout}>Déconnexion</button>
    </div>
  );
}

export default App;