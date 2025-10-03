import { useState, useEffect } from 'react';
import { authorsService } from '../services/apiService';
import './Escritores.css';

const GENRES = [
    'Ficción', 'No Ficción', 'Poesía', 'Drama', 'Novela',
    'Cuento', 'Ensayo', 'Literatura Infantil', 'Literatura Juvenil',
    'Fantasía', 'Ciencia Ficción', 'Misterio', 'Romance', 'Terror'
];

const LANGUAGES = [
    'Español', 'Inglés', 'Francés', 'Alemán', 'Italiano',
    'Portugués', 'Ruso', 'Chino', 'Japonés', 'Árabe'
];

const NATIONALITIES = [
    'Argentina', 'España', 'México', 'Colombia', 'Chile',
    'Perú', 'Estados Unidos', 'Reino Unido', 'Francia', 'Alemania', 'Japón'
];

const Escritores = () => {
    const [writers, setWriters] = useState([]);
    const [currentView, setCurrentView] = useState('list');
    const [editingWriter, setEditingWriter] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGenre, setFilterGenre] = useState('');
    const [feedback, setFeedback] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [photoPreview, setPhotoPreview] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        biography: '',
        birthDate: '',
        nationality: '',
        genre: '',
        language: 'Español',
        photo: 'https://via.placeholder.com/150x200?text=Autor',
        works: '',
        awards: '',
        socialMedia: '',
        isActive: true
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadWriters();
    }, []);

    // ✅ CORREGIDO: Usar response.data en lugar de response.authors
    const loadWriters = async () => {
        try {
            const response = await authorsService.getAll();
            console.log('Autores cargados:', response);
            
            // apiService ya normaliza la respuesta
            if (response.success) {
                setWriters(Array.isArray(response.data) ? response.data : []);
            } else {
                setFeedback({
                    type: 'error',
                    message: response.error || 'Error al cargar autores'
                });
                setWriters([]);
            }
        } catch (error) {
            console.error('Error cargando autores:', error);
            setFeedback({
                type: 'error',
                message: 'Error al cargar la lista de autores: ' + error.message
            });
            setWriters([]);
        }
    };

    const filteredWriters = writers.filter(writer => {
        const matchesSearch = 
            writer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (writer.nationality && writer.nationality.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesGenre = !filterGenre || (writer.genre && writer.genre.includes(filterGenre));
        
        return matchesSearch && matchesGenre;
    });

    const resetForm = () => {
        setFormData({
            name: '',
            biography: '',
            birthDate: '',
            nationality: '',
            genre: '',
            language: 'Español',
            photo: 'https://via.placeholder.com/150x200?text=Autor',
            works: '',
            awards: '',
            socialMedia: '',
            isActive: true
        });
        setErrors({});
        setPhotoPreview('');
        setEditingWriter(null);
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const photoData = e.target.result;
                setFormData(prev => ({...prev, photo: photoData}));
                setPhotoPreview(photoData);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === 'checkbox' && name === 'isActive') {
            setFormData(prev => ({ ...prev, isActive: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        
        if (errors[name] && value.trim()) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        if (formData.biography && formData.biography.length > 1000) {
            newErrors.biography = 'La biografía no puede exceder los 1000 caracteres';
        }

        if (formData.birthDate && isNaN(Date.parse(formData.birthDate))) {
            newErrors.birthDate = 'La fecha de nacimiento no es válida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const createWriter = async () => {
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        try {
            const authorData = {
                name: formData.name.trim(),
                biography: formData.biography?.trim() || '',
                birthDate: formData.birthDate || null,
                nationality: formData.nationality || '',
                genre: formData.genre || '',
                language: formData.language || 'Español',
                photo: formData.photo || 'https://via.placeholder.com/150x200?text=Autor',
                works: formData.works?.trim() || '',
                awards: formData.awards?.trim() || '',
                socialMedia: formData.socialMedia?.trim() || '',
                isActive: formData.isActive
            };

            console.log('Enviando autor:', authorData);
            
            const response = await authorsService.create(authorData);
            console.log('Respuesta del servidor:', response);

            // ✅ CORREGIDO: Verificar response.success
            if (response.success) {
                await loadWriters();
                resetForm();
                setCurrentView('list');
                setFeedback({
                    type: 'success',
                    message: response.message || 'Escritor creado exitosamente'
                });
                setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
            } else {
                throw new Error(response.error || 'Error al crear autor');
            }
        } catch (error) {
            console.error('Error creando autor:', error);
            setFeedback({
                type: 'error',
                message: error.message || 'Error al crear el autor'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateWriter = async () => {
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        try {
            const authorData = {
                name: formData.name.trim(),
                biography: formData.biography?.trim() || '',
                birthDate: formData.birthDate || null,
                nationality: formData.nationality || '',
                genre: formData.genre || '',
                language: formData.language || 'Español',
                photo: formData.photo || 'https://via.placeholder.com/150x200?text=Autor',
                works: formData.works?.trim() || '',
                awards: formData.awards?.trim() || '',
                socialMedia: formData.socialMedia?.trim() || '',
                isActive: formData.isActive
            };

            console.log('Actualizando autor:', authorData);

            const response = await authorsService.update(editingWriter._id, authorData);
            console.log('Respuesta del servidor:', response);

            // ✅ CORREGIDO: Verificar response.success
            if (response.success) {
                await loadWriters();
                resetForm();
                setCurrentView('list');
                setFeedback({
                    type: 'success',
                    message: response.message || 'Escritor actualizado exitosamente'
                });
                setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
            } else {
                throw new Error(response.error || 'Error al actualizar autor');
            }
        } catch (error) {
            console.error('Error actualizando autor:', error);
            setFeedback({
                type: 'error',
                message: error.message || 'Error al actualizar el autor'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteWriter = async (writerId) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este escritor?')) return;
        
        try {
            const response = await authorsService.delete(writerId);
            
            // ✅ CORREGIDO: Verificar response.success
            if (response.success) {
                await loadWriters();
                setFeedback({
                    type: 'success',
                    message: response.message || 'Escritor eliminado exitosamente'
                });
                setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
            } else {
                throw new Error(response.error || 'Error al eliminar autor');
            }
        } catch (error) {
            console.error('Error eliminando escritor:', error);
            setFeedback({
                type: 'error',
                message: error.message || 'Error al eliminar el escritor'
            });
        }
    };

    const editWriter = (writer) => {
        setFormData({
            ...writer,
            birthDate: writer.birthDate ? new Date(writer.birthDate).toISOString().split('T')[0] : ''
        });
        setEditingWriter(writer);
        setPhotoPreview(writer.photo);
        setCurrentView('edit');
    };

    const viewWriter = (writer) => {
        setFormData(writer);
        setPhotoPreview(writer.photo);
        setCurrentView('view');
    };

    const handleSubmit = async () => {
        setFeedback({ type: '', message: '' });
        
        if (currentView === 'create') {
            await createWriter();
        } else if (currentView === 'edit') {
            await updateWriter();
        }
    };

    if (currentView === 'list') {
        return (
            <div className="escritores">
                <div className="escritores-header">
                    <div>
                        <h1>Escritores y Autores</h1>
                        <p>Gestión completa de escritores registrados en la biblioteca</p>
                    </div>
                    <button onClick={() => { resetForm(); setCurrentView('create'); }} className="escritores-btn-new">
                        + Nuevo Escritor
                    </button>
                </div>

                {feedback.message && (
                    <div className={`escritores-feedback ${feedback.type}`}>
                        {feedback.message}
                    </div>
                )}

                <div className="escritores-filters">
                    <input
                        type="text"
                        placeholder="Buscar escritores por nombre o nacionalidad..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="escritores-search-input"
                    />
                    <select
                        value={filterGenre}
                        onChange={(e) => setFilterGenre(e.target.value)}
                        className="escritores-filter"
                    >
                        <option value="">Todos los géneros</option>
                        {GENRES.map(genre => (
                            <option key={genre} value={genre}>{genre}</option>
                        ))}
                    </select>
                </div>

                <div className="escritores-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Escritor</th>
                                <th>Nacionalidad</th>
                                <th>Género</th>
                                <th>Idioma</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredWriters.map((writer) => (
                                <tr key={writer._id}>
                                    <td>
                                        <div className="escritores-writer-info">
                                            {writer.photo ? (
                                                <img src={writer.photo} alt={writer.name} className="escritores-photo-small" />
                                            ) : (
                                                <div className="escritores-no-photo">👤</div>
                                            )}
                                            <div className="escritores-name">{writer.name}</div>
                                        </div>
                                    </td>
                                    <td>{writer.nationality || 'No especificada'}</td>
                                    <td>{writer.genre || 'No especificado'}</td>
                                    <td>{writer.language || 'Español'}</td>
                                    <td>
                                        <span className={`escritores-status-${writer.isActive ? 'active' : 'inactive'}`}>
                                            {writer.isActive ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="escritores-actions">
                                            <button onClick={() => viewWriter(writer)} className="escritores-btn-view">
                                                Ver
                                            </button>
                                            <button onClick={() => editWriter(writer)} className="escritores-btn-edit">
                                                Editar
                                            </button>
                                            <button onClick={() => deleteWriter(writer._id)} className="escritores-btn-delete">
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {filteredWriters.length === 0 && (
                        <div className="escritores-empty">
                            No se encontraron escritores
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (currentView === 'view') {
        return (
            <div className="escritores">
                <div className="escritores-header">
                    <button onClick={() => setCurrentView('list')} className="escritores-back">
                        ← Volver a la lista
                    </button>
                    <div>
                        <h1>{formData.name}</h1>
                        <p>{formData.nationality}</p>
                    </div>
                </div>

                <div className="escritores-detail">
                    <div className="escritores-detail-image">
                        {photoPreview ? (
                            <img src={photoPreview} alt={formData.name} />
                        ) : (
                            <div className="escritores-no-photo-big">
                                👤<br/>Sin fotografía
                            </div>
                        )}

                        <div className="escritores-quick-info">
                            <h3>Información Rápida</h3>
                            <div className="escritores-info-row">
                                <span>Nacimiento:</span>
                                <span>{formData.birthDate ? new Date(formData.birthDate).toLocaleDateString() : 'No especificada'}</span>
                            </div>
                            <div className="escritores-info-row">
                                <span>Género:</span>
                                <span>{formData.genre || 'No especificado'}</span>
                            </div>
                            <div className="escritores-info-row">
                                <span>Idioma:</span>
                                <span>{formData.language || 'Español'}</span>
                            </div>
                            <div className="escritores-info-row">
                                <span>Estado:</span>
                                <span className={`escritores-status-${formData.isActive ? 'active' : 'inactive'}`}>
                                    {formData.isActive ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="escritores-detail-content">
                        {formData.biography && (
                            <div className="escritores-section">
                                <h3>Biografía</h3>
                                <p>{formData.biography}</p>
                            </div>
                        )}

                        {formData.works && (
                            <div className="escritores-section">
                                <h3>Obras</h3>
                                <p>{formData.works}</p>
                            </div>
                        )}

                        {formData.awards && (
                            <div className="escritores-section">
                                <h3>Premios y Reconocimientos</h3>
                                <p>{formData.awards}</p>
                            </div>
                        )}

                        {formData.socialMedia && (
                            <div className="escritores-section">
                                <h3>Redes Sociales</h3>
                                <p>{formData.socialMedia}</p>
                            </div>
                        )}

                        <div className="escritores-actions">
                            <button onClick={() => editWriter(formData)} className="escritores-btn-edit">
                                Editar
                            </button>
                            <button onClick={() => setCurrentView('list')} className="escritores-btn-cancel">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="escritores">
            <div className="escritores-header">
                <button onClick={() => { setCurrentView('list'); resetForm(); }} className="escritores-back">
                    ← Volver a la lista
                </button>
                <div>
                    <h1>{currentView === 'create' ? 'Nuevo Escritor' : 'Editar Escritor'}</h1>
                    <p>Complete la información del escritor/autor</p>
                </div>
            </div>

            <div className="escritores-form">
                {feedback.message && (
                    <div className={`escritores-feedback ${feedback.type}`}>
                        {feedback.message}
                    </div>
                )}

                <div className="escritores-section">
                    <h3>Fotografía del Escritor</h3>
                    <div className="escritores-photo-upload">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="escritores-file-input"
                        />
                        {photoPreview && (
                            <div className="escritores-photo-preview">
                                <img src={photoPreview} alt="Vista previa" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="escritores-section">
                    <h3>Información Básica</h3>
                    <div className="escritores-form-grid">
                        <div className="escritores-form-group escritores-full-width">
                            <label>Nombre Completo *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={errors.name ? 'escritores-error' : ''}
                                placeholder="Ej: Gabriel García Márquez"
                            />
                            {errors.name && <span className="escritores-error-text">{errors.name}</span>}
                        </div>

                        <div className="escritores-form-group">
                            <label>Nacionalidad</label>
                            <select
                                name="nationality"
                                value={formData.nationality}
                                onChange={handleInputChange}
                                className="escritores-select"
                            >
                                <option value="">Seleccionar nacionalidad</option>
                                {NATIONALITIES.map(nationality => (
                                    <option key={nationality} value={nationality}>
                                        {nationality}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="escritores-form-group">
                            <label>Fecha de Nacimiento</label>
                            <input
                                type="date"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleInputChange}
                                className={errors.birthDate ? 'escritores-error' : ''}
                            />
                            {errors.birthDate && <span className="escritores-error-text">{errors.birthDate}</span>}
                        </div>

                        <div className="escritores-form-group">
                            <label>Género Literario</label>
                            <select
                                name="genre"
                                value={formData.genre}
                                onChange={handleInputChange}
                                className="escritores-select"
                            >
                                <option value="">Seleccionar género</option>
                                {GENRES.map(genre => (
                                    <option key={genre} value={genre}>
                                        {genre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="escritores-form-group">
                            <label>Idioma Principal</label>
                            <select
                                name="language"
                                value={formData.language}
                                onChange={handleInputChange}
                                className="escritores-select"
                            >
                                {LANGUAGES.map(language => (
                                    <option key={language} value={language}>
                                        {language}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="escritores-form-group">
                            <label>
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                />
                                {' '}Escritor Activo
                            </label>
                        </div>
                    </div>
                </div>

                <div className="escritores-section">
                    <h3>Biografía</h3>
                    <div className="escritores-form-group">
                        <textarea
                            name="biography"
                            value={formData.biography}
                            onChange={handleInputChange}
                            rows={4}
                            maxLength={1000}
                            placeholder="Descripción de la vida y obra del escritor (máximo 1000 caracteres)..."
                            className={errors.biography ? 'escritores-error' : ''}
                        />
                        {errors.biography && <span className="escritores-error-text">{errors.biography}</span>}
                        <small>{formData.biography.length}/1000 caracteres</small>
                    </div>
                </div>

                <div className="escritores-section">
                    <h3>Obras</h3>
                    <div className="escritores-form-group">
                        <textarea
                            name="works"
                            value={formData.works}
                            onChange={handleInputChange}
                            rows={3}
                            placeholder="Lista de obras principales del autor..."
                        />
                    </div>
                </div>

                <div className="escritores-section">
                    <h3>Premios y Reconocimientos</h3>
                    <div className="escritores-form-group">
                        <textarea
                            name="awards"
                            value={formData.awards}
                            onChange={handleInputChange}
                            rows={3}
                            placeholder="Premio Nobel de Literatura, Premio Cervantes, etc."
                        />
                    </div>
                </div>

                <div className="escritores-section">
                    <h3>Redes Sociales</h3>
                    <div className="escritores-form-group">
                        <textarea
                            name="socialMedia"
                            value={formData.socialMedia}
                            onChange={handleInputChange}
                            rows={2}
                            placeholder="Enlaces a redes sociales, sitio web, etc."
                        />
                    </div>
                </div>

                <div className="escritores-actions">
                    <button
                        type="button"
                        onClick={() => { setCurrentView('list'); resetForm(); }}
                        className="escritores-btn-cancel"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        disabled={isSubmitting}
                        className="escritores-btn-submit"
                        onClick={handleSubmit}
                    >
                        {isSubmitting ? 'Procesando...' : (currentView === 'create' ? 'Registrar Escritor' : 'Actualizar Escritor')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Escritores;