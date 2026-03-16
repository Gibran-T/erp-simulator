import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  cohort?: string;
  avatar?: string;
  progress?: Record<string, number>; // scenarioId -> score
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProgress: (scenarioId: string, score: number) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Demo users
const DEMO_USERS: (User & { password: string })[] = [
  {
    id: 'admin-1',
    name: 'Admin Système',
    email: 'admin@concordia.ca',
    password: 'admin123',
    role: 'admin',
    progress: {}
  },
  {
    id: 'teacher-1',
    name: 'Prof. Marie Dupont',
    email: 'prof@concordia.ca',
    password: 'prof123',
    role: 'teacher',
    progress: {}
  },
  {
    id: 'student-1',
    name: 'Alexandre Tremblay',
    email: 'student@concordia.ca',
    password: 'student123',
    role: 'student',
    cohort: 'ERP-2026-A',
    progress: {}
  },
  {
    id: 'student-2',
    name: 'Sophie Lavoie',
    email: 'sophie@concordia.ca',
    password: 'student123',
    role: 'student',
    cohort: 'ERP-2026-A',
    progress: {}
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('erp_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const found = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      localStorage.setItem('erp_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('erp_user');
  };

  const updateProgress = (scenarioId: string, score: number) => {
    if (!user) return;
    const updated = {
      ...user,
      progress: { ...(user.progress || {}), [scenarioId]: score }
    };
    setUser(updated);
    localStorage.setItem('erp_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateProgress }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
