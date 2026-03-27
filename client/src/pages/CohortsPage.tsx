/**
 * CohortsPage — ERP Integrated Business Simulator
 * Full student management: add/edit/remove students and cohorts
 * Uses tRPC + database (not localStorage)
 * v2.1: Full FR/EN bilingual support via useLang
 */
import { useState, useRef } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { useLang } from '@/contexts/LanguageContext';
import {
  Users, Plus, Pencil, Trash2, ChevronRight, ChevronDown,
  BookOpen, X, Check, UserPlus, Mail, Search, AlertTriangle,
  GraduationCap, Calendar, ToggleLeft, ToggleRight, Upload, FileText,
  Loader2, KeyRound
} from 'lucide-react';

// ─── Types from DB ────────────────────────────────────────────────────────────
interface DbStudent {
  id: number;
  name: string;
  email: string;
  cohortId: number | null;
  status: 'active' | 'inactive';
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  lastActive: Date | null;
}

interface DbCohort {
  id: number;
  name: string;
  description: string | null;
  program: string | null;
  semester: string | null;
  year: number | null;
  status: 'active' | 'completed' | 'planned';
  createdAt: Date;
  updatedAt: Date;
}

// ─── StudentModal ─────────────────────────────────────────────────────────────
function StudentModal({ cohortId, student, cohorts, onClose, onSave, isSaving, t }: {
  cohortId: number | null;
  student?: DbStudent;
  cohorts: DbCohort[];
  onClose: () => void;
  onSave: (d: { name: string; email: string; password?: string; cohortId: number | null; status: 'active' | 'inactive'; notes?: string }) => void;
  isSaving: boolean;
  t: (k: string) => string;
}) {
  const [name, setName] = useState(student?.name ?? '');
  const [email, setEmail] = useState(student?.email ?? '');
  const [password, setPassword] = useState('');
  const [selCohort, setSelCohort] = useState<number | null>(student?.cohortId ?? cohortId);
  const [status, setStatus] = useState<'active' | 'inactive'>(student?.status ?? 'active');
  const [notes, setNotes] = useState(student?.notes ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = t('cohorts.nameRequired');
    if (!email.trim()) e.email = t('cohorts.emailRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = t('cohorts.emailInvalid');
    if (!student && password.length < 6) e.password = t('cohorts.passwordRequired');
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({
      name: name.trim(),
      email: email.trim(),
      password: password || undefined,
      cohortId: selCohort,
      status,
      notes: notes.trim() || undefined
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'oklch(0 0 0 / 70%)' }}>
      <div className="w-full max-w-md rounded-2xl p-6 space-y-4" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(0.60 0.20 255 / 30%)' }}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)' }}>
            {student ? t('cohorts.editStudent') : t('cohorts.addStudent')}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10" style={{ color: 'oklch(0.55 0.010 255)' }}><X size={18} /></button>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'oklch(0.65 0.010 255)' }}>{t('cohorts.fullName')} *</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="ex. Marie Dupont"
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: 'oklch(0.11 0.015 255)', border: `1px solid ${errors.name ? 'oklch(0.65 0.22 25)' : 'oklch(0.25 0.018 255)'}`, color: 'oklch(0.88 0.005 255)' }} />
          {errors.name && <p className="text-xs mt-1" style={{ color: 'oklch(0.65 0.22 25)' }}>{errors.name}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'oklch(0.65 0.010 255)' }}>{t('cohorts.emailAddress')} *</label>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="ex. marie.dupont@laconcorde.ca"
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: 'oklch(0.11 0.015 255)', border: `1px solid ${errors.email ? 'oklch(0.65 0.22 25)' : 'oklch(0.25 0.018 255)'}`, color: 'oklch(0.88 0.005 255)' }} />
          {errors.email && <p className="text-xs mt-1" style={{ color: 'oklch(0.65 0.22 25)' }}>{errors.email}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'oklch(0.65 0.010 255)' }}>
            {student ? t('cohorts.newPasswordOptional') : `${t('cohorts.password')} *`}
          </label>
          <div className="relative">
            <KeyRound size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'oklch(0.45 0.010 255)' }} />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder={student ? '••••••••' : t('cohorts.passwordMin')}
              className="w-full pl-8 pr-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: 'oklch(0.11 0.015 255)', border: `1px solid ${errors.password ? 'oklch(0.65 0.22 25)' : 'oklch(0.25 0.018 255)'}`, color: 'oklch(0.88 0.005 255)' }} />
          </div>
          {errors.password && <p className="text-xs mt-1" style={{ color: 'oklch(0.65 0.22 25)' }}>{errors.password}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'oklch(0.65 0.010 255)' }}>{t('cohorts.cohort')}</label>
          <select value={selCohort ?? ''} onChange={e => setSelCohort(e.target.value ? Number(e.target.value) : null)}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: 'oklch(0.11 0.015 255)', border: '1px solid oklch(0.25 0.018 255)', color: 'oklch(0.88 0.005 255)' }}>
            <option value="">— {t('cohorts.noCohort')} —</option>
            {cohorts.map(c => <option key={c.id} value={c.id}>{c.name} — {c.description}</option>)}
          </select>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold" style={{ color: 'oklch(0.65 0.010 255)' }}>{t('cohorts.status')}</span>
          <button onClick={() => setStatus(s => s === 'active' ? 'inactive' : 'active')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ background: status === 'active' ? 'oklch(0.72 0.16 162 / 20%)' : 'oklch(0.18 0.018 255)', color: status === 'active' ? 'oklch(0.72 0.14 162)' : 'oklch(0.45 0.010 255)' }}>
            {status === 'active' ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
            {status === 'active' ? t('cohorts.active') : t('cohorts.inactive')}
          </button>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'oklch(0.65 0.010 255)' }}>{t('cohorts.notes')}</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder={t('cohorts.remarks')}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
            style={{ background: 'oklch(0.11 0.015 255)', border: '1px solid oklch(0.25 0.018 255)', color: 'oklch(0.88 0.005 255)' }} />
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} disabled={isSaving} className="flex-1 py-2 rounded-lg text-sm font-semibold hover:bg-white/5"
            style={{ border: '1px solid oklch(0.25 0.018 255)', color: 'oklch(0.55 0.010 255)' }}>{t('common.cancel')}</button>
          <button onClick={submit} disabled={isSaving} className="flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2"
            style={{ background: 'oklch(0.60 0.20 255)', color: 'white' }}>
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={15} />}
            {student ? t('common.save') : t('common.add')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CohortModal ──────────────────────────────────────────────────────────────
function CohortModal({ cohort, onClose, onSave, isSaving, t }: {
  cohort?: DbCohort;
  onClose: () => void;
  onSave: (d: { name: string; description?: string; program?: string; semester?: string; year?: number; status: 'active' | 'completed' | 'planned' }) => void;
  isSaving: boolean;
  t: (k: string) => string;
}) {
  const [name, setName] = useState(cohort?.name ?? '');
  const [description, setDescription] = useState(cohort?.description ?? '');
  const [semester, setSemester] = useState(cohort?.semester ?? 'Automne');
  const [year, setYear] = useState(cohort?.year ?? new Date().getFullYear());
  const [status, setStatus] = useState<'active' | 'completed' | 'planned'>(cohort?.status ?? 'active');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit() {
    if (!name.trim()) { setErrors({ name: t('cohorts.nameRequired') }); return; }
    onSave({
      name: name.trim(),
      description: description.trim() || `${name.trim()} — ${semester} ${year}`,
      program: 'Programme 2 — ERP Systems',
      semester,
      year,
      status
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'oklch(0 0 0 / 70%)' }}>
      <div className="w-full max-w-md rounded-2xl p-6 space-y-4" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(0.60 0.20 255 / 30%)' }}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)' }}>
            {cohort ? t('cohorts.editCohort') : t('cohorts.newCohort')}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10" style={{ color: 'oklch(0.55 0.010 255)' }}><X size={18} /></button>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'oklch(0.65 0.010 255)' }}>{t('cohorts.cohortName')} *</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="ex. ERP-2026-C"
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: 'oklch(0.11 0.015 255)', border: `1px solid ${errors.name ? 'oklch(0.65 0.22 25)' : 'oklch(0.25 0.018 255)'}`, color: 'oklch(0.88 0.005 255)' }} />
          {errors.name && <p className="text-xs mt-1" style={{ color: 'oklch(0.65 0.22 25)' }}>{errors.name}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'oklch(0.65 0.010 255)' }}>{t('cohorts.description')}</label>
          <input value={description} onChange={e => setDescription(e.target.value)} placeholder="ex. Groupe C — Automne 2026"
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: 'oklch(0.11 0.015 255)', border: '1px solid oklch(0.25 0.018 255)', color: 'oklch(0.88 0.005 255)' }} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'oklch(0.65 0.010 255)' }}>{t('cohorts.semester')}</label>
            <select value={semester} onChange={e => setSemester(e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: 'oklch(0.11 0.015 255)', border: '1px solid oklch(0.25 0.018 255)', color: 'oklch(0.88 0.005 255)' }}>
              <option value="Automne">{t('cohorts.fall')}</option>
              <option value="Hiver">{t('cohorts.winter')}</option>
              <option value="Été">{t('cohorts.summer')}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'oklch(0.65 0.010 255)' }}>{t('cohorts.year')}</label>
            <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} min={2024} max={2030}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: 'oklch(0.11 0.015 255)', border: '1px solid oklch(0.25 0.018 255)', color: 'oklch(0.88 0.005 255)' }} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'oklch(0.65 0.010 255)' }}>{t('cohorts.status')}</label>
          <select value={status} onChange={e => setStatus(e.target.value as 'active' | 'completed' | 'planned')}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: 'oklch(0.11 0.015 255)', border: '1px solid oklch(0.25 0.018 255)', color: 'oklch(0.88 0.005 255)' }}>
            <option value="active">{t('cohorts.active')}</option>
            <option value="planned">{t('cohorts.planned')}</option>
            <option value="completed">{t('cohorts.completed')}</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} disabled={isSaving} className="flex-1 py-2 rounded-lg text-sm font-semibold hover:bg-white/5"
            style={{ border: '1px solid oklch(0.25 0.018 255)', color: 'oklch(0.55 0.010 255)' }}>{t('common.cancel')}</button>
          <button onClick={submit} disabled={isSaving} className="flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2"
            style={{ background: 'oklch(0.60 0.20 255)', color: 'white' }}>
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={15} />}
            {cohort ? t('common.save') : t('common.create')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ConfirmModal ─────────────────────────────────────────────────────────────
function ConfirmModal({ message, onConfirm, onClose, t }: { message: string; onConfirm: () => void; onClose: () => void; t: (k: string) => string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'oklch(0 0 0 / 70%)' }}>
      <div className="w-full max-w-sm rounded-2xl p-6 space-y-4" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(0.65 0.22 25 / 40%)' }}>
        <div className="flex items-center gap-3">
          <AlertTriangle size={22} style={{ color: 'oklch(0.78 0.16 70)' }} />
          <h2 className="text-base font-bold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)' }}>{t('cohorts.confirmDelete')}</h2>
        </div>
        <p className="text-sm" style={{ color: 'oklch(0.60 0.010 255)' }}>{message}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg text-sm font-semibold hover:bg-white/5"
            style={{ border: '1px solid oklch(0.25 0.018 255)', color: 'oklch(0.55 0.010 255)' }}>{t('common.cancel')}</button>
          <button onClick={onConfirm} className="flex-1 py-2 rounded-lg text-sm font-bold"
            style={{ background: 'oklch(0.55 0.22 25)', color: 'white' }}>{t('common.delete')}</button>
        </div>
      </div>
    </div>
  );
}

// ─── StudentRow ───────────────────────────────────────────────────────────────
function StudentRow({ student, cohorts, onEdit, onRemove, t }: {
  student: DbStudent; cohorts: DbCohort[];
  onEdit: (s: DbStudent) => void; onRemove: (s: DbStudent) => void;
  t: (k: string) => string;
}) {
  void cohorts;
  const lastActiveStr = student.lastActive
    ? new Date(student.lastActive).toLocaleDateString('fr-CA', { month: 'short', day: 'numeric' })
    : t('common.never');

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
      style={{ background: 'oklch(0.11 0.015 255)', border: '1px solid oklch(1 0 0 / 5%)' }}>
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
        style={{ background: student.status === 'active' ? 'oklch(0.60 0.20 255 / 20%)' : 'oklch(0.18 0.018 255)', color: student.status === 'active' ? 'oklch(0.72 0.16 255)' : 'oklch(0.45 0.010 255)' }}>
        {student.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold truncate" style={{ color: 'oklch(0.88 0.005 255)' }}>{student.name}</span>
          <span className="text-xs px-1.5 py-0.5 rounded-full shrink-0"
            style={{ background: student.status === 'active' ? 'oklch(0.72 0.16 162 / 20%)' : 'oklch(0.18 0.018 255)', color: student.status === 'active' ? 'oklch(0.72 0.14 162)' : 'oklch(0.45 0.010 255)' }}>
            {student.status === 'active' ? t('cohorts.active') : t('cohorts.inactive')}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs truncate" style={{ color: 'oklch(0.45 0.010 255)' }}>
          <Mail size={10} /> {student.email}
        </div>
      </div>
      <div className="hidden md:block text-center">
        <div className="text-xs" style={{ color: 'oklch(0.40 0.010 255)' }}>{lastActiveStr}</div>
        <div className="text-xs" style={{ color: 'oklch(0.35 0.010 255)' }}>{t('cohorts.lastActivity')}</div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => onEdit(student)} className="p-1.5 rounded-lg hover:bg-white/10" style={{ color: 'oklch(0.60 0.20 255)' }} title={t('common.edit')}><Pencil size={14} /></button>
        <button onClick={() => onRemove(student)} className="p-1.5 rounded-lg hover:bg-white/10" style={{ color: 'oklch(0.55 0.22 25)' }} title={t('common.delete')}><Trash2 size={14} /></button>
      </div>
    </div>
  );
}

// ─── Main CohortsPage ─────────────────────────────────────────────────────────
export default function CohortsPage() {
  const { t } = useLang();
  const utils = trpc.useUtils();

  // Queries
  const { data: cohorts = [], isLoading: cohortsLoading } = trpc.cohorts.list.useQuery();
  const { data: students = [], isLoading: studentsLoading } = trpc.students.list.useQuery();

  // Cohort mutations
  const createCohort = trpc.cohorts.create.useMutation({
    onSuccess: () => { utils.cohorts.list.invalidate(); toast.success(t('cohorts.toastCohortCreated')); setShowCohort(false); setEditCohort(undefined); },
    onError: (e) => toast.error(e.message || t('cohorts.toastError')),
  });
  const updateCohort = trpc.cohorts.update.useMutation({
    onSuccess: () => { utils.cohorts.list.invalidate(); toast.success(t('cohorts.toastCohortUpdated')); setShowCohort(false); setEditCohort(undefined); },
    onError: (e) => toast.error(e.message || t('cohorts.toastError')),
  });
  const deleteCohort = trpc.cohorts.delete.useMutation({
    onSuccess: () => { utils.cohorts.list.invalidate(); toast.success(t('cohorts.toastCohortDeleted')); setConfirmDel(null); },
    onError: (e) => toast.error(e.message || t('cohorts.toastError')),
  });

  // Student mutations
  const createStudent = trpc.students.create.useMutation({
    onSuccess: () => { utils.students.list.invalidate(); toast.success(t('cohorts.toastStudentAdded')); setShowStudent(false); setEditStudent(undefined); },
    onError: (e) => toast.error(e.message || t('cohorts.toastError')),
  });
  const updateStudent = trpc.students.update.useMutation({
    onSuccess: () => { utils.students.list.invalidate(); toast.success(t('cohorts.toastStudentUpdated')); setShowStudent(false); setEditStudent(undefined); },
    onError: (e) => toast.error(e.message || t('cohorts.toastError')),
  });
  const resetPassword = trpc.students.resetPassword.useMutation({
    onSuccess: () => toast.success(t('cohorts.toastPasswordUpdated')),
    onError: (e) => toast.error(e.message || t('cohorts.toastError')),
  });
  const deleteStudent = trpc.students.delete.useMutation({
    onSuccess: () => { utils.students.list.invalidate(); toast.success(t('cohorts.toastStudentDeleted')); setConfirmDel(null); },
    onError: (e) => toast.error(e.message || t('cohorts.toastError')),
  });
  const importBulk = trpc.students.importBulk.useMutation({
    onSuccess: (result) => {
      utils.students.list.invalidate();
      toast.success(`${result.created} ${t('cohorts.toastImported')}${result.skipped > 0 ? `, ${result.skipped} ${t('cohorts.toastSkipped')}` : ''}`);
      setCsvPreview(null);
    },
    onError: (e) => toast.error(e.message || t('cohorts.toastError')),
  });

  // UI state
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState('');
  const [showStudent, setShowStudent] = useState(false);
  const [showCohort, setShowCohort] = useState(false);
  const [editStudent, setEditStudent] = useState<DbStudent | undefined>();
  const [editCohort, setEditCohort] = useState<DbCohort | undefined>();
  const [confirmDel, setConfirmDel] = useState<{ type: 'student' | 'cohort'; id: number; name: string } | null>(null);
  const [addToCohort, setAddToCohort] = useState<number | null>(null);
  const [csvPreview, setCsvPreview] = useState<{ rows: Array<{ name: string; email: string; cohortId: number | null; valid: boolean; error?: string }>; fileName: string } | null>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  // Auto-expand active cohorts when data loads
  const [autoExpanded, setAutoExpanded] = useState(false);
  if (!autoExpanded && cohorts.length > 0) {
    setAutoExpanded(true);
    setExpanded(new Set(cohorts.filter(c => c.status === 'active').map(c => c.id)));
  }

  function handleCsvFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split(/\r?\n/).filter(l => l.trim());
      const dataLines = lines[0] && !lines[0].includes('@') ? lines.slice(1) : lines;
      const defaultCohortId = cohorts.find(c => c.status === 'active')?.id ?? null;
      const rows = dataLines.map(line => {
        const parts = line.split(/[,;\t]/).map(p => p.trim().replace(/^"|"$/g, ''));
        const name = parts[0] || '';
        const email = parts[1] || '';
        const cohortName = parts[2] || '';
        const matchedCohort = cohortName ? cohorts.find(c => c.name.toLowerCase() === cohortName.toLowerCase()) : null;
        const cohortId = matchedCohort?.id ?? defaultCohortId;
        let error: string | undefined;
        if (!name) error = t('cohorts.csvErrorName');
        else if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) error = t('cohorts.emailInvalid');
        else if (students.find(s => s.email.toLowerCase() === email.toLowerCase())) error = t('cohorts.csvErrorDuplicate');
        return { name, email, cohortId, valid: !error, error };
      }).filter(r => r.name || r.email);
      setCsvPreview({ rows, fileName: file.name });
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function confirmCsvImport() {
    if (!csvPreview) return;
    const valid = csvPreview.rows.filter(r => r.valid);
    const defaultPassword = 'Concorde2026!';
    importBulk.mutate(valid.map(r => ({
      name: r.name,
      email: r.email,
      password: defaultPassword,
      cohortId: r.cohortId ?? undefined,
    })));
  }

  // Derived stats
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const activeCohorts = cohorts.filter(c => c.status === 'active').length;

  function toggle(id: number) { setExpanded(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  function openAddStudent(cohortId: number | null) { setAddToCohort(cohortId); setEditStudent(undefined); setShowStudent(true); }
  function openEditStudent(s: DbStudent) { setEditStudent(s); setAddToCohort(s.cohortId); setShowStudent(true); }

  function saveStudent(d: { name: string; email: string; password?: string; cohortId: number | null; status: 'active' | 'inactive'; notes?: string }) {
    if (editStudent) {
      updateStudent.mutate({ id: editStudent.id, name: d.name, email: d.email, cohortId: d.cohortId, status: d.status, notes: d.notes });
      if (d.password) resetPassword.mutate({ id: editStudent.id, newPassword: d.password });
    } else {
      if (!d.password) return;
      createStudent.mutate({ name: d.name, email: d.email, password: d.password, cohortId: d.cohortId ?? undefined, notes: d.notes });
    }
  }

  function saveCohort(d: { name: string; description?: string; program?: string; semester?: string; year?: number; status: 'active' | 'completed' | 'planned' }) {
    if (editCohort) {
      updateCohort.mutate({ id: editCohort.id, ...d });
    } else {
      createCohort.mutate(d);
    }
  }

  function doDelete() {
    if (!confirmDel) return;
    if (confirmDel.type === 'student') {
      deleteStudent.mutate({ id: confirmDel.id });
    } else {
      const cs = students.filter(s => s.cohortId === confirmDel.id);
      if (cs.length > 0) { toast.error(`${t('cohorts.cannotDelete')}: ${cs.length} ${t('cohorts.studentsInCohort')}`); setConfirmDel(null); return; }
      deleteCohort.mutate({ id: confirmDel.id });
    }
  }

  const filtered = search ? students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())) : null;
  const sColor = (s: string) => s === 'active' ? 'oklch(0.72 0.14 162)' : s === 'planned' ? 'oklch(0.78 0.16 70)' : 'oklch(0.45 0.010 255)';
  const sBg = (s: string) => s === 'active' ? 'oklch(0.72 0.16 162 / 20%)' : s === 'planned' ? 'oklch(0.78 0.16 70 / 20%)' : 'oklch(0.18 0.018 255)';
  const sLabel = (s: string) => s === 'active' ? t('cohorts.active') : s === 'planned' ? t('cohorts.planned') : t('cohorts.completed');

  const isLoading = cohortsLoading || studentsLoading;
  const isSavingStudent = createStudent.isPending || updateStudent.isPending;
  const isSavingCohort = createCohort.isPending || updateCohort.isPending;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)' }}>{t('cohorts.title')}</h1>
            <p className="text-sm" style={{ color: 'oklch(0.50 0.010 255)' }}>{t('cohorts.subtitle')}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <input ref={csvInputRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleCsvFile} />
            <button onClick={() => csvInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: 'oklch(0.72 0.16 162 / 20%)', color: 'oklch(0.72 0.14 162)', border: '1px solid oklch(0.72 0.16 162 / 30%)' }}
              title={t('cohorts.importCsvHint')}>
              <Upload size={16} /> {t('cohorts.importCsv')}
            </button>
            <button onClick={() => { setEditCohort(undefined); setShowCohort(true); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: 'oklch(0.60 0.20 255)', color: 'white' }}>
              <Plus size={16} /> {t('cohorts.newCohort')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: t('cohorts.activeCohorts'), value: activeCohorts, color: 'oklch(0.72 0.16 162)' },
            { label: t('cohorts.totalStudents'), value: totalStudents, color: 'oklch(0.60 0.20 255)' },
            { label: t('cohorts.activeStudents'), value: activeStudents, color: 'oklch(0.78 0.16 70)' },
            { label: t('cohorts.activityRate'), value: totalStudents > 0 ? `${Math.round(activeStudents / totalStudents * 100)}%` : '—', color: 'oklch(0.65 0.22 25)' },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-4" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
              <div className="text-2xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk', color: s.color }}>{s.value}</div>
              <div className="text-xs" style={{ color: 'oklch(0.50 0.010 255)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'oklch(0.45 0.010 255)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('cohorts.searchPlaceholder')}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 8%)', color: 'oklch(0.88 0.005 255)' }} />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'oklch(0.45 0.010 255)' }}><X size={14} /></button>}
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={32} className="animate-spin" style={{ color: 'oklch(0.60 0.20 255)' }} />
          </div>
        )}

        {!isLoading && filtered && (
          <div className="rounded-xl p-4 space-y-2" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(0.60 0.20 255 / 20%)' }}>
            <div className="text-xs font-semibold mb-2" style={{ color: 'oklch(0.55 0.010 255)' }}>{filtered.length} {t('cohorts.resultsFor')} "{search}"</div>
            {filtered.length === 0
              ? <p className="text-sm text-center py-4" style={{ color: 'oklch(0.45 0.010 255)' }}>{t('cohorts.noStudentFound')}</p>
              : filtered.map(s => <StudentRow key={s.id} student={s} cohorts={cohorts} onEdit={openEditStudent}
                onRemove={st => setConfirmDel({ type: 'student', id: st.id, name: st.name })} t={t} />)}
          </div>
        )}

        {!isLoading && !filtered && (
          <div className="space-y-4">
            {cohorts.length === 0 ? (
              <div className="rounded-xl p-10 text-center" style={{ background: 'oklch(0.14 0.018 255)', border: '1px dashed oklch(0.25 0.018 255)' }}>
                <GraduationCap size={36} className="mx-auto mb-3" style={{ color: 'oklch(0.35 0.010 255)' }} />
                <p className="text-sm" style={{ color: 'oklch(0.45 0.010 255)' }}>{t('cohorts.noCohortYet')}</p>
              </div>
            ) : cohorts.map(cohort => {
              const cs = students.filter(s => s.cohortId === cohort.id);
              const isExp = expanded.has(cohort.id);
              const active = cs.filter(s => s.status === 'active').length;
              return (
                <div key={cohort.id} className="rounded-xl overflow-hidden"
                  style={{ background: 'oklch(0.14 0.018 255)', border: `1px solid ${cohort.status === 'active' ? 'oklch(0.60 0.20 255 / 20%)' : 'oklch(1 0 0 / 6%)'}` }}>
                  <div className="flex items-center gap-3 p-4">
                    <button onClick={() => toggle(cohort.id)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: cohort.status === 'active' ? 'oklch(0.60 0.20 255 / 20%)' : 'oklch(0.18 0.018 255)', color: cohort.status === 'active' ? 'oklch(0.72 0.16 255)' : 'oklch(0.45 0.010 255)' }}>
                        <Users size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-base font-bold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.88 0.005 255)' }}>{cohort.name}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: sBg(cohort.status), color: sColor(cohort.status) }}>{sLabel(cohort.status)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs mt-0.5" style={{ color: 'oklch(0.45 0.010 255)' }}>
                          {cohort.program && <span className="flex items-center gap-1"><BookOpen size={10} /> {cohort.program}</span>}
                          {cohort.semester && <span className="flex items-center gap-1"><Calendar size={10} /> {cohort.semester} {cohort.year}</span>}
                        </div>
                      </div>
                      {isExp ? <ChevronDown size={16} style={{ color: 'oklch(0.45 0.010 255)' }} /> : <ChevronRight size={16} style={{ color: 'oklch(0.45 0.010 255)' }} />}
                    </button>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => openAddStudent(cohort.id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold"
                        style={{ background: 'oklch(0.60 0.20 255 / 15%)', color: 'oklch(0.72 0.16 255)' }}>
                        <UserPlus size={13} /> {t('common.add')}
                      </button>
                      <button onClick={() => { setEditCohort(cohort); setShowCohort(true); }} className="p-1.5 rounded-lg hover:bg-white/10" style={{ color: 'oklch(0.60 0.20 255)' }} title={t('common.edit')}><Pencil size={14} /></button>
                      <button onClick={() => setConfirmDel({ type: 'cohort', id: cohort.id, name: cohort.name })} className="p-1.5 rounded-lg hover:bg-white/10" style={{ color: 'oklch(0.55 0.22 25)' }} title={t('common.delete')}><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 border-t" style={{ borderColor: 'oklch(1 0 0 / 5%)' }}>
                    {[
                      { label: t('common.students'), value: cs.length },
                      { label: t('cohorts.active'), value: active },
                      { label: t('cohorts.inactive'), value: cs.length - active },
                    ].map((item, i) => (
                      <div key={i} className="text-center py-2.5 px-2" style={{ borderRight: i < 2 ? '1px solid oklch(1 0 0 / 5%)' : 'none' }}>
                        <div className="text-sm font-bold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.85 0.005 255)' }}>{item.value}</div>
                        <div className="text-xs" style={{ color: 'oklch(0.40 0.010 255)' }}>{item.label}</div>
                      </div>
                    ))}
                  </div>
                  {isExp && (
                    <div className="border-t px-4 py-3 space-y-2" style={{ borderColor: 'oklch(1 0 0 / 5%)' }}>
                      {cs.length === 0 ? (
                        <div className="text-center py-6">
                          <UserPlus size={24} className="mx-auto mb-2" style={{ color: 'oklch(0.35 0.010 255)' }} />
                          <p className="text-sm" style={{ color: 'oklch(0.45 0.010 255)' }}>{t('cohorts.noStudentsInCohort')}</p>
                          <button onClick={() => openAddStudent(cohort.id)} className="mt-2 text-xs font-semibold" style={{ color: 'oklch(0.60 0.20 255)' }}>+ {t('cohorts.addFirstStudent')}</button>
                        </div>
                      ) : (
                        <>
                          <div className="text-xs font-semibold mb-2" style={{ color: 'oklch(0.45 0.010 255)' }}>{cs.length} {t('common.students').toLowerCase()}</div>
                          {cs.map(s => <StudentRow key={s.id} student={s} cohorts={cohorts} onEdit={openEditStudent}
                            onRemove={st => setConfirmDel({ type: 'student', id: st.id, name: st.name })} t={t} />)}
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showStudent && <StudentModal
        cohortId={addToCohort}
        student={editStudent}
        cohorts={cohorts}
        onClose={() => { setShowStudent(false); setEditStudent(undefined); }}
        onSave={saveStudent}
        isSaving={isSavingStudent}
        t={t}
      />}
      {showCohort && <CohortModal
        cohort={editCohort}
        onClose={() => { setShowCohort(false); setEditCohort(undefined); }}
        onSave={saveCohort}
        isSaving={isSavingCohort}
        t={t}
      />}

      {/* CSV Preview Modal */}
      {csvPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'oklch(0 0 0 / 75%)' }}>
          <div className="w-full max-w-lg rounded-2xl p-6 space-y-4" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(0.72 0.16 162 / 30%)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={18} style={{ color: 'oklch(0.72 0.14 162)' }} />
                <h2 className="text-lg font-bold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)' }}>{t('cohorts.csvPreviewTitle')}</h2>
              </div>
              <button onClick={() => setCsvPreview(null)} className="p-1.5 rounded-lg hover:bg-white/10" style={{ color: 'oklch(0.55 0.010 255)' }}><X size={18} /></button>
            </div>
            <p className="text-xs" style={{ color: 'oklch(0.50 0.010 255)' }}>
              {t('cohorts.csvFile')} : <strong style={{ color: 'oklch(0.72 0.14 162)' }}>{csvPreview.fileName}</strong> — {csvPreview.rows.filter(r => r.valid).length} {t('cohorts.csvValid')}, {csvPreview.rows.filter(r => !r.valid).length} {t('cohorts.csvSkipped')}
            </p>
            <p className="text-xs" style={{ color: 'oklch(0.60 0.16 70)' }}>
              {t('cohorts.csvDefaultPassword')} : <code style={{ color: 'oklch(0.78 0.16 70)' }}>Concorde2026!</code> — {t('cohorts.csvPasswordHint')}
            </p>
            <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
              {csvPreview.rows.map((row, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg"
                  style={{ background: row.valid ? 'oklch(0.72 0.16 162 / 8%)' : 'oklch(0.65 0.22 25 / 8%)', border: `1px solid ${row.valid ? 'oklch(0.72 0.16 162 / 20%)' : 'oklch(0.65 0.22 25 / 20%)'}` }}>
                  <div className="shrink-0">
                    {row.valid
                      ? <Check size={14} style={{ color: 'oklch(0.72 0.14 162)' }} />
                      : <X size={14} style={{ color: 'oklch(0.65 0.22 25)' }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate" style={{ color: 'oklch(0.85 0.005 255)' }}>{row.name || '—'}</div>
                    <div className="text-xs truncate" style={{ color: 'oklch(0.50 0.010 255)' }}>{row.email || '—'}</div>
                  </div>
                  {!row.valid && <span className="text-xs shrink-0" style={{ color: 'oklch(0.65 0.22 25)' }}>{row.error}</span>}
                  {row.valid && (
                    <span className="text-xs shrink-0" style={{ color: 'oklch(0.50 0.010 255)' }}>
                      {cohorts.find(c => c.id === row.cohortId)?.name || t('cohorts.defaultCohort')}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>{t('cohorts.csvFormat')}</p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setCsvPreview(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: 'oklch(0.18 0.018 255)', color: 'oklch(0.65 0.010 255)' }}>{t('common.cancel')}</button>
              <button onClick={confirmCsvImport} disabled={csvPreview.rows.filter(r => r.valid).length === 0 || importBulk.isPending}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40 flex items-center justify-center gap-2"
                style={{ background: 'oklch(0.72 0.16 162)', color: 'white' }}>
                {importBulk.isPending ? <Loader2 size={14} className="animate-spin" /> : null}
                {t('cohorts.importCount').replace('{n}', String(csvPreview.rows.filter(r => r.valid).length))}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDel && <ConfirmModal
        message={confirmDel.type === 'student'
          ? t('cohorts.confirmDeleteStudent').replace('{name}', confirmDel.name)
          : t('cohorts.confirmDeleteCohort').replace('{name}', confirmDel.name)}
        onConfirm={doDelete} onClose={() => setConfirmDel(null)} t={t} />}
    </DashboardLayout>
  );
}
