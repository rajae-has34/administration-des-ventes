import React, { useState, useEffect } from 'react';
import { customerService, productService, salesOrderService } from '../../services/api';

const QuotationsOrders = () => {
  const [quotations, setQuotations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [activeTab, setActiveTab] = useState('quotations');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [customersRes, productsRes, ordersRes] = await Promise.all([
        customerService.getAll(),
        productService.getAll(),
        salesOrderService.getAll()
      ]);
      
      setCustomers(customersRes.data.results || customersRes.data);
      setProducts(productsRes.data.results || productsRes.data);
      
      const allOrders = ordersRes.data.results || ordersRes.data;
      setQuotations(allOrders.filter(order => order.status === 'quotation'));
      setOrders(allOrders.filter(order => order.status !== 'quotation'));
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.customer_id === customerId);
    return customer ? customer.name : 'N/A';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'quotation': { label: 'Devis', color: '#3498db' },
      'confirmed': { label: 'Confirmée', color: '#2ecc71' },
      'in_production': { label: 'En Production', color: '#f39c12' },
      'shipped': { label: 'Expédiée', color: '#9b59b6' },
      'delivered': { label: 'Livrée', color: '#27ae60' },
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

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1>📄 Devis & Commandes</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setShowQuotationForm(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            📄 Nouveau Devis
          </button>
          <button 
            onClick={() => setShowOrderForm(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2ecc71',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🛒 Nouvelle Commande
          </button>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div style={{
        display: 'flex',
        borderBottom: '2px solid #ecf0f1',
        marginBottom: '20px'
      }}>
        {[
          { id: 'quotations', label: `Devis (${quotations.length})`, icon: '📄' },
          { id: 'orders', label: `Commandes (${orders.length})`, icon: '🛒' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 24px',
              backgroundColor: activeTab === tab.id ? '#3498db' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#2c3e50',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderBottom: activeTab === tab.id ? '2px solid #3498db' : 'none',
              marginBottom: '-2px'
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tableau des devis */}
      {activeTab === 'quotations' && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>N° Devis</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Client</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Montant</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Validité</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Statut</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotations.map(quotation => (
                <tr key={quotation.order_id} style={{ borderBottom: '1px solid #ecf0f1' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>
                    DEV-{quotation.order_id}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {getCustomerName(quotation.customer_id)}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {new Date(quotation.order_date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>
                    {quotation.total_amount?.toLocaleString()} MAD
                  </td>
                  <td style={{ padding: '12px' }}>
                    {quotation.validity_days || 30} jours
                  </td>
                  <td style={{ padding: '12px' }}>
                    {getStatusBadge(quotation.status)}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '5px' }}>
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
                        👁️ Voir
                      </button>
                      <button 
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#2ecc71',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        ➕ Commande
                      </button>
                      <button 
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#f39c12',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        📧 Envoyer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {quotations.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#7f8c8d' }}>
              Aucun devis trouvé
            </div>
          )}
        </div>
      )}

      {/* Tableau des commandes */}
      {activeTab === 'orders' && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>N° Commande</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Client</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Montant</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Livraison</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Statut</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.order_id} style={{ borderBottom: '1px solid #ecf0f1' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>
                    CMD-{order.order_id}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {getCustomerName(order.customer_id)}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {new Date(order.order_date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>
                    {order.total_amount?.toLocaleString()} MAD
                  </td>
                  <td style={{ padding: '12px' }}>
                    {order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : 'Non planifié'}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {getStatusBadge(order.status)}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '5px' }}>
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
                      <button 
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#9b59b6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        📊 Suivi
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {orders.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#7f8c8d' }}>
              Aucune commande trouvée
            </div>
          )}
        </div>
      )}

      {/* Formulaires */}
      {showQuotationForm && (
        <QuotationForm 
          customers={customers}
          products={products}
          onClose={() => {
            setShowQuotationForm(false);
            loadData();
          }}
        />
      )}

      {showOrderForm && (
        <OrderForm 
          customers={customers}
          products={products}
          onClose={() => {
            setShowOrderForm(false);
            loadData();
          }}
        />
      )}
    </div>
  );
};

// Formulaire de devis
const QuotationForm = ({ customers, products, onClose }) => {
  const [formData, setFormData] = useState({
    customer_id: '',
    validity_days: 30,
    items: [{ product_id: '', quantity: 1, unit_price: '' }],
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Logique de sauvegarde du devis
    console.log('Sauvegarde devis:', formData);
    onClose();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product_id: '', quantity: 1, unit_price: '' }]
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const getProductPrice = (productId) => {
    const product = products.find(p => p.product_id == productId);
    return product ? product.unit_price : 0;
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      const price = item.unit_price || getProductPrice(item.product_id);
      return total + (price * item.quantity);
    }, 0);
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
        maxWidth: '900px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h2>📄 Nouveau Devis</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
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
              <label>Validité (jours)</label>
              <input type="number" name="validity_days" value={formData.validity_days} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
            </div>
          </div>

          {/* Lignes de produits */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0 }}>Articles</h3>
              <button type="button" onClick={addItem} style={{ padding: '8px 16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                ➕ Ajouter un article
              </button>
            </div>

            {formData.items.map((item, index) => (
              <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '10px', alignItems: 'end', marginBottom: '10px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                <div>
                  <label>Produit</label>
                  <select 
                    value={item.product_id} 
                    onChange={(e) => {
                      updateItem(index, 'product_id', e.target.value);
                      if (!item.unit_price) {
                        updateItem(index, 'unit_price', getProductPrice(e.target.value));
                      }
                    }}
                    required 
                    style={{ width: '100%', padding: '8px' }}
                  >
                    <option value="">Sélectionner un produit</option>
                    {products.map(product => (
                      <option key={product.product_id} value={product.product_id}>
                        {product.name} - {product.unit_price} MAD
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Quantité</label>
                  <input type="number" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', e.target.value)} min="1" required style={{ width: '100%', padding: '8px' }} />
                </div>

                <div>
                  <label>Prix unitaire (MAD)</label>
                  <input type="number" value={item.unit_price} onChange={(e) => updateItem(index, 'unit_price', e.target.value)} step="0.01" required style={{ width: '100%', padding: '8px' }} />
                </div>

                <div>
                  <label>Total</label>
                  <div style={{ padding: '8px', backgroundColor: '#e9ecef', borderRadius: '4px', textAlign: 'center', fontWeight: 'bold' }}>
                    {((item.unit_price || 0) * (item.quantity || 0)).toLocaleString()} MAD
                  </div>
                </div>

                <div>
                  <button type="button" onClick={() => removeItem(index)} style={{ padding: '8px 12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div style={{ padding: '15px', backgroundColor: '#34495e', color: 'white', borderRadius: '5px', marginBottom: '20px', textAlign: 'right' }}>
            <h3 style={{ margin: 0 }}>Total: {calculateTotal().toLocaleString()} MAD</h3>
          </div>

          <div>
            <label>Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} style={{ width: '100%', padding: '8px', height: '80px' }} />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Annuler
            </button>
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Créer le Devis
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Formulaire de commande (similaire au devis)
const OrderForm = ({ customers, products, onClose }) => {
  const [formData, setFormData] = useState({
    customer_id: '',
    delivery_date: '',
    items: [{ product_id: '', quantity: 1, unit_price: '' }],
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Logique de sauvegarde de la commande
    console.log('Sauvegarde commande:', formData);
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
        maxWidth: '800px'
      }}>
        <h2>🛒 Nouvelle Commande</h2>
        
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
              <label>Date de livraison souhaitée</label>
              <input type="date" name="delivery_date" value={formData.delivery_date} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
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
              Créer la Commande
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuotationsOrders;