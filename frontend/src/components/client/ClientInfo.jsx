import React, { useState, useEffect } from 'react';
import { customerService } from '../../services/api';
import { authService } from '../../services/auth';

const ClientInfo = () => {
  const [clientData, setClientData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClientData();
  }, []);

  const loadClientData = async () => {
    try {
      const user = authService.getCurrentUser();
      const customersRes = await customerService.getAll();
      const customers = customersRes.data.results || customersRes.data;
      
      // Trouver le client par email
      const client = customers.find(c => c.email === user.email);
      if (client) {
        setClientData(client);
        setFormData({
          phone: client.phone || '',
          email: client.email || '',
          address: client.address || '',
          contact_person: client.contact_person || ''
        });
      }
    } catch (error) {
      console.error('Erreur chargement données client:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await customerService.update(clientData.customer_id, formData);
      setClientData({ ...clientData, ...formData });
      setEditMode(false);
      alert('Informations mises à jour avec succès');
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Chargement...</div>;
  }

  if (!clientData) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Données client non trouvées</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1>👤 Mes Informations</h1>
        <button 
          onClick={() => setEditMode(!editMode)}
          style={{
            padding: '10px 20px',
            backgroundColor: editMode ? '#95a5a6' : '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {editMode ? '❌ Annuler' : '✏️ Modifier'}
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px'
      }}>
        {/* Informations de base */}
        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Informations de Base</h3>
          
          <div style={{ display: 'grid', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>
                Raison Sociale
              </label>
              <input 
                type="text" 
                value={clientData.name} 
                readOnly 
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e9ecef',
                  borderRadius: '5px',
                  color: '#6c757d'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>
                Email
              </label>
              <input 
                type="email" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                disabled={!editMode}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  backgroundColor: editMode ? 'white' : '#f8f9fa',
                  border: `1px solid ${editMode ? '#3498db' : '#e9ecef'}`,
                  borderRadius: '5px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>
                Téléphone
              </label>
              <input 
                type="text" 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                disabled={!editMode}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  backgroundColor: editMode ? 'white' : '#f8f9fa',
                  border: `1px solid ${editMode ? '#3498db' : '#e9ecef'}`,
                  borderRadius: '5px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>
                Personne à contacter
              </label>
              <input 
                type="text" 
                value={formData.contact_person} 
                onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
                disabled={!editMode}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  backgroundColor: editMode ? 'white' : '#f8f9fa',
                  border: `1px solid ${editMode ? '#3498db' : '#e9ecef'}`,
                  borderRadius: '5px'
                }}
              />
            </div>
          </div>
        </div>

        {/* Adresse et informations complémentaires */}
        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Adresse</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>
              Adresse complète
            </label>
            <textarea 
              value={formData.address} 
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              disabled={!editMode}
              rows="4"
              style={{ 
                width: '100%', 
                padding: '10px', 
                backgroundColor: editMode ? 'white' : '#f8f9fa',
                border: `1px solid ${editMode ? '#3498db' : '#e9ecef'}`,
                borderRadius: '5px',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Conditions contractuelles (lecture seule) */}
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '5px',
            borderLeft: '4px solid #3498db'
          }}>
            <h4 style={{ color: '#2c3e50', margin: '0 0 10px 0' }}>Conditions Contractuelles</h4>
            <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
              <div><strong>Conditions de paiement:</strong> {clientData.payment_terms || '30 jours net'}</div>
              <div><strong>Limite de crédit:</strong> {clientData.credit_limit ? `${clientData.credit_limit} MAD` : 'Non définie'}</div>
              <div><strong>Devise:</strong> {clientData.currency || 'MAD'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton de sauvegarde */}
      {editMode && (
        <div style={{ 
          marginTop: '30px', 
          textAlign: 'center',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <button 
            onClick={handleSave}
            style={{
              padding: '12px 30px',
              backgroundColor: '#2ecc71',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            💾 Sauvegarder les modifications
          </button>
          <p style={{ marginTop: '10px', color: '#7f8c8d', fontSize: '14px' }}>
            Seules les informations de contact peuvent être modifiées
          </p>
        </div>
      )}
    </div>
  );
};

export default ClientInfo;