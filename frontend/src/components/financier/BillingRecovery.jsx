import React, { useState, useEffect } from 'react';
import { customerService, invoiceService } from '../../services/api';

const BillingRecovery = () => {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [filter, setFilter] = useState('overdue');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [customersRes] = await Promise.all([
        customerService.getAll()
      ]);
      
      const customersData = customersRes.data.results || customersRes.data;
      
      // Simulation de données de facturation
      const simulatedInvoices = [
        {
          id: 1,
          invoice_number: 'FAC-2024-001',
          customer_id: 1,
          amount: 15000,
          due_date: '2024-11-10',
          status: 'overdue',
          days_overdue: 15,
          reminder_count: 2,
          last_reminder: '2024-11-20'
        },
        {
          id: 2,
          invoice_number: 'FAC-2024-002',
          customer_id: 2,
          amount: 25000,
          due_date: '2024-11-15',
          status: 'overdue',
          days_overdue: 10,
          reminder_count: 1,
          last_reminder: '2024-11-18'
        },
        {
          id: 3,
          invoice_number: 'FAC-2024-003',
          customer_id: 3,
          amount: 18000,
          due_date: '2024-11-25',
          status: 'pending',
          days_overdue: 0,
          reminder_count: 0,
          last_reminder: null
        },
        {
          id: 4,
          invoice_number: 'FAC-2024-004',
          customer_id: 1,
          amount: 32000,
          due_date: '2024-10-30',
          status: 'overdue',
          days_overdue: 25,
          reminder_count: 3,
          last_reminder: '2024-11-22'
        }
      ];
      
      setInvoices(simulatedInvoices);
      setCustomers(customersData);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    if (filter === 'all') return true;
    if (filter === 'overdue') return invoice.status === 'overdue';
    if (filter === 'pending') return invoice.status === 'pending';
    if (filter === 'paid') return invoice.status === 'paid';
    return true;
  });

  const getStatusBadge = (status, daysOverdue) => {
    const statusConfig = {
      'paid': { label: 'Payée', color: '#2ecc71' },
      'pending': { label: 'En attente', color: '#3498db' },
      'overdue': { 
        label: `Retard (${daysOverdue}j)`, 
        color: daysOverdue > 30 ? '#e74c3c' : daysOverdue > 15 ? '#f39c12' : '#e67e22'
      }
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

  const sendReminder = async (invoiceId, type) => {
    try {
      // Simulation d'envoi de relance
      console.log(`Envoi relance ${type} pour facture ${invoiceId}`);
      alert(`Relance ${type} envoyée avec succès`);
      
      setInvoices(invoices.map(inv => 
        inv.id === invoiceId 
          ? { 
              ...inv, 
              reminder_count: inv.reminder_count + 1,
              last_reminder: new Date().toISOString().split('T')[0]
            }
          : inv
      ));
      
      setShowRecoveryModal(false);
    } catch (error) {
      console.error('Erreur envoi relance:', error);
      alert('Erreur lors de l\'envoi de la relance');
    }
  };

  const markAsPaid = async (invoiceId) => {
    try {
      // Simulation de marquage comme payée
      console.log(`Marquage comme payée pour facture ${invoiceId}`);
      alert('Facture marquée comme payée');
      
      setInvoices(invoices.map(inv => 
        inv.id === invoiceId 
          ? { ...inv, status: 'paid' }
          : inv
      ));
    } catch (error) {
      console.error('Erreur marquage payée:', error);
      alert('Erreur lors du marquage');
    }
  };

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Chargement des factures...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1>💳 Facturation & Recouvrement</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '8px', borderRadius: '5px' }}
          >
            <option value="overdue">En retard</option>
            <option value="pending">En attente</option>
            <option value="paid">Payées</option>
            <option value="all">Toutes les factures</option>
          </select>
        </div>
      </div>

      {/* Statistiques de recouvrement */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '5px' }}>Montant total en retard</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e74c3c' }}>
            {invoices
              .filter(inv => inv.status === 'overdue')
              .reduce((sum, inv) => sum + inv.amount, 0)
              .toLocaleString()} MAD
          </div>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '5px' }}>Factures en retard</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f39c12' }}>
            {invoices.filter(inv => inv.status === 'overdue').length}
          </div>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '5px' }}>Relances envoyées</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3498db' }}>
            {invoices.reduce((sum, inv) => sum + inv.reminder_count, 0)}
          </div>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '5px' }}>Taux de recouvrement</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2ecc71' }}>
            87%
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
        <h4 style={{ color: '#721c24', margin: '0 0 10px 0' }}>🚨 Factures Critiques (&gt; 30 jours)</h4>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          {invoices
            .filter(inv => inv.days_overdue > 30)
            .map(invoice => (
              <div key={invoice.id} style={{
                padding: '8px 12px',
                backgroundColor: '#e74c3c',
                color: 'white',
                borderRadius: '5px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {invoice.invoice_number} - {getCustomerName(invoice.customer_id)} - {invoice.days_overdue}j
              </div>
            ))}
        </div>
      </div>

      {/* Tableau des factures */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#8e44ad', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>N° Facture</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Client</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Échéance</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Jours de retard</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Montant</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Relances</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Statut</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map(invoice => (
              <tr key={invoice.id} style={{ 
                borderBottom: '1px solid #ecf0f1',
                backgroundColor: invoice.days_overdue > 30 ? '#f8d7da' : 
                                invoice.days_overdue > 15 ? '#fff3cd' : 'transparent'
              }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>
                  {invoice.invoice_number}
                </td>
                <td style={{ padding: '12px' }}>
                  {getCustomerName(invoice.customer_id)}
                </td>
                <td style={{ padding: '12px' }}>
                  {new Date(invoice.due_date).toLocaleDateString()}
                </td>
                <td style={{ padding: '12px', fontWeight: 'bold', color: invoice.days_overdue > 0 ? '#e74c3c' : '#2ecc71' }}>
                  {invoice.days_overdue > 0 ? `${invoice.days_overdue} jours` : 'Dans les temps'}
                </td>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>
                  {invoice.amount.toLocaleString()} MAD
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ 
                      padding: '2px 6px', 
                      backgroundColor: '#3498db', 
                      color: 'white', 
                      borderRadius: '8px',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}>
                      {invoice.reminder_count}
                    </span>
                    {invoice.last_reminder && (
                      <span style={{ fontSize: '10px', color: '#7f8c8d' }}>
                        {new Date(invoice.last_reminder).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </td>
                <td style={{ padding: '12px' }}>
                  {getStatusBadge(invoice.status, invoice.days_overdue)}
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => {
                        setSelectedInvoice(invoice);
                        setShowRecoveryModal(true);
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
                      📧 Relancer
                    </button>
                    {invoice.status === 'overdue' && (
                      <button 
                        onClick={() => markAsPaid(invoice.id)}
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
                        💰 Marquer payée
                      </button>
                    )}
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
                      📄 Voir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredInvoices.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#7f8c8d' }}>
            Aucune facture trouvée avec ce filtre
          </div>
        )}
      </div>

      {/* Modal de relance */}
      {showRecoveryModal && selectedInvoice && (
        <RecoveryModal 
          invoice={selectedInvoice}
          customer={customers.find(c => c.customer_id === selectedInvoice.customer_id)}
          onSendReminder={sendReminder}
          onClose={() => {
            setShowRecoveryModal(false);
            setSelectedInvoice(null);
          }}
        />
      )}
    </div>
  );
};

// Modal de relance
const RecoveryModal = ({ invoice, customer, onSendReminder, onClose }) => {
  const [reminderType, setReminderType] = useState('friendly');
  const [customMessage, setCustomMessage] = useState('');

  const reminderTemplates = {
    friendly: `Bonjour,\n\nNous vous rappelons que votre facture ${invoice.invoice_number} d'un montant de ${invoice.amount.toLocaleString()} MAD était attendue pour le ${new Date(invoice.due_date).toLocaleDateString()}.\n\nPourriez-vous nous indiquer la date prévue de règlement ?\n\nCordialement,\nService Financier`,
    formal: `Madame, Monsieur,\n\nNous constatons que votre facture ${invoice.invoice_number} d'un montant de ${invoice.amount.toLocaleString()} MAD, échéante le ${new Date(invoice.due_date).toLocaleDateString()}, n'est toujours pas réglée à ce jour (${invoice.days_overdue} jours de retard).\n\nNous vous prions de bien vouloir procéder au règlement dans les plus brefs délais.\n\nCordialement,\nDirection Financière`,
    urgent: `URGENT - MISE EN DEMEURE\n\nNous vous informons que malgré nos relances antérieures, votre facture ${invoice.invoice_number} d'un montant de ${invoice.amount.toLocaleString()} MAD reste impayée (${invoice.days_overdue} jours de retard).\n\nFaute de règlement sous 8 jours, nous serons dans l'obligation de saisir nos services contentieux.\n\nVeuillez régulariser immédiatement.\n\nService Contentieux`
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
        <h2>📧 Envoi de Relance</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>Détails de la Facture</h4>
            <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '5px' }}>
              <div><strong>Facture:</strong> {invoice.invoice_number}</div>
              <div><strong>Client:</strong> {customer?.name || 'N/A'}</div>
              <div><strong>Montant:</strong> {invoice.amount.toLocaleString()} MAD</div>
              <div><strong>Échéance:</strong> {new Date(invoice.due_date).toLocaleDateString()}</div>
              <div><strong>Retard:</strong> {invoice.days_overdue} jours</div>
              <div><strong>Relances précédentes:</strong> {invoice.reminder_count}</div>
            </div>
          </div>
          
          <div>
            <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>Type de Relance</h4>
            <div style={{ display: 'grid', gap: '10px' }}>
              {[
                { id: 'friendly', label: '📞 Relance amiable', description: 'Premier rappel courtois' },
                { id: 'formal', label: '📝 Relance formelle', description: 'Rappel officiel' },
                { id: 'urgent', label: '🚨 Mise en demeure', description: 'Dernier avertissement' }
              ].map(type => (
                <label key={type.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    value={type.id}
                    checked={reminderType === type.id}
                    onChange={(e) => setReminderType(e.target.value)}
                  />
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{type.label}</div>
                    <div style={{ fontSize: '12px', color: '#7f8c8d' }}>{type.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Message de relance */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>Message de Relance</h4>
          <textarea
            value={customMessage || reminderTemplates[reminderType]}
            onChange={(e) => setCustomMessage(e.target.value)}
            rows="8"
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px',
              lineHeight: '1.5',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Annuler
          </button>
          <button 
            onClick={() => onSendReminder(invoice.id, reminderType)}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: reminderType === 'urgent' ? '#e74c3c' : reminderType === 'formal' ? '#f39c12' : '#3498db', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            📧 Envoyer la relance
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingRecovery;