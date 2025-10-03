import { useState, useEffect } from 'react';
import apiService, { loansService, usersService, booksService } from '../services/apiService';
import './Prestamos.css';

const Prestamos = () => {
    // Estados principales
    const [loans, setLoans] = useState([]);
    const [users, setUsers] = useState([]);
    const [books, setBooks] = useState([]);
    const [currentView, setCurrentView] = useState('list');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Estado del formulario simplificado
    const [formData, setFormData] = useState({
        userId: '',
        bookId: '',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: ''
    });

    // Cargar datos iniciales
    useEffect(() => {
        fetchLoans();
        fetchUsers();
        fetchBooks();
    }, []);

    // Función para cargar préstamos
    const fetchLoans = async () => {
        try {
            setLoading(true);
            const response = await loansService.getAll();
            console.log('Loans response:', response);
            
            if (response.success) {
                setLoans(Array.isArray(response.data) ? response.data : []);
            } else {
                setError(response.error || 'Error al cargar préstamos');
            }
        } catch (error) {
            console.error('Error al cargar préstamos:', error);
            setError('Error al cargar préstamos');
        } finally {
            setLoading(false);
        }
    };

    // Función para cargar usuarios
    const fetchUsers = async () => {
        try {
            const response = await usersService.getAll();
            console.log('Users response:', response);
            
            if (response.success) {
                setUsers(Array.isArray(response.data) ? response.data : []);
            }
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
        }
    };

    // Función para cargar libros
    const fetchBooks = async () => {
        try {
            const response = await booksService.getAll();
            console.log('Books response:', response);
            
            if (response.success) {
                // Filtrar solo libros disponibles
                const availableBooks = Array.isArray(response.data) 
                    ? response.data.filter(book => book.availableCopies > 0)
                    : [];
                setBooks(availableBooks);
            }
        } catch (error) {
            console.error('Error al cargar libros:', error);
        }
    };

    // Manejar cambios en el formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Crear préstamo
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validar campos requeridos
        if (!formData.userId || !formData.bookId) {
            alert('Por favor selecciona un usuario y un libro');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            // Datos a enviar al backend
            const loanData = {
                userId: formData.userId,
                bookId: formData.bookId,
                dueDate: formData.dueDate,
                notes: formData.notes
            };

            console.log('Enviando préstamo:', loanData);
            
            const response = await loansService.create(loanData);
            console.log('Respuesta crear préstamo:', response);
            
            if (response.success) {
                alert('Préstamo creado exitosamente');
                resetForm();
                setCurrentView('list');
                fetchLoans();
            } else {
                alert(response.error || 'Error al crear préstamo');
            }
        } catch (error) {
            console.error('Error al crear préstamo:', error);
            alert('Error al crear préstamo');
        } finally {
            setLoading(false);
        }
    };

    // Devolver libro
    const handleReturnBook = async (loanId) => {
        if (!window.confirm('¿Confirmar devolución del libro?')) return;

        try {
            setLoading(true);
            const response = await loansService.returnBook(loanId);
            
            if (response.success) {
                alert('Libro devuelto exitosamente');
                fetchLoans();
            } else {
                alert(response.error || 'Error al devolver libro');
            }
        } catch (error) {
            console.error('Error al devolver libro:', error);
            alert('Error al devolver libro');
        } finally {
            setLoading(false);
        }
    };

    // Resetear formulario
    const resetForm = () => {
        setFormData({
            userId: '',
            bookId: '',
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            notes: ''
        });
    };

    // VISTA: Formulario de nuevo préstamo
    if (currentView === 'create') {
        return (
            <div className="prestamos">
                <div className="prestamos-header">
                    <button onClick={() => { resetForm(); setCurrentView('list'); }} className="prestamos-back">
                        ← Volver a la lista
                    </button>
                    <div>
                        <h1>Nuevo Préstamo</h1>
                        <p>Registrar un nuevo préstamo de libro</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="prestamos-form">
                    <div className="prestamos-section">
                        <h3>Información del Préstamo</h3>
                        <div className="prestamos-form-grid">
                            {/* Seleccionar Usuario */}
                            <div className="prestamos-form-group">
                                <label>Seleccionar Usuario *</label>
                                <select
                                    name="userId"
                                    value={formData.userId}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">-- Selecciona un usuario --</option>
                                    {users.map(user => (
                                        <option key={user._id} value={user._id}>
                                            {user.name} - {user.email}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Seleccionar Libro */}
                            <div className="prestamos-form-group">
                                <label>Seleccionar Libro *</label>
                                <select
                                    name="bookId"
                                    value={formData.bookId}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">-- Selecciona un libro --</option>
                                    {books.map(book => (
                                        <option key={book._id} value={book._id}>
                                            {book.title} - ISBN: {book.isbn} ({book.availableCopies} disponibles)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Fecha de devolución */}
                            <div className="prestamos-form-group">
                                <label>Fecha de Devolución *</label>
                                <input
                                    type="date"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            {/* Observaciones */}
                            <div className="prestamos-form-group prestamos-full-width">
                                <label>Observaciones</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    rows={3}
                                    placeholder="Observaciones especiales del préstamo..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="prestamos-actions">
                        <button 
                            type="button" 
                            onClick={() => { resetForm(); setCurrentView('list'); }} 
                            className="prestamos-btn-cancel"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="prestamos-btn-submit"
                            disabled={loading}
                        >
                            {loading ? 'Creando...' : 'Registrar Préstamo'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    // VISTA: Lista de préstamos
    return (
        <div className="prestamos">
            <div className="prestamos-header">
                <div>
                    <h1>Gestión de Préstamos</h1>
                    <p>Control completo de préstamos de libros</p>
                </div>
                <button 
                    onClick={() => { resetForm(); setCurrentView('create'); }} 
                    className="prestamos-btn-new"
                >
                    + Nuevo Préstamo
                </button>
            </div>

            {/* Mostrar error si existe */}
            {error && (
                <div className="prestamos-error">
                    {error}
                </div>
            )}

            {/* Estadísticas rápidas */}
            <div className="prestamos-stats">
                <div className="prestamos-stat-card">
                    <h3>Préstamos Activos</h3>
                    <span className="prestamos-stat-number">
                        {loans.filter(l => l.status === 'active').length}
                    </span>
                </div>
                <div className="prestamos-stat-card">
                    <h3>Préstamos Vencidos</h3>
                    <span className="prestamos-stat-number prestamos-overdue">
                        {loans.filter(l => l.status === 'overdue').length}
                    </span>
                </div>
                <div className="prestamos-stat-card">
                    <h3>Devueltos</h3>
                    <span className="prestamos-stat-number">
                        {loans.filter(l => l.status === 'returned').length}
                    </span>
                </div>
                <div className="prestamos-stat-card">
                    <h3>Total</h3>
                    <span className="prestamos-stat-number">{loans.length}</span>
                </div>
            </div>

            {/* Tabla de préstamos */}
            <div className="prestamos-table">
                {loading ? (
                    <p>Cargando préstamos...</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Libro</th>
                                <th>Fecha Préstamo</th>
                                <th>Fecha Límite</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loans.length > 0 ? (
                                loans.map((loan) => (
                                    <tr key={loan._id}>
                                        <td>{loan.user?.name || 'Usuario desconocido'}</td>
                                        <td>{loan.book?.title || 'Libro desconocido'}</td>
                                        <td>{new Date(loan.loanDate).toLocaleDateString()}</td>
                                        <td>{new Date(loan.dueDate).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`prestamos-status prestamos-status-${loan.status}`}>
                                                {loan.status === 'active' ? 'Activo' :
                                                 loan.status === 'returned' ? 'Devuelto' :
                                                 loan.status === 'overdue' ? 'Vencido' : loan.status}
                                            </span>
                                        </td>
                                        <td>
                                            {loan.status === 'active' && (
                                                <button 
                                                    onClick={() => handleReturnBook(loan._id)}
                                                    className="prestamos-btn-return"
                                                    disabled={loading}
                                                >
                                                    Devolver
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="prestamos-empty">
                                        No hay préstamos registrados
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Prestamos;