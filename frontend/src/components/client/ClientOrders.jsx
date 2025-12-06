import React, { useState, useEffect } from 'react';
import { salesOrderService } from '../../services/api';
import { authService } from '../../services/auth';

const ClientOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const user = authService.getCurrentUser();
      const ordersRes = await salesOrderService.getAll();
      const allOrders = ordersRes.data.results || ordersRes.data;
      
      // Filtrer les commandes du client (simulation)
      const clientOrders = allOrders.filter(order => 
        order.customer_email === user.email || order.customer_id === user.id
      );
      
      setOrders(clientOrders);
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { label: 'En attente', color: '#f39c12' },
      'confirmed': { label: 'Confirmée', color: '#3498db' },
      'in_production': { label: 'En production', color: '#9b59b6' },
      'shipped': { label: 'Expédiée', color: '#e67e22' },
      'delivered': { label: 'Livrée', color: '#2ecc71' },
      'cancelled': { label: 'Annulée', color: '#e74c3c' }
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

  const downloadDocument = (type, orderId) => {
    // Simulation de téléchargement
    alert(`Téléchargement ${type} pour la commande ${orderId}`);
  };

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Chargement des commandes...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1>📦 Mes Commandes</h1>
        <button 
          onClick={() => setShowNewOrderForm(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2ecc71',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ➕ Nouvelle Commande
        </button>
      </div>

      {/* Filtres */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '10px',
        marginBottom: '20px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {[
          { value: 'all', label: 'Toutes', emoji: '📋' },
          { value: 'pending', label: 'En attente', emoji: '⏳' },
          { value: 'confirmed', label: 'Confirmées', emoji: '✅' },
          { value: 'in_production', label: 'En production', emoji: '🏭' },
          { value: 'shipped', label: 'Expédiées', emoji: '🚚' },
          { value: 'delivered', label: 'Livrées', emoji: '📦' }
        ].map(filterItem => (
          <button
            key={filterItem.value}
            onClick={() => setFilter(filterItem.value)}
            style={{
              padding: '12px',
              backgroundColor: filter === filterItem.value ? '#3498db' : '#ecf0f1',
              color: filter === filterItem.value ? 'white' : '#2c3e50',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <span style={{ fontSize: '18px' }}>{filterItem.emoji}</span>
            <span style={{ fontSize: '12px' }}>{filterItem.label}</span>
          </button>
        ))}
      </div>

      {/* Tableau des commandes */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#27ae60', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>N° Commande</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Montant</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Livraison prévue</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Statut</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Documents</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.order_id} style={{ borderBottom: '1px solid #ecf0f1' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>
                  CMD-{order.order_id}
                </td>
                <td style={{ padding: '12px' }}>
                  {new Date(order.order_date).toLocaleDateString()}
                </td>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>
                  {order.total_amount?.toLocaleString()} MAD
                </td>
                <td style={{ padding: '12px' }}>
                  {order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : 'Non définie'}
                </td>
                <td style={{ padding: '12px' }}>
                  {getStatusBadge(order.status)}
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => downloadDocument('devis', order.order_id)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '11px'
                      }}
                    >
                      📄 Devis
                    </button>
                    <button 
                      onClick={() => downloadDocument('BL', order.order_id)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#e67e22',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '11px'
                      }}
                    >
                      📋 BL
                    </button>
                    <button 
                      onClick={() => downloadDocument('facture', order.order_id)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#9b59b6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '11px'
                      }}
                    >
                      🧾 Facture
                    </button>
                  </div>
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
        
        {filteredOrders.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#7f8c8d' }}>
            {orders.length === 0 ? 'Aucune commande trouvée' : 'Aucune commande avec ce filtre'}
          </div>
        )}
      </div>

      {/* Formulaire nouvelle commande */}
      {showNewOrderForm && (
        <NewOrderForm 
          onClose={() => {
            setShowNewOrderForm(false);
            loadOrders();
          }}
        />
      )}
    </div>
  );
};

// Formulaire nouvelle commande
const NewOrderForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    product_id: '',
    quantity: 1,
    delivery_date: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Logique de création de commande
    console.log('Nouvelle commande:', formData);
    alert('Commande créée avec succès');
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
        <h2>➕ Nouvelle Commande</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label>Produit *</label>
              <select 
                value={formData.product_id} 
                onChange={(e) => setFormData({...formData, product_id: e.target.value})}
                required 
                style={{ width: '100%', padding: '8px' }}
              >
                <option value="">Sélectionner un produit</option>
                <option value="1">Produit A - 100 MAD</option>
                <option value="2">Produit B - 200 MAD</option>
              </select>
            </div>

            <div>
              <label>Quantité *</label>
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
              <label>Date de livraison souhaitée</label>
              <input 
                type="date" 
                value={formData.delivery_date} 
                onChange={(e) => setFormData({...formData, delivery_date: e.target.value})}
                style={{ width: '100%', padding: '8px' }} 
              />
            </div>

            <div>
              <label>Notes</label>
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
              Créer la Commande
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientOrders;