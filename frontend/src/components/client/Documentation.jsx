import React, { useState } from 'react';

const Documentation = () => {
  const [activeCategory, setActiveCategory] = useState('technical');

  const documents = {
    technical: [
      { id: 1, name: 'Fiche technique Produit A', type: 'PDF', size: '2.4 MB', date: '2024-10-15' },
      { id: 2, name: 'Fiche technique Produit B', type: 'PDF', size: '1.8 MB', date: '2024-10-10' },
      { id: 3, name: 'Guide d\'utilisation', type: 'PDF', size: '3.2 MB', date: '2024-09-20' }
    ],
    safety: [
      { id: 4, name: 'Fiche de sécurité Produit A', type: 'PDF', size: '1.2 MB', date: '2024-11-01' },
      { id: 5, name: 'Procédures de sécurité', type: 'PDF', size: '2.1 MB', date: '2024-10-25' }
    ],
    commercial: [
      { id: 6, name: 'Catalogue produits 2024', type: 'PDF', size: '5.6 MB', date: '2024-01-15' },
      { id: 7, name: 'Conditions générales de vente', type: 'PDF', size: '0.8 MB', date: '2024-11-01' }
    ]
  };

  const downloadDocument = (doc) => {
    // Simulation de téléchargement
    alert(`Téléchargement: ${doc.name}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '30px' }}>📚 Documentation</h1>

      {/* Catégories */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '15px',
        marginBottom: '30px'
      }}>
        {[
          { id: 'technical', label: '📋 Fiches Techniques', count: documents.technical.length, color: '#3498db' },
          { id: 'safety', label: '🛡️ Sécurité', count: documents.safety.length, color: '#e74c3c' },
          { id: 'commercial', label: '📊 Commercial', count: documents.commercial.length, color: '#2ecc71' }
        ].map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            style={{
              padding: '20px',
              backgroundColor: activeCategory === category.id ? category.color : 'white',
              color: activeCategory === category.id ? 'white' : '#2c3e50',
              border: `2px solid ${category.color}`,
              borderRadius: '10px',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>
              {category.label.split(' ')[0]}
            </div>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
              {category.label}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '5px' }}>
              {category.count} document(s)
            </div>
          </button>
        ))}
      </div>

      {/* Liste des documents */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#2c3e50', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0 }}>
            {activeCategory === 'technical' && '📋 Fiches Techniques'}
            {activeCategory === 'safety' && '🛡️ Documents de Sécurité'}
            {activeCategory === 'commercial' && '📊 Documents Commerciaux'}
          </h3>
          <span style={{ 
            backgroundColor: '#3498db', 
            padding: '4px 8px', 
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            {documents[activeCategory].length} document(s)
          </span>
        </div>

        <div style={{ padding: '20px' }}>
          {documents[activeCategory].map(doc => (
            <div key={doc.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              marginBottom: '10px',
              border: '1px solid #e9ecef'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  borderRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  PDF
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>
                    {doc.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                    {doc.size} • Mis à jour le {new Date(doc.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => downloadDocument(doc)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                ⬇️ Télécharger
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Information */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '8px',
        color: '#856404'
      }}>
        <strong>💡 Information :</strong> Tous les documents sont au format PDF. 
        Contactez votre commercial pour toute documentation supplémentaire.
      </div>
    </div>
  );
};

export default Documentation;