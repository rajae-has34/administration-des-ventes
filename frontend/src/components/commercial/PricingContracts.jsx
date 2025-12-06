import React, { useState, useEffect } from 'react';
import { customerService, productService } from '../../services/api';

const PricingContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [priceLists, setPriceLists] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('contracts');
  const [showContractForm, setShowContractForm] = useState(false);
  const [showPriceListForm, setShowPriceListForm] = useState(false);

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
      
      // Simulation de données
      setContracts([
        {
          id: 1,
          customer_id: 1,
          reference: 'CTR-2024-001',
          start_date: '2024-01-01',
          end_date: '2024-12-31',
          status: 'active',
          total_value: 500000,
          products_count: 5
        }
      ]);
      
      setPriceLists([
        {
          id: 1,
          name: 'Tarif Standard 2024',
          valid_from: '2024-01-01',
          valid_to: '2024-12-31',
          currency: 'MAD',
          products_count: 25,
          status: 'active'
        }
      ]);
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
      'active': { label: 'Actif', color: '#2ecc71' },
      'expired': { label: 'Expiré', color: '#e74c3c' },
      'draft': { label: 'Brouillon', color: '#f39c12' },
      'pending': { label: 'En attente', color: '#3498db' }
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
        <h1>💰 Tarification & Contrats</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setShowContractForm(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            📝 Nouveau Contrat
          </button>
          <button 
            onClick={() => setShowPriceListForm(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2ecc71',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            💰 Nouvelle Grille
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
          { id: 'contracts', label: `Contrats Clients (${contracts.length})`, icon: '📝' },
          { id: 'pricing', label: `Grilles Tarifaires (${priceLists.length})`, icon: '💰' },
          { id: 'discounts', label: 'Remises & Promos', icon: '🎯' }
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

      {/* Contenu des onglets */}
      {activeTab === 'contracts' && (
        <ContractsTab 
          contracts={contracts}
          customers={customers}
          getCustomerName={getCustomerName}
          getStatusBadge={getStatusBadge}
        />
      )}

      {activeTab === 'pricing' && (
        <PricingTab 
          priceLists={priceLists}
          getStatusBadge={getStatusBadge}
        />
      )}

      {activeTab === 'discounts' && (
        <DiscountsTab />
      )}

      {/* Formulaires */}
      {showContractForm && (
        <ContractForm 
          customers={customers}
          products={products}
          onClose={() => {
            setShowContractForm(false);
            loadData();
          }}
        />
      )}

      {showPriceListForm && (
        <PriceListForm 
          products={products}
          onClose={() => {
            setShowPriceListForm(false);
            loadData();
          }}
        />
      )}
    </div>
  );
};

// Composant pour l'onglet Contrats
const ContractsTab = ({ contracts, customers, getCustomerName, getStatusBadge }) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
          <th style={{ padding: '12px', textAlign: 'left' }}>Référence</th>
          <th style={{ padding: '12px', textAlign: 'left' }}>Client</th>
          <th style={{ padding: '12px', textAlign: 'left' }}>Période</th>
          <th style={{ padding: '12px', textAlign: 'left' }}>Valeur</th>
          <th style={{ padding: '12px', textAlign: 'left' }}>Produits</th>
          <th style={{ padding: '12px', textAlign: 'left' }}>Statut</th>
          <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {contracts.map(contract => (
          <tr key={contract.id} style={{ borderBottom: '1px solid #ecf0f1' }}>
            <td style={{ padding: '12px', fontWeight: 'bold' }}>
              {contract.reference}
            </td>
            <td style={{ padding: '12px' }}>
              {getCustomerName(contract.customer_id)}
            </td>
            <td style={{ padding: '12px' }}>
              {new Date(contract.start_date).toLocaleDateString()} - {new Date(contract.end_date).toLocaleDateString()}
            </td>
            <td style={{ padding: '12px', fontWeight: 'bold' }}>
              {contract.total_value?.toLocaleString()} MAD
            </td>
            <td style={{ padding: '12px' }}>
              {contract.products_count} produits
            </td>
            <td style={{ padding: '12px' }}>
              {getStatusBadge(contract.status)}
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
                    backgroundColor: '#f39c12',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  ✏️ Modifier
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    
    {contracts.length === 0 && (
      <div style={{ padding: '40px', textAlign: 'center', color: '#7f8c8d' }}>
        Aucun contrat trouvé
      </div>
    )}
  </div>
);

// Composant pour l'onglet Grilles Tarifaires
const PricingTab = ({ priceLists, getStatusBadge }) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
          <th style={{ padding: '12px', textAlign: 'left' }}>Nom</th>
          <th style={{ padding: '12px', textAlign: 'left' }}>Période</th>
          <th style={{ padding: '12px', textAlign: 'left' }}>Devise</th>
          <th style={{ padding: '12px', textAlign: 'left' }}>Produits</th>
          <th style={{ padding: '12px', textAlign: 'left' }}>Statut</th>
          <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {priceLists.map(priceList => (
          <tr key={priceList.id} style={{ borderBottom: '1px solid #ecf0f1' }}>
            <td style={{ padding: '12px', fontWeight: 'bold' }}>
              {priceList.name}
            </td>
            <td style={{ padding: '12px' }}>
              {new Date(priceList.valid_from).toLocaleDateString()} - {new Date(priceList.valid_to).toLocaleDateString()}
            </td>
            <td style={{ padding: '12px' }}>
              {priceList.currency}
            </td>
            <td style={{ padding: '12px' }}>
              {priceList.products_count} produits
            </td>
            <td style={{ padding: '12px' }}>
              {getStatusBadge(priceList.status)}
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
                    backgroundColor: '#9b59b6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  📊 Appliquer
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    
    {priceLists.length === 0 && (
      <div style={{ padding: '40px', textAlign: 'center', color: '#7f8c8d' }}>
        Aucune grille tarifaire trouvée
      </div>
    )}
  </div>
);

// Composant pour l'onglet Remises
const DiscountsTab = () => (
  <div style={{
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center'
  }}>
    <h3 style={{ color: '#7f8c8d' }}>🎯 Gestion des Remises & Promotions</h3>
    <p style={{ color: '#95a5a6' }}>Module en cours de développement</p>
    <div style={{ 
      height: '200px', 
      backgroundColor: '#f8f9fa', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      borderRadius: '5px',
      marginTop: '15px'
    }}>
      <p style={{ color: '#7f8c8d' }}>Interface de gestion des remises à implémenter</p>
    </div>
  </div>
);

// Formulaire de contrat
const ContractForm = ({ customers, products, onClose }) => {
  const [formData, setFormData] = useState({
    customer_id: '',
    reference: `CTR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    status: 'draft',
    products: [],
    special_conditions: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Sauvegarde contrat:', formData);
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
        maxWidth: '800px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h2>📝 Nouveau Contrat Client</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label>Référence</label>
              <input type="text" name="reference" value={formData.reference} readOnly style={{ width: '100%', padding: '8px', backgroundColor: '#f8f9fa' }} />
            </div>
            
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
              <label>Date de début *</label>
              <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
            </div>

            <div>
              <label>Date de fin *</label>
              <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
            </div>

            <div>
              <label>Statut</label>
              <select name="status" value={formData.status} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
                <option value="draft">Brouillon</option>
                <option value="pending">En attente</option>
                <option value="active">Actif</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label>Conditions particulières</label>
            <textarea name="special_conditions" value={formData.special_conditions} onChange={handleChange} style={{ width: '100%', padding: '8px', height: '100px' }} />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Annuler
            </button>
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Créer le Contrat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Formulaire de grille tarifaire
const PriceListForm = ({ products, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    valid_from: new Date().toISOString().split('T')[0],
    valid_to: '',
    currency: 'MAD',
    status: 'draft'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Sauvegarde grille tarifaire:', formData);
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
        <h2>💰 Nouvelle Grille Tarifaire</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label>Nom de la grille *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="ex: Tarif Standard 2024" required style={{ width: '100%', padding: '8px' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label>Date de début *</label>
                <input type="date" name="valid_from" value={formData.valid_from} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
              </div>

              <div>
                <label>Date de fin *</label>
                <input type="date" name="valid_to" value={formData.valid_to} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label>Devise *</label>
                <select name="currency" value={formData.currency} onChange={handleChange} required style={{ width: '100%', padding: '8px' }}>
                  <option value="MAD">MAD</option>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                </select>
              </div>

              <div>
                <label>Statut</label>
                <select name="status" value={formData.status} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
                  <option value="draft">Brouillon</option>
                  <option value="active">Actif</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Annuler
            </button>
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Créer la Grille
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PricingContracts;