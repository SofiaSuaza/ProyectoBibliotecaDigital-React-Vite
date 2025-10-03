// src/services/apiService.js
const API_BASE_URL = 'http://localhost:5000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // CRÍTICO: Envía y recibe cookies de sesión
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      console.log('Request:', {
        url,
        method: config.method,
        headers: config.headers,
        body: config.body
      });
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      }).finally(() => clearTimeout(timeoutId));
      
      // Parsear respuesta
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('Respuesta no JSON:', text);
        throw new Error('El servidor no devolvió JSON válido');
      }
      
      console.log('Response:', {
        status: response.status,
        ok: response.ok,
        data
      });

      // Manejar errores HTTP
      if (!response.ok) {
        if (response.status === 401) {
          // Sesión expirada o no válida
          localStorage.removeItem('currentUser');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
        
        throw new Error(data.message || data.error || `Error ${response.status}`);
      }

      // ✅ NORMALIZAR RESPUESTA - INCLUYE LOANS Y LOAN
      return {
        success: true,
        data: data.books || data.book || 
              data.authors || data.author || 
              data.users || data.user || 
              data.loans || data.loan ||
              data,
        message: data.message
      };
      
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      
      return {
        success: false,
        error: error.message || 'Error de conexión',
        data: null
      };
    }
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: data,
      ...options,
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data,
      ...options,
    });
  }

  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: data,
      ...options,
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }
}

const apiService = new ApiService();

// ✅ SERVICIOS ESPECÍFICOS
export const booksService = {
  getAll: () => apiService.get('/api/books'),
  getById: (id) => apiService.get(`/api/books/${id}`),
  create: (bookData) => apiService.post('/api/books', bookData),
  update: (id, bookData) => apiService.put(`/api/books/${id}`, bookData),
  delete: (id) => apiService.delete(`/api/books/${id}`),
};

export const authorsService = {
  getAll: () => apiService.get('/api/authors'),
  getById: (id) => apiService.get(`/api/authors/${id}`),
  create: (authorData) => apiService.post('/api/authors', authorData),
  update: (id, authorData) => apiService.put(`/api/authors/${id}`, authorData),
  delete: (id) => apiService.delete(`/api/authors/${id}`),
};

export const usersService = {
  getAll: () => apiService.get('/api/users'),
  getById: (id) => apiService.get(`/api/users/${id}`),
  create: (userData) => apiService.post('/api/users', userData),
  update: (id, userData) => apiService.put(`/api/users/${id}`, userData),
  delete: (id) => apiService.delete(`/api/users/${id}`),
  toggleStatus: (id) => apiService.patch(`/api/users/${id}/toggle-status`, {}), // ← AGREGADO
};

export const loansService = {
  getAll: () => apiService.get('/api/loans'),
  getById: (id) => apiService.get(`/api/loans/${id}`),
  create: (loanData) => apiService.post('/api/loans', loanData),
  update: (id, loanData) => apiService.put(`/api/loans/${id}`, loanData),
  returnBook: (id) => apiService.patch(`/api/loans/${id}/return`, {}),
  delete: (id) => apiService.delete(`/api/loans/${id}`),
};

export default apiService;