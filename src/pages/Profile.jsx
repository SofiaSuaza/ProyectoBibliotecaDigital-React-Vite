// src/pages/Profile.jsx
import { useAuth } from "../context/AuthContext";
import './Profile.css'; 

export default function Profile() {
  const { user } = useAuth();
  
  return (
    <div className="profile-container">
      {/* Header Elegante */}
      <div className="profile-header">
        <div className="header-content">
          <h1 className="profile-title">Perfil de Usuario</h1>
          <p className="profile-subtitle">Gestión de información personal y preferencias</p>
          <div className="header-divider"></div>
        </div>
      </div>
      
      <div className="profile-content">
        {/* Tarjeta Principal de Perfil */}
        <div className="profile-card">
          <div className="card-header">
            <h2 className="card-title">Información Personal</h2>
            <span className="card-badge">Cuenta Activa</span>
          </div>
          
          <div className="profile-main">
            <div className="profile-avatar-section">
              <div className="avatar-container">
                <div className="avatar-circle">
                  <span className="avatar-initial">
                    {user?.name?.charAt(0).toUpperCase() || 'S'}
                  </span>
                </div>
                <div className="avatar-status"></div>
              </div>
              <div className="profile-identity">
                <h2 className="user-name"><strong>{user?.name}</strong></h2>
                <p className="user-role">Miembro Bibliotecario</p>
                <div className="member-since">
                  <span className="member-icon">📅</span>
                  <span>Miembro desde {user?.joinDate || "24/09/2025"}</span>
                </div>
              </div>
            </div>
            
            <div className="profile-divider"></div>
            
            <div className="info-sections">
              {/* Información de Cuenta */}
              <div className="info-section">
                <div className="section-header">
                  <h3 className="section-title">
                    <span className="section-icon">👤</span>
                    Datos de la Cuenta
                  </h3>
                </div>
                
                <div className="info-grid">
                  <div className="info-item">
                    <div className="info-label">
                      <span className="label-icon">🆔</span>
                      Nombre completo
                    </div>
                    <div className="info-value"><strong>{user?.name}</strong></div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-label">
                      <span className="label-icon">✉️</span>
                      Correo electrónico
                    </div>
                    <div className="info-value">{user?.email || "No especificado"}</div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-label">
                      <span className="label-icon">🔐</span>
                      Estado de la cuenta
                    </div>
                    <div className="info-value status-verified">
                      <span className="status-dot"></span>
                      Verificada
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Estadísticas de Uso */}
              <div className="info-section">
                <div className="section-header">
                  <h3 className="section-title">
                    <span className="section-icon">📊</span>
                    Actividad en la Biblioteca
                  </h3>
                </div>
                
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-icon">📖</div>
                    <div className="stat-content">
                      <div className="stat-number">12</div>
                      <div className="stat-label">Préstamos activos</div>
                    </div>
                  </div>
                  
                  <div className="stat-item">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                      <div className="stat-number">47</div>
                      <div className="stat-label">Libros leídos</div>
                    </div>
                  </div>
                  
                  <div className="stat-item">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-content">
                      <div className="stat-number">8.9</div>
                      <div className="stat-label">Puntuación promedio</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Acciones del Perfil */}
          <div className="profile-actions">
            <div className="actions-header">
              <h3 className="actions-title">Gestionar Cuenta</h3>
            </div>
            <div className="actions-grid">
              <button className="action-button primary">
                <span className="button-icon">✏️</span>
                <span className="button-text">Editar Perfil</span>
                <span className="button-description">Actualizar información personal</span>
              </button>
              
              <button className="action-button secondary">
                <span className="button-icon">🔒</span>
                <span className="button-text">Cambiar Contraseña</span>
                <span className="button-description">Actualizar credenciales de acceso</span>
              </button>
              
              <button className="action-button tertiary">
                <span className="button-icon">📋</span>
                <span className="button-text">Preferencias</span>
                <span className="button-description">Configurar notificaciones</span>
              </button>
              
              <button className="action-button tertiary">
                <span className="button-icon">📚</span>
                <span className="button-text">Mi Historial</span>
                <span className="button-description">Ver actividad completa</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}