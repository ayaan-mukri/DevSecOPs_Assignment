import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import '../styles.css';




const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { user: 'bot', message: 'Hello! Ask me about Potato Leaf Diseases.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const fetchBotResponse = async (userMessage) => {
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: userMessage
      });
      return response.data.response;
    } catch (error) {
      console.error('Error fetching bot response:', error);
      return 'Sorry, I encountered an error while processing your request.';
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      const userMsg = { user: 'user', message: message.trim() };
      const typingMsg = {
        user: 'bot',
        message: '',
        isTyping: true
      };

      setChatHistory(prev => [...prev, userMsg, typingMsg]);
      setMessage('');

      const botResponse = await fetchBotResponse(message.trim());

      setChatHistory(prev =>
        prev.slice(0, prev.length - 1).concat({
          user: 'bot',
          message: botResponse
        })
      );
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  const handleClearChat = () => {
    setChatHistory([{ user: 'bot', message: 'Hello! Ask me about Potato Leaf Diseases.' }]);
  };

  const downloadChatAsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Potato Leaf Disease Chat History", 14, 22);
    doc.setFontSize(12);

    const tableData = chatHistory.map(chat => [
      chat.user === 'bot' ? 'Bot' : 'You',
      chat.message
    ]);

    autoTable(doc, {
      startY: 30,
      head: [['Sender', 'Message']],
      body: tableData,
      styles: {
        cellPadding: 3,
        fontSize: 10,
        cellWidth: 'wrap'
      },
      headStyles: {
        fillColor: [46, 125, 50]
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 150 }
      }
    });

    doc.save('potato_leaf_chat_history.pdf');
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-white">
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-light bg-success bg-gradient px-4 shadow-sm">
        <a className="navbar-brand fw-semibold text-white fs-4" href="/">Potato Leaf Detector</a>
        <button className="btn btn-outline-light ms-auto" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </nav>

      {/* Chat Section */}
      <div className="container my-5 flex-grow-1 d-flex justify-content-center align-items-center">
        <div className="card w-100 shadow-lg border-0 rounded-4" style={{ maxWidth: '800px' }}>
          <div className="card-body p-4 d-flex flex-column">
            <h3 className="text-center mb-4" style={{ color: '#2e7d32' }}>
              🍃 Potato Leaf Disease Chatbot
            </h3>

            {/* Chat History */}
            <div
              className="chat-box p-3 rounded-4 bg-light border mb-3"
              style={{ height: '350px', overflowY: 'auto' }}
              ref={chatBoxRef}
            >
              {chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className={`p-3 my-2 rounded-4 ${chat.user === 'bot' ? 'bg-white text-success align-self-start' : 'bg-success text-white align-self-end'}`}
                  style={{
                    width: '100%',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    position: 'relative',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  <strong>{chat.user === 'bot' ? 'Bot' : 'You'}:</strong>{' '}
                  {chat.isTyping ? (
                    <span className="typing-dots">
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </span>
                  ) : (
                    <>
                      {chat.message.includes('http') && chat.message.match(/\.(jpeg|jpg|gif|png|webp)$/) ? (
                        <img
                          src={chat.message}
                          alt="Bot response"
                          className="img-fluid rounded mt-2"
                          style={{ maxHeight: '300px', objectFit: 'contain' }}
                        />
                      ) : (
                        <ReactMarkdown>{chat.message}</ReactMarkdown>

                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Input Area + Buttons */}
            <div className="d-flex gap-2 flex-wrap">
              <div className="input-group flex-grow-1">
                <input
                  type="text"
                  className="form-control rounded-start-pill border-success"
                  placeholder="Ask me about potato leaf diseases..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
                <button
                  className="btn btn-success rounded-end-pill px-4"
                  onClick={handleSendMessage}
                  disabled={isLoading || !message.trim()}
                >
                  {isLoading ? (
                    <span><i className="fas fa-circle-notch fa-spin me-1" /> Sending...</span>
                  ) : (
                    'Send'
                  )}
                </button>
              </div>

              <div className="d-flex flex-wrap gap-2 mt-2 justify-content-between">
                <button
                  className="btn btn-outline-danger rounded-pill flex-grow-1"
                  onClick={handleClearChat}
                  disabled={isLoading}
                >
                  Clear Chat
                </button>

                <button
                  className="btn btn-outline-primary rounded-pill flex-grow-1"
                  onClick={downloadChatAsPDF}
                  disabled={chatHistory.length <= 1}
                >
                  Download Chat as PDF
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-success text-white text-center py-3 mt-auto shadow-sm">
        © 2025 Potato Leaf Disease Detection. All rights reserved.
      </footer>

    </div>
  );
};

export default Chatbot;
