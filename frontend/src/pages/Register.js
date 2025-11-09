import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register(){
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const nav = useNavigate();

  // Generate a simple captcha on component mount
  React.useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (captchaInput !== captcha) {
      setError('Invalid captcha');
      generateCaptcha();
      setCaptchaInput('');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    const res = await register({ username, email, password });
    if (res.error) {
      setError(res.error);
      generateCaptcha();
      setCaptchaInput('');
      return;
    }
    
    nav('/login');
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') setShowPassword(!showPassword);
    else setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        <h2 style={{textAlign:'center', marginBottom:24, color:'#2563eb', fontSize:24}}>Create Your Account</h2>
        
        {error && (
          <div style={{
            color:'#dc2626', 
            marginBottom:16, 
            background:'#fef2f2', 
            padding:'10px 16px', 
            borderRadius:8, 
            fontSize:14
          }}>
            Registration failed: {error}
          </div>
        )}

        <form onSubmit={submit}>
          <div className="form-row">
            <label>Username</label>
            <input 
              value={username} 
              onChange={e=>setUsername(e.target.value)} 
              required 
              style={{padding:'10px 16px'}}
            />
          </div>

          <div className="form-row">
            <label>Email</label>
            <input 
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              type="email" 
              required 
              style={{padding:'10px 16px'}}
            />
          </div>

          <div className="form-row">
            <label>Password</label>
            <div style={{position:'relative'}}>
              <input 
                value={password} 
                onChange={e=>setPassword(e.target.value)} 
                type={showPassword ? "text" : "password"} 
                required 
                style={{padding:'10px 16px', width:'100%'}}
              />
              <button 
                type="button"
                onClick={() => togglePasswordVisibility('password')}
                style={{
                  position:'absolute',
                  right:12,
                  top:'50%',
                  transform:'translateY(-50%)',
                  border:'none',
                  background:'none',
                  color:'#6b7280',
                  cursor:'pointer'
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="form-row">
            <label>Confirm Password</label>
            <div style={{position:'relative'}}>
              <input 
                value={confirmPassword} 
                onChange={e=>setConfirmPassword(e.target.value)} 
                type={showConfirmPassword ? "text" : "password"} 
                required 
                style={{padding:'10px 16px', width:'100%'}}
              />
              <button 
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                style={{
                  position:'absolute',
                  right:12,
                  top:'50%',
                  transform:'translateY(-50%)',
                  border:'none',
                  background:'none',
                  color:'#6b7280',
                  cursor:'pointer'
                }}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="form-row">
            <label>Captcha</label>
            <div style={{display:'flex', gap:8, alignItems:'center'}}>
              <div style={{
                background:'#f3f4f6',
                padding:'8px 16px',
                borderRadius:6,
                fontFamily:'monospace',
                letterSpacing:2,
                userSelect:'none'
              }}>
                {captcha}
              </div>
              <button 
                type="button" 
                onClick={generateCaptcha}
                style={{
                  border:'none',
                  background:'none',
                  color:'#2563eb',
                  cursor:'pointer',
                  fontSize:20
                }}
              >
                ↺
              </button>
            </div>
            <input 
              value={captchaInput}
              onChange={e=>setCaptchaInput(e.target.value)}
              placeholder="Enter captcha"
              required
              style={{padding:'10px 16px', marginTop:8}}
            />
          </div>

          <button 
            type="submit" 
            className="btn" 
            style={{width:'100%', padding:'12px', marginTop:8}}
          >
            Register
          </button>

          <div style={{textAlign:'center', marginTop:16, fontSize:14}}>
            Already have an account? <Link to="/login" style={{color:'#2563eb', textDecoration:'none'}}>Login here</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
