import React, { useState, useEffect } from 'react';
import { customerService } from '../../services/api';

const CreditManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [filter, setFilter] = useState('high_risk');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await customerService.getAll();
      const customersData = response.data.results || response.data;
      
      // Ajouter des données de crédit simulées
      const customersWithCreditData = customersData.map(customer => ({
        ...customer,
        current_balance: Math.floor(Math.random() * (customer.credit_limit || 50000)),
        overdue_amount: Math.random() > 0.7 ? Math.floor(Math.random() * 20000) : 0,
        payment_delay: Math.floor(Math.random() * 30),
        credit_score: Math.floor(Math.random() * 100),
        last_review: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: Math.random() > 0.8 ? 'blocked' : 'active'
      }));
      
      setCustomers(customersWithCreditData);
    } catch (error) {
      console.error('Erreur chargement clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const utilization = customer.credit_limit > 0 ? (customer.current_balance / customer.credit_limit) * 100 : 0;
    
    if (filter === 'all') return true;
    if (filter === 'high_risk') return utilization > 80 || customer.overdue_amount > 0;
    if (filter === 'blocked') return customer.status === 'blocked';
    if (filter === 'needs_review') return utilization > 50;
    if (filter === 'good') return utilization <= 50 && customer.overdue_amount === 0;
    return true;
  });

  const getRiskLevel = (customer) => {
    const utilization = customer.credit_limit > 0 ? (customer.current_balance / customer.credit_limit) * 100 : 0;
    
    if (customer.overdue_amount > 0) return { label: 'Très élevé', color: '#e74c3c', score: 1 };
    if (utilization > 90) return { label: 'Élevé', color: '#e67e22', score: 2 };
    if (utilization > 70) return { label: 'Moyen', color: '#f39c12', score: 3 };
    if (utilization > 50) return { label: 'Modéré', color: '#3498db', score: 4 };
    return { label: 'Faible', color: '#2ecc71', score: 5 };
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'active': { label: 'Actif', color: '#2ecc71' },
      'blocked': { label: 'Bloqué', color: '#e74c3c' },
      'pending': { label: 'En attente', color: '#f39c12' },
      'suspended': { label: 'Suspendu', color: '#95a5a6' }
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

  const handleCreditAction = async (customerId, action, newLimit = null) => {
    try {
      // Simulation d'action sur le crédit
      console.log(`Action ${action} pour client ${customerId}`, newLimit ? `avec nouvelle limite: ${newLimit}` : '');
      
      let updatedCustomer;
      if (action === 'block') {
        updatedCustomer = { status: 'blocked' };
      } else if (action === 'unblock') {
        updatedCustomer = { status: 'active' };
      } else if (action === 'update_limit' && newLimit) {
        updatedCustomer = { credit_limit: newLimit };
      }
      
      setCustomers(customers.map(c => 
        c.customer_id === customerId 
          ? { ...c, ...updatedCustomer }
          : c
      ));
      
      alert(`Action ${action} effectuée avec succès`);
      setShowCreditModal(false);
      setSelectedCustomer(null);
    } catch (error) {
      console.error('Erreur action crédit:', error);
      alert('Erreur lors de l\'action');
    }
  };

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Chargement des données crédit...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1>🚨 Gestion du Crédit Client</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '8px', borderRadius: '5px' }}
          >
            <option value="high_risk">Risque élevé</option>
            <option value="blocked">Clients bloqués</option>
            <option value="needs_review">À réviser</option>
            <option value="good">Bon payeurs</option>
            <option value="all">Tous les clients</option>
          </select>
        </div>
      </div>

      {/* Statistiques de risque */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <div style={{
          backgroundColor: '#f8d7da',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#721c24', marginBottom: '5px' }}>Risque très élevé</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e74c3c' }}>
            {customers.filter(c => getRiskLevel(c).score === 1).length}
          </div>
        </div>
        <div style={{
          backgroundColor: '#fff3cd',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#856404', marginBottom: '5px' }}>Risque élevé</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f39c12' }}>
            {customers.filter(c => getRiskLevel(c).score === 2).length}
          </div>
        </div>
        <div style={{
          backgroundColor: '#d1ecf1',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#0c5460', marginBottom: '5px' }}>Risque modéré</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3498db' }}>
            {customers.filter(c => getRiskLevel(c).score >= 3 && getRiskLevel(c).score <= 4).length}
          </div>
        </div>
        <div style={{
          backgroundColor: '#d4edda',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#155724', marginBottom: '5px' }}>Faible risque</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2ecc71' }}>
            {customers.filter(c => getRiskLevel(c).score === 5).length}
          </div>
        </div>
      </div>

      {/* Alertes critiques */}
      <div style={{
        backgroundColor: '#f8d7da',
        border: '1px solid #f5c6cb',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '20px'
      }}>
        <h4 style={{ color: '#721c24', margin: '0 0 10px 0' }}>🚨 Clients Requérant une Action Immédiate</h4>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {customers
            .filter(c => getRiskLevel(c).score === 1)
            .map(customer => (
              <div key={customer.customer_id} style={{
                padding: '8px 12px',
                backgroundColor: '#e74c3c',
                color: 'white',
                borderRadius: '5px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
              onClick={() => {
                setSelectedCustomer(customer);
                setShowCreditModal(true);
              }}
              >
                {customer.name} - {customer.overdue_amount > 0 ? `${customer.overdue_amount.toLocaleString()} MAD impayés` : 'Dépassement critique'}
              </div>
            ))}
        </div>
      </div>

      {/* Tableau de gestion du crédit */}
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
              <th style={{ padding: '12px', textAlign: 'left' }}>Solde Actuel</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Utilisation</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Impayés</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Score</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Niveau Risque</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Statut</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(customer => {
              const utilization = customer.credit_limit > 0 ? (customer.current_balance / customer.credit_limit) * 100 : 0;
              const risk = getRiskLevel(customer);
              
              return (
              <tr key={customer.customer_id} style={{ 
                borderBottom: '1px solid #ecf0f1',
                backgroundColor: risk.score === 1 ? '#f8d7da' : 
                                risk.score === 2 ? '#fff3cd' : 'transparent'
              }}>
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
                  {customer.current_balance.toLocaleString()} MAD
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
                        width: `${utilization}%`,
                        height: '100%',
                        backgroundColor: risk.color
                      }}></div>
                    </div>
                    <span style={{ 
                      fontSize: '12px', 
                      fontWeight: 'bold',
                      color: utilization > 100 ? '#e74c3c' : 'inherit'
                    }}>
                      {utilization.toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td style={{ padding: '12px', fontWeight: 'bold', color: customer.overdue_amount > 0 ? '#e74c3c' : '#2ecc71' }}>
                  {customer.overdue_amount > 0 ? `${customer.overdue_amount.toLocaleString()} MAD` : 'Aucun'}
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: risk.color,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }}>
                    {customer.credit_score}
                  </div>
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
                  {getStatusBadge(customer.status)}
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setShowCreditModal(true);
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
                      ⚙️ Gérer
                    </button>
                    {customer.status === 'blocked' ? (
                      <button 
                        onClick={() => handleCreditAction(customer.customer_id, 'unblock')}
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
                        🔓 Débloquer
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleCreditAction(customer.customer_id, 'block')}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        🚫 Bloquer
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

      {/* Modal de gestion du crédit */}
      {showCreditModal && selectedCustomer && (
        <CreditModal 
          customer={selectedCustomer}
          riskLevel={getRiskLevel(selectedCustomer)}
          onAction={handleCreditAction}
          onClose={() => {
            setShowCreditModal(false);
            setSelectedCustomer(null);
          }}
        />
      )}
    </div>
  );
};

// Modal de gestion du crédit
const CreditModal = ({ customer, riskLevel, onAction, onClose }) => {
  const [newCreditLimit, setNewCreditLimit] = useState(customer.credit_limit || '');
  const [actionNote, setActionNote] = useState('');

  const utilization = customer.credit_limit > 0 ? (customer.current_balance / customer.credit_limit) * 100 : 0;

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
        <h2>⚙️ Gestion du Crédit - {customer.name}</h2>
        
        <div style={{ display: 'grid', gap: '15px', marginBottom: '20px' }}>
          {/* Situation actuelle */}
          <div style={{
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '5px',
            borderLeft: `4px solid ${riskLevel.color}`
          }}>
            <h4 style={{ color: '#2c3e50', margin: '0 0 10px 0' }}>Situation Actuelle</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
              <div><strong>Limite actuelle:</strong> {customer.credit_limit ? `${customer.credit_limit.toLocaleString()} MAD` : 'Non définie'}</div>
              <div><strong>Solde utilisé:</strong> {customer.current_balance.toLocaleString()} MAD</div>
              <div><strong>Utilisation:</strong> {utilization.toFixed(1)}%</div>
              <div><strong>Impayés:</strong> {customer.overdue_amount > 0 ? `${customer.overdue_amount.toLocaleString()} MAD` : 'Aucun'}</div>
              <div><strong>Score crédit:</strong> {customer.credit_score}/100</div>
              <div><strong>Niveau risque:</strong> 
                <span style={{ color: riskLevel.color, fontWeight: 'bold', marginLeft: '5px' }}>
                  {riskLevel.label}
                </span>
              </div>
            </div>
          </div>

          {/* Modification de la limite */}
          <div>
            <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>Modifier la Limite de Crédit</h4>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="number"
                value={newCreditLimit}
                onChange={(e) => setNewCreditLimit(e.target.value)}
                placeholder="Nouvelle limite en MAD"
                style={{ 
                  flex: 1, 
                  padding: '8px', 
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
              <button 
                onClick={() => onAction(customer.customer_id, 'update_limit', parseInt(newCreditLimit))}
                disabled={!newCreditLimit}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: !newCreditLimit ? 'not-allowed' : 'pointer',
                  opacity: !newCreditLimit ? 0.6 : 1
                }}
              >
                💰 Mettre à jour
              </button>
            </div>
          </div>

          {/* Notes d'action */}
          <div>
            <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>Notes d'Action</h4>
            <textarea
              value={actionNote}
              onChange={(e) => setActionNote(e.target.value)}
              placeholder="Notes sur la décision prise..."
              rows="3"
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #ddd',
                borderRadius: '4px',
                resize: 'vertical'
              }}
            />
          </div>
        </div>

        {/* Actions rapides */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>Actions Rapides</h4>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {customer.status === 'blocked' ? (
              <button 
                onClick={() => onAction(customer.customer_id, 'unblock')}
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#2ecc71',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                🔓 Débloquer le crédit
              </button>
            ) : (
              <button 
                onClick={() => onAction(customer.customer_id, 'block')}
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                🚫 Bloquer le crédit
              </button>
            )}
            <button 
              style={{
                padding: '10px 16px',
                backgroundColor: '#f39c12',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              📊 Historique crédit
            </button>
            <button 
              style={{
                padding: '10px 16px',
                backgroundColor: '#9b59b6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              📋 Rapport risque
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreditManagement;