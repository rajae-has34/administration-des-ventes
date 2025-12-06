import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const CustomerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="customer-dashboard">
      <h1>Mon Espace Client</h1>
      <p>Bienvenue <strong>{user.name}</strong></p>
      
      <div className="customer-cards">
        <div className="card">
          <h3>📦 Mes Commandes</h3>
          <p>Consultez l'état de vos commandes</p>
          <div className="card-stats">
            <span className="stat">En cours: 2</span>
            <span className="stat">Livrées: 15</span>
          </div>
          <button className="card-button">Voir mes commandes</button>
        </div>
        
        <div className="card">
          <h3>🧾 Mes Factures</h3>
          <p>Téléchargez vos factures</p>
          <div className="card-stats">
            <span className="stat">Payées: 12</span>
            <span className="stat">En attente: 1</span>
          </div>
          <button className="card-button">Voir mes factures</button>
        </div>
        
        <div className="card">
          <h3>🚚 Suivi Livraison</h3>
          <p>Suivez vos colis en temps réel</p>
          <div className="card-stats">
            <span className="stat">En transit: 1</span>
          </div>
          <button className="card-button">Suivre mes livraisons</button>
        </div>
        
        <div className="card">
          <h3>📞 Support</h3>
          <p>Contactez notre service client</p>
          <button className="card-button">Contacter le support</button>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Activité Récente</h3>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-icon">📦</span>
            <div className="activity-details">
              <strong>Commande #2024-001</strong>
              <span>En préparation - Livraison prévue: 15/01/2024</span>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-icon">🧾</span>
            <div className="activity-details">
              <strong>Facture #F2024-001</strong>
              <span>Payée - 10/01/2024</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;