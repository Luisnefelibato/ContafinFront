import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { FiSend, FiDownload } from 'react-icons/fi';
import './Chat.css';

// Configuración para API - usando el proxy configurado en vite.config.js
const API_BASE = '/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hola, soy ContaFin, tu asistente financiero especializado. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre análisis financieros, cálculos contables, o solicitar plantillas Excel para diferentes necesidades.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [downloadingTemplate, setDownloadingTemplate] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate a random session ID when the component first loads
    const randomId = Math.random().toString(36).substring(2, 15);
    setSessionId(randomId);
  }, []);

  useEffect(() => {
    // Scroll to the bottom of the chat whenever messages change
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Send message to the ContaFin API
      const response = await axios.post(`${API_BASE}/chat`, {
        message: input,
        session_id: sessionId
      });

      // Add the assistant's response to the chat
      if (response.data && response.data.response) {
        const botMessage: Message = { 
          role: 'assistant', 
          content: response.data.response 
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      
      // Si estamos en desarrollo y hay un error, simular una respuesta
      if (import.meta.env.DEV) {
        setTimeout(() => {
          const simulatedResponse: Message = {
            role: 'assistant',
            content: `Estoy en modo de desarrollo. Aquí hay una respuesta simulada a tu consulta sobre "${input}".\n\n` + 
                    "Para realizar un análisis financiero adecuado, necesitaría más información sobre tu empresa. " +
                    "¿Puedo ayudarte con alguna plantilla específica como flujo de caja o balance general?"
          };
          setMessages(prev => [...prev, simulatedResponse]);
          setIsLoading(false);
        }, 1000);
        return;
      }
      
      // Add error message to the chat
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Lo siento, ha ocurrido un error al procesar tu solicitud. Por favor, intenta nuevamente en unos momentos.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para manejar la descarga de plantillas Excel
 const handleDownloadTemplate = (templateType: string) => {
  try {
    // Actualizar estado para mostrar que está descargando
    setDownloadingTemplate(templateType);
    
    // Agregar mensaje de notificación al chat
    const downloadMessage: Message = {
      role: 'assistant',
      content: `Estoy preparando tu plantilla de ${getTemplateName(templateType)}. La descarga comenzará en un momento...`
    };
    setMessages(prev => [...prev, downloadMessage]);
    
    // Usar window.open para descargar el archivo (mejor para archivos binarios)
    // Esto evita problemas con Axios y los encabezados CORS
    window.open(`/api/excel-template?type=${templateType}`, '_blank');
    
    // Mostrar mensaje de éxito después de un tiempo prudente
    setTimeout(() => {
      const successMessage: Message = {
        role: 'assistant',
        content: `✅ La plantilla de ${getTemplateName(templateType)} se está descargando. Si no comenzó automáticamente, verifica tu navegador o intenta nuevamente.`
      };
      setMessages(prev => [...prev, successMessage]);
      
      // Restablecer el estado de descarga
      setDownloadingTemplate(null);
    }, 2000);
    
  } catch (error) {
    console.error('Error al iniciar descarga de plantilla:', error);
    
    // Mostrar mensaje de error
    const errorMessage: Message = {
      role: 'assistant',
      content: `❌ Lo siento, ocurrió un problema al iniciar la descarga de la plantilla de ${getTemplateName(templateType)}. Por favor, intenta nuevamente o prueba con una plantilla diferente.`
    };
    setMessages(prev => [...prev, errorMessage]);
    
    // Restablecer el estado de descarga
    setDownloadingTemplate(null);
  }
};
  
  // Función para obtener nombre amigable de la plantilla
  const getTemplateName = (templateType: string): string => {
    const templateNames: {[key: string]: string} = {
      'flujo_caja': 'Flujo de Caja',
      'nomina': 'Nómina',
      'balance_general': 'Balance General',
      'estado_resultados': 'Estado de Resultados',
      'punto_equilibrio': 'Punto de Equilibrio',
      'ratios_financieros': 'Ratios Financieros'
    };
    
    return templateNames[templateType] || templateType;
  };

  // Function to detect and render download links in messages
  const renderMessageContent = (content: string) => {
    // Check for Excel template patterns
    const excelPattern = /plantilla(.+?)Excel|Excel(.+?)plantilla|descargar(.+?)plantilla|template(.+?)Excel|Excel(.+?)template/i;
    const containsExcelRequest = excelPattern.test(content);

    return (
      <div className="message-content">
        <ReactMarkdown>{content}</ReactMarkdown>
        
        {containsExcelRequest && (
          <div className="download-options">
            <h4>Descargar Plantillas:</h4>
            <div className="download-buttons">
              <button 
                onClick={() => handleDownloadTemplate('flujo_caja')} 
                className={`download-link ${downloadingTemplate === 'flujo_caja' ? 'downloading' : ''}`}
                disabled={downloadingTemplate !== null}
              >
                <FiDownload /> Flujo de Caja
              </button>
              <button 
                onClick={() => handleDownloadTemplate('nomina')} 
                className={`download-link ${downloadingTemplate === 'nomina' ? 'downloading' : ''}`}
                disabled={downloadingTemplate !== null}
              >
                <FiDownload /> Nómina
              </button>
              <button 
                onClick={() => handleDownloadTemplate('balance_general')} 
                className={`download-link ${downloadingTemplate === 'balance_general' ? 'downloading' : ''}`}
                disabled={downloadingTemplate !== null}
              >
                <FiDownload /> Balance General
              </button>
              <button 
                onClick={() => handleDownloadTemplate('estado_resultados')} 
                className={`download-link ${downloadingTemplate === 'estado_resultados' ? 'downloading' : ''}`}
                disabled={downloadingTemplate !== null}
              >
                <FiDownload /> Estado de Resultados
              </button>
              <button 
                onClick={() => handleDownloadTemplate('punto_equilibrio')} 
                className={`download-link ${downloadingTemplate === 'punto_equilibrio' ? 'downloading' : ''}`}
                disabled={downloadingTemplate !== null}
              >
                <FiDownload /> Punto de Equilibrio
              </button>
              <button 
                onClick={() => handleDownloadTemplate('ratios_financieros')} 
                className={`download-link ${downloadingTemplate === 'ratios_financieros' ? 'downloading' : ''}`}
                disabled={downloadingTemplate !== null}
              >
                <FiDownload /> Ratios Financieros
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Function to detect if a message might contain a financial report
  const containsReport = (content: string) => {
    return content.includes('INFORME') || content.includes('Informe') || 
           content.includes('REPORTE') || content.includes('Reporte') ||
           content.includes('ANÁLISIS') || content.includes('Análisis');
  };
  
  // Función para descargar un informe financiero
  const handleDownloadReport = async () => {
    try {
      setIsLoading(true);
      
      // Mensaje de notificación
      const downloadMessage: Message = {
        role: 'assistant',
        content: 'Estoy preparando tu informe financiero. La descarga comenzará en un momento...'
      };
      setMessages(prev => [...prev, downloadMessage]);
      
      // Descargar el informe
      const response = await axios.get(`${API_BASE}/report`, {
        responseType: 'blob'
      });
      
      // Crear URL para el blob
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      
      // Crear link y descargar
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'informe_financiero.pdf');
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      // Mensaje de éxito
      const successMessage: Message = {
        role: 'assistant',
        content: '✅ Tu informe financiero se ha descargado correctamente. ¿En qué más puedo ayudarte?'
      };
      setMessages(prev => [...prev, successMessage]);
      
    } catch (error) {
      console.error('Error al descargar informe:', error);
      
      // Mensaje de error
      const errorMessage: Message = {
        role: 'assistant',
        content: '❌ Lo siento, hubo un problema al descargar el informe. Por favor, intenta nuevamente en unos momentos.'
      };
      setMessages(prev => [...prev, errorMessage]);
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`message ${message.role === 'user' ? 'message-user' : 'message-bot'}`}
          >
            {message.role === 'user' ? (
              message.content
            ) : (
              renderMessageContent(message.content)
            )}
            
            {message.role === 'assistant' && containsReport(message.content) && (
              <button 
                onClick={handleDownloadReport}
                className="download-link report-download"
                disabled={isLoading}
              >
                <FiDownload /> Descargar Informe Completo
              </button>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="message message-bot loading">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chat-input" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu pregunta aquí..."
          disabled={isLoading || downloadingTemplate !== null}
        />
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={isLoading || downloadingTemplate !== null}
        >
          <FiSend />
        </button>
      </form>
    </div>
  );
};

export default Chat;