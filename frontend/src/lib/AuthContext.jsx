import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '@/lib/api';
import { appParams } from '@/lib/app-params';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      setAuthError(null);
      
      // Check for Telegram WebApp initData
      const tg = window.Telegram?.WebApp;
      const initData = tg?.initData;

      if (initData) {
        try {
          setIsLoadingAuth(true);
          const { token, user: userData } = await api.post('/auth/telegram', { initData });
          localStorage.setItem('token', token);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Telegram auth failed:', error);
          setAuthError({ type: 'auth_failed', message: 'Failed to authenticate with Telegram' });
        } finally {
          setIsLoadingAuth(false);
          setAuthChecked(true);
        }
      } else if (appParams.token) {
        await checkUserAuth();
      } else {
        setIsLoadingAuth(false);
        setIsAuthenticated(false);
        setAuthChecked(true);
      }
    };
    initAuth();
  }, []);

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      // Direct call to our custom API
      const currentUser = await api.get('/auth/me');
      setUser(currentUser);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      setAuthChecked(true);
    } catch (error) {
      console.error('User auth check failed:', error);
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      setAuthChecked(true);
      
      // If user auth fails, it might be an expired token
      if (error.status === 401 || error.status === 403) {
        setAuthError({
          type: 'auth_required',
          message: 'Authentication required'
        });
      }
    }
  };

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    
    localStorage.removeItem('access_token');
    localStorage.removeItem('token');

    if (shouldRedirect) {
      window.location.href = '/login';
    }
  };

  const navigateToLogin = () => {
    const returnUrl = encodeURIComponent(window.location.href);
    window.location.href = `/login?return_url=${returnUrl}`;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth, 
      authError,
      authChecked,
      logout,
      navigateToLogin,
      checkUserAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
