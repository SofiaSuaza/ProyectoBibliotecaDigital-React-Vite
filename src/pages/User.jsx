import { useState, useEffect } from 'react';
import { usersService } from '../services/apiService';
import './User.css';

const User = () => {
    // Estados principales
    const [users, setUsers] = useState([]);
    const [currentView, setCurrentView] = useState('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Estado del formulario
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        role: 'user',
        phone: '',
        address: ''
    });

    // Estado de errores
    const [errors, setErrors] = useState({});

    // Cargar usuarios al montar
    useEffect(() => {
        fetchUsers();
    }, []);

    // Obtener usuarios
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await usersService.getAll();
            
            if (response.success) {
                setUsers(response.data);
            } else {
                console.error('Error al cargar usuarios:', response.error);
                alert('Error al cargar usuarios');
            }
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            alert('Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    };

    // Resetear formulario
    const resetForm = () => {
        setFormData({
            name: '',
            username: '',
            email: '',
            password: '',
            role: 'user',
            phone: '',
            address: ''
        });
        setErrors({});
        setEditingId(null);
    };

    // Manejar cambios en inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Limpiar error del campo
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Validar formulario
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        if (!formData.username.trim()) {
            newErrors.username = 'El nombre de usuario es requerido';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Mínimo 3 caracteres';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        // Solo validar password en creación
        if (!editingId) {
            if (!formData.password) {
                newErrors.password = 'La contraseña es requerida';
            } else if (formData.password.length < 6) {
                newErrors.password = 'Mínimo 6 caracteres';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Crear/Actualizar usuario
    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);

            let response;
            if (editingId) {
                // Actualizar (sin password)
                const { password, ...updateData } = formData;
                response = await usersService.update(editingId, updateData);
            } else {
                // Crear
                response = await usersService.create(formData);
            }

            if (response.success) {
                alert(response.message || (editingId ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente'));
                resetForm();
                setCurrentView('list');
                fetchUsers();
            } else {
                alert(response.error || 'Error al guardar usuario');
            }
        } catch (error) {
            console.error('Error al guardar usuario:', error);
            alert('Error al guardar usuario');
        } finally {
            setLoading(false);
        }
    };

    // Editar usuario
    const handleEdit = (user) => {
        setFormData({
            name: user.name,
            username: user.username,
            email: user.email,
            password: '',
            role: user.role,
            phone: user.phone || '',
            address: user.address || ''
        });
        setEditingId(user._id);
        setCurrentView('edit');
    };

    // Eliminar usuario
    const handleDelete = async (id, name) => {
        if (!window.confirm(`¿Eliminar al usuario "${name}"?`)) return;

        try {
            setLoading(true);
            const response = await usersService.delete(id);
            
            if (response.success) {
                alert('Usuario eliminado exitosamente');
                fetchUsers();
            } else {
                alert(response.error || 'Error al eliminar usuario');
            }
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            alert('Error al eliminar usuario');
        } finally {
            setLoading(false);
        }
    };

    // Toggle estado
    const handleToggleStatus = async (id) => {
        try {
            setLoading(true);
            const response = await usersService.toggleStatus(id);
            
            if (response.success) {
                fetchUsers();
            } else {
                alert(response.error || 'Error al cambiar estado del usuario');
            }
        } catch (error) {
            console.error('Error al cambiar estado:', error);
            alert('Error al cambiar estado del usuario');
        } finally {
            setLoading(false);
        }
    };

    // Filtrar usuarios
    const filteredUsers = users.filter(user => {
        const search = searchTerm.toLowerCase();
        return (
            user.name?.toLowerCase().includes(search) ||
            user.email?.toLowerCase().includes(search) ||
            user.username?.toLowerCase().includes(search)
        );
    });

    // Estadísticas
    const stats = {
        total: users.length,
        active: users.filter(u => u.isActive).length,
        inactive: users.filter(u => !u.isActive).length,
        admins: users.filter(u => u.role === 'admin').length
    };

    // VISTA: Lista de usuarios
    if (currentView === 'list') {
        return (
            <div className="usuarios">
                <div className="usuarios-header">
                    <div>
                        <h1>Gestión de Usuarios</h1>
                        <p>Administración completa de usuarios del sistema</p>
                    </div>
                    <button 
                        onClick={() => {
                            resetForm();
                            setCurrentView('create');
                        }} 
                        className="usuarios-btn-new"
                        disabled={loading}
                    >
                        + Nuevo Usuario
                    </button>
                </div>

                {/* Estadísticas */}
                <div className="usuarios-stats">
                    <div className="usuarios-stat-card">
                        <div className="usuarios-stat-value">{stats.total}</div>
                        <div className="usuarios-stat-label">Total Usuarios</div>
                    </div>
                    <div className="usuarios-stat-card">
                        <div className="usuarios-stat-value">{stats.active}</div>
                        <div className="usuarios-stat-label">Activos</div>
                    </div>
                    <div className="usuarios-stat-card">
                        <div className="usuarios-stat-value">{stats.inactive}</div>
                        <div className="usuarios-stat-label">Inactivos</div>
                    </div>
                    <div className="usuarios-stat-card">
                        <div className="usuarios-stat-value">{stats.admins}</div>
                        <div className="usuarios-stat-label">Administradores</div>
                    </div>
                </div>

                {/* Búsqueda */}
                <div className="usuarios-search">
                    <input
                        type="text"
                        placeholder="Buscar por nombre, email o usuario..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="usuarios-search-input"
                    />
                </div>

                {/* Tabla */}
                <div className="usuarios-table">
                    {loading ? (
                        <div className="usuarios-loading">Cargando...</div>
                    ) : filteredUsers.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Usuario</th>
                                    <th>Email</th>
                                    <th>Teléfono</th>
                                    <th>Rol</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user._id}>
                                        <td>
                                            <div className="usuarios-user-info">
                                                <strong>{user.name}</strong>
                                                <small>@{user.username}</small>
                                            </div>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>{user.phone || '-'}</td>
                                        <td>
                                            <span className={`usuarios-badge usuarios-badge-${user.role}`}>
                                                {user.role === 'admin' ? 'Admin' : 'Usuario'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`usuarios-status ${user.isActive ? 'active' : 'inactive'}`}>
                                                {user.isActive ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="usuarios-actions-cell">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="usuarios-btn-edit"
                                                    disabled={loading}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleToggleStatus(user._id)}
                                                    className="usuarios-btn-toggle"
                                                    disabled={loading}
                                                >
                                                    {user.isActive ? 'Desactivar' : 'Activar'}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user._id, user.name)}
                                                    className="usuarios-btn-delete"
                                                    disabled={loading}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="usuarios-empty">
                            {searchTerm ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // VISTA: Formulario
    return (
        <div className="usuarios">
            <div className="usuarios-header">
                <button 
                    onClick={() => {
                        resetForm();
                        setCurrentView('list');
                    }} 
                    className="usuarios-back"
                    disabled={loading}
                >
                    ← Volver a la lista
                </button>
                <div>
                    <h1>{currentView === 'create' ? 'Nuevo Usuario' : 'Editar Usuario'}</h1>
                    <p>Complete la información del usuario</p>
                </div>
            </div>

            <div className="usuarios-form">
                <div className="usuarios-section">
                    <h3>Información del Usuario</h3>
                    <div className="usuarios-form-grid">
                        <div className="usuarios-form-group">
                            <label>Nombre Completo *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={errors.name ? 'error' : ''}
                            />
                            {errors.name && <span className="usuarios-error">{errors.name}</span>}
                        </div>

                        <div className="usuarios-form-group">
                            <label>Nombre de Usuario *</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className={errors.username ? 'error' : ''}
                                placeholder="Sin espacios ni caracteres especiales"
                            />
                            {errors.username && <span className="usuarios-error">{errors.username}</span>}
                        </div>

                        <div className="usuarios-form-group">
                            <label>Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={errors.email ? 'error' : ''}
                            />
                            {errors.email && <span className="usuarios-error">{errors.email}</span>}
                        </div>

                        <div className="usuarios-form-group">
                            <label>Teléfono</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                        </div>

                        {currentView === 'create' && (
                            <div className="usuarios-form-group">
                                <label>Contraseña *</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={errors.password ? 'error' : ''}
                                    placeholder="Mínimo 6 caracteres"
                                />
                                {errors.password && <span className="usuarios-error">{errors.password}</span>}
                            </div>
                        )}

                        <div className="usuarios-form-group">
                            <label>Rol *</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                            >
                                <option value="user">Usuario</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>

                        <div className="usuarios-form-group usuarios-full-width">
                            <label>Dirección</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {currentView === 'edit' && (
                        <div className="usuarios-info-box">
                            <strong>Nota:</strong> Para cambiar la contraseña, contacte al administrador del sistema.
                        </div>
                    )}
                </div>

                {/* Botones */}
                <div className="usuarios-actions">
                    <button
                        type="button"
                        onClick={() => {
                            resetForm();
                            setCurrentView('list');
                        }}
                        className="usuarios-btn-cancel"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="usuarios-btn-submit"
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : (currentView === 'create' ? 'Crear Usuario' : 'Actualizar Usuario')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default User;