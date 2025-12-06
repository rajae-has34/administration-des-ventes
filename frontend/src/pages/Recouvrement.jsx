import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Recouvrement = () => {
  const { hasPermission } = useAuth();

  return (
    <div className="recouvrement-page">
      <h1>Recouvrement</h1>
      
      <div className="recouvrement-stats">
        <div className="stat warning">En retard: <span>3</span></div>
        <div className="stat danger">Impayés: <span>1</span></div>
        <div className="stat success">À échéance: <span>8</span></div>
      </div>

      <div className="page-content">
        <p>Interface de recouvrement en cours de développement...</p>
        {hasPermission('manage_recouvrement') && (
          <button className="btn-primary">Planifier les relances</button>
        )}
      </div>
    </div>
  );
};

export default Recouvrement;