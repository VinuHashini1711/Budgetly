import React, { useEffect, useState } from 'react';
import { fakeApi } from '../api/fakeApi';

const CATEGORIES = ['Salary', 'Housing', 'Food', 'Transport', 'Shopping', 'Entertainment', 'Healthcare', 'Education', 'Other'];

export default function Transactions(){
  const [txns, setTxns] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [form, setForm] = useState({ 
    title:'', 
    amount:0, 
    type:'expense', 
    category:'Housing', 
    date:new Date().toISOString().slice(0,10),
    paymentMethod: 'Cash'
  });

  useEffect(()=>{ load(); },[]);
  
  const load = async ()=>{
    const list = await fakeApi.listTransactions();
    setTxns(list);
  };

  const add = async (e)=>{
    e.preventDefault();
    const t = { ...form, amount:Number(form.amount) };
    await fakeApi.addTransaction(t);
    setForm({ 
      title:'', 
      amount:0, 
      type:'expense', 
      category:'Housing', 
      date:new Date().toISOString().slice(0,10),
      paymentMethod: 'Cash'
    });
    load();
    document.getElementById('addForm').close();
  };

  const remove = async (id)=>{ 
    await fakeApi.deleteTransaction(id); 
    load(); 
  };

  const exportCSV = () => {
    const headers = ['Date', 'Title', 'Category', 'Amount', 'Type', 'Payment Method'];
    const csvContent = [
      headers.join(','),
      ...txns.map(t => [
        t.date,
        t.title,
        t.category,
        t.amount,
        t.type,
        t.paymentMethod
      ].join(','))
    ].join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'transactions.csv';
    link.click();
  };

  const filteredTxns = txns
    .filter(t => {
      if (filter === 'income') return t.type === 'income';
      if (filter === 'expenses') return t.type === 'expense';
      return true;
    })
    .filter(t => {
      if (selectedCategory !== 'All Categories') return t.category === selectedCategory;
      return true;
    })
    .filter(t => 
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24}}>
        <div>
          <h1 className="page-title" style={{marginBottom:4}}>Transactions</h1>
          <div style={{color:'#6b7280'}}>Track all your income and expenses</div>
        </div>
        <div style={{display:'flex', gap:8}}>
          <button onClick={exportCSV} className="btn secondary" style={{display:'flex', alignItems:'center', gap:4}}>
            <span style={{fontSize:18}}>↓</span> Export CSV
          </button>
          <button onClick={()=>document.getElementById('addForm').showModal()} className="btn">
            + Add Transaction
          </button>
        </div>
      </div>

      <div style={{display:'flex', gap:12, marginBottom:16}}>
        <div className="card" style={{flex:1}}>
          <input 
            type="text" 
            value={search} 
            onChange={e=>setSearch(e.target.value)}
            placeholder="Search transactions..."
            style={{width:'100%', padding:'10px 16px', border:'1px solid #e5e7eb', borderRadius:8}}
          />
        </div>
        <div style={{display:'flex', alignItems:'center', gap:2, background:'#fff', padding:4, borderRadius:8}}>
          <button 
            onClick={()=>setFilter('all')} 
            className={filter==='all'?'btn':'btn secondary'}
          >All</button>
          <button 
            onClick={()=>setFilter('income')} 
            className={filter==='income'?'btn':'btn secondary'}
          >Income</button>
          <button 
            onClick={()=>setFilter('expenses')} 
            className={filter==='expenses'?'btn':'btn secondary'}
          >Expenses</button>
        </div>
        <select 
          value={selectedCategory} 
          onChange={e=>setSelectedCategory(e.target.value)}
          style={{padding:'8px 16px', borderRadius:8, border:'1px solid #e5e7eb'}}
        >
          <option>All Categories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="card">
        <div className="transactions-list">
          {filteredTxns.length === 0 && 
            <div style={{textAlign:'center', padding:32, color:'#6b7280'}}>
              No transactions found
            </div>
          }
          {filteredTxns.map(t=> (
            <div key={t.id} className="txn" style={{display:'flex', justifyContent:'space-between', padding:'16px 20px', alignItems:'center'}}>
              <div style={{display:'flex', gap:16, alignItems:'center'}}>
                <div style={{
                  width:40, height:40, borderRadius:'50%', 
                  background: t.type==='income' ? '#dcfce7' : '#fee2e2',
                  color: t.type==='income' ? '#15803d' : '#dc2626',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:20
                }}>
                  {t.type === 'income' ? '↑' : '↓'}
                </div>
                <div>
                  <div style={{fontWeight:600, fontSize:15}}>{t.title}</div>
                  <div style={{fontSize:13, color:'#6b7280'}}>{t.category} • {t.paymentMethod} • {new Date(t.date).toLocaleDateString()}</div>
                </div>
              </div>
              <div style={{display:'flex', gap:12, alignItems:'center'}}>
                <div style={{fontWeight:600, fontSize:15, color:t.type==='income'?'#15803d':'#dc2626'}}>
                  {t.type==='income'?'+':'-'}₹{t.amount.toFixed(2)}
                </div>
                <button onClick={()=>remove(t.id)} style={{padding:8, border:'none', background:'none', cursor:'pointer', color:'#dc2626'}}>
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <dialog id="addForm" className="card" style={{border:'none', borderRadius:12, minWidth:400}}>
        <h3 style={{marginTop:0}}>Add Transaction</h3>
        <form onSubmit={add}>
          <div className="form-row">
            <label>Title</label>
            <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
          </div>
          <div className="form-row">
            <label>Amount</label>
            <input type="number" value={form.amount} onChange={e=>setForm({...form, amount:e.target.value})} required />
          </div>
          <div className="form-row">
            <label>Type</label>
            <select value={form.type} onChange={e=>setForm({...form, type:e.target.value})}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div className="form-row">
            <label>Category</label>
            <select value={form.category} onChange={e=>setForm({...form, category:e.target.value})}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-row">
            <label>Date</label>
            <input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} />
          </div>
          <div className="form-row">
            <label>Payment Method</label>
            <select value={form.paymentMethod} onChange={e=>setForm({...form, paymentMethod:e.target.value})}>
              <option>Cash</option>
              <option>Card</option>
              <option>UPI</option>
              <option>Bank Transfer</option>
            </select>
          </div>
          <div style={{display:'flex', gap:8, marginTop:24}}>
            <button type="submit" className="btn">Add Transaction</button>
            <button type="button" className="btn secondary" onClick={()=>document.getElementById('addForm').close()}>
              Cancel
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
