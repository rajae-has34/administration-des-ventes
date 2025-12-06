import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Clients = () => {
  const { hasPermission } = useAuth();

  return (
    <div className="clients-page">
      <h1>Gestion des Clients</h1>
      
      <div className="page-actions">
        {hasPermission('manage_clients') && (
          <button className="btn-primary">+ Nouveau Client</button>
        )}
        <button className="btn-secondary">Exporter</button>
      </div>

      <div className="clients-content">
        <p>Interface de gestion des clients en cours de développement...</p>
        <p>Fonctionnalités disponibles selon vos permissions :</p>
        <ul>
          {hasPermission('view_clients') && <li>✅ Consultation des clients</li>}
          {hasPermission('manage_clients') && <li>✅ Création/Modification clients</li>}
          {hasPermission('validate_clients_commercial') && <li>✅ Validation commerciale</li>}
          {hasPermission('validate_clients_financier') && <li>✅ Validation financière</li>}
        </ul>
      </div>
    </div>
  );
};

export default Clients;