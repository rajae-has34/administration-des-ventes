import axios from 'axios';
import { userService, customerService, employeeService } from './api';

const API_BASE_URL = 'http://localhost:8000/api';

const authApi = axios.create({
  baseURL: API_BASE_URL,
});

export const authService = {
  // Connexion sans mot de passe - juste avec l'email
  login: async (email) => {
    try {
      console.log('🔐 Tentative de connexion avec:', email);

      // 1. Vérifier si l'email existe dans les utilisateurs Django (auth_user)
      try {
        console.log('🔍 Recherche dans les utilisateurs Django...');
        const usersResponse = await userService.getAll();
        const users = usersResponse.data.results || usersResponse.data;
        console.log('👥 Utilisateurs trouvés:', users.length);
        
        const djangoUser = users.find(user => user.email === email);
        
        if (djangoUser) {
          console.log('✅ Utilisateur Django trouvé:', djangoUser);
          localStorage.setItem('user_email', email);
          localStorage.setItem('user_role', 'admin');
          localStorage.setItem('user_name', djangoUser.username || 'Administrateur');
          return { success: true, user: djangoUser };
        }
      } catch (error) {
        console.log('❌ Endpoint users non disponible:', error.message);
      }

      // 2. Vérifier si l'email existe dans les clients
      try {
        console.log('🔍 Recherche dans les clients...');
        const customersResponse = await customerService.getAll();
        const customers = customersResponse.data.results || customersResponse.data;
        console.log('👥 Clients trouvés:', customers.length);
        
        const customer = customers.find(cust => cust.email === email);
        
        if (customer) {
          console.log('✅ Client trouvé:', customer);
          localStorage.setItem('user_email', email);
          localStorage.setItem('user_role', 'client');
          localStorage.setItem('user_name', customer.name);
          return { success: true, user: customer };
        }
      } catch (error) {
        console.log('❌ Endpoint customers erreur:', error.message);
      }

      // 3. Vérifier si l'email existe dans les employés
      try {
        console.log('🔍 Recherche dans les employés...');
        const employeesResponse = await employeeService.getAll();
        const employees = employeesResponse.data.results || employeesResponse.data;
        console.log('👥 Employés trouvés:', employees.length);
        
        const employee = employees.find(emp => emp.email === email);
        
        if (employee) {
          console.log('✅ Employé trouvé:', employee);
          localStorage.setItem('user_email', email);
          localStorage.setItem('user_name', `${employee.first_name} ${employee.last_name}`);
          
          // Déterminer le rôle selon le job_title
          let role = 'employee';
          if (employee.job_title?.toLowerCase().includes('commercial')) {
            role = 'commercial';
          } else if (employee.job_title?.toLowerCase().includes('financier') || 
                     employee.job_title?.toLowerCase().includes('finance') ||
                     employee.department?.toLowerCase().includes('finance')) {
            role = 'financier';
          }
          
          localStorage.setItem('user_role', role);
          return { success: true, user: employee };
        }
      } catch (error) {
        console.log('❌ Endpoint employees erreur:', error.message);
      }

      // Si l'email n'existe nulle part
      console.log('❌ Email non trouvé dans le système');
      return { success: false, error: 'Email non trouvé dans le système' };

    } catch (error) {
      console.error('❌ Erreur lors de la connexion:', error);
      return { success: false, error: 'Erreur de connexion au serveur' };
    }
  },

  // Déconnexion
  logout: () => {
    console.log('🚪 Déconnexion');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    const isAuth = !!localStorage.getItem('user_email');
    console.log('🔐 isAuthenticated:', isAuth);
    return isAuth;
  },

  // Récupérer les informations de l'utilisateur connecté
  getCurrentUser: () => {
    const user = {
      email: localStorage.getItem('user_email'),
      role: localStorage.getItem('user_role'),
      name: localStorage.getItem('user_name')
    };
    console.log('👤 getCurrentUser:', user);
    return user;
  },

  // Vérifier les permissions
  hasRole: (role) => {
    const userRole = localStorage.getItem('user_role');
    const hasRole = userRole === role;
    console.log(`🎯 hasRole(${role}):`, hasRole);
    return hasRole;
  },

  // Vérifier si l'utilisateur a un des rôles
  hasAnyRole: (roles) => {
    const userRole = localStorage.getItem('user_role');
    const hasAny = roles.includes(userRole);
    console.log(`🎯 hasAnyRole(${roles}):`, hasAny);
    return hasAny;
  },

  // Rafraîchir le token (si tu utilises JWT)
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const response = await authApi.post('/token/refresh/', {
        refresh: refreshToken,
      });

      localStorage.setItem('access_token', response.data.access);
      return { success: true, access: response.data.access };
    } catch (error) {
      console.error('❌ Erreur rafraîchissement token:', error);
      this.logout();
      return { success: false, error: 'Impossible de rafraîchir le token' };
    }
  }
};

export default authApi;