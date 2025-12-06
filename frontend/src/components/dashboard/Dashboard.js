import React, { useState, useEffect } from 'react';
import { customerService, productService, salesOrderService } from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0
  });
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [customersRes, productsRes, ordersRes] = await Promise.all([
        customerService.getAll(),
        productService.getAll(),
        salesOrderService.getAll()
      ]);

      const customers = customersRes.data.results || customersRes.data;
      const products = productsRes.data.results || productsRes.data;
      const orders = ordersRes.data.results || ordersRes.data;

      setStats({
        totalCustomers: customers.length,
        totalProducts: products.length,
        totalOrders: orders.length,
        pendingOrders: orders.filter(order => order.status === 'pending').length
      });

      setRecentCustomers(customers.slice(0, 5));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Tableau de Bord</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Clients</h3>
          <p className="stat-number">{stats.totalCustomers}</p>
        </div>
        <div className="stat-card">
          <h3>Total Produits</h3>
          <p className="stat-number">{stats.totalProducts}</p>
        </div>
        <div className="stat-card">
          <h3>Commandes Total</h3>
          <p className="stat-number">{stats.totalOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Commandes en Attente</h3>
          <p className="stat-number">{stats.pendingOrders}</p>
        </div>
      </div>

      <div className="recent-section">
        <h2>Clients Récents</h2>
        <div className="recent-list">
          {recentCustomers.map(customer => (
            <div key={customer.customer_id} className="recent-item">
              <span>{customer.name}</span>
              <span className="email">{customer.email}</span>
            </div>
          ))}
          {recentCustomers.length === 0 && (
            <p>Aucun client trouvé</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;