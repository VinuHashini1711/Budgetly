import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login(){
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e)=>{
    e.preventDefault();
    const res = await login(identifier, password);
    if(res.error){ setError(res.error); return; }
    navigate('/dashboard');
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        <h2 style={{textAlign:'center'}}>Login</h2>
        {error && <div style={{color:'red', marginBottom:8}}>{error}</div>}
        <form onSubmit={submit}>
          <div className="form-row">
            <label>Username or Email</label>
            <input value={identifier} onChange={e=>setIdentifier(e.target.value)} required />
          </div>
          <div className="form-row">
            <label>Password</label>
            <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
          </div>
          <div style={{display:'flex', gap:8}}>
            <button type="submit" className="btn">Login</button>
            <Link to="/register" className="btn secondary" style={{textDecoration:'none', display:'inline-flex', alignItems:'center'}}>Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
