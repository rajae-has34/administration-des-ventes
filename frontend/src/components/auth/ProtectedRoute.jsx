import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredPermissions = [] }) => {
  const { user, loading, hasPermission } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requiredPermissions.every(permission => 
      hasPermission(permission)
    );

    if (!hasRequiredPermissions) {
      return (
        <div className="unauthorized-container">
          <h2>Accès non autorisé</h2>
          <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;