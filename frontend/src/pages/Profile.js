import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fakeApi } from '../api/fakeApi';

export default function Profile(){
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState({
    fullName: '',
    email: user?.email || '',
    occupation: '',
    address: '',
    phoneNumber: '',
    dateOfBirth: '',
    bio: ''
  });

  useEffect(() => {
    if(user) {
      // Load saved profile from localStorage if it exists
      const savedProfile = localStorage.getItem('user_profile');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      } else {
        setProfile(prev => ({
          ...prev,
          email: user.email
        }));
      }
    }
  }, [user]);

  const getInitial = (name) => {
    return name.charAt(0).toUpperCase();
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('user_profile', JSON.stringify(profile));
    // Show save confirmation
    alert('Profile saved successfully!');
  };

  if(!profile) return <div>Loading...</div>;

  const memberSinceDate = 'Nov 2025';
  const age = calculateAge(profile.dateOfBirth);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title" style={{ marginBottom: 4 }}>Profile</h1>
        <div style={{ color: '#6b7280' }}>Manage your personal information</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Profile Picture and Name */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px' }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: '#6366f1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            color: 'white',
            marginBottom: 16
          }}>
            {getInitial(profile.fullName)}
          </div>
          <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>{profile.fullName}</div>
          <div style={{ color: '#6b7280', marginBottom: 8 }}>{profile.email}</div>
          <div style={{ color: '#6b7280' }}>{profile.occupation}</div>
        </div>

        {/* Member Since */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px' }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: '#eef2ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            color: '#6366f1',
            marginBottom: 16
          }}>
            📅
          </div>
          <div style={{ color: '#6b7280', marginBottom: 4 }}>Member Since</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#6366f1' }}>Nov 2025</div>
        </div>

        {/* Age */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px' }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: '#faf5ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            color: '#9333ea',
            marginBottom: 16
          }}>
            🎂
          </div>
          <div style={{ color: '#6b7280', marginBottom: 4 }}>Age</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#9333ea' }}>
            {calculateAge(profile.dateOfBirth)} years
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="card">
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Personal Information</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          <div className="form-row">
            <label>Full Name</label>
            <input
              type="text"
              value={profile.fullName}
              onChange={e => handleChange('fullName', e.target.value)}
              style={{ padding: '10px 16px' }}
            />
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>Contact support to change your name</div>
          </div>

          <div className="form-row">
            <label>Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={e => handleChange('email', e.target.value)}
              style={{ padding: '10px 16px' }}
              disabled
            />
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>Contact support to change your email</div>
          </div>

          <div className="form-row">
            <label>Occupation</label>
            <input
              type="text"
              value={profile.occupation}
              onChange={e => handleChange('occupation', e.target.value)}
              style={{ padding: '10px 16px' }}
            />
          </div>

          <div className="form-row">
            <label>Phone Number</label>
            <input
              type="tel"
              value={profile.phoneNumber}
              onChange={e => handleChange('phoneNumber', e.target.value)}
              style={{ padding: '10px 16px' }}
            />
          </div>
        </div>

        <div className="form-row" style={{ marginBottom: 24 }}>
          <label>Address</label>
          <input
            type="text"
            value={profile.address}
            onChange={e => handleChange('address', e.target.value)}
            style={{ padding: '10px 16px' }}
          />
        </div>

        <div className="form-row" style={{ marginBottom: 24 }}>
          <label>Date of Birth</label>
          <input
            type="date"
            value={profile.dateOfBirth}
            onChange={e => handleChange('dateOfBirth', e.target.value)}
            style={{ padding: '10px 16px' }}
          />
          <div style={{ fontSize: 14, color: '#6366f1', marginTop: 4 }}>
            You are {calculateAge(profile.dateOfBirth)} years old
          </div>
        </div>

        <div className="form-row" style={{ marginBottom: 24 }}>
          <label>Bio</label>
          <textarea
            value={profile.bio}
            onChange={e => handleChange('bio', e.target.value)}
            style={{ padding: '10px 16px', minHeight: 100 }}
          />
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button 
            onClick={handleSave}
            className="btn"
            style={{ padding: '12px 24px', fontSize: 15 }}
          >
            Save Changes
          </button>
          <button 
            onClick={logout}
            className="btn-secondary"
            style={{ padding: '12px 24px', fontSize: 15 }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
