import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';

// Configuración para API - funciona tanto en desarrollo como en producción
const baseUrl = import.meta.env.VITE_APP_API_URL || '/api';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container header-container">
          <Link to="/" className="logo">
            <img src="/logo.svg" alt="ContaFin Logo" />
            ContaFin
          </Link>

          <button 
            className="mobile-menu-btn" 
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <Link to="/" className="nav-link">Inicio</Link>
            <Link to="/chat" className="nav-link">Chat</Link>
            <a href="/#features" className="nav-link">Características</a>
            <a href="/#templates" className="nav-link">Plantillas</a>
            <a href="/#contact" className="nav-link">Contacto</a>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="container footer-container">
          <div className="footer-section">
            <div className="footer-logo">ContaFin</div>
            <p>Asistente especializado en contabilidad, finanzas operativas y cumplimiento fiscal para pequeñas y medianas empresas.</p>
          </div>

          <div className="footer-section">
            <h4>Plantillas</h4>
            <div className="footer-links">
              <a href={`${baseUrl}/excel-template?type=flujo_caja`}>Flujo de Caja</a>
              <a href={`${baseUrl}/excel-template?type=nomina`}>Nómina</a>
              <a href={`${baseUrl}/excel-template?type=balance_general`}>Balance General</a>
              <a href={`${baseUrl}/excel-template?type=estado_resultados`}>Estado de Resultados</a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Enlaces</h4>
            <div className="footer-links">
              <Link to="/">Inicio</Link>
              <Link to="/chat">Chat</Link>
              <a href="/#features">Características</a>
              <a href="/#contact">Contacto</a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Contacto</h4>
            <div className="footer-links">
              <a href="mailto:info@innovacionfinanciera.com">info@innovacionfinanciera.com</a>
              <a href="tel:+573001234567">+57 319 3431250</a>
              <p>Bogotá, Colombia</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom container">
          <p>&copy; {new Date().getFullYear()} Created by Luisfercode@2025 - Antares Innovate</p>
        </div>
      </footer>
    </div>
  );
};

export default App;