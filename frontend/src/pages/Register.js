import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Register.css';

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

  // Generate random captcha
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

    // --- Validations ---
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

    // --- Send request ---
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

    // ✅ Registration Success
    setSuccessMsg(res.data?.message || 'Registration successful!');
    setTimeout(() => navigate('/login'), 1500);
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') setShowPassword(!showPassword);
    else setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        <h2
          style={{
            textAlign: 'center',
            marginBottom: 24,
            color: '#2563eb',
            fontSize: 24,
            fontWeight: 'bold',
          }}
        >
          Create Your Account
        </h2>

        {/* Error message */}
        {error && (
          <div
            style={{
              color: '#dc2626',
              marginBottom: 16,
              background: '#fef2f2',
              padding: '10px 16px',
              borderRadius: 8,
              fontSize: 14,
            }}
          >
            Registration failed: {error}
          </div>
        )}

        {/* Success message */}
        {successMsg && (
          <div
            style={{
              color: '#166534',
              marginBottom: 16,
              background: '#dcfce7',
              padding: '10px 16px',
              borderRadius: 8,
              fontSize: 14,
            }}
          >
            {successMsg}
          </div>
        )}

        <form onSubmit={submit}>
          {/* Username */}
          <div className="form-row">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              style={{ padding: '10px 16px' }}
            />
          </div>

          {/* Email */}
          <div className="form-row">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ padding: '10px 16px' }}
            />
          </div>

          {/* Password */}
          <div className="form-row">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                style={{ padding: '10px 16px', width: '100%' }}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('password')}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-row">
            <label>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                style={{ padding: '10px 16px', width: '100%' }}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                }}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Captcha */}
          <div className="form-row">
            <label>Captcha</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div
                style={{
                  background: '#f3f4f6',
                  padding: '8px 16px',
                  borderRadius: 6,
                  fontFamily: 'monospace',
                  letterSpacing: 2,
                  userSelect: 'none',
                }}
              >
                {captcha}
              </div>
              <button
                type="button"
                onClick={generateCaptcha}
                style={{
                  border: 'none',
                  background: 'none',
                  color: '#2563eb',
                  cursor: 'pointer',
                  fontSize: 20,
                }}
              >
                ↺
              </button>
            </div>
            <input
              type="text"
              name="captchaInput"
              value={form.captchaInput}
              onChange={handleChange}
              placeholder="Enter captcha"
              required
              style={{ padding: '10px 16px', marginTop: 8 }}
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="btn"
            style={{
              width: '100%',
              padding: '12px',
              marginTop: 8,
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Register
          </button>

          <div
            style={{
              textAlign: 'center',
              marginTop: 16,
              fontSize: 14,
            }}
          >
            Already have an account?{' '}
            <Link
              to="/login"
              style={{ color: '#2563eb', textDecoration: 'none' }}
            >
              Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
