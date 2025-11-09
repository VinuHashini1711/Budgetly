import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      sessionStorage.setItem('welcomed', 'true');
      navigate('/login');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(to bottom right, #f5f3ff, #ede9fe)',
      padding: 20,
      textAlign: 'center'
    }}>
      <div style={{
        width: 100,
        height: 100,
        background: '#6366f1',
        borderRadius: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 48,
        color: 'white',
        marginBottom: 24,
        boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)'
      }}>
        B
      </div>

      <div style={{
        fontSize: 32,
        fontWeight: 700,
        marginBottom: 8,
        color: '#1f2937',
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}>
        <span>👋</span>
        <span>Welcome to BudgetWise</span>
      </div>
      
      <div style={{
        fontSize: 20,
        color: '#6b7280',
        marginBottom: 32
      }}>
        Your AI-Powered Expense Tracker
      </div>

      <div style={{
        fontSize: 16,
        color: '#4b5563',
        maxWidth: 500,
        lineHeight: 1.6
      }}>
        Manage your income, budgets, and spending with ease.
      </div>

      {/* Loading bar */}
      <div style={{
        width: 200,
        height: 4,
        background: '#e5e7eb',
        borderRadius: 2,
        marginTop: 40,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          background: '#6366f1',
          animation: 'loading 10s linear forwards'
        }} />
      </div>

      <style>{`
        @keyframes loading {
          from { width: 0; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}