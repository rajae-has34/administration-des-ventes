import React, { useState, useEffect } from 'react';
import { customerService } from '../../services/api';

const ClientFinancialReview = () => {
  const [customers, setCustomers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await customerService.getAll();
      const customersData = response.data.results || response.data;
      
      // Ajouter des données financières simulées
      const customersWithFinancialData = customersData.map(customer => ({
        ...customer,
        financial_status: Math.random() > 0.7 ? 'pending' : 'approved',
        credit_utilization: Math.floor(Math.random() * 100),
        overdue_amount: Math.random() > 0.8 ? Math.floor(Math.random() * 50000) : 0,
        last_financial_review: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }));
      
      setCustomers(customersWithFinancialData);
    } catch (error) {
      console.error('Erreur chargement clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    if (filter === 'all') return true;
    if (filter === 'pending') return customer.financial_status === 'pending';
    if (filter === 'overdue') return customer.overdue_amount > 0;
    if (filter === 'high_risk') return customer.credit_utilization > 80;
    return true;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'approved': { label: 'Validé', color: '#2ecc71' },
      'pending': { label: 'En attente', color: '#f39c12' },
      'rejected': { label: 'Rejeté', color: '#e74c3c' },
      'blocked': { label: 'Bloqué', color: '#7f8c8d' }
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

  const getRiskLevel = (utilization, overdue) => {
    if (overdue > 0) return { label: 'Élevé', color: '#e74c3c' };
    if (utilization > 80) return { label: 'Moyen', color: '#f39c12' };
    return { label: 'Faible', color: '#2ecc71' };
  };

  const handleFinancialValidation = async (customerId, action) => {
    try {
      // Simulation de validation financière
      console.log(`Validation ${action} pour le client ${customerId}`);
      alert(`Client ${action === 'approve' ? 'approuvé' : 'rejeté'} avec succès`);
      
      // Mettre à jour le statut localement
      setCustomers(customers.map(c => 
        c.customer_id === customerId 
          ? { ...c, financial_status: action === 'approve' ? 'approved' : 'rejected' }
          : c
      ));
      
      setShowValidationModal(false);
      setSelectedCustomer(null);
    } catch (error) {
      console.error('Erreur validation:', error);
      alert('Erreur lors de la validation');
    }
  };

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Chargement des clients...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1>👥 Référentiel Client - Validation Financière</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '8px', borderRadius: '5px' }}
          >
            <option value="all">Tous les clients</option>
            <option value="pending">En attente de validation</option>
            <option value="overdue">Avec impayés</option>
            <option value="high_risk">Risque élevé</option>
          </select>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '5px' }}>En attente</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f39c12' }}>
            {customers.filter(c => c.financial_status === 'pending').length}
          </div>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '5px' }}>Avec impayés</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e74c3c' }}>
            {customers.filter(c => c.overdue_amount > 0).length}
          </div>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '5px' }}>Risque élevé</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d35400' }}>
            {customers.filter(c => c.credit_utilization > 80).length}
          </div>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '5px' }}>Total clients</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3498db' }}>
            {customers.length}
          </div>
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
            <tr style={{ backgroundColor: '#8e44ad', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Client</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Limite Crédit</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Utilisation</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Impayés</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Risque</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Statut Financier</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Dernière revue</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(customer => {
              const risk = getRiskLevel(customer.credit_utilization, customer.overdue_amount);
              return (
              <tr key={customer.customer_id} style={{ borderBottom: '1px solid #ecf0f1' }}>
                <td style={{ padding: '12px' }}>
                  <div>
                    <strong>{customer.name}</strong>
                    <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                      {customer.email}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>
                  {customer.credit_limit ? `${customer.credit_limit.toLocaleString()} MAD` : 'Non définie'}
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ 
                      width: '60px', 
                      height: '8px', 
                      backgroundColor: '#ecf0f1', 
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${customer.credit_utilization}%`,
                        height: '100%',
                        backgroundColor: customer.credit_utilization > 80 ? '#e74c3c' : customer.credit_utilization > 50 ? '#f39c12' : '#2ecc71'
                      }}></div>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 'bold' }}>
                      {customer.credit_utilization}%
                    </span>
                  </div>
                </td>
                <td style={{ padding: '12px', fontWeight: 'bold', color: customer.overdue_amount > 0 ? '#e74c3c' : '#2ecc71' }}>
                  {customer.overdue_amount > 0 ? `${customer.overdue_amount.toLocaleString()} MAD` : 'Aucun'}
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: risk.color,
                    color: 'white'
                  }}>
                    {risk.label}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  {getStatusBadge(customer.financial_status)}
                </td>
                <td style={{ padding: '12px', fontSize: '12px' }}>
                  {new Date(customer.last_financial_review).toLocaleDateString()}
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button 
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setShowValidationModal(true);
                      }}
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
                      👁️ Examiner
                    </button>
                    {customer.financial_status === 'pending' && (
                      <button 
                        onClick={() => handleFinancialValidation(customer.customer_id, 'approve')}
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
                        ✓ Valider
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
        
        {filteredCustomers.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#7f8c8d' }}>
            Aucun client trouvé avec ce filtre
          </div>
        )}
      </div>

      {/* Modal de validation */}
      {showValidationModal && selectedCustomer && (
        <ValidationModal 
          customer={selectedCustomer}
          onApprove={() => handleFinancialValidation(selectedCustomer.customer_id, 'approve')}
          onReject={() => handleFinancialValidation(selectedCustomer.customer_id, 'reject')}
          onClose={() => {
            setShowValidationModal(false);
            setSelectedCustomer(null);
          }}
        />
      )}
    </div>
  );
};

// Modal de validation financière
const ValidationModal = ({ customer, onApprove, onReject, onClose }) => {
  const risk = customer.overdue_amount > 0 ? 'Élevé' : customer.credit_utilization > 80 ? 'Moyen' : 'Faible';
  
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
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h2>👥 Validation Financière Client</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>Informations Client</h4>
            <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '5px' }}>
              <div><strong>Nom:</strong> {customer.name}</div>
              <div><strong>Email:</strong> {customer.email}</div>
              <div><strong>Téléphone:</strong> {customer.phone || 'Non renseigné'}</div>
            </div>
          </div>
          
          <div>
            <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>Situation Financière</h4>
            <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '5px' }}>
              <div><strong>Limite de crédit:</strong> {customer.credit_limit ? `${customer.credit_limit.toLocaleString()} MAD` : 'Non définie'}</div>
              <div><strong>Utilisation crédit:</strong> {customer.credit_utilization}%</div>
              <div><strong>Impayés:</strong> {customer.overdue_amount > 0 ? `${customer.overdue_amount.toLocaleString()} MAD` : 'Aucun'}</div>
              <div><strong>Niveau de risque:</strong> {risk}</div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>Documents Justificatifs</h4>
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#e8f4fd', 
            borderRadius: '5px',
            borderLeft: '4px solid #3498db'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>KBIS et documents légaux</div>
                <div style={{ fontSize: '12px', color: '#7f8c8d' }}>Dernière mise à jour: 15/11/2024</div>
              </div>
              <button style={{ padding: '8px 12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                📄 Voir
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Annuler
          </button>
          <button onClick={onReject} style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            ❌ Rejeter
          </button>
          <button onClick={onApprove} style={{ padding: '10px 20px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            ✅ Approuver
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientFinancialReview;