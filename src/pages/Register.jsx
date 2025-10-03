// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    isActive: true
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar errores al escribir
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    if (!formData.name.trim()) {
      setError("El nombre completo es requerido");
      setLoading(false);
      return;
    }

    if (!formData.username.trim()) {
      setError("El nombre de usuario es requerido");
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError("El correo electrónico es requerido");
      setLoading(false);
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("El formato del correo electrónico no es válido");
      setLoading(false);
      return;
    }

    try {
      // Preparar datos exactamente como espera el modelo
      const userData = {
        name: formData.name.trim(),
        username: formData.username.trim().toLowerCase(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim() || undefined,
        address: formData.address.trim() || undefined,
        isActive: true
      };

      const result = await register(userData);
      
      if (result.success) {
        setSuccess("¡Registro exitoso! Redirigiendo al dashboard...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        setError(result.error || "Error al registrar usuario");
      }
    } catch (error) {
      console.error('Error en registro:', error);
      setError("Error al registrar usuario. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-background">
        <div className="background-overlay"></div>
      </div>
      
      <div className="register-content">
        {/* Logo y Header */}
        <div className="register-header">
          <div className="register-logo">
            <span className="logo-icon">🏛️</span>
            <div className="logo-text">
              <h1 className="logo-title">Biblioteca Nacional</h1>
              <p className="logo-subtitle">Sistema de Gestión</p>
            </div>
          </div>
        </div>

        {/* Card de Registro */}
        <div className="register-card">
          <div className="card-header">
            <h2 className="card-title">Crear Cuenta</h2>
            <p className="card-subtitle">Únete a nuestra comunidad de lectores</p>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              <span className="success-icon">✅</span>
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  <span className="label-icon">👤</span>
                  Nombre completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Ingresa tu nombre completo"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  <span className="label-icon">🆔</span>
                  Nombre de usuario *
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Elige un nombre de usuario"
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <span className="label-icon">✉️</span>
                Correo electrónico *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="tu@email.com"
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <span className="label-icon">🔒</span>
                  Contraseña *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Mínimo 6 caracteres"
                  disabled={loading}
                />
                <div className="password-hint">
                  La contraseña debe tener al menos 6 caracteres
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  <span className="label-icon">🔒</span>
                  Confirmar contraseña *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Repite tu contraseña"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  <span className="label-icon">📞</span>
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Ej: +57 300 123 4567"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="address" className="form-label">
                  <span className="label-icon">📍</span>
                  Dirección
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Ingresa tu dirección completa"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-terms">
              <div className="terms-checkbox">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms" className="terms-label">
                  Acepto los <a href="/terminos" className="terms-link">términos y condiciones</a> y la <a href="/privacidad" className="terms-link">política de privacidad</a>
                </label>
              </div>
            </div>
            
            <button 
              type="submit" 
              className={`register-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="button-spinner"></div>
                  Creando cuenta...
                </>
              ) : (
                <>
                  <span className="button-icon">📝</span>
                  Crear cuenta
                </>
              )}
            </button>
          </form>

          {/* Links de navegación */}
          <div className="register-links">
            <div className="links-section">
              <p className="login-redirect">
                ¿Ya tienes cuenta? <Link to="/login" className="link primary">
                  <span className="link-icon">🚪</span>
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
            
            <div className="register-footer">
              <p className="footer-text">
                Al registrarte, aceptas formar parte de nuestra comunidad bibliotecaria
              </p>
            </div>
          </div>
        </div>

        {/* Footer decorativo */}
        <div className="register-page-footer">
          <p>&copy; 2024 Biblioteca Nacional. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;