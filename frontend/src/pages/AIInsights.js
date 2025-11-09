import React from 'react';

export default function AIInsights() {
  const stats = {
    income: 100000,
    expenses: 25000,
    transactions: 3,
    budgets: 1,
    goals: 0
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title" style={{ marginBottom: 4 }}>AI Financial Insights</h1>
        <div style={{ color: '#6b7280' }}>Get personalized recommendations powered by AI</div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 32 }}>
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ color: '#6b7280', fontSize: 14, marginBottom: 4 }}>Income</div>
          <div style={{ color: '#10b981', fontSize: 20, fontWeight: 600 }}>₹{stats.income}</div>
        </div>
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ color: '#6b7280', fontSize: 14, marginBottom: 4 }}>Expenses</div>
          <div style={{ color: '#ef4444', fontSize: 20, fontWeight: 600 }}>₹{stats.expenses}</div>
        </div>
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ color: '#6b7280', fontSize: 14, marginBottom: 4 }}>Transactions</div>
          <div style={{ color: '#6366f1', fontSize: 20, fontWeight: 600 }}>{stats.transactions}</div>
        </div>
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ color: '#6b7280', fontSize: 14, marginBottom: 4 }}>Budgets</div>
          <div style={{ color: '#8b5cf6', fontSize: 20, fontWeight: 600 }}>{stats.budgets}</div>
        </div>
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ color: '#6b7280', fontSize: 14, marginBottom: 4 }}>Goals</div>
          <div style={{ color: '#ec4899', fontSize: 20, fontWeight: 600 }}>{stats.goals}</div>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: '#f5f3ff',
          color: '#8b5cf6',
          fontSize: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px auto'
        }}>
          🤖
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12 }}>Generate AI-Powered Insights</h2>
        <p style={{ color: '#6b7280', marginBottom: 24 }}>
          Get a comprehensive analysis of your finances with personalized recommendations
        </p>
        <button className="btn" style={{ padding: '12px 24px' }}>
          Generate Insights
        </button>
      </div>
    </div>
  );
}