import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { ERP_MODULES } from '@/lib/erpData';
import { BookMarked, ChevronDown, ChevronRight, Clock, Target, Users, Award, Layers, Package, ShoppingCart, DollarSign, Zap } from 'lucide-react';

const MODULE_ICONS: Record<string, React.ReactNode> = {
  'erp-arch': <Layers size={18} />,
  'mm': <Package size={18} />,
  'sd': <ShoppingCart size={18} />,
  'fi': <DollarSign size={18} />,
  'erp-sim': <Zap size={18} />,
};

const GUIDE_SECTIONS = [
  {
    id: 'overview',
    title: 'Vue d\'ensemble du programme',
    content: `Le Programme 2 — ERP Integrated Business Simulator est conçu pour 30 heures d'enseignement réparties sur 5 modules. L'approche pédagogique est basée sur l'apprentissage par simulation : les étudiants exécutent des transactions réelles dans des environnements simulant SAP S/4HANA, Microsoft Dynamics 365 et Odoo ERP.

La philosophie du cours est le "mélange des systèmes" : plutôt que d'enseigner un seul ERP, les étudiants comprennent les processus métier universels (P2P, O2C, FI) et voient comment chaque système les implémente différemment. Cela prépare les étudiants à travailler dans n'importe quel environnement ERP.`
  },
  {
    id: 'approach',
    title: 'Approche pédagogique recommandée',
    content: `Chaque module suit la même séquence : Slides théoriques → Concept → Scénario → Transaction simulée → Validation → Score.

Pour chaque module, recommandez aux étudiants de :
1. Lire les slides dans l'ordre (onglet Slides du module)
2. Identifier les différences entre SAP, Dynamics et Odoo
3. Exécuter le scénario de niveau Débutant en premier
4. Progresser vers les niveaux Intermédiaire et Avancé
5. Comparer leurs réponses avec les messages de validation

En classe, utilisez le mode Monitoring pour afficher la progression en temps réel et identifier les étudiants en difficulté.`
  },
  {
    id: 'assessment',
    title: 'Grille d\'évaluation',
    content: `Structure d'évaluation Programme 2 :
• 30% — Transactions simulées : score automatique calculé par le simulateur
• 20% — Quiz & concepts : basé sur les questions des scénarios ERP-ARCH et FI
• 50% — Simulation finale ERP-SIM-01 : scénario intégré complet

Seuil de réussite : 60% global
Mention : 80%+ = Distinction | 90%+ = Grande distinction

Les scores sont enregistrés automatiquement dans le système et visibles dans le tableau de bord Monitoring.`
  },
  {
    id: 'systems',
    title: 'Comparaison des trois systèmes ERP',
    content: `SAP S/4HANA : système le plus utilisé en entreprise (22% du marché mondial). Utilise des T-codes (codes de transaction) comme ME21N, VA01, MIGO. Interface Fiori (web moderne) et SAP GUI (classique). Base de données in-memory HANA pour performance maximale.

Microsoft Dynamics 365 : suite Microsoft intégrée avec Office 365, Teams et Power BI. Interface familière pour les utilisateurs Microsoft. Modules Finance, Supply Chain Management, Sales. Déploiement cloud Azure ou hybride.

Odoo ERP : solution open source modulaire. Gratuit en version Community, payant en Enterprise. Interface web moderne. Idéal pour PME. Modules : Achats, Ventes, Stocks, Comptabilité, CRM. Technologie Python/PostgreSQL.`
  },
  {
    id: 'tips',
    title: 'Conseils pédagogiques par module',
    content: `ERP-ARCH (5h) : Commencez par la comparaison des 3 systèmes. Utilisez le scénario ERP-ARCH-03 (diagnostic) comme activité de groupe.

MM — Procure-to-Pay (7h) : Insistez sur la séquence PR→PO→GR→IV→Payment. Montrez les T-codes SAP en parallèle avec Dynamics et Odoo. Le scénario MM-04 (urgence) est excellent pour simuler des situations réelles.

SD — Order-to-Cash (7h) : Connectez ce module au MM pour montrer l'intégration SD-MM. Le scénario SD-04 (client international) introduit les notions de devises et Incoterms.

FI — Financial Integration (5h) : Ce module est souvent le plus difficile. Utilisez des exemples concrets de journaux comptables. Montrez comment chaque transaction MM et SD génère automatiquement des écritures FI.

ERP-SIM (6h) : Simulation finale intégrée. Recommandez de faire ce module en dernier. Idéal pour un examen pratique en conditions réelles.`
  }
];

export default function TeacherGuidePageFull() {
  const [expandedSection, setExpandedSection] = useState<string>('overview');
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'oklch(0.72 0.15 200 / 20%)', color: 'oklch(0.72 0.14 200)' }}>
            <BookMarked size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)' }}>
              Guide du Professeur
            </h1>
            <p className="text-sm" style={{ color: 'oklch(0.50 0.010 255)' }}>
              Programme 2 — ERP Integrated Business Simulator · Collège de la Concorde
            </p>
          </div>
        </div>

        {/* Programme summary */}
        <div className="grid sm:grid-cols-4 gap-4">
          {[
            { label: 'Durée totale', value: '30 heures', icon: <Clock size={18} />, color: 'oklch(0.60 0.20 255)' },
            { label: 'Modules', value: '5 modules', icon: <Target size={18} />, color: 'oklch(0.65 0.22 295)' },
            { label: 'Scénarios', value: `${ERP_MODULES.reduce((a, m) => a + m.scenarios.length, 0)} scénarios`, icon: <Award size={18} />, color: 'oklch(0.78 0.16 70)' },
            { label: 'Systèmes ERP', value: 'SAP · D365 · Odoo', icon: <Users size={18} />, color: 'oklch(0.72 0.16 162)' },
          ].map((item, i) => (
            <div key={i} className="rounded-xl p-4" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span style={{ color: item.color }}>{item.icon}</span>
                <span className="text-xs" style={{ color: 'oklch(0.50 0.010 255)' }}>{item.label}</span>
              </div>
              <div className="text-sm font-bold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.88 0.005 255)' }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Guide sections */}
        <div className="space-y-3">
          {GUIDE_SECTIONS.map(section => (
            <div key={section.id} className="rounded-xl overflow-hidden"
              style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
              <button
                onClick={() => setExpandedSection(expandedSection === section.id ? '' : section.id)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="text-sm font-semibold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.85 0.005 255)' }}>
                  {section.title}
                </span>
                {expandedSection === section.id
                  ? <ChevronDown size={16} style={{ color: 'oklch(0.50 0.010 255)' }} />
                  : <ChevronRight size={16} style={{ color: 'oklch(0.50 0.010 255)' }} />
                }
              </button>
              {expandedSection === section.id && (
                <div className="px-4 pb-4" style={{ borderTop: '1px solid oklch(1 0 0 / 6%)' }}>
                  <div className="pt-4 text-sm whitespace-pre-line" style={{ color: 'oklch(0.68 0.010 255)', lineHeight: '1.7' }}>
                    {section.content}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Module guide */}
        <div>
          <h2 className="text-base font-semibold mb-4" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.85 0.005 255)' }}>
            Guide détaillé par module
          </h2>
          <div className="space-y-3">
            {ERP_MODULES.map(mod => (
              <div key={mod.id} className="rounded-xl overflow-hidden"
                style={{ background: 'oklch(0.14 0.018 255)', border: `1px solid ${mod.color}25` }}>
                <button
                  onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}
                  className="w-full flex items-center gap-4 p-4 text-left"
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${mod.color}20`, color: mod.color }}>
                    {MODULE_ICONS[mod.id]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold" style={{ color: mod.color }}>{mod.code}</span>
                      <span className="text-sm font-semibold" style={{ color: 'oklch(0.85 0.005 255)' }}>{mod.name}</span>
                    </div>
                    <div className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>
                      {mod.duration} · {mod.scenarios.length} scénarios · {mod.slides.length} slides
                    </div>
                  </div>
                  {expandedModule === mod.id
                    ? <ChevronDown size={16} style={{ color: 'oklch(0.50 0.010 255)' }} />
                    : <ChevronRight size={16} style={{ color: 'oklch(0.50 0.010 255)' }} />
                  }
                </button>
                {expandedModule === mod.id && (
                  <div className="px-4 pb-4 space-y-4" style={{ borderTop: `1px solid ${mod.color}20` }}>
                    <div className="pt-4">
                      <p className="text-sm" style={{ color: 'oklch(0.65 0.010 255)', lineHeight: '1.6' }}>{mod.description}</p>
                    </div>

                    {/* Slides list */}
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'oklch(0.45 0.010 255)' }}>
                        Slides ({mod.slides.length})
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {mod.slides.map((slide, i) => (
                          <div key={slide.id} className="flex items-start gap-2 p-2 rounded-lg"
                            style={{ background: 'oklch(0.11 0.015 255)' }}>
                            <span className="text-xs font-mono font-bold shrink-0 mt-0.5" style={{ color: mod.color }}>{i + 1}</span>
                            <div>
                              <div className="text-xs font-semibold" style={{ color: 'oklch(0.75 0.008 255)' }}>{slide.title}</div>
                              {slide.subtitle && <div className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>{slide.subtitle}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Scenarios */}
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'oklch(0.45 0.010 255)' }}>
                        Scénarios de simulation
                      </div>
                      <div className="space-y-2">
                        {mod.scenarios.map(sc => (
                          <div key={sc.id} className="p-3 rounded-lg" style={{ background: 'oklch(0.11 0.015 255)' }}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono font-bold" style={{ color: mod.color }}>{sc.code}</span>
                              <span className="text-xs px-1.5 py-0.5 rounded-full"
                                style={{
                                  background: sc.difficulty === 'Débutant' ? 'oklch(0.72 0.16 162 / 20%)' : sc.difficulty === 'Intermédiaire' ? 'oklch(0.78 0.16 70 / 20%)' : 'oklch(0.65 0.22 25 / 20%)',
                                  color: sc.difficulty === 'Débutant' ? 'oklch(0.72 0.14 162)' : sc.difficulty === 'Intermédiaire' ? 'oklch(0.78 0.14 70)' : 'oklch(0.65 0.20 25)'
                                }}>
                                {sc.difficulty}
                              </span>
                              <span className="text-xs" style={{ color: 'oklch(0.40 0.010 255)' }}>{sc.duration}</span>
                            </div>
                            <div className="text-xs font-semibold mb-0.5" style={{ color: 'oklch(0.78 0.008 255)' }}>{sc.title}</div>
                            <div className="text-xs" style={{ color: 'oklch(0.50 0.010 255)' }}>{sc.learningObjective}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Assessment grid */}
        <div className="rounded-xl p-5" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
          <h2 className="text-base font-semibold mb-4" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.85 0.005 255)' }}>
            Grille d'évaluation officielle
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid oklch(1 0 0 / 8%)' }}>
                  {['Composante', 'Poids', 'Modalité', 'Seuil de réussite'].map(h => (
                    <th key={h} className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: 'oklch(0.45 0.010 255)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { comp: 'Transactions simulées', poids: '30%', modalite: 'Score automatique simulateur', seuil: '18/30' },
                  { comp: 'Quiz & concepts ERP', poids: '20%', modalite: 'Questions intégrées aux scénarios', seuil: '12/20' },
                  { comp: 'Simulation finale ERP-SIM-01', poids: '50%', modalite: 'Scénario intégré complet', seuil: '30/50' },
                  { comp: 'TOTAL', poids: '100%', modalite: 'Note finale Programme 2', seuil: '60/100' },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid oklch(1 0 0 / 4%)', background: i === 3 ? 'oklch(0.60 0.20 255 / 5%)' : 'transparent' }}>
                    <td className="py-2.5 px-3 text-xs" style={{ color: i === 3 ? 'oklch(0.85 0.005 255)' : 'oklch(0.70 0.008 255)', fontWeight: i === 3 ? 700 : 400 }}>{row.comp}</td>
                    <td className="py-2.5 px-3 text-xs font-bold" style={{ color: 'oklch(0.78 0.16 70)' }}>{row.poids}</td>
                    <td className="py-2.5 px-3 text-xs" style={{ color: 'oklch(0.55 0.010 255)' }}>{row.modalite}</td>
                    <td className="py-2.5 px-3 text-xs font-mono" style={{ color: 'oklch(0.72 0.16 162)' }}>{row.seuil}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
