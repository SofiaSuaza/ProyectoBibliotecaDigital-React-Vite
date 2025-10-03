// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Verificar sesión al inicializar
  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Error parsing stored user:", error);
          localStorage.removeItem('currentUser');
        }
      }
    };

    initializeAuth();

    // Verificar sesión cada 5 minutos
    const interval = setInterval(initializeAuth, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authService.login(credentials);
      console.log('Respuesta en AuthContext:', response);
      
      // Verificar si el login fue exitoso
      if (response && response.user) {
        setUser(response.user);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        setSuccess('Login exitoso');
        return { success: true, user: response.user };
      }
      
      // Si llegamos aquí, el login falló
      const errorMsg = response?.message || 'Credenciales inválidas';
      setError(errorMsg);
      return { success: false, error: errorMsg };
      
    } catch (error) {
      console.error('Error en login:', error);
      const errorMsg = error.message || 'Error al iniciar sesión';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('currentUser');
      // También eliminar cualquier token residual si existe
      localStorage.removeItem('authToken');
    }
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const requestPasswordReset = async (email) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authService.forgotPassword(email);
      setSuccess(response.message || 'Código de restablecimiento enviado');
      return { success: true, resetCode: response.resetCode }; // Solo para testing
    } catch (error) {
      console.error('Error en requestPasswordReset:', error);
      setError(error.message || 'Error al enviar el código de recuperación');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email, code, newPassword) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authService.resetPassword(email, code, newPassword);
      setSuccess(response.message || 'Contraseña restablecida exitosamente');
      return { success: true };
    } catch (error) {
      console.error('Error en resetPassword:', error);
      setError(error.message || 'Error al restablecer la contraseña');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authService.register(userData);
      
      if (response.user) {
        setUser(response.user);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        setSuccess('Usuario registrado exitosamente');
        return { success: true, user: response.user };
      }
    } catch (error) {
      console.error('Error en registro:', error);
      setError(error.message || 'Error al registrar usuario');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    loading,
    error,
    success,
    requestPasswordReset,
    resetPassword,
    clearMessages
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};