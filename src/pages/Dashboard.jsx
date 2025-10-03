// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import apiService from '../services/apiService';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentLoans, setRecentLoans] = useState([]);
  const [lowStockBooks, setLowStockBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsRes, loansRes, booksRes] = await Promise.all([
          apiService.get('/api/dashboard/stats'),
          apiService.get('/api/dashboard/recent-loans'),
          apiService.get('/api/dashboard/low-stock-books')
        ]);

        if (statsRes.success) setStats(statsRes.data);
        if (loansRes.success) setRecentLoans(loansRes.data);
        if (booksRes.success) setLowStockBooks(booksRes.data);
      } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Cargando datos del sistema...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header Elegante */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="dashboard-title">Panel de Control</h1>
            <p className="welcome-text">Bienvenido(a), <strong>{user?.name}</strong></p>
            <p className="header-subtitle">Sistema de Gestión Bibliotecaria</p>
          </div>
          <div className="header-actions">
            <span className="user-role">Administrador</span>
            <button className="logout-button" onClick={handleLogout}>
              <span className="logout-icon">🚪</span>
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {/* Resumen de Estadísticas */}
      <section className="stats-section">
        <div className="section-header">
          <h2>Resumen General</h2>
          <p>Estado actual del sistema bibliotecario</p>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <h3>Colección Total</h3>
              <div className="stat-number">{stats?.summary.totalBooks}</div>
              <div className="stat-detail">
                <span className="available">{stats?.summary.availableCopies}</span>
                <span className="stat-divider">/</span>
                <span className="total">{stats?.summary.totalCopies} copias disponibles</span>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✍️</div>
            <div className="stat-content">
              <h3>Autores Registrados</h3>
              <div className="stat-number">{stats?.summary.totalAuthors}</div>
              <div className="stat-detail">Catálogo de escritores</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>Comunidad</h3>
              <div className="stat-number">{stats?.summary.totalUsers}</div>
              <div className="stat-detail">Usuarios activos</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📖</div>
            <div className="stat-content">
              <h3>Préstamos Activos</h3>
              <div className="stat-number">{stats?.summary.activeLoans}</div>
              <div className="stat-detail danger">
                <span className="overdue-count">{stats?.summary.overdueLoans}</span>
                <span>préstamos vencidos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Principal */}
      <div className="dashboard-grid">
        {/* Géneros Populares */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Géneros Literarios</h3>
            <span className="card-subtitle">Distribución por categoría</span>
          </div>
          <div className="genres-list">
            {stats?.popularGenres.map((genre, index) => (
              <div key={genre._id} className="genre-item">
                <div className="genre-info">
                  <span className="genre-name">{genre._id}</span>
                  <span className="genre-count">{genre.count} volúmenes</span>
                </div>
                <div className="genre-bar">
                  <div 
                    className="genre-bar-fill"
                    style={{ width: `${(genre.count / stats.popularGenres[0].count) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usuarios más Activos */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Lectores Destacados</h3>
            <span className="card-subtitle">Mayor actividad de préstamos</span>
          </div>
          <div className="active-users-list">
            {stats?.activeUsers.map((user, index) => (
              <div key={user._id} className="user-item">
                <div className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <strong className="user-name">{user.name}</strong>
                  <span className="user-email">{user.email}</span>
                </div>
                <div className="user-stats">
                  <span className="loan-count">{user.loanCount}</span>
                  <span className="loan-label">préstamos</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Préstamos Recientes */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Actividad Reciente</h3>
            <span className="card-subtitle">Últimos movimientos</span>
          </div>
          <div className="loans-list">
            {recentLoans.map((loan) => (
              <div key={loan._id} className="loan-item">
                <div className="loan-icon">
                  {loan.status === 'active' ? '📖' : 
                   loan.status === 'overdue' ? '⚠️' : '✅'}
                </div>
                <div className="loan-info">
                  <strong className="book-title">{loan.book.title}</strong>
                  <span className="user-name">{loan.user.name}</span>
                  <span className="loan-date">
                    {new Date(loan.loanDate).toLocaleDateString()}
                  </span>
                </div>
                <span className={`loan-status ${loan.status}`}>
                  {loan.status === 'active' ? 'En préstamo' : 
                   loan.status === 'overdue' ? 'Vencido' : 'Devuelto'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Libros con Pocas Copias */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Inventario Bajo</h3>
            <span className="card-subtitle">Necesitan reposición</span>
          </div>
          <div className="low-stock-list">
            {lowStockBooks.map((book) => (
              <div key={book._id} className="book-item">
                <div className="book-cover">
                  {book.title.charAt(0)}
                </div>
                <div className="book-info">
                  <strong className="book-title">{book.title}</strong>
                  <span className="book-author">por {book.author.name}</span>
                </div>
                <div className="stock-info">
                  <span className="stock-count">
                    {book.availableCopies}/{book.totalCopies}
                  </span>
                  <span className="stock-label">disponibles</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;