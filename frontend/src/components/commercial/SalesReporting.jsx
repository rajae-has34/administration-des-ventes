import React, { useState, useEffect } from 'react';
import { salesOrderService, customerService } from '../../services/api';

const SalesReporting = () => {
  const [reportData, setReportData] = useState({});
  const [timeRange, setTimeRange] = useState('month');
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReportData();
  }, [timeRange, startDate, endDate]);

  const loadReportData = async () => {
    setLoading(true);
    try {
      // Simulation de données de reporting
      const mockData = {
        salesSummary: {
          totalRevenue: 1250000,
          totalOrders: 45,
          averageOrderValue: 27778,
          conversionRate: 12.5
        },
        performanceMetrics: {
          targetAchievement: 85,
          growthRate: 15.2,
          customerRetention: 78.5,
          newCustomers: 8
        },
        topCustomers: [
          { id: 1, name: 'Entreprise A', revenue: 250000, orders: 12 },
          { id: 2, name: 'Société B', revenue: 180000, orders: 8 },
          { id: 3, name: 'Groupe C', revenue: 150000, orders: 6 }
        ],
        salesTrend: [
          { month: 'Jan', revenue: 100000, target: 120000 },
          { month: 'Fév', revenue: 110000, target: 120000 },
          { month: 'Mar', revenue: 105000, target: 125000 },
          { month: 'Avr', revenue: 120000, target: 125000 },
          { month: 'Mai', revenue: 130000, target: 130000 },
          { month: 'Jun', revenue: 125000, target: 135000 }
        ]
      };
      
      setReportData(mockData);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    const now = new Date();
    let start = new Date();
    
    switch (range) {
      case 'week':
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        start = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      case 'year':
        start = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        break;
    }
    
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(now.toISOString().split('T')[0]);
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#3498db' }}>Chargement des données...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1>📊 Suivi & Reporting Commercial</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select 
            value={timeRange}
            onChange={(e) => handleTimeRangeChange(e.target.value)}
            style={{ padding: '8px', borderRadius: '5px' }}
          >
            <option value="week">7 derniers jours</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
            <option value="custom">Personnalisé</option>
          </select>
          
          {timeRange === 'custom' && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ padding: '8px', borderRadius: '5px' }}
              />
              <span>au</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ padding: '8px', borderRadius: '5px' }}
              />
            </div>
          )}
          
          <button 
            onClick={loadReportData}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🔄 Actualiser
          </button>
        </div>
      </div>

      {/* Résumé des ventes */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <MetricCard
          title="Chiffre d'Affaires"
          value={reportData.salesSummary?.totalRevenue}
          format="currency"
          color="#3498db"
          icon="💰"
        />
        <MetricCard
          title="Commandes"
          value={reportData.salesSummary?.totalOrders}
          format="number"
          color="#2ecc71"
          icon="🛒"
        />
        <MetricCard
          title="Panier Moyen"
          value={reportData.salesSummary?.averageOrderValue}
          format="currency"
          color="#9b59b6"
          icon="📦"
        />
        <MetricCard
          title="Taux de Conversion"
          value={reportData.salesSummary?.conversionRate}
          format="percentage"
          color="#e67e22"
          icon="📈"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '30px' }}>
        {/* Graphique de performance */}
        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>📈 Performance Commerciale</h3>
          <SalesTrendChart data={reportData.salesTrend} />
        </div>

        {/* Métriques de performance */}
        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>🎯 Indicateurs Clés</h3>
          <div style={{ display: 'grid', gap: '15px' }}>
            <PerformanceMetric
              label="Réalisation Objectif"
              value={reportData.performanceMetrics?.targetAchievement}
              format="percentage"
              color={reportData.performanceMetrics?.targetAchievement >= 100 ? '#2ecc71' : '#f39c12'}
            />
            <PerformanceMetric
              label="Taux de Croissance"
              value={reportData.performanceMetrics?.growthRate}
              format="percentage"
              color="#3498db"
            />
            <PerformanceMetric
              label="Fidélisation Clients"
              value={reportData.performanceMetrics?.customerRetention}
              format="percentage"
              color="#9b59b6"
            />
            <PerformanceMetric
              label="Nouveaux Clients"
              value={reportData.performanceMetrics?.newCustomers}
              format="number"
              color="#e67e22"
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Top clients */}
        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>🏆 Top Clients</h3>
          <TopCustomersList customers={reportData.topCustomers} />
        </div>

        {/* Analyse des performances */}
        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>📋 Analyse des Performances</h3>
          <PerformanceAnalysis data={reportData} />
        </div>
      </div>

      {/* Actions de reporting */}
      <div style={{
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginTop: '30px'
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>📄 Exports & Rapports</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <ReportActionButton
            icon="📊"
            label="Rapport Détaillé"
            description="Export PDF complet"
            onClick={() => console.log('Générer rapport détaillé')}
          />
          <ReportActionButton
            icon="💼"
            label="Performance Commercial"
            description="Analyse par commercial"
            onClick={() => console.log('Performance commercial')}
          />
          <ReportActionButton
            icon="👥"
            label="Analyse Client"
            description="Segmentations clients"
            onClick={() => console.log('Analyse client')}
          />
          <ReportActionButton
            icon="📦"
            label="Performance Produits"
            description="Top produits et marges"
            onClick={() => console.log('Performance produits')}
          />
        </div>
      </div>
    </div>
  );
};

// Composant de carte métrique
const MetricCard = ({ title, value, format, color, icon }) => {
  const formatValue = (val, fmt) => {
    if (!val) return '0';
    switch (fmt) {
      case 'currency':
        return `${val.toLocaleString()} MAD`;
      case 'percentage':
        return `${val}%`;
      case 'number':
        return val.toLocaleString();
      default:
        return val;
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '24px', marginBottom: '10px' }}>{icon}</div>
      <h3 style={{ color: '#2c3e50', margin: '0 0 10px 0', fontSize: '14px' }}>{title}</h3>
      <div style={{ fontSize: '24px', fontWeight: 'bold', color: color }}>
        {formatValue(value, format)}
      </div>
    </div>
  );
};

// Composant graphique de tendance (simplifié)
const SalesTrendChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ 
        height: '200px', 
        backgroundColor: '#f8f9fa', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderRadius: '5px'
      }}>
        <p style={{ color: '#7f8c8d' }}>Graphique des tendances de vente</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => Math.max(d.revenue, d.target))) * 1.1;
  
  return (
    <div style={{ height: '250px', position: 'relative' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'end', 
        justifyContent: 'space-around', 
        height: '200px',
        padding: '0 20px',
        borderBottom: '2px solid #ecf0f1'
      }}>
        {data.map((item, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'end', height: '150px', gap: '3px' }}>
              <div
                style={{
                  height: `${(item.revenue / maxValue) * 100}%`,
                  width: '15px',
                  backgroundColor: '#3498db',
                  borderRadius: '3px 3px 0 0'
                }}
                title={`Réel: ${item.revenue.toLocaleString()} MAD`}
              />
              <div
                style={{
                  height: `${(item.target / maxValue) * 100}%`,
                  width: '15px',
                  backgroundColor: '#e74c3c',
                  borderRadius: '3px 3px 0 0',
                  opacity: 0.7
                }}
                title={`Objectif: ${item.target.toLocaleString()} MAD`}
              />
            </div>
            <div style={{ marginTop: '8px', fontSize: '12px', fontWeight: 'bold' }}>{item.month}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#3498db', borderRadius: '2px' }}></div>
          <span style={{ fontSize: '12px' }}>Réalisé</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#e74c3c', borderRadius: '2px', opacity: 0.7 }}></div>
          <span style={{ fontSize: '12px' }}>Objectif</span>
        </div>
      </div>
    </div>
  );
};

// Composant métrique de performance
const PerformanceMetric = ({ label, value, format, color }) => {
  const formatValue = (val, fmt) => {
    if (!val) return '0';
    switch (fmt) {
      case 'percentage':
        return `${val}%`;
      case 'currency':
        return `${val.toLocaleString()} MAD`;
      default:
        return val;
    }
  };

  return (
    <div style={{
      padding: '15px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      borderLeft: `4px solid ${color}`
    }}>
      <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '5px' }}>{label}</div>
      <div style={{ fontSize: '18px', fontWeight: 'bold', color: color }}>
        {formatValue(value, format)}
      </div>
    </div>
  );
};

// Composant liste des top clients
const TopCustomersList = ({ customers }) => {
  if (!customers || customers.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>
        Aucune donnée client disponible
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '10px' }}>
      {customers.map((customer, index) => (
        <div key={customer.id} style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '24px',
              height: '24px',
              backgroundColor: index === 0 ? '#f39c12' : index === 1 ? '#95a5a6' : '#d35400',
              color: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {index + 1}
            </div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{customer.name}</div>
              <div style={{ fontSize: '12px', color: '#7f8c8d' }}>{customer.orders} commandes</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 'bold', color: '#2ecc71' }}>{customer.revenue.toLocaleString()} MAD</div>
            <div style={{ fontSize: '12px', color: '#7f8c8d' }}>CA</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Composant analyse des performances
const PerformanceAnalysis = ({ data }) => {
  const getPerformanceLevel = (achievement) => {
    if (achievement >= 100) return { label: 'Excellent', color: '#2ecc71' };
    if (achievement >= 80) return { label: 'Bon', color: '#3498db' };
    if (achievement >= 60) return { label: 'Satisfaisant', color: '#f39c12' };
    return { label: 'À améliorer', color: '#e74c3c' };
  };

  const performance = getPerformanceLevel(data.performanceMetrics?.targetAchievement);

  return (
    <div style={{ display: 'grid', gap: '15px' }}>
      <div style={{
        padding: '15px',
        backgroundColor: performance.color,
        color: 'white',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '14px', marginBottom: '5px' }}>Niveau de Performance</div>
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{performance.label}</div>
      </div>
      
      <div style={{ display: 'grid', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span>Période analysée:</span>
          <span style={{ fontWeight: 'bold' }}>{data.salesTrend?.length || 0} mois</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span>Clients actifs:</span>
          <span style={{ fontWeight: 'bold' }}>{data.topCustomers?.length || 0}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span>Tendance:</span>
          <span style={{ 
            fontWeight: 'bold', 
            color: (data.performanceMetrics?.growthRate || 0) >= 0 ? '#2ecc71' : '#e74c3c' 
          }}>
            {(data.performanceMetrics?.growthRate || 0) >= 0 ? '↗' : '↘'} 
            {Math.abs(data.performanceMetrics?.growthRate || 0)}%
          </span>
        </div>
      </div>
      
      <div style={{ 
        padding: '12px', 
        backgroundColor: '#fff3cd', 
        border: '1px solid #ffeaa7',
        borderRadius: '6px',
        fontSize: '12px',
        color: '#856404'
      }}>
        💡 <strong>Recommandation:</strong> {performance.label === 'À améliorer' 
          ? 'Focus sur la fidélisation client et développement de nouveaux prospects' 
          : 'Maintenir l\'effort et optimiser les processus'}
      </div>
    </div>
  );
};

// Composant bouton d'action de rapport
const ReportActionButton = ({ icon, label, description, onClick }) => (
  <button 
    onClick={onClick}
    style={{
      padding: '15px',
      backgroundColor: 'white',
      border: '2px solid #ecf0f1',
      borderRadius: '8px',
      cursor: 'pointer',
      textAlign: 'left',
      transition: 'all 0.3s ease',
      ':hover': {
        borderColor: '#3498db'
      }
    }}
    onMouseOver={(e) => {
      e.target.style.borderColor = '#3498db';
      e.target.style.transform = 'translateY(-2px)';
    }}
    onMouseOut={(e) => {
      e.target.style.borderColor = '#ecf0f1';
      e.target.style.transform = 'translateY(0)';
    }}
  >
    <div style={{ fontSize: '20px', marginBottom: '8px' }}>{icon}</div>
    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{label}</div>
    <div style={{ fontSize: '12px', color: '#7f8c8d' }}>{description}</div>
  </button>
);

export default SalesReporting;