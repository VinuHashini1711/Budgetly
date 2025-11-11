import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(identifier, password);
    if (res.error) {
      setError(res.error);
      return;
    }
    navigate('/dashboard');
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        <h2
          style={{
            textAlign: 'center',
            marginBottom: 24,
            color: '#2563eb',
            fontSize: 22,
            fontWeight: 'bold',
          }}
        >
          Login
        </h2>

        {error && (
          <div
            style={{
              color: '#dc2626',
              marginBottom: 12,
              background: '#fef2f2',
              padding: '8px 12px',
              borderRadius: 6,
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username or Email */}
          <div className="form-row" style={{ marginBottom: 14 }}>
            <label>Username or Email</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              style={{
                padding: '10px 16px',
                width: '100%',
                borderRadius: 6,
                border: '1px solid #d1d5db',
                outline: 'none',
              }}
            />
          </div>

          {/* Password Field */}
          <div className="form-row" style={{ marginBottom: 18 }}>
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  padding: '10px 40px 10px 16px',
                  width: '100%',
                  borderRadius: 6,
                  border: '1px solid #d1d5db',
                  outline: 'none',
                }}
              />
              {/* Blue Eye Icon */}
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  fontSize: 18,
                  color: '#2563eb', // Blue eye color
                  userSelect: 'none',
                  transition: 'color 0.2s ease',
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                &#128065;
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="submit"
              style={{
                flex: 1,
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                padding: '10px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Login
            </button>

            <Link
              to="/register"
              style={{
                flex: 1,
                textAlign: 'center',
                border: '1px solid #2563eb',
                borderRadius: 6,
                padding: '10px',
                color: '#2563eb',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
