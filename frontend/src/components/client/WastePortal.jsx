import React, { useState, useEffect } from 'react';
import { authService } from '../../services/auth';

const WastePortal = () => {
  const [wasteRequests, setWasteRequests] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [activeTab, setActiveTab] = useState('requests');

  useEffect(() => {
    // Simulation de données
    loadWasteData();
  }, []);

  const loadWasteData = () => {
    // Données simulées
    setWasteRequests([
      {
        id: 1,
        type: 'cuivre',
        quantity: 100,
        status: 'pending',
        request_date: '2024-11-15',
        estimated_value: 5000
      },
      {
        id: 2, 
        type: 'aluminium',
        quantity: 200,
        status: 'approved',
        request_date: '2024-11-10',
        estimated_value: 3000
      }
    ]);

    setStocks([
      { type: 'cuivre', available: 500, price: 50, unit: 'kg' },
      { type: 'aluminium', available: 300, price: 15, unit: 'kg' },
      { type: 'plastique', available: 1000, price: 8, unit: 'kg' }
    ]);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { label: 'En attente', color: '#f39c12' },
      'approved': { label: 'Approuvée', color: '#2ecc71' },
      'in_progress': { label: 'En traitement', color: '#3498db' },
      'completed': { label: 'Terminée', color: '#27ae60' },
      'rejected': { label: 'Rejetée', color: '#e74c3c' }
    };
    
    const config = statusConfig[status] || { label: status, color: '#95a5a6' };
    
    return (
      <span style={{
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 'bold',
        backgroundColor: config.color,
        color: 'white'
      }}>
        {config.label}
      </span>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1>♻️ Portail Déchets</h1>
        <button 
          onClick={() => setShowRequestForm(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2ecc71',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ➕ Nouvelle Demande
        </button>
      </div>

      {/* Navigation par onglets */}
      <div style={{
        display: 'flex',
        borderBottom: '2px solid #ecf0f1',
        marginBottom: '20px'
      }}>
        {[
          { id: 'requests', label: `Mes Demandes (${wasteRequests.length})`, icon: '📋' },
          { id: 'stocks', label: 'Stocks Disponibles', icon: '📊' },
          { id: 'prices', label: 'Grille Tarifaire', icon: '💰' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 24px',
              backgroundColor: activeTab === tab.id ? '#27ae60' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#2c3e50',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderBottom: activeTab === tab.id ? '2px solid #27ae60' : 'none',
              marginBottom: '-2px'
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'requests' && (
        <WasteRequestsTab 
          requests={wasteRequests}
          getStatusBadge={getStatusBadge}
        />
      )}

      {activeTab === 'stocks' && (
        <StocksTab stocks={stocks} />
      )}

      {activeTab === 'prices' && (
        <PricesTab />
      )}

      {/* Formulaire nouvelle demande */}
      {showRequestForm && (
        <WasteRequestForm 
          onClose={() => {
            setShowRequestForm(false);
            loadWasteData();
          }}
        />
      )}
    </div>
  );
};

// Onglet Demandes
const WasteRequestsTab = ({ requests, getStatusBadge }) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ backgroundColor: '#27ae60', color: 'white' }}>
          <th style={{ padding: '12px', textAlign: 'left' }}>N° Demande</th>
          <th style={{ padding: '12px', textAlign: 'left' }}>Type Déchet</th>
          <th style={{ padding: '12px', textAlign: 'left' }}>Quantité</th>
          <th style={{ padding: '12px', textAlign: 'left' }}>Valeur Estimée</th>
          <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
          <th style={{ padding: '12px', textAlign: 'left' }}>Statut</th>
          <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {requests.map(request => (
          <tr key={request.id} style={{ borderBottom: '1px solid #ecf0f1' }}>
            <td style={{ padding: '12px', fontWeight: 'bold' }}>
              DCH-{request.id}
            </td>
            <td style={{ padding: '12px' }}>
              <span style={{
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold',
                backgroundColor: 
                  request.type === 'cuivre' ? '#d35400' :
                  request.type === 'aluminium' ? '#7f8c8d' : '#3498db',
                color: 'white',
                textTransform: 'capitalize'
              }}>
                {request.type}
              </span>
            </td>
            <td style={{ padding: '12px' }}>
              {request.quantity} kg
            </td>
            <td style={{ padding: '12px', fontWeight: 'bold' }}>
              {request.estimated_value?.toLocaleString()} MAD
            </td>
            <td style={{ padding: '12px' }}>
              {new Date(request.request_date).toLocaleDateString()}
            </td>
            <td style={{ padding: '12px' }}>
              {getStatusBadge(request.status)}
            </td>
            <td style={{ padding: '12px' }}>
              <button 
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                👁️ Détails
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    
    {requests.length === 0 && (
      <div style={{ padding: '40px', textAlign: 'center', color: '#7f8c8d' }}>
        Aucune demande de déchets trouvée
      </div>
    )}
  </div>
);

// Onglet Stocks
const StocksTab = ({ stocks }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px'
  }}>
    {stocks.map(stock => (
      <div key={stock.type} style={{
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <div style={{ 
          fontSize: '48px', 
          marginBottom: '15px',
          color: 
            stock.type === 'cuivre' ? '#d35400' :
            stock.type === 'aluminium' ? '#7f8c8d' : '#3498db'
        }}>
          {stock.type === 'cuivre' ? '🔶' : stock.type === 'aluminium' ? '🔘' : '🔵'}
        </div>
        
        <h3 style={{ 
          color: '#2c3e50', 
          margin: '0 0 10px 0',
          textTransform: 'capitalize' 
        }}>
          {stock.type}
        </h3>
        
        <div style={{ 
          fontSize: '32px', 
          fontWeight: 'bold', 
          color: '#27ae60',
          marginBottom: '10px'
        }}>
          {stock.available} {stock.unit}
        </div>
        
        <div style={{ color: '#7f8c8d', fontSize: '18px', marginBottom: '15px' }}>
          {stock.price} MAD/{stock.unit}
        </div>
        
        <div style={{ 
          padding: '10px',
          backgroundColor: '#f8f9fa',
          borderRadius: '5px',
          fontSize: '14px',
          color: '#2c3e50'
        }}>
          Stock disponible immédiatement
        </div>
      </div>
    ))}
  </div>
);

// Onglet Prix
const PricesTab = () => (
  <div style={{
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  }}>
    <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>💰 Grille Tarifaire Déchets</h3>
    
    <div style={{
      display: 'grid',
      gap: '15px'
    }}>
      {[
        { type: 'Cuivre haute qualité', price: '55-60 MAD/kg', details: '99% pureté' },
        { type: 'Cuivre standard', price: '45-50 MAD/kg', details: '95% pureté' },
        { type: 'Aluminium', price: '12-18 MAD/kg', details: 'Selon qualité' },
        { type: 'Plastique PET', price: '6-10 MAD/kg', details: 'Trié et nettoyé' },
        { type: 'Plastique PEHD', price: '4-8 MAD/kg', details: 'Trié et nettoyé' }
      ].map((item, index) => (
        <div key={index} style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          borderLeft: '4px solid #27ae60'
        }}>
          <div>
            <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>{item.type}</div>
            <div style={{ fontSize: '14px', color: '#7f8c8d' }}>{item.details}</div>
          </div>
          <div style={{ 
            fontWeight: 'bold', 
            color: '#27ae60',
            fontSize: '18px'
          }}>
            {item.price}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Formulaire demande déchets
const WasteRequestForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    waste_type: '',
    quantity: '',
    quality: 'standard',
    delivery_date: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Nouvelle demande déchets:', formData);
    alert('Demande de déchets créée avec succès');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        width: '90%',
        maxWidth: '500px'
      }}>
        <h2>♻️ Nouvelle Demande de Déchets</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label>Type de déchet *</label>
              <select 
                value={formData.waste_type} 
                onChange={(e) => setFormData({...formData, waste_type: e.target.value})}
                required 
                style={{ width: '100%', padding: '8px' }}
              >
                <option value="">Sélectionner un type</option>
                <option value="cuivre">Cuivre</option>
                <option value="aluminium">Aluminium</option>
                <option value="plastique">Plastique</option>
              </select>
            </div>

            <div>
              <label>Quantité (kg) *</label>
              <input 
                type="number" 
                value={formData.quantity} 
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                min="1" 
                required 
                style={{ width: '100%', padding: '8px' }} 
              />
            </div>

            <div>
              <label>Qualité</label>
              <select 
                value={formData.quality} 
                onChange={(e) => setFormData({...formData, quality: e.target.value})}
                style={{ width: '100%', padding: '8px' }}
              >
                <option value="standard">Standard</option>
                <option value="high">Haute qualité</option>
                <option value="mixed">Mélangé</option>
              </select>
            </div>

            <div>
              <label>Date de livraison souhaitée</label>
              <input 
                type="date" 
                value={formData.delivery_date} 
                onChange={(e) => setFormData({...formData, delivery_date: e.target.value})}
                style={{ width: '100%', padding: '8px' }} 
              />
            </div>

            <div>
              <label>Notes (qualité, conditionnement...)</label>
              <textarea 
                value={formData.notes} 
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                style={{ width: '100%', padding: '8px', height: '80px' }} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Annuler
            </button>
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Soumettre la Demande
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WastePortal;