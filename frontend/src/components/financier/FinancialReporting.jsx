import React, { useState, useEffect } from 'react';
import { customerService, invoiceService } from '../../services/api';

const FinancialReporting = () => {
  const [reportData, setReportData] = useState({});
  const [timeRange, setTimeRange] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('recovery');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReportData();
  }, [timeRange]);

  const loadReportData = async () => {
    try {
      // Simulation de données de reporting
      const simulatedData = {
        recoveryMetrics: {
          totalInvoiced: 1250000,
          totalCollected: 1090000,
          recoveryRate: 87.2,
          averageDelay: 8.5,
          overdueAmount: 160000
        },
        riskAnalysis: [
          { category: 'Très élevé', count: 3, amount: 75000, percentage: 12 },
          { category: 'Élevé', count: 8, amount: 45000, percentage: 28 },
          { category: 'Modéré', count: 15, amount: 25000, percentage: 35 },
          { category: 'Faible', count: 25, amount: 15000, percentage: 25 }
        ],
        paymentTrends: [
          { month: 'Jan', paid: 85, overdue: 15 },
          { month: 'Fév', paid: 82, overdue: 18 },
          { month: 'Mar', paid: 88, overdue: 12 },
          { month: 'Avr', paid: 84, overdue: 16 },
          { month: 'Mai', paid: 90, overdue: 10 },
          { month: 'Jun', paid: 87, overdue: 13 }
        ],
        topDelinquents: [
          { name: 'Entreprise A', amount: 45000, days: 45, risk: 'Très élevé' },
          { name: 'Société B', amount: 32000, days: 32, risk: 'Élevé' },
          { name: 'Groupe C', amount: 28000, days: 28, risk: 'Élevé' },
          { name: 'Compagnie D', amount: 22000, days: 18, risk: 'Modéré' },
          { name: 'Industrie E', amount: 18000, days: 12, risk: 'Modéré' }
        ]
      };
      
      setReportData(simulatedData);
    } catch (error) {
      console.error('Erreur chargement reporting:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Très élevé': return '#e74c3c';
      case 'Élevé': return '#e67e22';
      case 'Modéré': return '#f39c12';
      case 'Faible': return '#2ecc71';
      default: return '#95a5a6';
    }
  };

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Chargement des rapports...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1>📈 Pilotage & Reporting Financier</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            style={{ padding: '8px', borderRadius: '5px' }}
          >
            <option value="week">7 derniers jours</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
        </div>
      </div>

      {/* Navigation des métriques */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '15px',
        marginBottom: '30px'
      }}>
        {[
          { id: 'recovery', label: '📊 Recouvrement', icon: '📊' },
          { id: 'risk', label: '🎯 Analyse Risque', icon: '🎯' },
          { id: 'trends', label: '📈 Tendances', icon: '📈' },
          { id: 'delinquents', label: '🚨 Délinquants', icon: '🚨' }
        ].map(metric => (
          <button
            key={metric.id}
            onClick={() => setSelectedMetric(metric.id)}
            style={{
              padding: '20px',
              backgroundColor: selectedMetric === metric.id ? '#8e44ad' : 'white',
              color: selectedMetric === metric.id ? 'white' : '#2c3e50',
              border: `2px solid ${selectedMetric === metric.id ? '#8e44ad' : '#e9ecef'}`,
              borderRadius: '10px',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>{metric.icon}</div>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{metric.label}</div>
          </button>
        ))}
      </div>

      {/* Contenu des rapports */}
      {selectedMetric === 'recovery' && (
        <RecoveryReport data={reportData.recoveryMetrics} />
      )}

      {selectedMetric === 'risk' && (
        <RiskReport data={reportData.riskAnalysis} />
      )}

      {selectedMetric === 'trends' && (
        <TrendsReport data={reportData.paymentTrends} />
      )}

      {selectedMetric === 'delinquents' && (
        <DelinquentsReport data={reportData.topDelinquents} getRiskColor={getRiskColor} />
      )}
    </div>
  );
};

// Rapport de Recouvrement
const RecoveryReport = ({ data }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '30px'
  }}>
    {/* Métriques principales */}
    <div>
      <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>📊 Métriques de Recouvrement</h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '5px' }}>Facturé</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3498db' }}>
            {data.totalInvoiced?.toLocaleString()} MAD
          </div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '5px' }}>Encaissé</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2ecc71' }}>
            {data.totalCollected?.toLocaleString()} MAD
          </div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '5px' }}>Taux Recouvrement</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9b59b6' }}>
            {data.recoveryRate}%
          </div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '5px' }}>Retard Moyen</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f39c12' }}>
            {data.averageDelay} jours
          </div>
        </div>
      </div>

      {/* Graphique de performance */}
      <div style={{
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h4 style={{ color: '#2c3e50', marginBottom: '15px' }}>Performance vs Objectif</h4>
        <div style={{ 
          height: '200px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '5px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#7f8c8d'
        }}>
          Graphique de performance à implémenter
        </div>
      </div>
    </div>

    {/* Analyse détaillée */}
    <div>
      <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>🔍 Analyse Détaillée</h3>
      
      <div style={{
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h4 style={{ color: '#2c3e50', marginBottom: '15px' }}>Répartition des Encours</h4>
        <div style={{ display: 'grid', gap: '10px' }}>
          {[
            { label: '0-30 jours', amount: 850000, color: '#2ecc71' },
            { label: '31-60 jours', amount: 240000, color: '#f39c12' },
            { label: '61-90 jours', amount: 120000, color: '#e67e22' },
            { label: '+90 jours', amount: 40000, color: '#e74c3c' }
          ].map((item, index) => (
            <div key={index}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '14px' }}>{item.label}</span>
                <span style={{ fontWeight: 'bold' }}>{item.amount.toLocaleString()} MAD</span>
              </div>
              <div style={{ 
                width: '100%', 
                height: '8px', 
                backgroundColor: '#ecf0f1', 
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${(item.amount / data.totalInvoiced) * 100}%`,
                  height: '100%',
                  backgroundColor: item.color
                }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommandations */}
      <div style={{
        backgroundColor: '#e8f4fd',
        padding: '20px',
        borderRadius: '10px',
        borderLeft: '4px solid #3498db'
      }}>
        <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>💡 Recommandations</h4>
        <ul style={{ fontSize: '14px', color: '#2c3e50', paddingLeft: '20px', margin: 0 }}>
          <li>Renforcer les relances pour les encours 61-90 jours</li>
          <li>Revoir les limites de crédit des clients à risque</li>
          <li>Automatiser les relances pour les retards 31-60 jours</li>
        </ul>
      </div>
    </div>
  </div>
);

// Analyse des Risques
const RiskReport = ({ data }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px'
  }}>
    {/* Répartition des risques */}
    <div style={{
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>🎯 Répartition du Risque Client</h3>
      
      <div style={{ display: 'grid', gap: '15px' }}>
        {data.map((item, index) => (
          <div key={index}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: 
                    item.category === 'Très élevé' ? '#e74c3c' :
                    item.category === 'Élevé' ? '#e67e22' :
                    item.category === 'Modéré' ? '#f39c12' : '#2ecc71'
                }}></div>
                <span style={{ fontWeight: 'bold' }}>{item.category}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold' }}>{item.count} clients</div>
                <div style={{ fontSize: '12px', color: '#7f8c8d' }}>{item.amount.toLocaleString()} MAD</div>
              </div>
            </div>
            <div style={{ 
              width: '100%', 
              height: '10px', 
              backgroundColor: '#ecf0f1', 
              borderRadius: '5px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${item.percentage}%`,
                height: '100%',
                backgroundColor: 
                  item.category === 'Très élevé' ? '#e74c3c' :
                  item.category === 'Élevé' ? '#e67e22' :
                  item.category === 'Modéré' ? '#f39c12' : '#2ecc71'
              }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Cartographie du risque */}
    <div style={{
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>🗺️ Cartographie du Risque</h3>
      
      <div style={{ 
        height: '300px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#7f8c8d',
        marginBottom: '20px'
      }}>
        Carte de chaleur des risques à implémenter
      </div>

      {/* Légende */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        {data.map((item, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '15px',
              height: '15px',
              borderRadius: '3px',
              backgroundColor: 
                item.category === 'Très élevé' ? '#e74c3c' :
                item.category === 'Élevé' ? '#e67e22' :
                item.category === 'Modéré' ? '#f39c12' : '#2ecc71'
            }}></div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{item.category}</div>
              <div style={{ fontSize: '11px', color: '#7f8c8d' }}>{item.percentage}% du portefeuille</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Tendances de Paiement
const TrendsReport = ({ data }) => (
  <div style={{
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  }}>
    <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>📈 Tendances de Paiement</h3>
    
    <div style={{ 
      height: '300px', 
      backgroundColor: '#f8f9fa', 
      borderRadius: '5px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#7f8c8d',
      marginBottom: '20px'
    }}>
      Graphique des tendances à implémenter
    </div>

    {/* Tableau des tendances */}
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Mois</th>
            <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Payé à temps</th>
            <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>En retard</th>
            <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Taux ponctualité</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', fontWeight: 'bold' }}>{item.month}</td>
              <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', textAlign: 'center', color: '#2ecc71', fontWeight: 'bold' }}>
                {item.paid}%
              </td>
              <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', textAlign: 'center', color: '#e74c3c', fontWeight: 'bold' }}>
                {item.overdue}%
              </td>
              <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>
                <div style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  backgroundColor: item.paid >= 85 ? '#d5f4e6' : item.paid >= 75 ? '#fff3cd' : '#f8d7da',
                  color: item.paid >= 85 ? '#155724' : item.paid >= 75 ? '#856404' : '#721c24'
                }}>
                  {item.paid}%
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Top Délinquants
const DelinquentsReport = ({ data, getRiskColor }) => (
  <div style={{
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  }}>
    <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>🚨 Top Délinquants</h3>
    
    <div style={{ display: 'grid', gap: '15px' }}>
      {data.map((client, index) => (
        <div key={index} style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          borderLeft: `4px solid ${getRiskColor(client.risk)}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: getRiskColor(client.risk),
              color: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              {index + 1}
            </div>
            <div>
              <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>{client.name}</div>
              <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                {client.days} jours de retard
              </div>
            </div>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 'bold', color: '#e74c3c', fontSize: '18px' }}>
              {client.amount.toLocaleString()} MAD
            </div>
            <div style={{
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              backgroundColor: getRiskColor(client.risk),
              color: 'white',
              display: 'inline-block'
            }}>
              {client.risk}
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Actions recommandées */}
    <div style={{
      marginTop: '25px',
      padding: '20px',
      backgroundColor: '#fff3cd',
      border: '1px solid #ffeaa7',
      borderRadius: '8px'
    }}>
      <h4 style={{ color: '#856404', marginBottom: '10px' }}>🎯 Plan d'Action Recommandé</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', fontSize: '14px' }}>
        <div>
          <strong>Actions immédiates:</strong>
          <ul style={{ margin: '5px 0 0 20px', padding: 0 }}>
            <li>Relances téléphoniques prioritaires</li>
            <li>Mises en demeure formalisées</li>
            <li>Blocage des nouvelles commandes</li>
          </ul>
        </div>
        <div>
          <strong>Actions préventives:</strong>
          <ul style={{ margin: '5px 0 0 20px', padding: 0 }}>
            <li>Révision des limites de crédit</li>
            <li>Accords de paiement échelonnés</li>
            <li>Surveillance renforcée</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default FinancialReporting;