import React, { useState, useEffect } from 'react';
import { customerService, productService } from '../../services/api';

const SalesForecast = () => {
  const [forecasts, setForecasts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('2025-01');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [customersRes, productsRes] = await Promise.all([
        customerService.getAll(),
        productService.getAll()
      ]);
      setCustomers(customersRes.data.results || customersRes.data);
      setProducts(productsRes.data.results || productsRes.data);
      
      // Charger les prévisions existantes
      loadForecasts();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const loadForecasts = () => {
    // Simulation de données de prévision
    const sampleForecasts = [
      {
        id: 1,
        customer_id: 1,
        product_id: 1,
        period: '2025-01',
        quantity: 1000,
        amount: 50000,
        status: 'draft',
        created_at: '2024-11-15'
      }
    ];
    setForecasts(sampleForecasts);
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.customer_id === customerId);
    return customer ? customer.name : 'N/A';
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.product_id === productId);
    return product ? product.name : 'N/A';
  };

  const totalForecast = forecasts.reduce((sum, f) => sum + (f.amount || 0), 0);
  const realizedAmount = 35000; // À connecter avec les données réelles

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1>📈 Prévisionnel des Ventes</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            style={{ padding: '8px', borderRadius: '5px' }}
          >
            <option value="2025-01">Janvier 2025</option>
            <option value="2025-02">Février 2025</option>
            <option value="2025-03">Mars 2025</option>
          </select>
          <button 
            onClick={() => setShowForm(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            ➕ Nouvelle Prévision
          </button>
        </div>
      </div>

      {/* Métriques */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#2c3e50', margin: '0 0 10px 0' }}>Prévision Total</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3498db' }}>
            {totalForecast.toLocaleString()} MAD
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#2c3e50', margin: '0 0 10px 0' }}>Réalisé</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2ecc71' }}>
            {realizedAmount.toLocaleString()} MAD
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#2c3e50', margin: '0 0 10px 0' }}>Taux de Réalisation</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9b59b6' }}>
            {totalForecast > 0 ? Math.round((realizedAmount / totalForecast) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Tableau des prévisions */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Client</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Produit</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Période</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Quantité</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Montant (MAD)</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Statut</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {forecasts.map(forecast => (
              <tr key={forecast.id} style={{ borderBottom: '1px solid #ecf0f1' }}>
                <td style={{ padding: '12px' }}>
                  <strong>{getCustomerName(forecast.customer_id)}</strong>
                </td>
                <td style={{ padding: '12px' }}>
                  {getProductName(forecast.product_id)}
                </td>
                <td style={{ padding: '12px' }}>
                  {forecast.period}
                </td>
                <td style={{ padding: '12px' }}>
                  {forecast.quantity}
                </td>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>
                  {forecast.amount?.toLocaleString()} MAD
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: forecast.status === 'validated' ? '#2ecc71' : '#f39c12',
                    color: 'white'
                  }}>
                    {forecast.status === 'validated' ? 'Validé' : 'Brouillon'}
                  </span>
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
                      marginRight: '5px'
                    }}
                  >
                    ✏️ Modifier
                  </button>
                  <button 
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️ Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {forecasts.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#7f8c8d' }}>
            Aucune prévision trouvée pour cette période
          </div>
        )}
      </div>

      {/* Graphique de simulation (placeholder) */}
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginTop: '30px',
        textAlign: 'center'
      }}>
        <h3>📊 Simulation des Prévisions vs Réalisé</h3>
        <div style={{ 
          height: '200px', 
          backgroundColor: '#f8f9fa', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderRadius: '5px',
          marginTop: '15px'
        }}>
          <p style={{ color: '#7f8c8d' }}>Graphique de simulation à implémenter</p>
        </div>
      </div>

      {showForm && (
        <ForecastForm 
          customers={customers}
          products={products}
          period={selectedPeriod}
          onClose={() => {
            setShowForm(false);
            loadForecasts();
          }}
        />
      )}
    </div>
  );
};

// Formulaire de prévision
const ForecastForm = ({ customers, products, period, onClose }) => {
  const [formData, setFormData] = useState({
    customer_id: '',
    product_id: '',
    period: period,
    quantity: '',
    amount: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Logique de sauvegarde
    console.log('Sauvegarde prévision:', formData);
    onClose();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
        maxWidth: '600px'
      }}>
        <h2>➕ Nouvelle Prévision</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label>Client *</label>
              <select name="customer_id" value={formData.customer_id} onChange={handleChange} required style={{ width: '100%', padding: '8px' }}>
                <option value="">Sélectionner un client</option>
                {customers.map(customer => (
                  <option key={customer.customer_id} value={customer.customer_id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Produit *</label>
              <select name="product_id" value={formData.product_id} onChange={handleChange} required style={{ width: '100%', padding: '8px' }}>
                <option value="">Sélectionner un produit</option>
                {products.map(product => (
                  <option key={product.product_id} value={product.product_id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label>Période *</label>
                <input type="month" name="period" value={formData.period} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
              </div>
              <div>
                <label>Quantité *</label>
                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
              </div>
            </div>

            <div>
              <label>Montant Prévisionnel (MAD) *</label>
              <input type="number" name="amount" value={formData.amount} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
            </div>

            <div>
              <label>Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} style={{ width: '100%', padding: '8px', height: '80px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Annuler
            </button>
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalesForecast;