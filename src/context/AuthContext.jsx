import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'hkfitters_user';
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const login = (email, password) => {
    const emailValue = typeof email === 'string' ? email.trim() : '';
    const passwordValue = typeof password === 'string' ? password : '';

    if (!emailValue || !passwordValue) {
      return false;
    }

    setUser({ email: emailValue });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
