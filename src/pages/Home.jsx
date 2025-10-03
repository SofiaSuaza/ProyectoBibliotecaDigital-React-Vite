// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import './Home.css';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "https://pymstatic.com/9881/conversions/frases-gabriel-garcia-marquez-small-16_9.jpg",
      title: "Gabriel García Márquez",
      description: "Premio Nobel de Literatura 1982 - Cien años de soledad"
    },
    {
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      title: "Biblioteca Histórica",
      description: "Colección de manuscritos y primeras ediciones desde el siglo XVI"
    },
    {
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      title: "Salón de Lectura",
      description: "Ambiente clásico para estudio e investigación académica"
    },
    {
      image: "https://www.lavozdelsur.es/uploads/s1/25/36/76/3/vargas-llosa.jpeg",
      title: "Mario Vargas Llosa",
      description: "Premio Nobel de Literatura 2010 - La ciudad y los perros"
    },
    {
      image: "https://www.penguinlibros.com/es/img/cms/LENGUA/Cortazar-clasesliteratura-int1.webp",
      title: "Julio Cortázar",
      description: "Maestro del relato corto - Rayuela"
    },
    {
      image: "https://editorialtelevisa.brightspotcdn.com/dims4/default/460ea00/2147483647/strip/true/crop/900x507+0+47/resize/1000x563!/quality/90/?url=https%3A%2F%2Fk2-prod-editorial-televisa.s3.us-east-1.amazonaws.com%2Fbrightspot%2Fwp-content%2Fuploads%2F2019%2F06%2FPablo-Neruda.jpg",
      title: "Pablo Neruda",
      description: "Premio Nobel de Literatura 1971 - Veinte poemas de amor"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="library-home">
      {/* Header Elegante */}
      <header className="library-header">
        <div className="header-content">
          <h1 className="library-title">Biblioteca Nacional</h1>
          <p className="library-subtitle">Fundada en 1923 • Patrimonio Cultural</p>
        </div>
      </header>

      {/* Carrusel Principal - Solo automático */}
      <div className="carousel-container">
        <div className="carousel">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="slide-overlay">
                <div className="slide-content">
                  <div className="slide-badge">Colección Especial</div>
                  <h2 className="slide-title">{slide.title}</h2>
                  <p className="slide-description">{slide.description}</p>
                  <button className="slide-button">Explorar Obras</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Galería de Escritores */}
      <section className="writers-gallery">
        <div className="container">
          <div className="section-header">
            <h2>Grandes Maestros de la Literatura</h2>
            <p>Explora la vida y obra de los escritores más influyentes</p>
          </div>
          <div className="writers-grid">
            <div className="writer-card">
              <img src="https://pymstatic.com/9881/conversions/frases-gabriel-garcia-marquez-small-16_9.jpg" alt="Gabriel García Márquez" />
              <div className="writer-info">
                <h3>Gabriel García Márquez</h3>
                <p>Realismo mágico • Nobel 1982</p>
              </div>
            </div>
            <div className="writer-card">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg0woqEsa9NSwrr8pZWVufJaRs6nJStIk_Lw&s" alt="Mario Vargas Llosa" />
              <div className="writer-info">
                <h3>Mario Vargas Llosa</h3>
                <p>Novela contemporánea • Nobel 2010</p>
              </div>
            </div>
            <div className="writer-card">
              <img src="data:image/jpeg;base64,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" alt="Julio Cortázar" />
              <div className="writer-info">
                <h3>Julio Cortázar</h3>
                <p>Literatura experimental • Rayuela</p>
              </div>
            </div>
            <div className="writer-card">
              <img src="https://www.biografiasyvidas.com/biografia/n/fotos/neruda_2.jpg" alt="Pablo Neruda" />
              <div className="writer-info">
                <h3>Pablo Neruda</h3>
                <p>Poesía lírica • Nobel 1971</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Separador Decorativo */}
      <div className="section-divider">
        <div className="divider-line"></div>
        <div className="divider-icon">📚</div>
        <div className="divider-line"></div>
      </div>

      {/* Sección de Servicios */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <h2>Servicios Bibliotecarios</h2>
            <p>Acceso al conocimiento y la cultura desde 1923</p>
          </div>
          
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🏛️</div>
              <h3>Consulta en Sala</h3>
              <p>Acceso directo a más de 500,000 volúmenes en nuestras salas de lectura especializadas.</p>
              <ul className="service-features">
                <li>• Sala de investigación</li>
                <li>• Hemeroteca histórica</li>
                <li>• Mapoteca y archivos</li>
              </ul>
            </div>
            
            <div className="service-card">
              <div className="service-icon">💻</div>
              <h3>Catálogo Digital</h3>
              <p>Plataforma avanzada con más de 200,000 recursos digitales y bases de datos académicas.</p>
              <ul className="service-features">
                <li>• E-books y revistas</li>
                <li>• Bases de datos científicas</li>
                <li>• Recursos multimedia</li>
              </ul>
            </div>
            
            <div className="service-card">
              <div className="service-icon">📖</div>
              <h3>Préstamo Domiciliario</h3>
              <p>Sistema de préstamo para socios con acceso a colecciones generales y especiales.</p>
              <ul className="service-features">
                <li>• Hasta 5 libros por 15 días</li>
                <li>• Renovación online</li>
                <li>• Reserva de materiales</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Colecciones Especiales */}
      <section className="collections-section">
        <div className="container">
          <div className="section-header">
            <h2>Colecciones Especiales</h2>
            <p>Patrimonio bibliográfico de valor histórico y cultural</p>
          </div>
          
          <div className="collections-grid">
            <div className="collection-item">
              <div className="collection-image" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80)'}}></div>
              <div className="collection-content">
                <h3>Manuscritos Medievales</h3>
                <p>Colección de códices y manuscritos iluminados de los siglos XII al XV</p>
                <span className="collection-count">+150 documentos</span>
              </div>
            </div>
            
            <div className="collection-item">
              <div className="collection-image" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80)'}}></div>
              <div className="collection-content">
                <h3>Primeras Ediciones</h3>
                <p>Ediciones príncipe de obras fundamentales de la literatura universal</p>
                <span className="collection-count">+2,000 volúmenes</span>
              </div>
            </div>
            
            <div className="collection-item">
              <div className="collection-image" style={{backgroundImage: 'url(data:image/jpeg;base64,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)'}}></div>
              <div className="collection-content">
                <h3>Archivo Fotográfico</h3>
                <p>Fondos documentales fotográficos desde la invención de la fotografía</p>
                <span className="collection-count">+50,000 imágenes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Conviértete en Socio</h2>
            <p>Accede a todos nuestros servicios y forma parte de nuestra comunidad de lectores</p>
            <div className="cta-buttons">
              <button className="cta-button primary">Registrarse</button>
              <button className="cta-button secondary">Visita Virtual</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}