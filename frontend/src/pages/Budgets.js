import React, { useEffect, useState } from 'react';
import { fakeApi } from '../api/fakeApi';

export default function Budgets(){
  const [budgets, setBudgets] = useState([]);
  const [form, setForm] = useState({ category:'', amount:'' });
  
  useEffect(()=>{ load(); },[]);
  
  const load = async ()=>{ 
    const list = await fakeApi.listBudgets(); 
    setBudgets(list); 
  };

  const add = async (e)=>{ 
    e.preventDefault(); 
    await fakeApi.addBudget({ 
      name: form.category, 
      limit: Number(form.amount),
      period: 'monthly',
      startDate: new Date('2025-11-01'),
      endDate: new Date('2025-11-30')
    }); 
    setForm({category:'', amount:''}); 
    load(); 
  };

  const remove = async (id) => {
    await fakeApi.deleteBudget(id);
    load();
  };

  const getProgressColor = (spent, limit) => {
    const percentage = (spent/limit) * 100;
    if(percentage > 90) return '#ef4444';  // red
    if(percentage > 75) return '#f97316'; // orange
    return '#2563eb'; // blue
  };

  return (
    <div>
      <div style={{marginBottom:24}}>
        <h1 className="page-title" style={{marginBottom:4}}>Budgets</h1>
        <div style={{color:'#6b7280'}}>Set spending limits and track your budget</div>
      </div>

      <div style={{display:'flex', justifyContent:'space-between', gap:24}}>
        {/* Create Budget Form */}
        <div className="card" style={{flex:1}}>
          <form onSubmit={add} style={{display:'flex', gap:8}}>
            <input 
              placeholder="Category" 
              value={form.category} 
              onChange={e=>setForm({...form, category:e.target.value})} 
              style={{flex:2, padding:'8px 12px', border:'1px solid #e5e7eb', borderRadius:6}}
              required 
            />
            <input 
              type="number" 
              placeholder="₹0" 
              value={form.amount} 
              onChange={e=>setForm({...form, amount:e.target.value})} 
              style={{flex:1, padding:'8px 12px', border:'1px solid #e5e7eb', borderRadius:6}}
              required 
            />
            <button className="btn" type="submit">Create</button>
          </form>
        </div>
      </div>

      {/* Monthly Budget Card */}
      {budgets.length > 0 && (
        <div className="card" style={{marginTop:24}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16}}>
            <div>
              <h3 style={{margin:0}}>Monthly Budget</h3>
              <div style={{fontSize:14, color:'#6b7280'}}>Nov 1 - Nov 30, 2025</div>
            </div>
            <div style={{display:'flex', gap:8}}>
              <button className="btn secondary" style={{padding:'6px 12px'}}>✎</button>
              <button className="btn secondary" style={{padding:'6px 12px'}}>🗑</button>
            </div>
          </div>

          <div style={{display:'grid', gap:16}}>
            {budgets.map(b => {
              const percentage = ((b.spent||0)/(b.limit||1)*100);
              const progressColor = getProgressColor(b.spent||0, b.limit);
              return (
                <div key={b.id} style={{background:'#f8fafc', padding:16, borderRadius:8}}>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:8}}>
                    <div style={{fontWeight:600}}>{b.name}</div>
                    <div style={{fontWeight:600}}>₹{(b.spent||0).toFixed(2)} <span style={{color:'#6b7280'}}>of ₹{b.limit.toFixed(2)}</span></div>
                  </div>
                  <div style={{height:6, background:'#e5e7eb', borderRadius:3, overflow:'hidden'}}>
                    <div 
                      style={{
                        height:'100%', 
                        width:`${percentage}%`, 
                        background:progressColor,
                        transition:'width 0.3s ease'
                      }} 
                    />
                  </div>
                  <div style={{fontSize:13, color:'#6b7280', marginTop:4}}>{percentage.toFixed(1)}% used</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {budgets.length === 0 && (
        <div className="card" style={{marginTop:24, textAlign:'center', padding:32, color:'#6b7280'}}>
          No budgets yet
        </div>
      )}
    </div>
  );
}
