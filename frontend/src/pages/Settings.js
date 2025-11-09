import React, { useState } from 'react';

export default function Settings(){
  const [settings, setSettings] = useState({
    darkMode: false,
    language: 'us English',
    currency: 'INR (₹) - Indian Rupee',
    monthlyIncome: '100000',
    riskTolerance: 'Moderate - Balanced approach to risk and return'
  });

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveChanges = () => {
    // Save to localStorage or API
    localStorage.setItem('bw_settings', JSON.stringify(settings));
  };

  return (
    <div>
      <div style={{marginBottom:24}}>
        <h1 className="page-title" style={{marginBottom:4}}>Settings</h1>
        <div style={{color:'#6b7280'}}>Manage your app preferences</div>
      </div>

      {/* Appearance */}
      <div className="card" style={{marginBottom:24}}>
        <div style={{display:'flex', gap:12, alignItems:'center', marginBottom:16}}>
          <div style={{
            width:40, 
            height:40, 
            background:'#f3f4f6', 
            borderRadius:8,
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            fontSize:20
          }}>
            ☼
          </div>
          <div>
            <div style={{fontWeight:600, fontSize:16}}>Appearance</div>
            <div style={{color:'#6b7280', fontSize:14}}>Customize how BudgetWise looks</div>
          </div>
        </div>

        <div className="form-row">
          <label>Dark Mode</label>
          <div style={{display:'flex', alignItems:'center', gap:12}}>
            <label style={{display:'flex', alignItems:'center', gap:8, cursor:'pointer'}}>
              <div style={{
                width:44,
                height:24,
                background: settings.darkMode ? '#2563eb' : '#e5e7eb',
                borderRadius:12,
                position:'relative',
                transition:'background-color 0.2s'
              }}>
                <div style={{
                  width:20,
                  height:20,
                  background:'white',
                  borderRadius:'50%',
                  position:'absolute',
                  top:2,
                  left: settings.darkMode ? 22 : 2,
                  transition:'left 0.2s'
                }} />
              </div>
              <span>Switch between light and dark theme</span>
            </label>
            <input 
              type="checkbox"
              checked={settings.darkMode}
              onChange={e => handleChange('darkMode', e.target.checked)}
              style={{display:'none'}}
            />
          </div>
        </div>
      </div>

      {/* Language */}
      <div className="card" style={{marginBottom:24}}>
        <div style={{display:'flex', gap:12, alignItems:'center', marginBottom:16}}>
          <div style={{
            width:40, 
            height:40, 
            background:'#f3f4f6', 
            borderRadius:8,
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            fontSize:20
          }}>
            🌐
          </div>
          <div>
            <div style={{fontWeight:600, fontSize:16}}>Language</div>
            <div style={{color:'#6b7280', fontSize:14}}>Choose your preferred language</div>
          </div>
        </div>

        <div className="form-row">
          <label>Select language</label>
          <select 
            value={settings.language}
            onChange={e => handleChange('language', e.target.value)}
            style={{padding:'10px 16px'}}
          >
            <option value="us English">US English</option>
            <option value="uk English">UK English</option>
            <option value="spanish">Spanish</option>
            <option value="french">French</option>
          </select>
        </div>
      </div>

      {/* Financial Preferences */}
      <div className="card" style={{marginBottom:24}}>
        <div style={{display:'flex', gap:12, alignItems:'center', marginBottom:16}}>
          <div style={{
            width:40, 
            height:40, 
            background:'#f3f4f6', 
            borderRadius:8,
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            fontSize:20
          }}>
            💰
          </div>
          <div>
            <div style={{fontWeight:600, fontSize:16}}>Financial Preferences</div>
            <div style={{color:'#6b7280', fontSize:14}}>Set your currency and financial settings</div>
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:24}}>
          <div className="form-row">
            <label>Preferred Currency</label>
            <select 
              value={settings.currency}
              onChange={e => handleChange('currency', e.target.value)}
              style={{padding:'10px 16px'}}
            >
              <option>INR (₹) - Indian Rupee</option>
              <option>USD ($) - US Dollar</option>
              <option>EUR (€) - Euro</option>
              <option>GBP (£) - British Pound</option>
            </select>
          </div>

          <div className="form-row">
            <label>Average Monthly Income</label>
            <input 
              type="text"
              value={settings.monthlyIncome}
              onChange={e => handleChange('monthlyIncome', e.target.value)}
              style={{padding:'10px 16px'}}
            />
          </div>
        </div>

        <div className="form-row" style={{marginTop:16}}>
          <label>Risk Tolerance</label>
          <select 
            value={settings.riskTolerance}
            onChange={e => handleChange('riskTolerance', e.target.value)}
            style={{padding:'10px 16px'}}
          >
            <option>Conservative - Low risk, stable returns</option>
            <option>Moderate - Balanced approach to risk and return</option>
            <option>Aggressive - Higher risk, potential higher returns</option>
          </select>
        </div>
      </div>

      {/* Save Button */}
      <button 
        onClick={saveChanges}
        className="btn"
        style={{padding:'12px 24px', fontSize:15}}
      >
        Save Changes
      </button>
    </div>
  );
}
