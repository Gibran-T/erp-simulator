/**
 * CohortsPage — ERP Integrated Business Simulator
 * Full student management: add/edit/remove students and cohorts
 * Uses tRPC + database (not localStorage)
 */
import { useState, useRef } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
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
function StudentModal({ cohortId, student, cohorts, onClose, onSave, isSaving }: {
  cohortId: number | null;
  student?: DbStudent;
  cohorts: DbCohort[];
  onClose: () => void;
  onSave: (d: { name: string; email: string; password?: string; cohortId: number | null; status: 'active' | 'inactive'; notes?: string }) => void;
  isSaving: boolean;
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
    if (!name.trim()) e.name = 'Le nom est requis';
    if (!email.trim()) e.email = "L'email est requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Email invalide';
    if (!student && password.length < 6) e.password = 'Mot de passe requis (min. 6 caractères)';
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
            {student ? "Modifier l'étudiant" : 'Ajouter un étudiant'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10" style={{ color: 'oklch(0.55 0.010 255)' }}><X size={18} /></button>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'oklch(0.65 0.010 255)' }}>Nom complet *</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="ex. Marie Dupont"
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: 'oklch(0.11 0.015 255)', border: `1px solid ${errors.name ? 'oklch(0.65 0.22 25)' : 'oklch(0.25 0.018 255)'}`, color: 'oklch(0.88 0.005 255)' }} />
          {errors.name && <p className="text-xs mt-1" style={{ color: 'oklch(0.65 0.22 25)' }}>{errors.name}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'oklch(0.65 0.010 255)' }}>Adresse email *</label>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="ex. marie.dupont@laconcorde.ca"
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: 'oklch(0.11 0.015 255)', border: `1px solid ${errors.email ? 'oklch(0.65 0.22 25)' : 'oklch(0.25 0.018 255)'}`, color: 'oklch(0.88 0.005 255)' }} />
          {errors.email && <p className="text-xs mt-1" style={{ color: 'oklch(0.65 0.22 25)' }}>{errors.email}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'oklch(0.65 0.010 255)' }}>
            {student ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe *'}
          </label>
          <div className="relative">
            <KeyRound size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'oklch(0.45 0.010 255)' }} />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder={student ? '••••••••' : 'Min. 6 caractères'}
              className="w-full pl-8 pr-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: 'oklch(0.11 0.015 255)', border: `1px solid ${errors.password ? 'oklch(0.65 0.22 25)' : 'oklch(0.25 0.018 255)'}`, color: 'oklch(0.88 0.005 255)' }} />
          </div>
          {errors.password && <p className="text-xs mt-1" style={{ color: 'oklch(0.65 0.22 25)' }}>{errors.password}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'oklch(0.65 0.010 255)' }}>Cohorte</label>
          <select value={selCohort ?? ''} onChange={e => setSelCohort(e.target.value ? Number(e.target.value) : null)}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: 'oklch(0.11 0.015 255)', border: '1px solid oklch(0.25 0.018 255)', color: 'oklch(0.88 0.005 255)' }}>
            <option value="">— Aucune cohorte —</option>
            {cohorts.map(c => <option key={c.id} value={c.id}>{c.name} — {c.description}</option>)}
          </select>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold" style={{ color: 'oklch(0.65 0.010 255)' }}>Statut</span>
          <button onClick={() => setStatus(s => s === 'active' ? 'inactive' : 'active')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ background: status === 'active' ? 'oklch(0.72 0.16 162 / 20%)' : 'oklch(0.18 0.018 255)', color: status === 'active' ? 'oklch(0.72 0.14 162)' : 'oklch(0.45 0.010 255)' }}>
            {status === 'active' ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
            {status === 'active' ? 'Actif' : 'Inactif'}
          </button>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'oklch(0.65 0.010 255)' }}>Notes (optionnel)</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Remarques..."
            className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
            style={{ background: 'oklch(0.11 0.015 255)', border: '1px solid oklch(0.25 0.018 255)', color: 'oklch(0.88 0.005 255)' }} />
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} disabled={isSaving} className="flex-1 py-2 rounded-lg text-sm font-semibold hover:bg-white/5"
            style={{ border: '1px solid oklch(0.25 0.018 255)', color: 'oklch(0.55 0.010 255)' }}>Annuler</button>
          <button onClick={submit} disabled={isSaving} className="flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2"
            style={{ background: 'oklch(0.60 0.20 255)', color: 'white' }}>
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={15} />}
            {student ? 'Enregistrer' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CohortModal ──────────────────────────────────────────────────────────────
function CohortModal({ cohort, onClose, onSave, isSaving }: {
  cohort?: DbCohort;
  onClose: () => void;
  onSave: (d: { name: string; description?: string; program?: string; semester?: string; year?: number; status: 'active' | 'completed' | 'planned' }) => void;
  isSaving: boolean;
}) {
  const [name, setName] = useState(cohort?.name ?? '');
  const [description, setDescription] = useState(cohort?.description ?? '');
  const [semester, setSemester] = useState(cohort?.semester ?? 'Automne');
  const [year, setYear] = useState(cohort?.year ?? new Date().getFullYear());
  const [status, setStatus] = useState<'active' | 'completed' | 'planned'>(cohort?.status ?? 'active');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit() {
    if (!name.trim()) { setErrors({ name: 'Le nom est requis' }); return; }
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
            {cohort ? 'Modifier la cohorte' : 'Nouvelle cohorte'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10" style={{ color: 'oklch(0.55 0.010 255)' }}><X size={18} /></button>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'oklch(0.65 0.010 255)' }}>Nom *</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="ex. ERP-2026-C"
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: 'oklch(0.11 0.015 255)', border: `1px solid ${errors.name ? 'oklch(0.65 0.22 25)' : 'oklch(0.25 0.018 255)'}`, color: 'oklch(0.88 0.005 255)' }} />
          {errors.name && <p className="text-xs mt-1" style={{ color: 'oklch(0.65 0.22 25)' }}>{errors.name}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'oklch(0.65 0.010 255)' }}>Description</label>
          <input value={description} onChange={e => setDescription(e.target.value)} placeholder="ex. Groupe C — Automne 2026"
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: 'oklch(0.11 0.015 255)', border: '1px solid oklch(0.25 0.018 255)', color: 'oklch(0.88 0.005 255)' }} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'oklch(0.65 0.010 255)' }}>Semestre</label>
            <select value={semester} onChange={e => setSemester(e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: 'oklch(0.11 0.015 255)', border: '1px solid oklch(0.25 0.018 255)', color: 'oklch(0.88 0.005 255)' }}>
              <option value="Automne">Automne</option>
              <option value="Hiver">Hiver</option>
              <option value="Été">Été</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'oklch(0.65 0.010 255)' }}>Année</label>
            <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} min={2024} max={2030}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: 'oklch(0.11 0.015 255)', border: '1px solid oklch(0.25 0.018 255)', color: 'oklch(0.88 0.005 255)' }} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'oklch(0.65 0.010 255)' }}>Statut</label>
          <select value={status} onChange={e => setStatus(e.target.value as 'active' | 'completed' | 'planned')}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: 'oklch(0.11 0.015 255)', border: '1px solid oklch(0.25 0.018 255)', color: 'oklch(0.88 0.005 255)' }}>
            <option value="active">Actif</option>
            <option value="planned">Planifié</option>
            <option value="completed">Complété</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} disabled={isSaving} className="flex-1 py-2 rounded-lg text-sm font-semibold hover:bg-white/5"
            style={{ border: '1px solid oklch(0.25 0.018 255)', color: 'oklch(0.55 0.010 255)' }}>Annuler</button>
          <button onClick={submit} disabled={isSaving} className="flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2"
            style={{ background: 'oklch(0.60 0.20 255)', color: 'white' }}>
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={15} />}
            {cohort ? 'Enregistrer' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ConfirmModal ─────────────────────────────────────────────────────────────
function ConfirmModal({ message, onConfirm, onClose }: { message: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'oklch(0 0 0 / 70%)' }}>
      <div className="w-full max-w-sm rounded-2xl p-6 space-y-4" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(0.65 0.22 25 / 40%)' }}>
        <div className="flex items-center gap-3">
          <AlertTriangle size={22} style={{ color: 'oklch(0.78 0.16 70)' }} />
          <h2 className="text-base font-bold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)' }}>Confirmer la suppression</h2>
        </div>
        <p className="text-sm" style={{ color: 'oklch(0.60 0.010 255)' }}>{message}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg text-sm font-semibold hover:bg-white/5"
            style={{ border: '1px solid oklch(0.25 0.018 255)', color: 'oklch(0.55 0.010 255)' }}>Annuler</button>
          <button onClick={onConfirm} className="flex-1 py-2 rounded-lg text-sm font-bold"
            style={{ background: 'oklch(0.55 0.22 25)', color: 'white' }}>Supprimer</button>
        </div>
      </div>
    </div>
  );
}

// ─── StudentRow ───────────────────────────────────────────────────────────────
function StudentRow({ student, cohorts, onEdit, onRemove }: {
  student: DbStudent; cohorts: DbCohort[];
  onEdit: (s: DbStudent) => void; onRemove: (s: DbStudent) => void;
}) {
  const lastActiveStr = student.lastActive
    ? new Date(student.lastActive).toLocaleDateString('fr-CA', { month: 'short', day: 'numeric' })
    : 'Jamais';

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
            {student.status === 'active' ? 'Actif' : 'Inactif'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs truncate" style={{ color: 'oklch(0.45 0.010 255)' }}>
          <Mail size={10} /> {student.email}
        </div>
      </div>
      <div className="hidden md:block text-center">
        <div className="text-xs" style={{ color: 'oklch(0.40 0.010 255)' }}>{lastActiveStr}</div>
        <div className="text-xs" style={{ color: 'oklch(0.35 0.010 255)' }}>dernière activité</div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => onEdit(student)} className="p-1.5 rounded-lg hover:bg-white/10" style={{ color: 'oklch(0.60 0.20 255)' }} title="Modifier"><Pencil size={14} /></button>
        <button onClick={() => onRemove(student)} className="p-1.5 rounded-lg hover:bg-white/10" style={{ color: 'oklch(0.55 0.22 25)' }} title="Supprimer"><Trash2 size={14} /></button>
      </div>
    </div>
  );
}

// ─── Main CohortsPage ─────────────────────────────────────────────────────────
export default function CohortsPage() {
  const utils = trpc.useUtils();

  // Queries
  const { data: cohorts = [], isLoading: cohortsLoading } = trpc.cohorts.list.useQuery();
  const { data: students = [], isLoading: studentsLoading } = trpc.students.list.useQuery();

  // Cohort mutations
  const createCohort = trpc.cohorts.create.useMutation({
    onSuccess: () => { utils.cohorts.list.invalidate(); toast.success('Cohorte créée'); setShowCohort(false); setEditCohort(undefined); },
    onError: (e) => toast.error(e.message || 'Erreur lors de la création'),
  });
  const updateCohort = trpc.cohorts.update.useMutation({
    onSuccess: () => { utils.cohorts.list.invalidate(); toast.success('Cohorte mise à jour'); setShowCohort(false); setEditCohort(undefined); },
    onError: (e) => toast.error(e.message || 'Erreur lors de la mise à jour'),
  });
  const deleteCohort = trpc.cohorts.delete.useMutation({
    onSuccess: () => { utils.cohorts.list.invalidate(); toast.success('Cohorte supprimée'); setConfirmDel(null); },
    onError: (e) => toast.error(e.message || 'Erreur lors de la suppression'),
  });

  // Student mutations
  const createStudent = trpc.students.create.useMutation({
    onSuccess: () => { utils.students.list.invalidate(); toast.success('Étudiant ajouté'); setShowStudent(false); setEditStudent(undefined); },
    onError: (e) => toast.error(e.message || 'Erreur lors de l\'ajout'),
  });
  const updateStudent = trpc.students.update.useMutation({
    onSuccess: () => { utils.students.list.invalidate(); toast.success('Étudiant mis à jour'); setShowStudent(false); setEditStudent(undefined); },
    onError: (e) => toast.error(e.message || 'Erreur lors de la mise à jour'),
  });
  const resetPassword = trpc.students.resetPassword.useMutation({
    onSuccess: () => toast.success('Mot de passe mis à jour'),
    onError: (e) => toast.error(e.message || 'Erreur lors du changement de mot de passe'),
  });
  const deleteStudent = trpc.students.delete.useMutation({
    onSuccess: () => { utils.students.list.invalidate(); toast.success('Étudiant supprimé'); setConfirmDel(null); },
    onError: (e) => toast.error(e.message || 'Erreur lors de la suppression'),
  });
  const importBulk = trpc.students.importBulk.useMutation({
    onSuccess: (result) => {
      utils.students.list.invalidate();
      toast.success(`${result.created} étudiant(s) importé(s)${result.skipped > 0 ? `, ${result.skipped} ignoré(s)` : ''}`);
      setCsvPreview(null);
    },
    onError: (e) => toast.error(e.message || 'Erreur lors de l\'import'),
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
        if (!name) error = 'Nom manquant';
        else if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) error = 'Email invalide';
        else if (students.find(s => s.email.toLowerCase() === email.toLowerCase())) error = 'Email déjà existant';
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
      if (cs.length > 0) { toast.error(`Impossible: ${cs.length} étudiant(s) dans cette cohorte`); setConfirmDel(null); return; }
      deleteCohort.mutate({ id: confirmDel.id });
    }
  }

  const filtered = search ? students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())) : null;
  const sColor = (s: string) => s === 'active' ? 'oklch(0.72 0.14 162)' : s === 'planned' ? 'oklch(0.78 0.16 70)' : 'oklch(0.45 0.010 255)';
  const sBg = (s: string) => s === 'active' ? 'oklch(0.72 0.16 162 / 20%)' : s === 'planned' ? 'oklch(0.78 0.16 70 / 20%)' : 'oklch(0.18 0.018 255)';
  const sLabel = (s: string) => s === 'active' ? 'Actif' : s === 'planned' ? 'Planifié' : 'Complété';

  const isLoading = cohortsLoading || studentsLoading;
  const isSavingStudent = createStudent.isPending || updateStudent.isPending;
  const isSavingCohort = createCohort.isPending || updateCohort.isPending;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)' }}>Gestion des cohortes</h1>
            <p className="text-sm" style={{ color: 'oklch(0.50 0.010 255)' }}>Gérez vos groupes d'étudiants — Programme 2 ERP</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <input ref={csvInputRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleCsvFile} />
            <button onClick={() => csvInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: 'oklch(0.72 0.16 162 / 20%)', color: 'oklch(0.72 0.14 162)', border: '1px solid oklch(0.72 0.16 162 / 30%)' }}
              title="Importer une liste d'étudiants depuis un fichier CSV">
              <Upload size={16} /> Importer CSV
            </button>
            <button onClick={() => { setEditCohort(undefined); setShowCohort(true); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: 'oklch(0.60 0.20 255)', color: 'white' }}>
              <Plus size={16} /> Nouvelle cohorte
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Cohortes actives', value: activeCohorts, color: 'oklch(0.72 0.16 162)' },
            { label: 'Étudiants total', value: totalStudents, color: 'oklch(0.60 0.20 255)' },
            { label: 'Étudiants actifs', value: activeStudents, color: 'oklch(0.78 0.16 70)' },
            { label: 'Taux d\'activité', value: totalStudents > 0 ? `${Math.round(activeStudents / totalStudents * 100)}%` : '—', color: 'oklch(0.65 0.22 25)' },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-4" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
              <div className="text-2xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk', color: s.color }}>{s.value}</div>
              <div className="text-xs" style={{ color: 'oklch(0.50 0.010 255)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'oklch(0.45 0.010 255)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un étudiant par nom ou email..."
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
            <div className="text-xs font-semibold mb-2" style={{ color: 'oklch(0.55 0.010 255)' }}>{filtered.length} résultat(s) pour "{search}"</div>
            {filtered.length === 0
              ? <p className="text-sm text-center py-4" style={{ color: 'oklch(0.45 0.010 255)' }}>Aucun étudiant trouvé</p>
              : filtered.map(s => <StudentRow key={s.id} student={s} cohorts={cohorts} onEdit={openEditStudent}
                onRemove={st => setConfirmDel({ type: 'student', id: st.id, name: st.name })} />)}
          </div>
        )}

        {!isLoading && !filtered && (
          <div className="space-y-4">
            {cohorts.length === 0 ? (
              <div className="rounded-xl p-10 text-center" style={{ background: 'oklch(0.14 0.018 255)', border: '1px dashed oklch(0.25 0.018 255)' }}>
                <GraduationCap size={36} className="mx-auto mb-3" style={{ color: 'oklch(0.35 0.010 255)' }} />
                <p className="text-sm" style={{ color: 'oklch(0.45 0.010 255)' }}>Aucune cohorte. Créez votre première cohorte.</p>
              </div>
            ) : cohorts.map(cohort => {
              const cs = students.filter(s => s.cohortId === cohort.id);
              const isExp = expanded.has(cohort.id);
              const active = cs.filter(s => s.status === 'active').length;
              return (
                <div key={cohort.id} className="rounded-xl overflow-hidden"
                  style={{ background: 'oklch(0.14 0.018 255)', border: `1px solid ${cohort.status === 'active' ? 'oklch(0.60 0.20 255 / 25%)' : 'oklch(1 0 0 / 6%)'}` }}>
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
                        <UserPlus size={13} /> Ajouter
                      </button>
                      <button onClick={() => { setEditCohort(cohort); setShowCohort(true); }} className="p-1.5 rounded-lg hover:bg-white/10" style={{ color: 'oklch(0.60 0.20 255)' }} title="Modifier"><Pencil size={14} /></button>
                      <button onClick={() => setConfirmDel({ type: 'cohort', id: cohort.id, name: cohort.name })} className="p-1.5 rounded-lg hover:bg-white/10" style={{ color: 'oklch(0.55 0.22 25)' }} title="Supprimer"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 border-t" style={{ borderColor: 'oklch(1 0 0 / 5%)' }}>
                    {[
                      { label: 'Étudiants', value: cs.length },
                      { label: 'Actifs', value: active },
                      { label: 'Inactifs', value: cs.length - active },
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
                          <p className="text-sm" style={{ color: 'oklch(0.45 0.010 255)' }}>Aucun étudiant dans cette cohorte.</p>
                          <button onClick={() => openAddStudent(cohort.id)} className="mt-2 text-xs font-semibold" style={{ color: 'oklch(0.60 0.20 255)' }}>+ Ajouter le premier étudiant</button>
                        </div>
                      ) : (
                        <>
                          <div className="text-xs font-semibold mb-2" style={{ color: 'oklch(0.45 0.010 255)' }}>{cs.length} étudiant{cs.length > 1 ? 's' : ''}</div>
                          {cs.map(s => <StudentRow key={s.id} student={s} cohorts={cohorts} onEdit={openEditStudent}
                            onRemove={st => setConfirmDel({ type: 'student', id: st.id, name: st.name })} />)}
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
      />}
      {showCohort && <CohortModal
        cohort={editCohort}
        onClose={() => { setShowCohort(false); setEditCohort(undefined); }}
        onSave={saveCohort}
        isSaving={isSavingCohort}
      />}

      {/* CSV Preview Modal */}
      {csvPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'oklch(0 0 0 / 75%)' }}>
          <div className="w-full max-w-lg rounded-2xl p-6 space-y-4" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(0.72 0.16 162 / 30%)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={18} style={{ color: 'oklch(0.72 0.14 162)' }} />
                <h2 className="text-lg font-bold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)' }}>Aperçu de l'import</h2>
              </div>
              <button onClick={() => setCsvPreview(null)} className="p-1.5 rounded-lg hover:bg-white/10" style={{ color: 'oklch(0.55 0.010 255)' }}><X size={18} /></button>
            </div>
            <p className="text-xs" style={{ color: 'oklch(0.50 0.010 255)' }}>
              Fichier : <strong style={{ color: 'oklch(0.72 0.14 162)' }}>{csvPreview.fileName}</strong> — {csvPreview.rows.filter(r => r.valid).length} valide(s), {csvPreview.rows.filter(r => !r.valid).length} ignoré(s)
            </p>
            <p className="text-xs" style={{ color: 'oklch(0.60 0.16 70)' }}>
              Mot de passe par défaut : <code style={{ color: 'oklch(0.78 0.16 70)' }}>Concorde2026!</code> — à changer lors de la première connexion
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
                      {cohorts.find(c => c.id === row.cohortId)?.name || 'Cohorte par défaut'}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>Format attendu : <code style={{ color: 'oklch(0.72 0.14 162)' }}>nom,email</code> ou <code style={{ color: 'oklch(0.72 0.14 162)' }}>nom,email,cohorte</code> — une ligne par étudiant</p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setCsvPreview(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: 'oklch(0.18 0.018 255)', color: 'oklch(0.65 0.010 255)' }}>Annuler</button>
              <button onClick={confirmCsvImport} disabled={csvPreview.rows.filter(r => r.valid).length === 0 || importBulk.isPending}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40 flex items-center justify-center gap-2"
                style={{ background: 'oklch(0.72 0.16 162)', color: 'white' }}>
                {importBulk.isPending ? <Loader2 size={14} className="animate-spin" /> : null}
                Importer {csvPreview.rows.filter(r => r.valid).length} étudiant(s)
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDel && <ConfirmModal
        message={confirmDel.type === 'student'
          ? `Supprimer l'étudiant "${confirmDel.name}" ? Cette action est irréversible.`
          : `Supprimer la cohorte "${confirmDel.name}" ? Les étudiants associés ne seront pas supprimés.`}
        onConfirm={doDelete} onClose={() => setConfirmDel(null)} />}
    </DashboardLayout>
  );
}
