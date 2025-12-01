import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChatbotButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/ai-insights');
  };

  return (
    <button
      onClick={handleClick}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        border: 'none',
        color: 'white',
        fontSize: '24px',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
        zIndex: 1000,
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.1)';
        e.target.style.boxShadow = '0 6px 25px rgba(99, 102, 241, 0.6)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)';
        e.target.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.4)';
      }}
    >
      🤖
    </button>
  );
}