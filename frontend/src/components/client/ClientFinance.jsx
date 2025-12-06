import React, { useState, useEffect } from 'react';
import { authService } from '../../services/auth';

const ClientFinance = () => {
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [financialSummary, setFinancialSummary] = useState({});
  const [activeTab, setActiveTab] = useState('invoices');

  useEffect(() => {
    loadFinancialData();
  }, []);

  const loadFinancialData = () => {
    // Simulation de données financières
    setInvoices([
      {
        id: 1,
        invoice_number: 'FAC-2024-001',
        amount: 15000,
        due_date: '2024-12-15',
        status: 'paid',
        issue_date: '2024-11-01'
      },
      {
        id: 2,
        invoice_number: 'FAC-2024-002',
        amount: 25000,
        due_date: '2024-12-20',
        status: 'pending',
        issue_date: '2024-11-10'
      },
      {
        id: 3,
        invoice_number: 'FAC-2024-003',
        amount: 18000,
        due_date: '2025-01-05',
        status: 'pending',
        issue_date: '2024-11-15'
      }
    ]);

    setPayments([
      {
        id: 1,
        invoice_number: 'FAC-2024-001',
        amount: 15000,
        payment_date: '2024-11-05',
        method: 'virement'
      },
      {
        id: 2,
        invoice_number: 'FAC-2023-125',
        amount: 32000,
        payment_date: '2024-10-20',
        method: 'chèque'
      }
    ]);

    setFinancialSummary({
      totalDue: 43000,
      overdueAmount: 0,
      creditLimit: 100000,
      availableCredit: 57000,
      lastPayment: 15000,
      lastPaymentDate: '2024-11-05'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'paid': { label: 'Payée', color: '#2ecc71' },
      'pending': { label: 'En attente', color: '#f39c12' },
      'overdue': { label: 'En retard', color: '#e74c3c' },
      'draft': { label: 'Brouillon', color: '#95a5a6' }
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

  const downloadInvoice = (invoice) => {
    alert(`Téléchargement facture: ${invoice.invoice_number}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '30px' }}>💰 Situation Financière</h1>

      {/* Résumé financier */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
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
          <h3 style={{ color: '#2c3e50', margin: '0 0 10px 0', fontSize: '14px' }}>Montant dû</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e74c3c' }}>
            {financialSummary.totalDue?.toLocaleString()} MAD
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#2c3e50', margin: '0 0 10px 0', fontSize: '14px' }}>Crédit disponible</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2ecc71' }}>
            {financialSummary.availableCredit?.toLocaleString()} MAD
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#2c3e50', margin: '0 0 10px 0', fontSize: '14px' }}>Dernier paiement</h3>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3498db' }}>
            {financialSummary.lastPayment?.toLocaleString()} MAD
          </div>
          <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
            {financialSummary.lastPaymentDate ? new Date(financialSummary.lastPaymentDate).toLocaleDateString() : 'N/A'}
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#2c3e50', margin: '0 0 10px 0', fontSize: '14px' }}>Limite de crédit</h3>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#9b59b6' }}>
            {financialSummary.creditLimit?.toLocaleString()} MAD
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div style={{
        display: 'flex',
        borderBottom: '2px solid #ecf0f1',
        marginBottom: '20px'
      }}>
        {[
          { id: 'invoices', label: `Factures (${invoices.length})`, icon: '🧾' },
          { id: 'payments', label: `Paiements (${payments.length})`, icon: '💳' },
          { id: 'balance', label: 'Solde', icon: '📊' }
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
      {activeTab === 'invoices' && (
        <InvoicesTab 
          invoices={invoices}
          getStatusBadge={getStatusBadge}
          downloadInvoice={downloadInvoice}
        />
      )}

      {activeTab === 'payments' && (
        <PaymentsTab payments={payments} />
      )}

      {activeTab === 'balance' && (
        <BalanceTab financialSummary={financialSummary} />
      )}
    </div>
  );
};

// Onglet Factures
const InvoicesTab = ({ invoices, getStatusBadge, downloadInvoice }) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ backgroundColor: '#3498db', color: 'white' }}>
          <th style={{ padding: '12px', textAlign: 'left' }}>N° Facture</th>
          <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
          <th style={{ padding: '12px', textAlign: 'left' }}>Échéance</th>
          <th style={{ padding: '12px', textAlign: 'left' }}>Montant</th>
          <th style={{ padding: '12px', textAlign: 'left' }}>Statut</th>
          <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {invoices.map(invoice => (
          <tr key={invoice.id} style={{ borderBottom: '1px solid #ecf0f1' }}>
            <td style={{ padding: '12px', fontWeight: 'bold' }}>
              {invoice.invoice_number}
            </td>
            <td style={{ padding: '12px' }}>
              {new Date(invoice.issue_date).toLocaleDateString()}
            </td>
            <td style={{ padding: '12px' }}>
              {new Date(invoice.due_date).toLocaleDateString()}
            </td>
            <td style={{ padding: '12px', fontWeight: 'bold' }}>
              {invoice.amount?.toLocaleString()} MAD
            </td>
            <td style={{ padding: '12px' }}>
              {getStatusBadge(invoice.status)}
            </td>
            <td style={{ padding: '12px' }}>
              <div style={{ display: 'flex', gap: '5px' }}>
                <button 
                  onClick={() => downloadInvoice(invoice)}
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
                  📄 PDF
                </button>
                {invoice.status === 'pending' && (
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
                    💳 Payer
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    
    {invoices.length === 0 && (
      <div style={{ padding: '40px', textAlign: 'center', color: '#7f8c8d' }}>
        Aucune facture trouvée
      </div>
    )}
  </div>
);

// Onglet Paiements
const PaymentsTab = ({ payments }) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ backgroundColor: '#2ecc71', color: 'white' }}>
          <th style={{ padding: '12px', textAlign: 'left' }}>N° Facture</th>
          <th style={{ padding: '12px', textAlign: 'left' }}>Date paiement</th>
          <th style={{ padding: '12px', textAlign: 'left' }}>Montant</th>
          <th style={{ padding: '12px', textAlign: 'left' }}>Méthode</th>
          <th style={{ padding: '12px', textAlign: 'left' }}>Référence</th>
        </tr>
      </thead>
      <tbody>
        {payments.map(payment => (
          <tr key={payment.id} style={{ borderBottom: '1px solid #ecf0f1' }}>
            <td style={{ padding: '12px', fontWeight: 'bold' }}>
              {payment.invoice_number}
            </td>
            <td style={{ padding: '12px' }}>
              {new Date(payment.payment_date).toLocaleDateString()}
            </td>
            <td style={{ padding: '12px', fontWeight: 'bold', color: '#2ecc71' }}>
              {payment.amount?.toLocaleString()} MAD
            </td>
            <td style={{ padding: '12px' }}>
              <span style={{
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold',
                backgroundColor: '#3498db',
                color: 'white',
                textTransform: 'capitalize'
              }}>
                {payment.method}
              </span>
            </td>
            <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px' }}>
              REF-{payment.id.toString().padStart(6, '0')}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    
    {payments.length === 0 && (
      <div style={{ padding: '40px', textAlign: 'center', color: '#7f8c8d' }}>
        Aucun paiement trouvé
      </div>
    )}
  </div>
);

// Onglet Solde
const BalanceTab = ({ financialSummary }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px'
  }}>
    {/* Détails du solde */}
    <div style={{
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>📊 Détails du Solde</h3>
      
      <div style={{ display: 'grid', gap: '15px' }}>
        {[
          { label: 'Solde actuel', value: `${financialSummary.totalDue?.toLocaleString()} MAD`, color: '#e74c3c' },
          { label: 'Montant en retard', value: `${financialSummary.overdueAmount?.toLocaleString()} MAD`, color: '#e74c3c' },
          { label: 'Limite de crédit', value: `${financialSummary.creditLimit?.toLocaleString()} MAD`, color: '#3498db' },
          { label: 'Crédit disponible', value: `${financialSummary.availableCredit?.toLocaleString()} MAD`, color: '#2ecc71' }
        ].map((item, index) => (
          <div key={index} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>{item.label}</span>
            <span style={{ fontWeight: 'bold', color: item.color }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Informations de paiement */}
    <div style={{
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>💳 Informations de Paiement</h3>
      
      <div style={{ display: 'grid', gap: '15px' }}>
        <div style={{
          padding: '15px',
          backgroundColor: '#e8f5e8',
          borderRadius: '8px',
          borderLeft: '4px solid #2ecc71'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#27ae60' }}>Coordonnées Bancaires</h4>
          <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
            <div><strong>Banque:</strong> Bank of Africa</div>
            <div><strong>IBAN:</strong> MA64 0030 0000 0000 0000 0000 000</div>
            <div><strong>BIC/SWIFT:</strong> BCMAMAMCXXX</div>
            <div><strong>Bénéficiaire:</strong> ADV INDUSTRIE</div>
          </div>
        </div>

        <div style={{
          padding: '15px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          borderLeft: '4px solid #3498db'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#2980b9' }}>Contact Financier</h4>
          <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
            <div><strong>Service financier:</strong> 05 22 00 00 00</div>
            <div><strong>Email:</strong> finance@adv.ma</div>
            <div><strong>Délai de traitement:</strong> 48h ouvrées</div>
          </div>
        </div>
      </div>

      {/* Information importante */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#856404'
      }}>
        <strong>💡 Important :</strong> Merci de toujours indiquer le numéro de facture dans la référence de paiement.
      </div>
    </div>
  </div>
);

export default ClientFinance;