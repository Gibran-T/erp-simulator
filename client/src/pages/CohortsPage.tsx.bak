import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Users, Plus, ChevronRight, BookOpen, Award } from 'lucide-react';
import { toast } from 'sonner';

const COHORTS = [
  { id: 'erp-2026-a', name: 'ERP-2026-A', description: 'Groupe A — Session Hiver 2026', students: 18, activeStudents: 14, avgScore: 87, avgCompletion: 62, program: 'Programme 2 — ERP Business Simulator', status: 'active' },
  { id: 'erp-2026-b', name: 'ERP-2026-B', description: 'Groupe B — Session Hiver 2026', students: 22, activeStudents: 19, avgScore: 83, avgCompletion: 55, program: 'Programme 2 — ERP Business Simulator', status: 'active' },
  { id: 'erp-2025-fall', name: 'ERP-2025-FALL', description: 'Groupe Automne 2025 — Complété', students: 20, activeStudents: 0, avgScore: 81, avgCompletion: 100, program: 'Programme 2 — ERP Business Simulator', status: 'completed' },
];

export default function CohortsPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)' }}>Cohortes</h1>
            <p className="text-sm" style={{ color: 'oklch(0.50 0.010 255)' }}>Gestion des groupes d'étudiants — Programme 2 ERP</p>
          </div>
          <button onClick={() => toast.info('Fonctionnalité disponible en mode administrateur')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ background: 'oklch(0.60 0.20 255)', color: 'white' }}>
            <Plus size={16} /> Nouvelle cohorte
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[{ label: 'Cohortes actives', value: COHORTS.filter(c => c.status === 'active').length, color: 'oklch(0.72 0.16 162)' },
            { label: 'Étudiants total', value: COHORTS.reduce((a, c) => a + c.students, 0), color: 'oklch(0.60 0.20 255)' },
            { label: 'Score moyen global', value: `${Math.round(COHORTS.reduce((a, c) => a + c.avgScore, 0) / COHORTS.length)}%`, color: 'oklch(0.78 0.16 70)' },
          ].map((stat, i) => (
            <div key={i} className="rounded-xl p-4" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
              <div className="text-2xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk', color: stat.color }}>{stat.value}</div>
              <div className="text-xs" style={{ color: 'oklch(0.50 0.010 255)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          {COHORTS.map(cohort => (
            <div key={cohort.id} className="rounded-xl p-5"
              style={{ background: 'oklch(0.14 0.018 255)', border: `1px solid ${cohort.status === 'active' ? 'oklch(0.60 0.20 255 / 30%)' : 'oklch(1 0 0 / 6%)'}` }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: cohort.status === 'active' ? 'oklch(0.60 0.20 255 / 20%)' : 'oklch(0.18 0.018 255)', color: cohort.status === 'active' ? 'oklch(0.72 0.16 255)' : 'oklch(0.45 0.010 255)' }}>
                    <Users size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-base font-bold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.88 0.005 255)' }}>{cohort.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: cohort.status === 'active' ? 'oklch(0.72 0.16 162 / 20%)' : 'oklch(0.18 0.018 255)', color: cohort.status === 'active' ? 'oklch(0.72 0.14 162)' : 'oklch(0.45 0.010 255)' }}>
                        {cohort.status === 'active' ? 'Actif' : 'Complété'}
                      </span>
                    </div>
                    <div className="text-sm" style={{ color: 'oklch(0.55 0.010 255)' }}>{cohort.description}</div>
                    <div className="flex items-center gap-1 mt-1 text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>
                      <BookOpen size={11} /> {cohort.program}
                    </div>
                  </div>
                </div>
                <button onClick={() => toast.info(`Cohorte ${cohort.name} — ${cohort.students} étudiants`)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold"
                  style={{ background: 'oklch(0.18 0.018 255)', color: 'oklch(0.65 0.010 255)' }}>
                  Détails <ChevronRight size={12} />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-4">
                {[{ label: 'Étudiants', value: cohort.students }, { label: 'Actifs', value: cohort.activeStudents },
                  { label: 'Score moy.', value: `${cohort.avgScore}%` }, { label: 'Complétion', value: `${cohort.avgCompletion}%` }]
                  .map((item, i) => (
                    <div key={i} className="text-center p-2 rounded-lg" style={{ background: 'oklch(0.11 0.015 255)' }}>
                      <div className="text-sm font-bold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.85 0.005 255)' }}>{item.value}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'oklch(0.45 0.010 255)' }}>{item.label}</div>
                    </div>
                  ))}
              </div>
              {cohort.status === 'active' && (
                <div className="mt-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>Progression globale</span>
                    <span className="text-xs font-semibold" style={{ color: 'oklch(0.60 0.20 255)' }}>{cohort.avgCompletion}%</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'oklch(0.20 0.018 255)' }}>
                    <div className="h-full rounded-full" style={{ width: `${cohort.avgCompletion}%`, background: 'oklch(0.60 0.20 255)' }} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
