/**
 * StudentsContext — ERP Integrated Business Simulator
 * Manages student and cohort data with localStorage persistence
 * Professor can add/edit/remove students and cohorts
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface Student {
  id: string;
  name: string;
  email: string;
  cohortId: string;
  enrolledAt: string;
  status: 'active' | 'inactive';
  progress: Record<string, number>; // scenarioId -> score
  quizScores: Record<string, number>; // moduleId -> quiz score
  lastActive: string;
  notes?: string;
}

export interface Cohort {
  id: string;
  name: string;
  description: string;
  program: string;
  semester: string;
  year: number;
  status: 'active' | 'completed' | 'planned';
  createdAt: string;
}

interface StudentsContextType {
  students: Student[];
  cohorts: Cohort[];
  addStudent: (student: Omit<Student, 'id' | 'enrolledAt' | 'progress' | 'quizScores' | 'lastActive'>) => { success: boolean; error?: string };
  updateStudent: (id: string, updates: Partial<Student>) => void;
  removeStudent: (id: string) => void;
  addCohort: (cohort: Omit<Cohort, 'id' | 'createdAt'>) => void;
  updateCohort: (id: string, updates: Partial<Cohort>) => void;
  removeCohort: (id: string) => void;
  getStudentsByCohort: (cohortId: string) => Student[];
  getCohortStats: (cohortId: string) => { total: number; active: number; avgScore: number; avgCompletion: number };
}

const StudentsContext = createContext<StudentsContextType | null>(null);

const DEFAULT_COHORTS: Cohort[] = [
  { id: 'erp-2026-a', name: 'ERP-2026-A', description: 'Groupe A — Automne 2026', program: 'Programme 2 — ERP Systems', semester: 'Automne', year: 2026, status: 'active', createdAt: '2026-01-15' },
  { id: 'erp-2026-b', name: 'ERP-2026-B', description: 'Groupe B — Automne 2026', program: 'Programme 2 — ERP Systems', semester: 'Automne', year: 2026, status: 'active', createdAt: '2026-01-15' },
];

const DEFAULT_STUDENTS: Student[] = [
  { id: 's1', name: 'Alexandre Tremblay', email: 'alexandre.tremblay@laconcorde.ca', cohortId: 'erp-2026-a', enrolledAt: '2026-01-15', status: 'active', progress: { 'erp-arch-01': 92, 'erp-arch-02': 88, 'mm-01': 95, 'mm-02': 78 }, quizScores: { 'erp-arch': 85, 'mm': 90 }, lastActive: 'Il y a 2h' },
  { id: 's2', name: 'Sophie Lavoie', email: 'sophie.lavoie@laconcorde.ca', cohortId: 'erp-2026-a', enrolledAt: '2026-01-15', status: 'active', progress: { 'erp-arch-01': 85, 'erp-arch-02': 91, 'mm-01': 87 }, quizScores: { 'erp-arch': 88 }, lastActive: 'Il y a 4h' },
  { id: 's3', name: 'Marc Bouchard', email: 'marc.bouchard@laconcorde.ca', cohortId: 'erp-2026-a', enrolledAt: '2026-01-15', status: 'active', progress: { 'erp-arch-01': 78 }, quizScores: {}, lastActive: 'Hier' },
  { id: 's4', name: 'Julie Gagnon', email: 'julie.gagnon@laconcorde.ca', cohortId: 'erp-2026-b', enrolledAt: '2026-01-15', status: 'active', progress: { 'erp-arch-01': 96, 'erp-arch-02': 94, 'erp-arch-03': 89, 'mm-01': 92, 'mm-02': 88, 'sd-01': 91 }, quizScores: { 'erp-arch': 95, 'mm': 92, 'sd': 88 }, lastActive: 'Il y a 1h' },
  { id: 's5', name: 'Pierre Martin', email: 'pierre.martin@laconcorde.ca', cohortId: 'erp-2026-b', enrolledAt: '2026-01-15', status: 'active', progress: { 'erp-arch-01': 82, 'mm-01': 79 }, quizScores: { 'erp-arch': 80 }, lastActive: 'Il y a 3h' },
  { id: 's6', name: 'Isabelle Roy', email: 'isabelle.roy@laconcorde.ca', cohortId: 'erp-2026-b', enrolledAt: '2026-01-15', status: 'active', progress: { 'erp-arch-01': 90, 'erp-arch-02': 86, 'mm-01': 93, 'sd-01': 88, 'fi-01': 85 }, quizScores: { 'erp-arch': 91, 'mm': 89, 'sd': 86 }, lastActive: 'Il y a 30min' },
];

const TOTAL_SCENARIOS = 15;

function nanoid() {
  return Math.random().toString(36).slice(2, 10);
}

export function StudentsProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const stored = localStorage.getItem('erp_students');
      return stored ? JSON.parse(stored) : DEFAULT_STUDENTS;
    } catch { return DEFAULT_STUDENTS; }
  });

  const [cohorts, setCohorts] = useState<Cohort[]>(() => {
    try {
      const stored = localStorage.getItem('erp_cohorts');
      return stored ? JSON.parse(stored) : DEFAULT_COHORTS;
    } catch { return DEFAULT_COHORTS; }
  });

  useEffect(() => {
    localStorage.setItem('erp_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('erp_cohorts', JSON.stringify(cohorts));
  }, [cohorts]);

  const addStudent = useCallback((student: Omit<Student, 'id' | 'enrolledAt' | 'progress' | 'quizScores' | 'lastActive'>): { success: boolean; error?: string } => {
    // Fix 2: Prevent duplicate emails
    const emailLower = student.email.trim().toLowerCase();
    const duplicate = students.find(s => s.email.toLowerCase() === emailLower);
    if (duplicate) {
      return { success: false, error: `Un étudiant avec l'email "${student.email}" existe déjà (${duplicate.name}).` };
    }
    const newStudent: Student = {
      ...student,
      email: student.email.trim(),
      id: nanoid(),
      enrolledAt: new Date().toISOString().split('T')[0],
      progress: {},
      quizScores: {},
      lastActive: 'Jamais',
    };
    setStudents(prev => [...prev, newStudent]);
    return { success: true };
  }, [students]);

  const updateStudent = useCallback((id: string, updates: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const removeStudent = useCallback((id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  }, []);

  const addCohort = useCallback((cohort: Omit<Cohort, 'id' | 'createdAt'>) => {
    const newCohort: Cohort = {
      ...cohort,
      id: nanoid(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCohorts(prev => [...prev, newCohort]);
  }, []);

  const updateCohort = useCallback((id: string, updates: Partial<Cohort>) => {
    setCohorts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const removeCohort = useCallback((id: string) => {
    setCohorts(prev => prev.filter(c => c.id !== id));
  }, []);

  const getStudentsByCohort = useCallback((cohortId: string) => {
    return students.filter(s => s.cohortId === cohortId);
  }, [students]);

  const getCohortStats = useCallback((cohortId: string) => {
    const cohortStudents = students.filter(s => s.cohortId === cohortId);
    const total = cohortStudents.length;
    const active = cohortStudents.filter(s => s.status === 'active').length;
    const avgScore = total === 0 ? 0 : Math.round(
      cohortStudents.reduce((acc, s) => {
        const scores = Object.values(s.progress);
        return acc + (scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0);
      }, 0) / total
    );
    const avgCompletion = total === 0 ? 0 : Math.round(
      cohortStudents.reduce((acc, s) => acc + (Object.keys(s.progress).length / TOTAL_SCENARIOS) * 100, 0) / total
    );
    return { total, active, avgScore, avgCompletion };
  }, [students]);

  return (
    <StudentsContext.Provider value={{ students, cohorts, addStudent, updateStudent, removeStudent, addCohort, updateCohort, removeCohort, getStudentsByCohort, getCohortStats }}>
      {children}
    </StudentsContext.Provider>
  );
}

export function useStudents() {
  const ctx = useContext(StudentsContext);
  if (!ctx) throw new Error('useStudents must be used within StudentsProvider');
  return ctx;
}
