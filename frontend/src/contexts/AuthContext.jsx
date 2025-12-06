import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const getPermissionsByJobTitle = (jobTitle) => {
  const permissionsMap = {
    'commercial': [
      'view_dashboard', 'view_clients', 'manage_clients', 'validate_clients_commercial',
      'view_commandes', 'manage_commandes', 'validate_commandes', 'view_contrats', 
      'manage_contrats', 'view_devis', 'manage_devis', 'view_prospection'
    ],
    'financier': [
      'view_dashboard', 'view_clients', 'validate_clients_financier', 'view_commandes',
      'view_factures', 'manage_factures', 'view_recouvrement', 'manage_recouvrement',
      'view_rapports_financiers'
    ],
    'directeur': [
      'view_dashboard', 'view_analytics', 'view_clients', 'manage_clients', 
      'validate_clients_commercial', 'validate_clients_financier', 'view_commandes', 
      'manage_commandes', 'validate_commandes', 'view_contrats', 'manage_contrats',
      'view_tarification', 'manage_tarification', 'view_recouvrement', 'manage_recouvrement',
      'view_rapports', 'manage_rapports'
    ],
    'gestionnaire': [
      'view_dashboard', 'view_commandes', 'manage_livraisons', 'view_stocks', 
      'manage_stocks', 'view_expeditions'
    ]
  };
  
  return permissionsMap[jobTitle?.toLowerCase()] || ['view_dashboard'];
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    const storedUserType = localStorage.getItem('userType');
    
    if (token && userData && storedUserType) {
      try {
        const userObj = JSON.parse(userData);
        setUser(userObj);
        setUserType(storedUserType);
        
        // Définir les permissions selon le job_title
        const userPermissions = getPermissionsByJobTitle(userObj.job_title);
        setPermissions(userPermissions);
      } catch (error) {
        console.error('Error parsing user data:', error);
        logout();
      }
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    try {
      // Simulation de connexion - À remplacer par votre API
      let userData, userType;
      
      // Employés de test
      if (credentials.email === 'commercial@adv.com' && credentials.password === 'demo123') {
        userData = {
          id: 1,
          email: 'commercial@adv.com',
          first_name: 'Jean',
          last_name: 'Commercial',
          job_title: 'commercial',
          department: 'Commercial',
          phone: '+212 600-000000'
        };
        userType = 'employee';
      }
      else if (credentials.email === 'financier@adv.com' && credentials.password === 'demo123') {
        userData = {
          id: 2,
          email: 'financier@adv.com',
          first_name: 'Marie',
          last_name: 'Financier',
          job_title: 'financier',
          department: 'Financier',
          phone: '+212 600-000001'
        };
        userType = 'employee';
      }
      // Clients de test
      else if (credentials.email === 'client@example.com' && credentials.password === 'demo123') {
        userData = {
          id: 101,
          email: 'client@example.com',
          name: 'SARL Client Example',
          phone: '+212 600-000002',
          address: 'Casablanca, Maroc'
        };
        userType = 'customer';
      }
      else {
        throw new Error('Identifiants incorrects');
      }
      
      // Stocker les données
      localStorage.setItem('authToken', 'mock-token-123');
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('userType', userType);
      
      // Mettre à jour le state
      setUser(userData);
      setUserType(userType);
      
      if (userType === 'employee') {
        const userPermissions = getPermissionsByJobTitle(userData.job_title);
        setPermissions(userPermissions);
      } else {
        setPermissions(['view_orders', 'view_invoices', 'view_deliveries']);
      }
      
      return { success: true, userType };
    } catch (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userType');
    setUser(null);
    setUserType(null);
    setPermissions([]);
  };

  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  const value = {
    user,
    userType,
    loading,
    permissions,
    login,
    logout,
    hasPermission,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};