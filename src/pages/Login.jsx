// src/pages/Login.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login({ username, password });
      
      // Si recibimos usuario en el resultado, navegamos al dashboard
      if (result && result.success && result.user) {
        navigate("/dashboard");
        return;
      }
      
      setError("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
    } catch (error) {
      console.error('Error en login:', error);
      setError("Error al iniciar sesión. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="background-overlay"></div>
      </div>
      
      <div className="login-content">
        {/* Logo y Header */}
        <div className="login-header">
          <div className="login-logo">
            <span className="logo-icon">🏛️</span>
            <div className="logo-text">
              <h1 className="logo-title">Biblioteca Nacional</h1>
              <p className="logo-subtitle">Sistema de Gestión</p>
            </div>
          </div>
        </div>

        {/* Card de Login */}
        <div className="login-card">
          <div className="card-header">
            <h2 className="card-title">Acceso al Sistema</h2>
            <p className="card-subtitle">Ingresa tus credenciales para continuar</p>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                <span className="label-icon">👤</span>
                Nombre de usuario
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                placeholder="Ingresa tu nombre de usuario"
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <span className="label-icon">🔒</span>
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="Ingresa tu contraseña"
                disabled={loading}
              />
            </div>
            
            <button 
              type="submit" 
              className={`login-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="button-spinner"></div>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <span className="button-icon">🚪</span>
                  Iniciar sesión
                </>
              )}
            </button>
          </form>

          {/* Links de ayuda */}
          <div className="login-links">
            <div className="links-section">
              <Link to="/register" className="link primary">
                <span className="link-icon">📝</span>
                Crear nueva cuenta
              </Link>
              <Link to="/forgot-password" className="link secondary">
                <span className="link-icon">🔑</span>
                Recuperar contraseña
              </Link>
            </div>
            
            <div className="login-footer">
              <p className="footer-text">
                ¿Necesitas ayuda? <a href="mailto:soporte@bibliotecanacional.gov" className="help-link">Contactar soporte</a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer decorativo */}
        <div className="login-page-footer">
          <p>&copy; 2024 Biblioteca Nacional. Sistema de gestión bibliotecaria.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;