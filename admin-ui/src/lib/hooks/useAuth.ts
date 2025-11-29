import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export interface User {
  id: number;
  email: string;
  role: 'STUDENT' | 'LECTURER' | 'ADMIN';
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
        return data;
      } else {
        setUser(null);
        return null;
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
        return { success: true, user: data };
      } else {
        const error = await res.json();
        return { success: false, error: error.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      window.location.href = window.location.origin + '/login';
    }
  }, []);

  // Fetch user only once on mount, skip if on login page
  useEffect(() => {
    if (location.pathname === '/login') {
      setLoading(false);
      return;
    }

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return {
    user,
    loading,
    login,
    logout,
    refetch: fetchUser,
  };
}
