// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/">
            <span className="logo-icon">🏛️</span>
            <span className="logo-text">
              <span className="logo-main">Biblioteca Nacional</span>
              <span className="logo-subtitle">desde 1923</span>
            </span>
          </Link>
        </div>
        
        <div className="nav-menu">
          <div className="nav-links">
            <Link to="/" className="nav-link">Inicio</Link>
            
            {!user ? (
              <>
                <Link to="/login" className="nav-link">Acceder</Link>
                <button
                  onClick={toggleTheme}
                  className="theme-toggle"
                  title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
                >
                  {theme === 'light' ? '🌙' : '☀️'}
                </button>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="nav-link">Panel</Link>
                <Link to="/escritores" className="nav-link">Escritores</Link>
                <Link to="/libros" className="nav-link">Catálogo</Link>
                <Link to="/prestamos" className="nav-link">Préstamos</Link>
                <Link to="/user" className="nav-link">Usuarios</Link>
                <Link to="/profile" className="nav-link">Perfil</Link>
                <span className="user-welcome">Bienvenido, <strong>{user?.name}</strong></span>
                <button
                  onClick={toggleTheme}
                  className="theme-toggle"
                  title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
                >
                  {theme === 'light' ? '🌙' : '☀️'}
                </button>
                <button onClick={logout} className="logout-btn">Salir</button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;