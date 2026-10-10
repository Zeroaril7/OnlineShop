import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, LoginCredentials, RegisterCredentials } from '../types/auth';
import { loginUser, registerUser, getCurrentUser } from '../services/api';
import { identifyUser, trackEvent } from '../services/monitoring';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Verifikasi keabsahan token saat aplikasi pertama kali dimuat
  useEffect(() => {
    const verifyExistingToken = async () => {
      const savedToken = localStorage.getItem('token');
      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const { user: verifiedUser } = await getCurrentUser();
        setUser(verifiedUser);
        localStorage.setItem('user', JSON.stringify(verifiedUser));
        identifyUser(verifiedUser);
      } catch (err) {
        console.warn('Sesi tidak valid atau telah kedaluwarsa, melakukan logout otomatis:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyExistingToken();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const res = await loginUser(credentials);
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    setToken(res.token);
    setUser(res.user);
    identifyUser(res.user);
    trackEvent('user_login', { userId: res.user.id, email: res.user.email });
  };

  const register = async (credentials: RegisterCredentials) => {
    const res = await registerUser(credentials);
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    setToken(res.token);
    setUser(res.user);
    identifyUser(res.user);
    trackEvent('user_registered', { userId: res.user.id, email: res.user.email });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    trackEvent('user_logout');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
};
