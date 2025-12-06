import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSidebar } from '../context/SidebarContext';

export default function Sidebar(){
  const { user, logout } = useAuth();
  const { isDarkMode } = useTheme();
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const nav = useNavigate();
  const doLogout = ()=>{
    logout();
    nav('/login');
  };

  const subtitleColor = isDarkMode ? '#94a3b8' : '#6b7280';
  const textColor = isDarkMode ? '#cbd5e1' : '#374151';
  const borderColor = isDarkMode ? '#334155' : '#e5e7eb';

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div>
        <div className="logo">
          <div className="app-icon">B</div>
          {!isCollapsed && (
            <div>
              <div style={{fontWeight:700, color: isDarkMode ? '#f1f5f9' : '#111827'}}>BudgetWise</div>
              <div style={{fontSize:12, color: subtitleColor}}>AI Financial Advisor</div>
            </div>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="collapse-btn"
            style={{
              background: 'none',
              border: 'none',
              color: isDarkMode ? '#cbd5e1' : '#374151',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              marginLeft: 'auto',
              fontSize: '16px'
            }}
          >
            ☰
          </button>
        </div>
        <nav className="nav">
          <NavLink to="/dashboard" className={({isActive})=>isActive? 'active':''} title="Dashboard">
            <span style={{display:'flex', gap:8, alignItems:'center'}}>
              <span style={{width:20, display:'inline-flex'}}>📊</span>
              {!isCollapsed && 'Dashboard'}
            </span>
          </NavLink>
          <NavLink to="/transactions" className={({isActive})=>isActive? 'active':''} title="Transactions">
            <span style={{display:'flex', gap:8, alignItems:'center'}}>
              <span style={{width:20, display:'inline-flex'}}>💳</span>
              {!isCollapsed && 'Transactions'}
            </span>
          </NavLink>
          <NavLink to="/budgets" className={({isActive})=>isActive? 'active':''} title="Budgets">
            <span style={{display:'flex', gap:8, alignItems:'center'}}>
              <span style={{width:20, display:'inline-flex'}}>💰</span>
              {!isCollapsed && 'Budgets'}
            </span>
          </NavLink>
          <NavLink to="/goals" className={({isActive})=>isActive? 'active':''} title="Goals">
            <span style={{display:'flex', gap:8, alignItems:'center'}}>
              <span style={{width:20, display:'inline-flex'}}>🎯</span>
              {!isCollapsed && 'Goals'}
            </span>
          </NavLink>
          <NavLink to="/ai-insights" className={({isActive})=>isActive? 'active':''} title="AI Insights">
            <span style={{display:'flex', gap:8, alignItems:'center'}}>
              <span style={{width:20, display:'inline-flex'}}>🤖</span>
              {!isCollapsed && 'AI Insights'}
            </span>
          </NavLink>
          <NavLink to="/analytics" className={({isActive})=>isActive? 'active':''} title="Analytics">
            <span style={{display:'flex', gap:8, alignItems:'center'}}>
              <span style={{width:20, display:'inline-flex'}}>📈</span>
              {!isCollapsed && 'Analytics'}
            </span>
          </NavLink>
          <NavLink to="/community" className={({isActive})=>isActive? 'active':''} title="Community">
            <span style={{display:'flex', gap:8, alignItems:'center'}}>
              <span style={{width:20, display:'inline-flex'}}>💬</span>
              {!isCollapsed && 'Community'}
            </span>
          </NavLink>
          <NavLink to="/export" className={({isActive})=>isActive? 'active':''} title="Export">
            <span style={{display:'flex', gap:8, alignItems:'center'}}>
              <span style={{width:20, display:'inline-flex'}}>📊</span>
              {!isCollapsed && 'Export'}
            </span>
          </NavLink>
          <NavLink to="/profile" className={({isActive})=>isActive? 'active':''} title="Profile">
            <span style={{display:'flex', gap:8, alignItems:'center'}}>
              <span style={{width:20, display:'inline-flex'}}>👤</span>
              {!isCollapsed && 'Profile'}
            </span>
          </NavLink>
          <NavLink to="/settings" className={({isActive})=>isActive? 'active':''} title="Settings">
            <span style={{display:'flex', gap:8, alignItems:'center'}}>
              <span style={{width:20, display:'inline-flex'}}>⚙️</span>
              {!isCollapsed && 'Settings'}
            </span>
          </NavLink>
        </nav>
      </div>

      <div>
        <button onClick={doLogout} className="btn secondary" style={{width:'100%', marginBottom:12}}>
          {isCollapsed ? '↩' : 'Logout'}
        </button>
        <div className="sidebar-bottom" style={{borderTopColor: borderColor}}>
          <div className="avatar">{user && user.username ? user.username[0].toUpperCase() : 'U'}</div>
          {!isCollapsed && (
            <div style={{fontSize:15, color: textColor}}>
              {user?.username}
              <div style={{fontSize:12, color: subtitleColor}}>{user?.email}</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
