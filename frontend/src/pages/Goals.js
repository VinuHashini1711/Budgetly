import React from 'react';

export default function Goals() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>Savings Goals</h1>
          <div style={{ color: '#6b7280' }}>Track your progress towards financial goals</div>
        </div>
        <button className="btn" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>+</span> New Goal
        </button>
      </div>

      {/* Empty State */}
      <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <div style={{
          width: 80,
          height: 80,
          margin: '0 auto 24px auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg viewBox="0 0 24 24" width="48" height="48" stroke="#9ca3af" strokeWidth="1.5" fill="none">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
            <line x1="12" y1="2" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="22" />
            <line x1="22" y1="12" x2="20" y2="12" />
            <line x1="4" y1="12" x2="2" y2="12" />
          </svg>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 500, marginBottom: 8, color: '#4b5563' }}>
          No savings goals yet
        </h2>
        <p style={{ color: '#6b7280', marginBottom: 24 }}>
          Create your first goal to start saving!
        </p>
      </div>
    </div>
  );
}