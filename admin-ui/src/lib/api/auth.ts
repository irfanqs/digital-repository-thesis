export interface User {
  id: number;
  email: string;
  role: 'STUDENT' | 'LECTURER' | 'ADMIN';
}

export const authApi = {
  async getCurrentUser(): Promise<User | null> {
    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (res.ok) {
        return await res.json();
      }
      return null;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },

  async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
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
        const user = await res.json();
        return { success: true, user };
      } else {
        const error = await res.json();
        return { success: false, error: error.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error' };
    }
  },

  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  async registerStudent(data: {
    email: string;
    password: string;
    name: string;
    studentNumber: string;
    program: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch('/api/auth/register-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        return { success: true };
      } else {
        const error = await res.json();
        return { success: false, error: error.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Network error' };
    }
  },

  async registerLecturer(data: {
    email: string;
    password: string;
    name: string;
    nidn: string;
    department: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch('/api/auth/register-lecturer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        return { success: true };
      } else {
        const error = await res.json();
        return { success: false, error: error.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Network error' };
    }
  },

  async registerAdmin(data: {
    email: string;
    password: string;
    name: string;
    employeeId: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch('/api/auth/register-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        return { success: true };
      } else {
        const error = await res.json();
        return { success: false, error: error.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Network error' };
    }
  },
};
