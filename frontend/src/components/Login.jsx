import React, { useState } from 'react';
import { authService } from '../services/auth';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authService.login(email);
      
      if (result.success) {
        if (onLogin) {
          onLogin();
        }
      } else {
        setError(result.error || 'Email non trouvé dans le système');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{ 
        width: '100%',
        maxWidth: '450px', 
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '15px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#2c3e50', marginBottom: '10px', fontSize: '28px' }}>
            Connexion
          </h1>
          <p style={{ color: '#7f8c8d', fontSize: '16px' }}>
            Entrez votre email pour vous connecter
          </p>
        </div>
        
        {error && (
          <div style={{ 
            color: 'white', 
            backgroundColor: '#e74c3c',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '30px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: '600',
              color: '#2c3e50',
              fontSize: '14px'
            }}>
              Adresse Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '14px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'border-color 0.3s'
              }}
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: loading ? '#bdc3c7' : '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              transition: 'background-color 0.3s'
            }}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter avec Email'}
          </button>
        </form>

        <div style={{ 
          marginTop: '30px', 
          textAlign: 'center',
          color: '#95a5a6',
          fontSize: '14px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <h4 style={{ color: '#2c3e50', marginBottom: '15px' }}>Accès par email :</h4>
          <div style={{ display: 'grid', gap: '10px', fontSize: '13px', textAlign: 'left' }}>
            <div>🔐 <strong>Administrateurs :</strong> Utilisateurs Django</div>
            <div>👨‍💼 <strong>Employés :</strong> Commercial, Financier, etc.</div>
            <div>👥 <strong>Clients :</strong> Clients de l'entreprise</div>
            <div style={{ marginTop: '10px', fontStyle: 'italic', textAlign: 'center' }}>
              Aucun mot de passe requis
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;