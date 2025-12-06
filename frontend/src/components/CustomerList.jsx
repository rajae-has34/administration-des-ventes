import React, { useState, useEffect } from 'react';
import { customerService } from '../services/api';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await customerService.getAll();
      console.log('Données reçues:', response.data);
      
      const customersData = response.data.results || response.data;
      setCustomers(customersData);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (customerId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      try {
        await customerService.delete(customerId);
        fetchCustomers();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  if (loading) {
    return <div>Chargement des clients...</div>;
  }

  return (
    <div>
      <h2>Liste des Clients</h2>
      
      <button onClick={fetchCustomers} style={{marginBottom: '20px', padding: '10px'}}>
        Actualiser la liste
      </button>

      <div style={{display: 'grid', gap: '15px'}}>
        {customers.map(customer => (
          <div key={customer.customer_id} style={{
            border: '1px solid #ddd', 
            padding: '15px', 
            borderRadius: '5px',
            backgroundColor: '#f9f9f9'
          }}>
            <h3>{customer.name}</h3>
            <p><strong>Email:</strong> {customer.email}</p>
            <p><strong>Téléphone:</strong> {customer.phone || 'Non renseigné'}</p>
            <p><strong>Adresse:</strong> {customer.address || 'Non renseignée'}</p>
            
            <button 
              onClick={() => handleDelete(customer.customer_id)}
              style={{
                backgroundColor: 'red', 
                color: 'white', 
                border: 'none',
                padding: '5px 10px',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              Supprimer
            </button>
          </div>
        ))}
        
        {customers.length === 0 && (
          <p>Aucun client trouvé. Créez votre premier client !</p>
        )}
      </div>
    </div>
  );
};

export default CustomerList;