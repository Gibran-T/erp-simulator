/**
 * CohortsPage — ERP Integrated Business Simulator
 * Full student management: add/edit/remove students and cohorts
 */
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useStudents, Student, Cohort } from '@/contexts/StudentsContext';
import { toast } from 'sonner';
import {
  Users, Plus, Pencil, Trash2, ChevronRight, ChevronDown,
  BookOpen, X, Check, UserPlus, Mail, Search, AlertTriangle,
  GraduationCap, Calendar, ToggleLeft, ToggleRight
} from 'lucide-react';

function StudentModal({ cohortId, student, cohorts, onClose, onSave }: {
  cohortId: string; student?: Student; cohorts: Cohort[];
  onClose: () => void;
  onSave: (d: { name: string; email: string; cohortId: string; status: 'active' | 'inactive'; notes?: string }) => void;
}) {
  const [name, setName] = useState(student?.name ?? '');
  const [email, setEmail] = useState(student?.email ?? '');
  const [selCohort, setSelCohort] = useState(student?.cohortId ?? cohortId);
  const [status, setStatus] = useState<'active' | 'inactive'>(student?.status ?? 'active');
  const [notes, setNotes] = useState(student?.notes ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Le nom est requis';
    if (!email.trim()) e.email = "L'email est requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Email invalide';
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ name: name.trim(), email: email.trim(), cohortId: selCohort, status, notes: notes.trim() || undefined });
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
          <label className="block text-xs font-semibold mb-1" style={{ color: 'oklch(0.65 0.010 255)' }}>Cohorte</label>
          <select value={selCohort} onChange={e => setSelCohort(e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: 'oklch(0.11 0.015 255)', border: '1px solid oklch(0.25 0.018 255)', color: 'oklch(0.88 0.005 255)' }}>
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
          <button onClick={onClose} className="flex-1 py-2 rounded-lg text-sm font-semibold hover:bg-white/5"
            style={{ border: '1px solid oklch(0.25 0.018 255)', color: 'oklch(0.55 0.010 255)' }}>Annuler</button>
          <button onClick={submit} className="flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2"
            style={{ background: 'oklch(0.60 0.20 255)', color: 'white' }}>
            <Check size={15} /> {student ? 'Enregistrer' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
}

function CohortModal({ cohort, onClose, onSave }: {
  cohort?: Cohort; onClose: () => void;
  onSave: (d: Omit<Cohort, 'id' | 'createdAt'>) => void;
}) {
  const [name, setName] = useState(cohort?.name ?? '');
  const [description, setDescription] = useState(cohort?.description ?? '');
  const [semester, setSemester] = useState(cohort?.semester ?? 'Automne');
  const [year, setYear] = useState(cohort?.year ?? new Date().getFullYear());
  const [status, setStatus] = useState<'active' | 'completed' | 'planned'>(cohort?.status ?? 'active');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit() {
    if (!name.trim()) { setErrors({ name: 'Le nom est requis' }); return; }
    onSave({ name: name.trim(), description: description.trim() || `${name.trim()} — ${semester} ${year}`, program: 'Programme 2 — ERP Systems', semester, year, status });
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
          <button onClick={onClose} className="flex-1 py-2 rounded-lg text-sm font-semibold hover:bg-white/5"
            style={{ border: '1px solid oklch(0.25 0.018 255)', color: 'oklch(0.55 0.010 255)' }}>Annuler</button>
          <button onClick={submit} className="flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2"
            style={{ background: 'oklch(0.60 0.20 255)', color: 'white' }}>
            <Check size={15} /> {cohort ? 'Enregistrer' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  );
}

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

function StudentRow({ student, cohorts, onEdit, onRemove }: {
  student: Student; cohorts: Cohort[];
  onEdit: (s: Student) => void; onRemove: (s: Student) => void;
}) {
  const done = Object.keys(student.progress).length;
  const avg = done > 0 ? Math.round(Object.values(student.progress).reduce((a, b) => a + b, 0) / done) : 0;
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
      <div className="hidden sm:flex items-center gap-4 text-center">
        <div>
          <div className="text-sm font-bold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.85 0.005 255)' }}>{done}</div>
          <div className="text-xs" style={{ color: 'oklch(0.40 0.010 255)' }}>scénarios</div>
        </div>
        <div>
          <div className="text-sm font-bold" style={{ fontFamily: 'Space Grotesk', color: avg >= 70 ? 'oklch(0.72 0.16 162)' : avg >= 50 ? 'oklch(0.78 0.16 70)' : avg > 0 ? 'oklch(0.65 0.22 25)' : 'oklch(0.45 0.010 255)' }}>
            {avg > 0 ? `${avg}%` : '—'}
          </div>
          <div className="text-xs" style={{ color: 'oklch(0.40 0.010 255)' }}>score moy.</div>
        </div>
        <div className="hidden md:block">
          <div className="text-xs" style={{ color: 'oklch(0.40 0.010 255)' }}>{student.lastActive}</div>
          <div className="text-xs" style={{ color: 'oklch(0.35 0.010 255)' }}>dernière activité</div>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => onEdit(student)} className="p-1.5 rounded-lg hover:bg-white/10" style={{ color: 'oklch(0.60 0.20 255)' }} title="Modifier"><Pencil size={14} /></button>
        <button onClick={() => onRemove(student)} className="p-1.5 rounded-lg hover:bg-white/10" style={{ color: 'oklch(0.55 0.22 25)' }} title="Supprimer"><Trash2 size={14} /></button>
      </div>
    </div>
  );
}

export default function CohortsPage() {
  const { students, cohorts, addStudent, updateStudent, removeStudent, addCohort, updateCohort, removeCohort, getStudentsByCohort, getCohortStats } = useStudents();
  const [expanded, setExpanded] = useState<Set<string>>(new Set(cohorts.filter(c => c.status === 'active').map(c => c.id)));
  const [search, setSearch] = useState('');
  const [showStudent, setShowStudent] = useState(false);
  const [showCohort, setShowCohort] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | undefined>();
  const [editCohort, setEditCohort] = useState<Cohort | undefined>();
  const [confirmDel, setConfirmDel] = useState<{ type: 'student' | 'cohort'; id: string; name: string } | null>(null);
  const [addToCohort, setAddToCohort] = useState('');

  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const activeCohorts = cohorts.filter(c => c.status === 'active').length;
  const globalAvg = students.length === 0 ? 0 : Math.round(
    students.reduce((acc, s) => {
      const sc = Object.values(s.progress);
      return acc + (sc.length > 0 ? sc.reduce((a, b) => a + b, 0) / sc.length : 0);
    }, 0) / students.length
  );

  function toggle(id: string) { setExpanded(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  function openAddStudent(cohortId: string) { setAddToCohort(cohortId); setEditStudent(undefined); setShowStudent(true); }
  function openEditStudent(s: Student) { setEditStudent(s); setAddToCohort(s.cohortId); setShowStudent(true); }

  function saveStudent(d: { name: string; email: string; cohortId: string; status: 'active' | 'inactive'; notes?: string }) {
    if (editStudent) { updateStudent(editStudent.id, d); toast.success(`Étudiant ${d.name} mis à jour`); }
    else {
      const result = addStudent(d);
      if (!result.success) { toast.error(result.error || 'Erreur lors de l\'ajout'); return; }
      toast.success(`Étudiant ${d.name} ajouté`);
    }
    setShowStudent(false); setEditStudent(undefined);
  }

  function saveCohort(d: Omit<Cohort, 'id' | 'createdAt'>) {
    if (editCohort) { updateCohort(editCohort.id, d); toast.success(`Cohorte ${d.name} mise à jour`); }
    else { addCohort(d); toast.success(`Cohorte ${d.name} créée`); }
    setShowCohort(false); setEditCohort(undefined);
  }

  function doDelete() {
    if (!confirmDel) return;
    if (confirmDel.type === 'student') { removeStudent(confirmDel.id); toast.success('Étudiant supprimé'); }
    else {
      const cs = getStudentsByCohort(confirmDel.id);
      if (cs.length > 0) { toast.error(`Impossible: ${cs.length} étudiant(s) dans cette cohorte`); setConfirmDel(null); return; }
      removeCohort(confirmDel.id); toast.success('Cohorte supprimée');
    }
    setConfirmDel(null);
  }

  const filtered = search ? students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())) : null;
  const sColor = (s: string) => s === 'active' ? 'oklch(0.72 0.14 162)' : s === 'planned' ? 'oklch(0.78 0.16 70)' : 'oklch(0.45 0.010 255)';
  const sBg = (s: string) => s === 'active' ? 'oklch(0.72 0.16 162 / 20%)' : s === 'planned' ? 'oklch(0.78 0.16 70 / 20%)' : 'oklch(0.18 0.018 255)';
  const sLabel = (s: string) => s === 'active' ? 'Actif' : s === 'planned' ? 'Planifié' : 'Complété';

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)' }}>Gestion des cohortes</h1>
            <p className="text-sm" style={{ color: 'oklch(0.50 0.010 255)' }}>Gérez vos groupes d'étudiants — Programme 2 ERP</p>
          </div>
          <button onClick={() => { setEditCohort(undefined); setShowCohort(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold shrink-0"
            style={{ background: 'oklch(0.60 0.20 255)', color: 'white' }}>
            <Plus size={16} /> Nouvelle cohorte
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[{ label: 'Cohortes actives', value: activeCohorts, color: 'oklch(0.72 0.16 162)' },
            { label: 'Étudiants total', value: totalStudents, color: 'oklch(0.60 0.20 255)' },
            { label: 'Étudiants actifs', value: activeStudents, color: 'oklch(0.72 0.15 200)' },
            { label: 'Score moyen global', value: globalAvg > 0 ? `${globalAvg}%` : '—', color: 'oklch(0.78 0.16 70)' },
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

        {filtered && (
          <div className="rounded-xl p-4 space-y-2" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(0.60 0.20 255 / 20%)' }}>
            <div className="text-xs font-semibold mb-2" style={{ color: 'oklch(0.55 0.010 255)' }}>{filtered.length} résultat(s) pour "{search}"</div>
            {filtered.length === 0
              ? <p className="text-sm text-center py-4" style={{ color: 'oklch(0.45 0.010 255)' }}>Aucun étudiant trouvé</p>
              : filtered.map(s => <StudentRow key={s.id} student={s} cohorts={cohorts} onEdit={openEditStudent}
                onRemove={st => setConfirmDel({ type: 'student', id: st.id, name: st.name })} />)}
          </div>
        )}

        {!filtered && (
          <div className="space-y-4">
            {cohorts.length === 0 ? (
              <div className="rounded-xl p-10 text-center" style={{ background: 'oklch(0.14 0.018 255)', border: '1px dashed oklch(0.25 0.018 255)' }}>
                <GraduationCap size={36} className="mx-auto mb-3" style={{ color: 'oklch(0.35 0.010 255)' }} />
                <p className="text-sm" style={{ color: 'oklch(0.45 0.010 255)' }}>Aucune cohorte. Créez votre première cohorte.</p>
              </div>
            ) : cohorts.map(cohort => {
              const stats = getCohortStats(cohort.id);
              const cs = getStudentsByCohort(cohort.id);
              const isExp = expanded.has(cohort.id);
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
                          <span className="flex items-center gap-1"><BookOpen size={10} /> {cohort.program}</span>
                          <span className="flex items-center gap-1"><Calendar size={10} /> {cohort.semester} {cohort.year}</span>
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
                  <div className="grid grid-cols-4 border-t" style={{ borderColor: 'oklch(1 0 0 / 5%)' }}>
                    {[{ label: 'Étudiants', value: stats.total }, { label: 'Actifs', value: stats.active },
                      { label: 'Score moy.', value: stats.avgScore > 0 ? `${stats.avgScore}%` : '—' },
                      { label: 'Complétion', value: `${stats.avgCompletion}%` }].map((item, i) => (
                      <div key={i} className="text-center py-2.5 px-2" style={{ borderRight: i < 3 ? '1px solid oklch(1 0 0 / 5%)' : 'none' }}>
                        <div className="text-sm font-bold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.85 0.005 255)' }}>{item.value}</div>
                        <div className="text-xs" style={{ color: 'oklch(0.40 0.010 255)' }}>{item.label}</div>
                      </div>
                    ))}
                  </div>
                  {cohort.status === 'active' && stats.avgCompletion > 0 && (
                    <div className="px-4 pb-3 pt-1">
                      <div className="h-1 rounded-full" style={{ background: 'oklch(0.20 0.018 255)' }}>
                        <div className="h-full rounded-full" style={{ width: `${stats.avgCompletion}%`, background: 'oklch(0.60 0.20 255)' }} />
                      </div>
                    </div>
                  )}
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

      {showStudent && <StudentModal cohortId={addToCohort || cohorts[0]?.id || ''} student={editStudent} cohorts={cohorts}
        onClose={() => { setShowStudent(false); setEditStudent(undefined); }} onSave={saveStudent} />}
      {showCohort && <CohortModal cohort={editCohort}
        onClose={() => { setShowCohort(false); setEditCohort(undefined); }} onSave={saveCohort} />}
      {confirmDel && <ConfirmModal
        message={confirmDel.type === 'student'
          ? `Supprimer l'étudiant "${confirmDel.name}" ? Cette action est irréversible.`
          : `Supprimer la cohorte "${confirmDel.name}" ? Les étudiants associés ne seront pas supprimés.`}
        onConfirm={doDelete} onClose={() => setConfirmDel(null)} />}
    </DashboardLayout>
  );
}
