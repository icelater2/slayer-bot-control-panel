import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { User, AuthState } from '../types';
import { getUserInfo } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (token: string) => void;
  logout: () => void;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null
};

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: () => {},
  logout: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  const login = (token: string) => {
    Cookies.set('discord_token', token, { expires: 7 });
    setAuthState(prev => ({ ...prev, loading: true }));
    
    getUserInfo(token)
      .then(user => {
        setAuthState({
          isAuthenticated: true,
          user,
          loading: false,
          error: null
        });
      })
      .catch(error => {
        console.error('Authentication error:', error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: 'Failed to authenticate with Discord'
        });
        Cookies.remove('discord_token');
      });
  };

  const logout = () => {
    Cookies.remove('discord_token');
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null
    });
  };

  useEffect(() => {
    const token = Cookies.get('discord_token');
    
    if (token) {
      getUserInfo(token)
        .then(user => {
          setAuthState({
            isAuthenticated: true,
            user,
            loading: false,
            error: null
          });
        })
        .catch(() => {
          setAuthState({
            isAuthenticated: false,
            user: null,
            loading: false,
            error: null
          });
          Cookies.remove('discord_token');
        });
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};