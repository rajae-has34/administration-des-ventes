import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Commandes = () => {
  const { user, hasPermission } = useAuth();

  return (
    <div className="commandes-page">
      <h1>Gestion des Commandes</h1>
      <p>Connecté en tant que : <strong>{user.job_title}</strong></p>
      
      <div className="commandes-stats">
        <div className="stat">Commandes en cours: <span>12</span></div>
        <div className="stat">À traiter: <span>5</span></div>
        <div className="stat">En livraison: <span>3</span></div>
      </div>

      <div className="page-content">
        <p>Interface de gestion des commandes en cours de développement...</p>
        <p>Permissions activées :</p>
        <ul>
          {hasPermission('view_commandes') && <li>✅ Voir les commandes</li>}
          {hasPermission('manage_commandes') && <li>✅ Créer/modifier commandes</li>}
          {hasPermission('validate_commandes') && <li>✅ Valider commandes</li>}
        </ul>
      </div>
    </div>
  );
};

export default Commandes;