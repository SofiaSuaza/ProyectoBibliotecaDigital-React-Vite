// src/services/authService.js
import apiService from './apiService';

// Servicios de autenticación
export const authService = {
  // Registro de usuario
  register: async (userData) => {
    try {
      const response = await apiService.post('/api/auth/register', userData);
      
      // NO guardar token - usamos sesiones con cookies
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Login de usuario
  login: async (credentials) => {
    try {
      console.log('Enviando credenciales:', credentials);
      const response = await apiService.post('/api/auth/login', credentials);
      console.log('Respuesta del servidor:', response);
      
      // Verificar si la respuesta tiene la estructura correcta
      if (response.success && response.data) {
        // apiService ya normalizó la respuesta, extraer el user
        return {
          success: true,
          user: response.data,
          message: response.message
        };
      }
      
      // Si no hay success, retornar error
      return {
        success: false,
        error: response.error || 'Error en login'
      };
      
    } catch (error) {
      console.log('Error detallado:', error);
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await apiService.post('/api/auth/logout');
      // Solo limpiar usuario, NO hay token
      localStorage.removeItem('currentUser');
    } catch (error) {
      // Limpiar datos locales aunque falle la llamada al servidor
      localStorage.removeItem('currentUser');
      throw error;
    }
  },

  // Solicitar restablecimiento de contraseña
  forgotPassword: async (email) => {
    try {
      const response = await apiService.post('/api/auth/forgot-password', { email });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Restablecer contraseña
  resetPassword: async (email, code, newPassword) => {
    try {
      const response = await apiService.post('/api/auth/reset-password', {
        email,
        code,
        newPassword
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Verificar si hay una sesión activa (solo verifica localStorage)
  isAuthenticated: () => {
    const user = localStorage.getItem('currentUser');
    return !!user;
  }
};

export default authService;