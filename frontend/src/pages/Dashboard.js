import React, { useEffect, useState } from 'react';
import { fakeApi } from '../api/fakeApi';

export default function Dashboard(){
  const [summary, setSummary] = useState({ income:0, expenses:0, recent:[] });
  useEffect(()=>{
    fakeApi.getSummary().then(setSummary);
  },[]);
  return (
    <div>
      <div className="page-title">Dashboard</div>
      <div className="stats">
        <div className="card stat-card">
          <div style={{fontSize:12, color:'#6b7280'}}>Total Income</div>
          <div style={{fontSize:22, fontWeight:700}}>₹{summary.income.toFixed(2)}</div>
        </div>
        <div className="card stat-card">
          <div style={{fontSize:12, color:'#6b7280'}}>Total Expenses</div>
          <div style={{fontSize:22, fontWeight:700}}>₹{summary.expenses.toFixed(2)}</div>
        </div>
        <div className="card stat-card">
          <div style={{fontSize:12, color:'#6b7280'}}>Net</div>
          <div style={{fontSize:22, fontWeight:700}}>₹{(summary.income - summary.expenses).toFixed(2)}</div>
        </div>
      </div>

      <div className="card">
        <h3>Recent Transactions</h3>
        <div className="transactions-list">
          {summary.recent.length===0 && <div style={{color:'#6b7280'}}>No transactions yet</div>}
          {summary.recent.map(txn=> (
            <div key={txn.id} className="txn">
              <div>
                <div style={{fontWeight:700}}>{txn.title}</div>
                <div style={{fontSize:12, color:'#6b7280'}}>{txn.category} • {new Date(txn.date).toLocaleDateString()}</div>
              </div>
              <div style={{fontWeight:700, color: txn.type==='income' ? 'green' : 'red'}}> {txn.type==='income'?'+':'-'}₹{txn.amount.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
