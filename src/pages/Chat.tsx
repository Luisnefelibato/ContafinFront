import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { FiSend, FiDownload } from 'react-icons/fi';
import './Chat.css';

// Configuración para API - funciona tanto en desarrollo como en producción
const baseUrl = import.meta.env.VITE_APP_API_URL || '/api';

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
      // Usamos baseUrl para que funcione en desarrollo y producción
      const response = await axios.post(`${baseUrl}/chat`, {
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
      
      // Si estamos en desarrollo y hay un error CORS, simular una respuesta
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

  // Function to detect and render download links in messages
  const renderMessageContent = (content: string) => {
    // Check for Excel template patterns
    const excelPattern = /plantilla(.+?)Excel|Excel(.+?)plantilla|descargar(.+?)plantilla|template(.+?)Excel|Excel(.+?)template/i;
    const containsExcelRequest = excelPattern.test(content);

    return (
      <div>
        <ReactMarkdown>{content}</ReactMarkdown>
        
        {containsExcelRequest && (
          <div className="download-options">
            <h4>Descargar Plantillas:</h4>
            <div className="download-buttons">
              <a href={`${baseUrl}/excel-template?type=flujo_caja`} className="download-link" target="_blank" rel="noopener noreferrer">
                <FiDownload /> Flujo de Caja
              </a>
              <a href={`${baseUrl}/excel-template?type=nomina`} className="download-link" target="_blank" rel="noopener noreferrer">
                <FiDownload /> Nómina
              </a>
              <a href={`${baseUrl}/excel-template?type=balance_general`} className="download-link" target="_blank" rel="noopener noreferrer">
                <FiDownload /> Balance General
              </a>
              <a href={`${baseUrl}/excel-template?type=estado_resultados`} className="download-link" target="_blank" rel="noopener noreferrer">
                <FiDownload /> Estado de Resultados
              </a>
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
              <a href={`${baseUrl}/report`} className="download-link" target="_blank" rel="noopener noreferrer">
                <FiDownload /> Descargar Informe Completo
              </a>
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
          disabled={isLoading}
        />
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          <FiSend />
        </button>
      </form>
    </div>
  );
};

export default Chat;