import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Línea decorativa superior */}
                <div className="footer-divider"></div>
                
                <div className="footer-main">
                    {/* Brand Section */}
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <span className="footer-logo-icon">🏛️</span>
                            <div className="footer-logo-text">
                                <h3 className="footer-title">Biblioteca Nacional</h3>
                                <p className="footer-subtitle">Fundada en 1923</p>
                            </div>
                        </div>
                        <p className="footer-description">
                            Custodios del patrimonio bibliográfico nacional y promotores 
                            del acceso al conocimiento para todas las generaciones.
                        </p>
                        <div className="footer-social">
                            <span className="social-text">Síguenos:</span>
                            <div className="social-links">
                                <a href="#" className="social-link" aria-label="Twitter">📘</a>
                                <a href="#" className="social-link" aria-label="Facebook">📷</a>
                                <a href="#" className="social-link" aria-label="Instagram">🐦</a>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Sections */}
                    <div className="footer-links-sections">
                        <div className="footer-section">
                            <h4 className="footer-section-title">Colecciones</h4>
                            <div className="footer-links">
                                <a href="/catalogo" className="footer-link">Catálogo General</a>
                                <a href="/manuscritos" className="footer-link">Manuscritos</a>
                                <a href="/hemeroteca" className="footer-link">Hemeroteca</a>
                                <a href="/mapoteca" className="footer-link">Mapoteca</a>
                                <a href="/digital" className="footer-link">Archivo Digital</a>
                            </div>
                        </div>

                        <div className="footer-section">
                            <h4 className="footer-section-title">Servicios</h4>
                            <div className="footer-links">
                                <a href="/consulta" className="footer-link">Consulta en Sala</a>
                                <a href="/prestamo" className="footer-link">Préstamo Domiciliario</a>
                                <a href="/investigacion" className="footer-link">Asesoría Investigación</a>
                                <a href="/digitalizacion" className="footer-link">Digitalización</a>
                                <a href="/visitas" className="footer-link">Visitas Guiadas</a>
                            </div>
                        </div>

                        <div className="footer-section">
                            <h4 className="footer-section-title">Información</h4>
                            <div className="footer-links">
                                <a href="/horarios" className="footer-link">Horarios</a>
                                <a href="/tarifas" className="footer-link">Membresías</a>
                                <a href="/normas" className="footer-link">Normas de Uso</a>
                                <a href="/donaciones" className="footer-link">Donaciones</a>
                                <a href="/prensa" className="footer-link">Sala de Prensa</a>
                            </div>
                        </div>

                        <div className="footer-section">
                            <h4 className="footer-section-title">Contacto</h4>
                            <div className="footer-contact-info">
                                <div className="contact-item">
                                    <span className="contact-icon">📍</span>
                                    <div>
                                        <p className="contact-text">Plaza de la Cultura #45</p>
                                        <p className="contact-subtext">Centro Histórico, Ciudad</p>
                                    </div>
                                </div>
                                <div className="contact-item">
                                    <span className="contact-icon">📞</span>
                                    <div>
                                        <p className="contact-text">+57 (1) 342-5678</p>
                                        <p className="contact-subtext">Lun-Vie: 8:00-18:00</p>
                                    </div>
                                </div>
                                <div className="contact-item">
                                    <span className="contact-icon">✉️</span>
                                    <div>
                                        <p className="contact-text">info@bibliotecanacional.gov</p>
                                        <p className="contact-subtext">Respuesta en 24h</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="footer-bottom">
                    <div className="footer-bottom-content">
                        <div className="copyright">
                            <p className="copyright-text">
                                &copy; 2025 Biblioteca Nacional. Patrimonio Cultural de la Nación.
                            </p>
                             <p className="copyright-legal">
                                Todos los derechos reservados. Registro Nacional de Bibliotecas #1947-28B
                            </p>
                        </div>
                        <div className="footer-legal">
                            <a href="/privacidad" className="legal-link">Política de Privacidad</a>
                            <span className="legal-separator">•</span>
                            <a href="/terminos" className="legal-link">Términos de Uso</a>
                            <span className="legal-separator">•</span>
                            <a href="/accesibilidad" className="legal-link">Accesibilidad</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;