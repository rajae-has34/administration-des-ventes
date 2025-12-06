import React, { useState, useEffect } from 'react';
import { salesOrderService, customerService } from '../../services/api';

const OrderFinancialControl = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ordersRes, customersRes] = await Promise.all([
        salesOrderService.getAll(),
        customerService.getAll()
      ]);
      
      const ordersData = ordersRes.data.results || ordersRes.data;
      const customersData = customersRes.data.results || customersRes.data;
      
      // Ajouter des données financières simulées
      const ordersWithFinancialData = ordersData.map(order => {
        const customer = customersData.find(c => c.customer_id === order.customer_id);
        const creditLimit = customer?.credit_limit || 0;
        const customerOrders = ordersData.filter(o => o.customer_id === order.customer_id);
        const totalPending = customerOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
        const creditUtilization = creditLimit > 0 ? (totalPending / creditLimit) * 100 : 0;
        
        return {
          ...order,
          requires_approval: Math.random() > 0.6,
          credit_utilization: Math.round(creditUtilization),
          exceeds_limit: creditUtilization > 100,
          financial_status: Math.random() > 0.7 ? 'pending' : 'approved'
        };
      });
      
      setOrders(ordersWithFinancialData);
      setCustomers(customersData);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'pending') return order.financial_status === 'pending';
    if (filter === 'exceeds_limit') return order.exceeds_limit;
    if (filter === 'approved') return order.financial_status === 'approved';
    if (filter === 'rejected') return order.financial_status === 'rejected';
    return true;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'approved': { label: 'Approuvée', color: '#2ecc71' },
      'pending': { label: 'En attente', color: '#f39c12' },
      'rejected': { label: 'Rejetée', color: '#e74c3c' },
      'cancelled': { label: 'Annulée', color: '#95a5a6' }
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

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.customer_id === customerId);
    return customer ? customer.name : 'N/A';
  };

  const handleOrderApproval = async (orderId, action) => {
    try {
      // Simulation d'approbation
      console.log(`Commande ${action} pour l'ordre ${orderId}`);
      alert(`Commande ${action === 'approve' ? 'approuvée' : 'rejetée'} avec succès`);
      
      setOrders(orders.map(o => 
        o.order_id === orderId 
          ? { ...o, financial_status: action === 'approve' ? 'approved' : 'rejected' }
          : o
      ));
      
      setShowApprovalModal(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Erreur approbation:', error);
      alert('Erreur lors de l\'approbation');
    }
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
        <h1>📋 Contrôle Financier des Commandes</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '8px', borderRadius: '5px' }}
          >
            <option value="pending">En attente d'approbation</option>
            <option value="exceeds_limit">Dépassement de crédit</option>
            <option value="approved">Approuvées</option>
            <option value="rejected">Rejetées</option>
            <option value="all">Toutes les commandes</option>
          </select>
        </div>
      </div>

      {/* Alertes */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '8px',
          padding: '15px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ fontSize: '24px' }}>⏰</div>
            <div>
              <div style={{ fontWeight: 'bold', color: '#856404' }}>En attente</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f39c12' }}>
                {orders.filter(o => o.financial_status === 'pending').length}
              </div>
            </div>
          </div>
        </div>
        <div style={{
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '8px',
          padding: '15px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ fontSize: '24px' }}>🚨</div>
            <div>
              <div style={{ fontWeight: 'bold', color: '#721c24' }}>Dépassement crédit</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#e74c3c' }}>
                {orders.filter(o => o.exceeds_limit).length}
              </div>
            </div>
          </div>
        </div>
        <div style={{
          backgroundColor: '#d1ecf1',
          border: '1px solid #bee5eb',
          borderRadius: '8px',
          padding: '15px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ fontSize: '24px' }}>💰</div>
            <div>
              <div style={{ fontWeight: 'bold', color: '#0c5460' }}>Montant total en attente</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3498db' }}>
                {orders
                  .filter(o => o.financial_status === 'pending')
                  .reduce((sum, o) => sum + (o.total_amount || 0), 0)
                  .toLocaleString()} MAD
              </div>
            </div>
          </div>
        </div>
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
            <tr style={{ backgroundColor: '#8e44ad', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>N° Commande</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Client</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Montant</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Utilisation Crédit</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Statut Financier</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.order_id} style={{ 
                borderBottom: '1px solid #ecf0f1',
                backgroundColor: order.exceeds_limit ? '#f8d7da' : 'transparent'
              }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>
                  CMD-{order.order_id}
                  {order.exceeds_limit && (
                    <div style={{ fontSize: '10px', color: '#e74c3c', fontWeight: 'bold' }}>🚨 DÉPASSEMENT</div>
                  )}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ 
                      width: '60px', 
                      height: '8px', 
                      backgroundColor: '#ecf0f1', 
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${Math.min(order.credit_utilization, 100)}%`,
                        height: '100%',
                        backgroundColor: order.credit_utilization > 100 ? '#e74c3c' : order.credit_utilization > 80 ? '#f39c12' : '#2ecc71'
                      }}></div>
                    </div>
                    <span style={{ 
                      fontSize: '12px', 
                      fontWeight: 'bold',
                      color: order.credit_utilization > 100 ? '#e74c3c' : 'inherit'
                    }}>
                      {order.credit_utilization}%
                    </span>
                  </div>
                </td>
                <td style={{ padding: '12px' }}>
                  {getStatusBadge(order.financial_status)}
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button 
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowApprovalModal(true);
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
                      {order.financial_status === 'pending' ? '👁️ Examiner' : '📋 Détails'}
                    </button>
                    {order.financial_status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleOrderApproval(order.order_id, 'approve')}
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
                          ✓ Approuver
                        </button>
                        <button 
                          onClick={() => handleOrderApproval(order.order_id, 'reject')}
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
                          ✗ Rejeter
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredOrders.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#7f8c8d' }}>
            Aucune commande trouvée avec ce filtre
          </div>
        )}
      </div>

      {/* Modal d'approbation */}
      {showApprovalModal && selectedOrder && (
        <ApprovalModal 
          order={selectedOrder}
          customer={customers.find(c => c.customer_id === selectedOrder.customer_id)}
          onApprove={() => handleOrderApproval(selectedOrder.order_id, 'approve')}
          onReject={() => handleOrderApproval(selectedOrder.order_id, 'reject')}
          onClose={() => {
            setShowApprovalModal(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};

// Modal d'approbation de commande
const ApprovalModal = ({ order, customer, onApprove, onReject, onClose }) => {
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
        maxWidth: '700px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h2>📋 Approbation Financière de Commande</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>Détails de la Commande</h4>
            <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '5px' }}>
              <div><strong>N° Commande:</strong> CMD-{order.order_id}</div>
              <div><strong>Date:</strong> {new Date(order.order_date).toLocaleDateString()}</div>
              <div><strong>Montant:</strong> {order.total_amount?.toLocaleString()} MAD</div>
              <div><strong>Statut:</strong> {order.status}</div>
            </div>
          </div>
          
          <div>
            <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>Informations Client</h4>
            <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '5px' }}>
              <div><strong>Client:</strong> {customer?.name || 'N/A'}</div>
              <div><strong>Limite de crédit:</strong> {customer?.credit_limit ? `${customer.credit_limit.toLocaleString()} MAD` : 'Non définie'}</div>
              <div><strong>Utilisation crédit:</strong> {order.credit_utilization}%</div>
              <div><strong>Dépassement:</strong> 
                <span style={{ color: order.exceeds_limit ? '#e74c3c' : '#2ecc71', fontWeight: 'bold' }}>
                  {order.exceeds_limit ? ' OUI' : ' Non'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Analyse de risque */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>Analyse de Risque</h4>
          <div style={{ 
            padding: '15px', 
            backgroundColor: order.exceeds_limit ? '#f8d7da' : '#d1ecf1', 
            borderRadius: '5px',
            borderLeft: `4px solid ${order.exceeds_limit ? '#e74c3c' : '#3498db'}`
          }}>
            {order.exceeds_limit ? (
              <div>
                <div style={{ fontWeight: 'bold', color: '#721c24' }}>🚨 ALERTE: Dépassement de limite de crédit</div>
                <div style={{ fontSize: '14px', color: '#721c24', marginTop: '5px' }}>
                  Le client dépasse sa limite de crédit de {order.credit_utilization - 100}%. 
                  Approbation exceptionnelle requise.
                </div>
              </div>
            ) : order.credit_utilization > 80 ? (
              <div>
                <div style={{ fontWeight: 'bold', color: '#856404' }}>⚠️ ATTENTION: Utilisation élevée du crédit</div>
                <div style={{ fontSize: '14px', color: '#856404', marginTop: '5px' }}>
                  Le client utilise {order.credit_utilization}% de sa limite de crédit.
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontWeight: 'bold', color: '#155724' }}>✅ Situation normale</div>
                <div style={{ fontSize: '14px', color: '#155724', marginTop: '5px' }}>
                  Le client respecte sa limite de crédit ({order.credit_utilization}% d'utilisation).
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Historique du client */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>Historique Client</h4>
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#e8f4fd', 
            borderRadius: '5px',
            borderLeft: '4px solid #3498db'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
              <div><strong>Commandes totales:</strong> 12</div>
              <div><strong>Dernier paiement:</strong> 15/11/2024</div>
              <div><strong>Retard moyen:</strong> 5 jours</div>
              <div><strong>Score de paiement:</strong> 8.5/10</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Annuler
          </button>
          <button onClick={onReject} style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            ❌ Rejeter la commande
          </button>
          <button onClick={onApprove} style={{ padding: '10px 20px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            ✅ Approuver la commande
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderFinancialControl;