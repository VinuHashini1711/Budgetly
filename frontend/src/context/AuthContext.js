import React, { createContext, useContext, useEffect, useState } from 'react';
import { fakeApi } from '../api/fakeApi';

const AuthContext = createContext();

export function AuthProvider({ children }){
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('bw_user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(()=>{
    // if token exists but user is not set (simple restore)
    const token = localStorage.getItem('bw_token');
    if(token && !user){
      const raw = localStorage.getItem('bw_user');
      if(raw) setUser(JSON.parse(raw));
    }
  },[]);

  const login = async (identifier, password) => {
    const res = await fakeApi.login({ identifier, password });
    if(res.token){
      const userWithJoinDate = {
        ...res.user,
        joinDate: 'Nov 2025'
      };
      localStorage.setItem('bw_token', res.token);
      localStorage.setItem('bw_user', JSON.stringify(userWithJoinDate));
      setUser(userWithJoinDate);
    }
    return res;
  };

  const register = async (payload) => {
    const res = await fakeApi.register(payload);
    return res;
  };

  const logout = () =>{
    localStorage.removeItem('bw_token');
    localStorage.removeItem('bw_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(){
  return useContext(AuthContext);
}
