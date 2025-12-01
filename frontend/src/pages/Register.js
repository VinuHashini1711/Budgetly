import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    captchaInput: '',
  });

  const [captcha, setCaptcha] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!form.username || !form.email || !form.password) {
      setError('All fields are required.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (form.captchaInput !== captcha) {
      setError('Invalid captcha');
      generateCaptcha();
      setForm({ ...form, captchaInput: '' });
      return;
    }

    const res = await register({
      username: form.username,
      email: form.email,
      password: form.password,
      confirmPassword: form.confirmPassword,
      captchaValue: form.captchaInput,
    });

    if (!res.success) {
      setError(res.error);
      generateCaptcha();
      setForm({ ...form, captchaInput: '' });
      return;
    }

    setSuccessMsg(res.data?.message || 'Registration successful!');
    setTimeout(() => navigate('/login'), 1500);
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') setShowPassword(!showPassword);
    else setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="login-modern-wrapper">
      {/* Animated Background */}
      <div className="login-animated-bg">
        <div className="login-blob blob-1"></div>
        <div className="login-blob blob-2"></div>
        <div className="login-blob blob-3"></div>
      </div>

      {/* Main Container */}
      <div className="login-modern-container">
        {/* Register Form - Centered */}
        <div className="login-center-panel">
          <div className="login-form-wrapper">
            <div className="login-form-header">
              <h2>Create Your Account</h2>
              <p>Join BudgetwiseAI to start managing your finances</p>
            </div>

            {error && (
              <div className="login-error-banner">
                <span className="login-error-icon">⚠️</span>
                <div>
                  <strong>Registration Error</strong>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {successMsg && (
              <div className="login-error-banner" style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', border: '1px solid #6ee7b7' }}>
                <span className="login-error-icon">✅</span>
                <div>
                  <strong style={{ color: '#065f46' }}>Success</strong>
                  <p style={{ color: '#047857' }}>{successMsg}</p>
                </div>
              </div>
            )}

            <form onSubmit={submit} className="login-form-modern">
              {/* Username */}
              <div className="login-input-group">
                <label htmlFor="username" className="login-label">
                  <span className="login-label-icon">👤</span>
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  required
                  className="login-input-field"
                />
              </div>

              {/* Email */}
              <div className="login-input-group">
                <label htmlFor="email" className="login-label">
                  <span className="login-label-icon">📧</span>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="login-input-field"
                />
              </div>

              {/* Password */}
              <div className="login-input-group">
                <label htmlFor="password" className="login-label">
                  <span className="login-label-icon">🔐</span>
                  Password
                </label>
                <div className="login-password-wrapper">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="login-input-field"
                  />
                  <button
                    type="button"
                    className="login-toggle-password"
                    onClick={() => togglePasswordVisibility('password')}
                  >
                    {showPassword ? '👁️' : '👁️🗨️'}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="login-input-group">
                <label htmlFor="confirmPassword" className="login-label">
                  <span className="login-label-icon">🔐</span>
                  Confirm Password
                </label>
                <div className="login-password-wrapper">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    className="login-input-field"
                  />
                  <button
                    type="button"
                    className="login-toggle-password"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showConfirmPassword ? '👁️' : '👁️🗨️'}
                  </button>
                </div>
              </div>

              {/* Captcha */}
              <div className="login-input-group">
                <label htmlFor="captcha" className="login-label">
                  <span className="login-label-icon">🔒</span>
                  Captcha
                </label>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10 }}>
                  <div style={{
                    background: '#1e293b',
                    color: '#f1f5f9',
                    padding: '12px 18px',
                    borderRadius: 8,
                    fontFamily: 'monospace',
                    letterSpacing: 3,
                    userSelect: 'none',
                    border: '2px solid #334155'
                  }}>
                    {captcha}
                  </div>
                  <button
                    type="button"
                    onClick={generateCaptcha}
                    style={{
                      border: 'none',
                      background: '#667eea',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: 16,
                      padding: '8px 12px',
                      borderRadius: 6
                    }}
                  >
                    ↺
                  </button>
                </div>
                <input
                  id="captcha"
                  type="text"
                  name="captchaInput"
                  value={form.captchaInput}
                  onChange={handleChange}
                  placeholder="Enter captcha"
                  required
                  className="login-input-field"
                />
              </div>

              {/* Register Button */}
              <button
                type="submit"
                className="login-submit-btn"
              >
                Create Account
                <span className="login-btn-arrow">→</span>
              </button>

              {/* Login Link */}
              <div className="login-register-prompt">
                <p>Already have an account? <Link to="/login" className="login-register-link">Sign in</Link></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}