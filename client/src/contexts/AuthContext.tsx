/**
 * AuthContext — ERP Integrated Business Simulator
 * Uses tRPC backend for real email/password authentication.
 * Supports student and teacher/admin roles.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { trpc } from '@/lib/trpc';

export type UserRole = 'admin' | 'teacher' | 'student';

export interface ErpUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  cohortId?: number | null;
}

interface AuthContextType {
  user: ErpUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginAsStudent: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAsTeacher: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ErpUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data: erpMe, refetch: refetchErpMe } = trpc.erp.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (erpMe !== undefined) {
      if (erpMe) {
        setUser({
          id: erpMe.id,
          name: erpMe.name ?? '',
          email: erpMe.email ?? '',
          role: erpMe.role as UserRole,
          cohortId: 'cohortId' in erpMe ? erpMe.cohortId : undefined,
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    }
  }, [erpMe]);

  const studentLoginMutation = trpc.erp.studentLogin.useMutation();
  const teacherLoginMutation = trpc.erp.teacherLogin.useMutation();
  const logoutMutation = trpc.erp.logout.useMutation();

  const loginAsStudent = useCallback(async (email: string, password: string) => {
    try {
      const result = await studentLoginMutation.mutateAsync({ email, password });
      setUser({ id: result.id, name: result.name ?? '', email: result.email ?? '', role: 'student', cohortId: result.cohortId });
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur de connexion';
      return { success: false, error: msg };
    }
  }, [studentLoginMutation]);

  const loginAsTeacher = useCallback(async (email: string, password: string) => {
    try {
      const result = await teacherLoginMutation.mutateAsync({ email, password });
      setUser({ id: result.id, name: result.name ?? '', email: result.email ?? '', role: result.role as UserRole });
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur de connexion';
      return { success: false, error: msg };
    }
  }, [teacherLoginMutation]);

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
    setUser(null);
  }, [logoutMutation]);

  const refetchUser = useCallback(() => {
    refetchErpMe();
  }, [refetchErpMe]);

  // Legacy compat: also check updateProgress for ScenarioPageFull bridge
  const updateProgress = useCallback((_scenarioId: string, _score: number) => {
    // Progress is now saved via trpc.scores.submitScenario — this is a no-op
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      loginAsStudent,
      loginAsTeacher,
      logout,
      refetchUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
