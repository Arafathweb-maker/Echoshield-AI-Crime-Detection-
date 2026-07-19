import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'echoshield-auth';

function getStoredAuth() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function persistAuth(payload) {
  if (typeof window === 'undefined') {
    return;
  }

  if (payload) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAuth = getStoredAuth();
    if (storedAuth?.token) {
      setToken(storedAuth.token);
      setUser(storedAuth.user);
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${storedAuth.token}` }
      })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error('Session expired');
          }

          const data = await response.json();
          setUser(data.user);
          persistAuth({ token: storedAuth.token, user: data.user });
        })
        .catch(() => {
          setToken(null);
          setUser(null);
          persistAuth(null);
        })
        .finally(() => setLoading(false));
      return;
    }

    setLoading(false);
  }, []);

  const request = async (path, options = {}) => {
    const headers = {
      ...(options.headers || {})
    };

    if (!headers['Content-Type'] && options.body) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(path, { ...options, headers });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  };

  const login = async (credentials) => {
    const data = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });

    setToken(data.token);
    setUser(data.user);
    persistAuth({ token: data.token, user: data.user });
    return data;
  };

  const register = async (credentials) => {
    const data = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });

    setToken(data.token);
    setUser(data.user);
    persistAuth({ token: data.token, user: data.user });
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    persistAuth(null);
  };

  const value = useMemo(() => ({ user, token, loading, login, register, logout, request }), [loading, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
