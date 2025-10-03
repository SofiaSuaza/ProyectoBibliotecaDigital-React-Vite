import { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import './Libros.css';

const Libros = () => {
    const [books, setBooks] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [currentView, setCurrentView] = useState('list');
    const [editingBook, setEditingBook] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGenre, setFilterGenre] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        isbn: '',
        genre: '',
        publicationDate: '',
        publisher: '',
        pages: '',
        language: 'Español',
        description: '',
        image: 'https://via.placeholder.com/150x200?text=Libro',
        totalCopies: 1,
        availableCopies: 1
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        loadBooks();
        loadAuthors();
    }, []);

    const loadAuthors = async () => {
        try {
            const response = await apiService.get('/api/authors');
            if (response.success && Array.isArray(response.data)) {
                setAuthors(response.data);
            } else {
                setAuthors([]);
            }
        } catch (error) {
            console.error('Error cargando autores:', error);
            setAuthors([]);
        }
    };

    const loadBooks = async () => {
        try {
            const response = await apiService.get('/api/books');
            if (response.success) {
                setBooks(response.data || []);
            }
        } catch (error) {
            console.error('Error cargando libros:', error);
            setBooks([]);
        }
    };

    const filteredBooks = books.filter(book => {
        const matchesSearch = 
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.isbn.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesGenre = !filterGenre || book.genre === filterGenre;
        
        return matchesSearch && matchesGenre;
    });

    const resetForm = () => {
        setFormData({
            title: '',
            author: '',
            isbn: '',
            genre: '',
            publicationDate: '',
            publisher: '',
            pages: '',
            language: 'Español',
            description: '',
            image: 'https://via.placeholder.com/150x200?text=Libro',
            totalCopies: 1,
            availableCopies: 1
        });
        setErrors({});
        setImagePreview('');
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = e.target.result;
                setFormData(prev => ({...prev, image: imageData}));
                setImagePreview(imageData);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (name === 'totalCopies') {
            const newTotal = parseInt(value) || 0;
            setFormData(prev => ({
                ...prev,
                availableCopies: Math.min(prev.availableCopies, newTotal)
            }));
        }
        
        if (errors[name] && value.trim()) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) newErrors.title = 'El título es requerido';
        if (!formData.author) newErrors.author = 'El autor es requerido';
        if (!formData.isbn.trim()) newErrors.isbn = 'El ISBN es requerido';
        if (!formData.genre.trim()) newErrors.genre = 'El género es requerido';
        
        if (!formData.totalCopies || formData.totalCopies < 1) {
            newErrors.totalCopies = 'Debe haber al menos una copia';
        }
        
        if (formData.availableCopies === undefined || formData.availableCopies < 0) {
            newErrors.availableCopies = 'Las copias disponibles no pueden ser negativas';
        }
        
        if (formData.availableCopies > formData.totalCopies) {
            newErrors.availableCopies = 'Las copias disponibles no pueden exceder el total';
        }
        
        if (formData.pages && formData.pages < 1) {
            newErrors.pages = 'El número de páginas debe ser mayor a 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const createBook = async () => {
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        try {
            const bookData = {
                title: formData.title.trim(),
                author: formData.author,
                isbn: formData.isbn.trim(),
                genre: formData.genre.trim(),
                language: formData.language || 'Español',
                totalCopies: parseInt(formData.totalCopies) || 1,
                availableCopies: parseInt(formData.availableCopies) || 1
            };

            if (formData.publicationDate) bookData.publicationDate = formData.publicationDate;
            if (formData.publisher?.trim()) bookData.publisher = formData.publisher.trim();
            if (formData.pages) bookData.pages = parseInt(formData.pages);
            if (formData.description?.trim()) bookData.description = formData.description.trim();
            if (formData.image) bookData.image = formData.image;

            const response = await apiService.post('/api/books', bookData);
            if (response.success) {
                await loadBooks();
                resetForm();
                setCurrentView('list');
                alert('Libro creado exitosamente');
            } else {
                alert(response.error || 'Error al crear el libro');
            }
        } catch (error) {
            console.error('Error creando libro:', error);
            alert('Error al crear el libro: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateBook = async () => {
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        try {
            // Extraer solo el ID del autor si es un objeto
            const bookData = {
                ...formData,
                author: typeof formData.author === 'object' ? formData.author._id : formData.author
            };

            console.log('Enviando actualización:', bookData);

            const response = await apiService.put(`/api/books/${formData._id}`, bookData);
            if (response.success) {
                await loadBooks();
                resetForm();
                setEditingBook(null);
                setCurrentView('list');
                alert('Libro actualizado exitosamente');
            } else {
                alert(response.error || 'Error al actualizar el libro');
            }
        } catch (error) {
            console.error('Error actualizando libro:', error);
            alert('Error al actualizar el libro: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteBook = async (bookId) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este libro?')) return;
        
        try {
            const response = await apiService.delete(`/api/books/${bookId}`);
            if (response.success) {
                await loadBooks();
                alert('Libro eliminado exitosamente');
            }
        } catch (error) {
            console.error('Error eliminando libro:', error);
            alert('Error al eliminar el libro: ' + error.message);
        }
    };

    const editBook = (book) => {
        setFormData({
            ...book,
            author: book.author?._id || book.author,
            publicationDate: book.publicationDate ? new Date(book.publicationDate).toISOString().split('T')[0] : ''
        });
        setEditingBook(book);
        setImagePreview(book.image);
        setCurrentView('edit');
    };

    const viewBook = (book) => {
        setFormData(book);
        setImagePreview(book.image);
        setCurrentView('view');
    };

    const handleSubmit = async () => {
        if (currentView === 'create') {
            await createBook();
        } else if (currentView === 'edit') {
            await updateBook();
        }
    };

    const genreOptions = [
        'Ficción', 'No Ficción', 'Ciencia Ficción', 'Fantasía', 'Misterio',
        'Romance', 'Thriller', 'Terror', 'Histórica', 'Biografía',
        'Ciencia', 'Tecnología', 'Arte', 'Música', 'Cocina',
        'Autoayuda', 'Educación', 'Literatura Infantil', 'Literatura Juvenil'
    ];

    if (currentView === 'list') {
        return (
            <div className="libros">
                <div className="libros-header">
                    <div>
                        <h1>Gestión de Libros</h1>
                        <p>Sistema completo de gestión del catálogo de la biblioteca</p>
                    </div>
                    <button onClick={() => { resetForm(); setCurrentView('create'); }}>
                        + Nuevo Libro
                    </button>
                </div>

                <div className="libros-filters">
                    <input
                        type="text"
                        placeholder="Buscar por título o ISBN..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="libros-search"
                    />
                    <select
                        value={filterGenre}
                        onChange={(e) => setFilterGenre(e.target.value)}
                        className="libros-filter"
                    >
                        <option value="">Todos los géneros</option>
                        {genreOptions.map(genre => (
                            <option key={genre} value={genre}>{genre}</option>
                        ))}
                    </select>
                </div>

                <div className="libros-grid">
                    {filteredBooks.map((book) => (
                        <div key={book._id} className="libros-card">
                            <div className="libros-image">
                                <img src={book.image} alt={book.title} />
                            </div>
                            
                            <div className="libros-info">
                                <h3>{book.title}</h3>
                                <p>por {book.author?.name || 'Autor desconocido'}</p>
                                
                                <div className="libros-genre-tag">
                                    <span>{book.genre}</span>
                                </div>

                                <div className="libros-status">
                                    <span>{book.availableCopies}/{book.totalCopies} copias</span>
                                    {!book.isActive && <span className="libros-inactive">Inactivo</span>}
                                </div>

                                <div className="libros-actions">
                                    <button onClick={() => viewBook(book)} className="libros-btn-view">
                                        Ver
                                    </button>
                                    <button 
                                        onClick={() => editBook(book)} 
                                        className="libros-btn-edit"
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        onClick={() => deleteBook(book._id)} 
                                        className="libros-btn-delete"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {filteredBooks.length === 0 && (
                    <div className="libros-empty">
                        No se encontraron libros
                    </div>
                )}
            </div>
        );
    }

    if (currentView === 'view') {
        return (
            <div className="libros">
                <div className="libros-header">
                    <button onClick={() => setCurrentView('list')} className="libros-back">
                        ← Volver al catálogo
                    </button>
                    <div>
                        <h1>{formData.title}</h1>
                        <p>por {formData.author?.name || 'Autor desconocido'}</p>
                    </div>
                </div>

                <div className="libros-detail">
                    <div className="libros-detail-image">
                        <img src={formData.image} alt={formData.title} />

                        <div className="libros-quick-info">
                            <h3>Información Rápida</h3>
                            <div className="libros-info-row">
                                <span>Copias:</span>
                                <span>{formData.availableCopies}/{formData.totalCopies}</span>
                            </div>
                            <div className="libros-info-row">
                                <span>ISBN:</span>
                                <span>{formData.isbn}</span>
                            </div>
                            <div className="libros-info-row">
                                <span>Género:</span>
                                <span>{formData.genre}</span>
                            </div>
                        </div>
                    </div>

                    <div className="libros-detail-content">
                        {formData.description && (
                            <div className="libros-section">
                                <h3>Descripción</h3>
                                <p>{formData.description}</p>
                            </div>
                        )}

                        <div className="libros-section">
                            <h3>Información Bibliográfica</h3>
                            <div className="libros-info-grid">
                                {formData.publisher && (
                                    <div className="libros-info-item">
                                        <label>Editorial:</label>
                                        <span>{formData.publisher}</span>
                                    </div>
                                )}
                                {formData.publicationDate && (
                                    <div className="libros-info-item">
                                        <label>Fecha de Publicación:</label>
                                        <span>{new Date(formData.publicationDate).toLocaleDateString()}</span>
                                    </div>
                                )}
                                <div className="libros-info-item">
                                    <label>Idioma:</label>
                                    <span>{formData.language}</span>
                                </div>
                                {formData.pages && (
                                    <div className="libros-info-item">
                                        <label>Páginas:</label>
                                        <span>{formData.pages}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="libros-actions">
                            <button onClick={() => editBook(formData)} className="libros-btn-edit">
                                Editar
                            </button>
                            <button onClick={() => setCurrentView('list')} className="libros-btn-cancel">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="libros">
            <div className="libros-header">
                <button onClick={() => { setCurrentView('list'); resetForm(); setEditingBook(null); }} className="libros-back">
                    ← Volver a la lista
                </button>
                <div>
                    <h1>{currentView === 'create' ? 'Nuevo Libro' : 'Editar Libro'}</h1>
                    <p>Complete la información del libro</p>
                </div>
            </div>

            <div className="libros-form">
                <div className="libros-section">
                    <h3>Información Básica</h3>
                    <div className="libros-form-grid">
                        <div className="libros-form-group">
                            <label>Título *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className={errors.title ? 'libros-error' : ''}
                            />
                            {errors.title && <span className="libros-error-text">{errors.title}</span>}
                        </div>

                        <div className="libros-form-group">
                            <label>Autor *</label>
                            <select
                                name="author"
                                value={formData.author}
                                onChange={handleInputChange}
                                className={errors.author ? 'libros-error' : ''}
                            >
                                <option value="">Selecciona un autor</option>
                                {authors.map(author => (
                                    <option key={author._id} value={author._id}>
                                        {author.name}
                                    </option>
                                ))}
                            </select>
                            {errors.author && <span className="libros-error-text">{errors.author}</span>}
                        </div>

                        <div className="libros-form-group">
                            <label>ISBN *</label>
                            <input
                                type="text"
                                name="isbn"
                                value={formData.isbn}
                                onChange={handleInputChange}
                                className={errors.isbn ? 'libros-error' : ''}
                            />
                            {errors.isbn && <span className="libros-error-text">{errors.isbn}</span>}
                        </div>

                        <div className="libros-form-group">
                            <label>Género *</label>
                            <select
                                name="genre"
                                value={formData.genre}
                                onChange={handleInputChange}
                                className={errors.genre ? 'libros-error' : ''}
                            >
                                <option value="">Selecciona un género</option>
                                {genreOptions.map(genre => (
                                    <option key={genre} value={genre}>{genre}</option>
                                ))}
                            </select>
                            {errors.genre && <span className="libros-error-text">{errors.genre}</span>}
                        </div>

                        <div className="libros-form-group">
                            <label>Editorial</label>
                            <input
                                type="text"
                                name="publisher"
                                value={formData.publisher}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="libros-form-group">
                            <label>Fecha de Publicación</label>
                            <input
                                type="date"
                                name="publicationDate"
                                value={formData.publicationDate}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="libros-form-group">
                            <label>Idioma</label>
                            <select
                                name="language"
                                value={formData.language}
                                onChange={handleInputChange}
                            >
                                <option value="Español">Español</option>
                                <option value="Inglés">Inglés</option>
                                <option value="Francés">Francés</option>
                                <option value="Italiano">Italiano</option>
                                <option value="Portugués">Portugués</option>
                            </select>
                        </div>

                        <div className="libros-form-group">
                            <label>Páginas</label>
                            <input
                                type="number"
                                name="pages"
                                value={formData.pages}
                                onChange={handleInputChange}
                                min="1"
                            />
                        </div>

                        <div className="libros-form-group">
                            <label>Copias Totales *</label>
                            <input
                                type="number"
                                name="totalCopies"
                                value={formData.totalCopies}
                                onChange={handleInputChange}
                                min="1"
                                className={errors.totalCopies ? 'libros-error' : ''}
                            />
                            {errors.totalCopies && <span className="libros-error-text">{errors.totalCopies}</span>}
                        </div>

                        <div className="libros-form-group">
                            <label>Copias Disponibles *</label>
                            <input
                                type="number"
                                name="availableCopies"
                                value={formData.availableCopies}
                                onChange={handleInputChange}
                                min="0"
                                max={formData.totalCopies}
                                className={errors.availableCopies ? 'libros-error' : ''}
                            />
                            {errors.availableCopies && <span className="libros-error-text">{errors.availableCopies}</span>}
                        </div>
                    </div>
                </div>

                <div className="libros-section">
                    <h3>Imagen de Portada</h3>
                    <div className="libros-image-upload">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="libros-file-input"
                        />
                        {imagePreview && (
                            <div className="libros-image-preview">
                                <img src={imagePreview} alt="Vista previa" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="libros-section">
                    <h3>Descripción</h3>
                    <div className="libros-form-group">
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Descripción del libro..."
                        />
                    </div>
                </div>

                <div className="libros-actions">
                    <button
                        type="button"
                        onClick={() => { setCurrentView('list'); resetForm(); setEditingBook(null); }}
                        className="libros-btn-cancel"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        disabled={isSubmitting}
                        className="libros-btn-submit"
                        onClick={handleSubmit}
                    >
                        {isSubmitting ? 'Procesando...' : (currentView === 'create' ? 'Registrar Libro' : 'Actualizar Libro')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Libros;