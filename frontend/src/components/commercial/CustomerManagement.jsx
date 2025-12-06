import React, { useState, useEffect } from 'react';
import { customerService } from '../../services/api';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    segment: '',
    search: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await customerService.getAll();
      const data = response.data.results || response.data;
      setCustomers(data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    return (
      (filters.status === '' || customer.status === filters.status) &&
      (filters.segment === '' || customer.segment === filters.segment) &&
      (filters.search === '' || 
        customer.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        customer.email.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1>👥 Référentiel Client</h1>
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
          ➕ Nouveau Client
        </button>
      </div>

      {/* Filtres */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 2fr',
        gap: '15px',
        marginBottom: '20px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div>
          <label>Statut :</label>
          <select 
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="">Tous</option>
            <option value="actif">Actif</option>
            <option value="prospect">Prospect</option>
            <option value="sommeil">En sommeil</option>
            <option value="radie">Radié</option>
          </select>
        </div>
        
        <div>
          <label>Segment :</label>
          <select 
            value={filters.segment}
            onChange={(e) => setFilters({...filters, segment: e.target.value})}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="">Tous</option>
            <option value="A">Segment A</option>
            <option value="B">Segment B</option>
            <option value="C">Segment C</option>
          </select>
        </div>
        
        <div>
          <label>Recherche :</label>
          <input
            type="text"
            placeholder="Nom, email, téléphone..."
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
      </div>

      {/* Tableau des clients */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Client</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Contact</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Statut</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Segment</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(customer => (
              <tr key={customer.customer_id} style={{ borderBottom: '1px solid #ecf0f1' }}>
                <td style={{ padding: '12px' }}>#{customer.customer_id}</td>
                <td style={{ padding: '12px' }}>
                  <div>
                    <strong>{customer.name}</strong>
                    <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                      {customer.email}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px' }}>
                  {customer.phone || 'Non renseigné'}
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: 
                      customer.status === 'actif' ? '#2ecc71' :
                      customer.status === 'prospect' ? '#3498db' :
                      customer.status === 'sommeil' ? '#f39c12' : '#e74c3c',
                    color: 'white'
                  }}>
                    {customer.status || 'Non défini'}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '50%',
                    backgroundColor: '#34495e',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    {customer.segment || 'N/A'}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <button 
                    onClick={() => {
                      setEditingCustomer(customer);
                      setShowForm(true);
                    }}
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
                    onClick={() => {/* Voir détails */}}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#2ecc71',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    👁️ Détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Formulaire */}
      {showForm && (
        <CustomerForm 
          customer={editingCustomer}
          onClose={() => {
            setShowForm(false);
            setEditingCustomer(null);
            fetchCustomers();
          }}
        />
      )}
    </div>
  );
};

// Composant Formulaire Client
const CustomerForm = ({ customer, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'prospect',
    segment: 'C',
    payment_terms: '',
    credit_limit: '',
    vat_number: '',
    currency: 'MAD',
    delivery_conditions: '',
    order_modality: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        status: customer.status || 'prospect',
        segment: customer.segment || 'C',
        payment_terms: customer.payment_terms || '',
        credit_limit: customer.credit_limit || '',
        vat_number: customer.vat_number || '',
        currency: customer.currency || 'MAD',
        delivery_conditions: customer.delivery_conditions || '',
        order_modality: customer.order_modality || ''
      });
    }
  }, [customer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (customer) {
        await customerService.update(customer.customer_id, formData);
      } else {
        await customerService.create(formData);
      }
      onClose();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
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
        <h2>{customer ? '✏️ Modifier le client' : '➕ Nouveau Client'}</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Informations de base */}
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>Informations de base</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label>Nom/Raison sociale *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
              </div>
              <div>
                <label>Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
              </div>
              <div>
                <label>Téléphone</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
              </div>
              <div>
                <label>Numéro TVA</label>
                <input type="text" name="vat_number" value={formData.vat_number} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
              </div>
            </div>
          </div>

          {/* Adresse */}
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>Adresse</h3>
            <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Adresse complète..." style={{ width: '100%', padding: '8px', height: '80px' }} />
          </div>

          {/* Classification */}
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>Classification</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
              <div>
                <label>Statut *</label>
                <select name="status" value={formData.status} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
                  <option value="prospect">Prospect</option>
                  <option value="actif">Actif</option>
                  <option value="sommeil">En sommeil</option>
                  <option value="radie">Radié</option>
                </select>
              </div>
              <div>
                <label>Segment *</label>
                <select name="segment" value={formData.segment} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
                  <option value="A">Segment A</option>
                  <option value="B">Segment B</option>
                  <option value="C">Segment C</option>
                </select>
              </div>
              <div>
                <label>Devise</label>
                <select name="currency" value={formData.currency} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
                  <option value="MAD">MAD</option>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>
          </div>

          {/* Conditions commerciales */}
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>Conditions commerciales</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label>Conditions de paiement</label>
                <input type="text" name="payment_terms" value={formData.payment_terms} onChange={handleChange} placeholder="ex: 30 jours net" style={{ width: '100%', padding: '8px' }} />
              </div>
              <div>
                <label>Limite de crédit (MAD)</label>
                <input type="number" name="credit_limit" value={formData.credit_limit} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
              </div>
              <div>
                <label>Conditions de livraison</label>
                <input type="text" name="delivery_conditions" value={formData.delivery_conditions} onChange={handleChange} placeholder="ex: Sur site, enlèvement" style={{ width: '100%', padding: '8px' }} />
              </div>
              <div>
                <label>Modalité de commande</label>
                <input type="text" name="order_modality" value={formData.order_modality} onChange={handleChange} placeholder="ex: EDI, au comptoir" style={{ width: '100%', padding: '8px' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Annuler
            </button>
            <button type="submit" disabled={loading} style={{ padding: '10px 20px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Sauvegarde...' : (customer ? 'Modifier' : 'Créer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerManagement;