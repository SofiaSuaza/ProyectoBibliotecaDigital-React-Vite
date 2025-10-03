// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import MessageAlert from "../components/Common/MessageAlert";
import { validateEmail } from "../utils/validators";
import { emailExists } from "../utils/userHelpers";
import EmailJSConfig from "../components/EmailJSConfig";
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showConfig, setShowConfig] = useState(false);
  const [isEmailJSConfigured, setIsEmailJSConfigured] = useState(false);
  const { loading, error, success, requestPasswordReset, clearMessages } = useAuth();

  // Verificar si EmailJS está configurado
  React.useEffect(() => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    const configured = serviceId && templateId && publicKey &&
                      serviceId !== 'tu-service-id' &&
                      templateId !== 'tu-template-id' &&
                      publicKey !== 'tu-public-key';

    setIsEmailJSConfigured(configured);
  }, []);

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    // Limpiar errores previos
    setEmailError("");
    clearMessages();

    // Validar email en tiempo real
    if (newEmail && !validateEmail(newEmail).isValid) {
      setEmailError(validateEmail(newEmail).message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Limpiar mensajes previos
    setEmailError("");
    clearMessages();

    // Validar email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.message);
      return;
    }

    // Verificar si el email existe antes de proceder
    if (!emailExists(email)) {
      setEmailError("No existe una cuenta asociada a este correo electrónico. ¿Necesitas registrarte?");
      return;
    }

    try {
      await requestPasswordReset(email);
    } catch (err) {
      // Error ya manejado en el hook
      console.error('Error en recuperación de contraseña:', err);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-background">
        <div className="background-overlay"></div>
      </div>
      
      <div className="forgot-password-content">
        {/* Logo y Header */}
        <div className="forgot-password-header">
          <div className="header-logo">
            <span className="logo-icon">🏛️</span>
            <div className="logo-text">
              <h1 className="logo-title">Biblioteca Nacional</h1>
              <p className="logo-subtitle">Recuperación de Acceso</p>
            </div>
          </div>
        </div>

        {/* Card Principal */}
        <div className="forgot-password-card">
          <div className="card-header">
            <div className="card-icon">🔐</div>
            <h2 className="card-title">Recuperar Contraseña</h2>
            <p className="card-subtitle">
              Ingresa tu correo electrónico y te enviaremos un código para restablecer tu contraseña.
            </p>
          </div>

          {/* Advertencia de EmailJS */}
          {!isEmailJSConfigured && (
            <div className="emailjs-warning">
              <div className="warning-content">
                <span className="warning-icon">⚠️</span>
                <div className="warning-text">
                  <strong>Sistema de correo no configurado</strong>
                  <span>Se usará modo simulación para el envío de códigos.</span>
                </div>
              </div>
              <button
                type="button"
                className="config-toggle-btn"
                onClick={() => setShowConfig(!showConfig)}
              >
                {showConfig ? 'Ocultar Configuración' : 'Configurar Email'}
              </button>
            </div>
          )}

          {showConfig && (
            <div className="config-section">
              <EmailJSConfig
                onConfigComplete={(configured) => {
                  setIsEmailJSConfigured(configured);
                  if (configured) {
                    setShowConfig(false);
                  }
                }}
              />
            </div>
          )}

          {/* Mensajes del Sistema */}
          <div className="messages-container">
            <MessageAlert type="error" message={error} onClose={clearMessages} />
            <MessageAlert type="success" message={success} onClose={clearMessages} />
            <MessageAlert type="error" message={emailError} />
          </div>

          {/* Formulario */}
          <form className="forgot-password-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <span className="label-icon">✉️</span>
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={email}
                onChange={handleEmailChange}
                placeholder="Ingresa tu correo electrónico registrado"
                disabled={loading}
                className="form-input"
              />
              <div className="form-hint">
                Te enviaremos un código de verificación a este correo
              </div>
            </div>

            <button
              type="submit"
              className={`submit-button ${loading ? 'loading' : ''}`}
              disabled={loading || !email || emailError}
            >
              {loading ? (
                <>
                  <LoadingSpinner small />
                  <span>Enviando código...</span>
                </>
              ) : (
                <>
                  <span className="button-icon">📧</span>
                  <span>Enviar Código de Recuperación</span>
                </>
              )}
            </button>
          </form>

          {/* Links de Navegación */}
          <div className="forgot-password-links">
            <div className="links-section">
              <Link to="/reset-password" className="link primary">
                <span className="link-icon">🔑</span>
                Ya tengo un código de recuperación
              </Link>
              <Link to="/login" className="link secondary">
                <span className="link-icon">←</span>
                Volver al inicio de sesión
              </Link>
            </div>
            
            <div className="help-section">
              <p className="help-text">
                ¿Problemas para recuperar tu cuenta? 
                <a href="mailto:soporte@bibliotecanacional.gov" className="help-link"> Contactar soporte técnico</a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="forgot-password-footer">
          <p>&copy; 2024 Biblioteca Nacional. Sistema seguro de recuperación de acceso.</p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;