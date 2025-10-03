# 📚 Biblioteca Digital – Frontend

Este es el **frontend** del sistema de Biblioteca Digital, desarrollado en **React + Vite**.  
Su objetivo es ofrecer una **interfaz moderna, rápida y fácil de usar** para la gestión de autores, libros y usuarios.

> 🔗 Repositorio del proyecto: [ProyectoBibliotecaDigital-React-Vite](https://github.com/SofiaSuaza/ProyectoBibliotecaDigital-React-Vite)  
> 👩‍💻 Autora: [Sofía Suaza](https://github.com/SofiaSuaza)

---

## ✨ Características principales

- 📖 Visualización de autores y libros.  
- 👤 Gestión de usuarios (registro e inicio de sesión).  
- 🛒 Interfaz clara y amigable.  
- ⚡ Renderizado rápido gracias a **Vite**.  
- 🎨 Diseño responsivo adaptable a dispositivos móviles.  

---

## 🚀 Tecnologías

- [React](https://react.dev/) – Librería de interfaces.  
- [Vite](https://vitejs.dev/) – Entorno de desarrollo rápido.  
- [React Router](https://reactrouter.com/) – Manejo de rutas.  
- [Axios](https://axios-http.com/) – Consumo de API.  
- [CSS / Tailwind]* – Estilos y maquetación.  

---

## ⚙️ Instalación y ejecución

1. Clona el repositorio:
   ```bash
   git clone https://github.com/SofiaSuaza/ProyectoBibliotecaDigital-React-Vite.git

2. Ingresa al directorio del proyecto:
cd RUTAS-AUTH

3. Instala dependencias:
npm install

4. Inicia el servidor de desarrollo:
npm run dev



## 📂 Estructura del proyecto

src/
├── assets/ # Recursos estáticos (imágenes, logos)
├── components/ # Componentes reutilizables
│ ├── Common/ # Componentes comunes
│ ├── Footer.jsx / css # Pie de página
│ ├── Navbar.jsx / css # Barra de navegación
│
├── context/ # Context API
│ ├── AuthContext.jsx # Manejo de sesión y autenticación
│ ├── ThemeContext.jsx # Manejo de tema (oscuro/claro)
│
├── pages/ # Páginas principales de la app
│ ├── Dashboard.jsx # Panel principal
│ ├── Escritores.jsx # Gestión de autores
│ ├── Libros.jsx # Gestión y visualización de libros
│ ├── Prestamos.jsx # Gestión de préstamos
│ ├── Login.jsx # Inicio de sesión
│ ├── Register.jsx # Registro de usuario
│ ├── Profile.jsx # Perfil del usuario
│ ├── ForgotPassword.jsx # Recuperar contraseña
│ ├── ResetPassword.jsx # Restablecer contraseña
│ ├── Home.jsx # Página principal
│ ├── User.jsx # Gestión de usuarios
│
├── routes/ # Manejo de rutas
│ ├── PrivateRoute.jsx # Rutas protegidas según rol
│
├── services/ # Servicios para consumir la API
│ ├── apiService.js # Configuración base de la API
│ ├── authService.js # Autenticación (login, register, logout)
│ ├── authorService.js # CRUD de autores
│ ├── emailService.js # Envío de correos (recuperación de contraseña, notificaciones)
│
├── utils/ # Funciones auxiliares
│
├── App.jsx # Componente raíz
├── main.jsx # Punto de entrada
├── index.css # Estilos globales

📜 Licencia

Este proyecto ha sido desarrollado con fines académicos.
Queda prohibido su uso con fines comerciales sin autorización.

👩‍💻 Autora

Sofía Suaza

GitHub: @SofiaSuaza
https://github.com/SofiaSuaza