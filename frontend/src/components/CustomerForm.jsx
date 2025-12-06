import React, { useState } from 'react';
import { customerService } from '../services/api';

const CustomerForm = ({ onCustomerAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await customerService.create(formData);
      alert('Client créé avec succès !');
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: ''
      });
      
      if (onCustomerAdded) {
        onCustomerAdded();
      }
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert('Erreur lors de la création du client');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      marginBottom: '30px', 
      padding: '20px', 
      border: '1px solid #ccc',
      borderRadius: '5px'
    }}>
      <h3>Nouveau Client</h3>
      
      <div style={{marginBottom: '10px'}}>
        <input
          type="text"
          name="name"
          placeholder="Nom du client"
          value={formData.name}
          onChange={handleChange}
          required
          style={{width: '100%', padding: '8px'}}
        />
      </div>
      
      <div style={{marginBottom: '10px'}}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{width: '100%', padding: '8px'}}
        />
      </div>
      
      <div style={{marginBottom: '10px'}}>
        <input
          type="text"
          name="phone"
          placeholder="Téléphone"
          value={formData.phone}
          onChange={handleChange}
          style={{width: '100%', padding: '8px'}}
        />
      </div>
      
      <div style={{marginBottom: '10px'}}>
        <textarea
          name="address"
          placeholder="Adresse"
          value={formData.address}
          onChange={handleChange}
          style={{width: '100%', padding: '8px', height: '60px'}}
        />
      </div>
      
      <button type="submit" style={{
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer'
      }}>
        Créer le client
      </button>
    </form>
  );
};

export default CustomerForm;