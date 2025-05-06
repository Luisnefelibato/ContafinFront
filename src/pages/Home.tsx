import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiBarChart2, FiDollarSign, FiPieChart, FiTrendingUp, FiShield, FiChevronDown } from 'react-icons/fi';
import './Home.css';

const Home: React.FC = () => {
  // Función para manejar el scroll suave al hacer clic en un enlace de anclaje
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80, // Ajuste para el header fijo
        behavior: 'smooth'
      });
    }
  };

  // Efecto para activar la animación del texto principal
  useEffect(() => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      heroTitle.classList.add('animate-text');
    }
  }, []);

  // Efecto para hacer visible las secciones cuando entran en la vista
  useEffect(() => {
    // Función para manejar cuando una sección se vuelve visible
    const handleVisibility = () => {
      const sections = document.querySelectorAll('.fade-in-section');
      
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const isVisible = (
          rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
          rect.bottom >= 0
        );
        
        if (isVisible) {
          section.classList.add('is-visible');
        }
      });
    };
    
    // Ejecutar al cargar
    handleVisibility();
    
    // Agregar event listener para el scroll
    window.addEventListener('scroll', handleVisibility);
    
    // Cleanup del event listener
    return () => {
      window.removeEventListener('scroll', handleVisibility);
    };
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background"></div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Soluciones Financieras Inteligentes para tu Negocio</h1>
            <p className="hero-subtitle">
              ContaFin es tu asistente especializado en contabilidad, finanzas y cumplimiento fiscal
              para pequeñas y medianas empresas. Obtén análisis personalizados, informes detallados
              y plantillas listas para usar.
            </p>
            <div className="hero-buttons">
              <Link to="/chat" className="btn btn-primary">Iniciar Conversación</Link>
              <a 
                href="#features" 
                className="btn btn-outline"
                onClick={(e) => handleSmoothScroll(e, 'features')}
              >
                Conocer Más
              </a>
            </div>
          </div>
        </div>
        <a 
          href="#features" 
          className="scroll-down-arrow"
          onClick={(e) => handleSmoothScroll(e, 'features')}
        >
          <FiChevronDown />
        </a>
      </section>

      {/* Features Section */}
      <section className="features fade-in-section" id="features">
        <div className="container">
          <h2 className="features-title">Características Principales</h2>
          
          <div className="features-grid">
            <div className="feature-card" style={{ '--animation-order': 0 } as React.CSSProperties}>
              <div className="feature-icon">
                <FiFileText />
              </div>
              <h3 className="feature-title">Plantillas Excel Automatizadas</h3>
              <p>Accede a plantillas profesionales para flujo de caja, nómina, balances y más, con fórmulas pre-configuradas.</p>
            </div>
            
            <div className="feature-card" style={{ '--animation-order': 1 } as React.CSSProperties}>
              <div className="feature-icon">
                <FiBarChart2 />
              </div>
              <h3 className="feature-title">Análisis Financiero</h3>
              <p>Obtén análisis detallados de punto de equilibrio, ratios financieros y proyecciones personalizadas para tu negocio.</p>
            </div>
            
            <div className="feature-card" style={{ '--animation-order': 2 } as React.CSSProperties}>
              <div className="feature-icon">
                <FiDollarSign />
              </div>
              <h3 className="feature-title">Gestión Contable</h3>
              <p>Mantén al día tus registros contables con estados financieros estructurados según normativas vigentes.</p>
            </div>
            
            <div className="feature-card" style={{ '--animation-order': 3 } as React.CSSProperties}>
              <div className="feature-icon">
                <FiShield />
              </div>
              <h3 className="feature-title">Cumplimiento Fiscal</h3>
              <p>Recibe orientación sobre obligaciones tributarias, retenciones e impuestos según tu jurisdicción.</p>
            </div>
            
            <div className="feature-card" style={{ '--animation-order': 4 } as React.CSSProperties}>
              <div className="feature-icon">
                <FiPieChart />
              </div>
              <h3 className="feature-title">Reportes Periódicos</h3>
              <p>Informes automáticos con análisis de tendencias, recomendaciones estratégicas y alertas financieras.</p>
            </div>
            
            <div className="feature-card" style={{ '--animation-order': 5 } as React.CSSProperties}>
              <div className="feature-icon">
                <FiTrendingUp />
              </div>
              <h3 className="feature-title">Optimización de Costos</h3>
              <p>Identifica oportunidades de ahorro y mejora en la estructura de costos de tu empresa.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="templates fade-in-section" id="templates">
        <div className="container">
          <h2 className="templates-title">Plantillas Disponibles</h2>
          
          <div className="templates-grid">
            <div className="template-card" style={{ '--animation-order': 0 } as React.CSSProperties}>
              <div className="template-icon">
                <FiFileText />
              </div>
              <h3>Flujo de Caja</h3>
              <p>Controla las entradas y salidas de efectivo de tu negocio con proyecciones a 6 meses.</p>
              <a href="https://contafin.onrender.com/excel-template?type=flujo_caja" className="btn btn-outline" target="_blank" rel="noopener noreferrer">Descargar</a>
            </div>
            
            <div className="template-card" style={{ '--animation-order': 1 } as React.CSSProperties}>
              <div className="template-icon">
                <FiFileText />
              </div>
              <h3>Nómina</h3>
              <p>Calcula salarios, deducciones y aportes patronales con actualización automática.</p>
              <a href="https://contafin.onrender.com/excel-template?type=nomina" className="btn btn-outline" target="_blank" rel="noopener noreferrer">Descargar</a>
            </div>
            
            <div className="template-card" style={{ '--animation-order': 2 } as React.CSSProperties}>
              <div className="template-icon">
                <FiFileText />
              </div>
              <h3>Balance General</h3>
              <p>Estructura el balance de tu empresa con activos, pasivos y patrimonio claramente organizados.</p>
              <a href="https://contafin.onrender.com/excel-template?type=balance_general" className="btn btn-outline" target="_blank" rel="noopener noreferrer">Descargar</a>
            </div>
            
            <div className="template-card" style={{ '--animation-order': 3 } as React.CSSProperties}>
              <div className="template-icon">
                <FiFileText />
              </div>
              <h3>Estado de Resultados</h3>
              <p>Analiza ingresos, costos y gastos para visualizar la rentabilidad de tu operación.</p>
              <a href="https://contafin.onrender.com/excel-template?type=estado_resultados" className="btn btn-outline" target="_blank" rel="noopener noreferrer">Descargar</a>
            </div>
            
            <div className="template-card" style={{ '--animation-order': 4 } as React.CSSProperties}>
              <div className="template-icon">
                <FiBarChart2 />
              </div>
              <h3>Punto de Equilibrio</h3>
              <p>Determina el nivel de ventas necesario para cubrir costos con análisis gráfico.</p>
              <a href="https://contafin.onrender.com/excel-template?type=punto_equilibrio" className="btn btn-outline" target="_blank" rel="noopener noreferrer">Descargar</a>
            </div>
            
            <div className="template-card" style={{ '--animation-order': 5 } as React.CSSProperties}>
              <div className="template-icon">
                <FiPieChart />
              </div>
              <h3>Ratios Financieros</h3>
              <p>Evalúa la salud financiera de tu empresa con indicadores de liquidez, solvencia y rentabilidad.</p>
              <a href="https://contafin.onrender.com/excel-template?type=ratios_financieros" className="btn btn-outline" target="_blank" rel="noopener noreferrer">Descargar</a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta fade-in-section">
        <div className="cta-background"></div>
        <div className="container">
          <h2>¿Listo para transformar las finanzas de tu empresa?</h2>
          <p>Comienza a utilizar ContaFin hoy mismo y descubre cómo podemos ayudarte a tomar mejores decisiones financieras.</p>
          <Link to="/chat" className="btn btn-primary pulse">Iniciar Ahora</Link>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact fade-in-section" id="contact">
        <div className="container">
          <h2>Contacto</h2>
          <p>¿Tienes preguntas o necesitas ayuda? Estamos aquí para asistirte.</p>
          
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <strong>Email:</strong>
              <a href="mailto:info@innovacionfinanciera.com">info@innovacionfinanciera.com</a>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <strong>Teléfono:</strong>
              <a href="tel:+573001234567">+57 300 123 4567</a>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <strong>Dirección:</strong>
              <p>Calle 93 #15-40, Bogotá, Colombia</p>
            </div>
          </div>
          
          <div className="contact-form">
            <h3>Envíanos un mensaje</h3>
            <form className="form">
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input type="text" id="name" placeholder="Tu nombre" />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="tu@email.com" />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Mensaje</label>
                <textarea id="message" rows={5} placeholder="¿En qué podemos ayudarte?"></textarea>
              </div>
              
              <button type="button" className="btn btn-primary">Enviar Mensaje</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;