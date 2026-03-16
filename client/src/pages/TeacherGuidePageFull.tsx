// TeacherGuidePageFull — ERP Integrated Business Simulator
// Guide du Professeur with PDF export, FR/EN support, and full pedagogical content
// SAP S/4HANA | Microsoft Dynamics 365 | Odoo ERP
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { ERP_MODULES } from '@/lib/erpData';
import { useLang } from '@/contexts/LanguageContext';
import {
  BookMarked, ChevronDown, ChevronRight, Clock, Target, Users, Award,
  Layers, Package, ShoppingCart, DollarSign, Zap, Download, Printer,
  FileText, CheckCircle2
} from 'lucide-react';

const MODULE_ICONS: Record<string, React.ReactNode> = {
  'erp-arch': <Layers size={18} />,
  'mm': <Package size={18} />,
  'sd': <ShoppingCart size={18} />,
  'fi': <DollarSign size={18} />,
  'erp-sim': <Zap size={18} />,
};

const GUIDE_SECTIONS_FR = [
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

const GUIDE_SECTIONS_EN = [
  {
    id: 'overview',
    title: 'Programme Overview',
    content: `Programme 2 — ERP Integrated Business Simulator is designed for 30 hours of instruction across 5 modules. The pedagogical approach is based on simulation-based learning: students execute real transactions in environments simulating SAP S/4HANA, Microsoft Dynamics 365 and Odoo ERP.

The course philosophy is the "system blend": rather than teaching a single ERP, students understand universal business processes (P2P, O2C, FI) and see how each system implements them differently. This prepares students to work in any ERP environment.`
  },
  {
    id: 'approach',
    title: 'Recommended Pedagogical Approach',
    content: `Each module follows the same sequence: Theory Slides → Concept → Scenario → Simulated Transaction → Validation → Score.

For each module, recommend students to:
1. Read slides in order (module Slides tab)
2. Identify differences between SAP, Dynamics and Odoo
3. Execute the Beginner scenario first
4. Progress to Intermediate and Advanced levels
5. Compare their answers with validation messages

In class, use Monitoring mode to display real-time progress and identify struggling students.`
  },
  {
    id: 'assessment',
    title: 'Assessment Grid',
    content: `Programme 2 Assessment Structure:
• 30% — Simulated transactions: automatic score calculated by the simulator
• 20% — Quiz & concepts: based on ERP-ARCH and FI scenario questions
• 50% — Final simulation ERP-SIM-01: complete integrated scenario

Pass threshold: 60% overall
Honours: 80%+ = Distinction | 90%+ = High Distinction

Scores are automatically recorded in the system and visible in the Monitoring dashboard.`
  },
  {
    id: 'systems',
    title: 'Comparison of Three ERP Systems',
    content: `SAP S/4HANA: most widely used enterprise system (22% global market share). Uses T-codes (transaction codes) like ME21N, VA01, MIGO. Fiori interface (modern web) and SAP GUI (classic). In-memory HANA database for maximum performance.

Microsoft Dynamics 365: Microsoft suite integrated with Office 365, Teams and Power BI. Familiar interface for Microsoft users. Finance, Supply Chain Management, Sales modules. Azure cloud or hybrid deployment.

Odoo ERP: modular open source solution. Free Community version, paid Enterprise. Modern web interface. Ideal for SMEs. Modules: Purchases, Sales, Inventory, Accounting, CRM. Python/PostgreSQL technology.`
  },
  {
    id: 'tips',
    title: 'Pedagogical Tips by Module',
    content: `ERP-ARCH (5h): Start with the comparison of 3 systems. Use scenario ERP-ARCH-03 (diagnostic) as a group activity.

MM — Procure-to-Pay (7h): Emphasize the PR→PO→GR→IV→Payment sequence. Show SAP T-codes in parallel with Dynamics and Odoo. Scenario MM-04 (emergency) is excellent for simulating real situations.

SD — Order-to-Cash (7h): Connect this module to MM to show SD-MM integration. Scenario SD-04 (international customer) introduces currency and Incoterms concepts.

FI — Financial Integration (5h): This module is often the most difficult. Use concrete examples of accounting journals. Show how each MM and SD transaction automatically generates FI entries.

ERP-SIM (6h): Final integrated simulation. Recommend doing this module last. Ideal for a practical exam under real conditions.`
  }
];

function generatePDFContent(lang: 'fr' | 'en'): string {
  const sections = lang === 'fr' ? GUIDE_SECTIONS_FR : GUIDE_SECTIONS_EN;
  const title = lang === 'fr' ? 'Guide du Professeur — ERP Integrated Business Simulator' : 'Teacher Guide — ERP Integrated Business Simulator';
  const date = new Date().toLocaleDateString(lang === 'fr' ? 'fr-CA' : 'en-CA', { year: 'numeric', month: 'long', day: 'numeric' });

  let html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>${title}</title>
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1a1a2e; }
  h1 { color: #1e3a5f; border-bottom: 3px solid #2563eb; padding-bottom: 12px; font-size: 22px; }
  h2 { color: #1e3a5f; font-size: 16px; margin-top: 28px; }
  h3 { color: #2563eb; font-size: 14px; }
  .meta { color: #666; font-size: 12px; margin-bottom: 24px; }
  .section { margin-bottom: 24px; padding: 16px; background: #f8faff; border-left: 4px solid #2563eb; border-radius: 4px; }
  .module { margin-bottom: 16px; padding: 12px; border: 1px solid #e0e8ff; border-radius: 6px; }
  .module-code { display: inline-block; background: #2563eb; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-family: monospace; margin-right: 8px; }
  .assessment-table { width: 100%; border-collapse: collapse; margin-top: 12px; }
  .assessment-table th { background: #1e3a5f; color: white; padding: 8px 12px; text-align: left; font-size: 12px; }
  .assessment-table td { padding: 8px 12px; border-bottom: 1px solid #e0e8ff; font-size: 12px; }
  .assessment-table tr:last-child td { font-weight: bold; background: #f0f4ff; }
  .sys-sap { background: #fff3e0; color: #e65100; padding: 2px 6px; border-radius: 3px; font-size: 10px; font-family: monospace; }
  .sys-d365 { background: #e3f2fd; color: #0277bd; padding: 2px 6px; border-radius: 3px; font-size: 10px; font-family: monospace; }
  .sys-odoo { background: #e8f5e9; color: #2e7d32; padding: 2px 6px; border-radius: 3px; font-size: 10px; font-family: monospace; }
  pre { white-space: pre-wrap; font-family: inherit; font-size: 13px; line-height: 1.6; margin: 0; }
  @media print { body { padding: 20px; } }
</style></head><body>
<h1>${title}</h1>
<div class="meta">Collège de la Concorde, Montréal | Programme 2 | ${date} | SAP S/4HANA · Microsoft Dynamics 365 · Odoo ERP</div>`;

  sections.forEach(s => {
    html += `<div class="section"><h2>${s.title}</h2><pre>${s.content}</pre></div>`;
  });

  html += `<h2>${lang === 'fr' ? 'Modules ERP — Résumé' : 'ERP Modules — Summary'}</h2>`;
  ERP_MODULES.forEach(mod => {
    html += `<div class="module">
      <span class="module-code">${mod.code}</span>
      <strong>${mod.fullName}</strong> — ${mod.duration}
      <br><small style="color:#666">${mod.description}</small>
      <br><small>${lang === 'fr' ? 'Scénarios' : 'Scenarios'}: ${mod.scenarios.map(s => s.code).join(', ')}</small>
    </div>`;
  });

  html += `<h2>${lang === 'fr' ? 'Grille d\'évaluation officielle' : 'Official Assessment Grid'}</h2>
  <table class="assessment-table">
    <thead><tr>
      <th>${lang === 'fr' ? 'Composante' : 'Component'}</th>
      <th>${lang === 'fr' ? 'Poids' : 'Weight'}</th>
      <th>${lang === 'fr' ? 'Modalité' : 'Modality'}</th>
      <th>${lang === 'fr' ? 'Seuil' : 'Threshold'}</th>
    </tr></thead>
    <tbody>
      <tr><td>${lang === 'fr' ? 'Transactions simulées' : 'Simulated transactions'}</td><td>30%</td><td>${lang === 'fr' ? 'Score automatique simulateur' : 'Automatic simulator score'}</td><td>18/30</td></tr>
      <tr><td>${lang === 'fr' ? 'Quiz & concepts ERP' : 'Quiz & ERP concepts'}</td><td>20%</td><td>${lang === 'fr' ? 'Questions intégrées' : 'Integrated questions'}</td><td>12/20</td></tr>
      <tr><td>${lang === 'fr' ? 'Simulation finale ERP-SIM-01' : 'Final simulation ERP-SIM-01'}</td><td>50%</td><td>${lang === 'fr' ? 'Scénario intégré complet' : 'Complete integrated scenario'}</td><td>30/50</td></tr>
      <tr><td>TOTAL</td><td>100%</td><td>${lang === 'fr' ? 'Note finale Programme 2' : 'Final Grade Programme 2'}</td><td>60/100</td></tr>
    </tbody>
  </table>
</body></html>`;

  return html;
}

export default function TeacherGuidePageFull() {
  const { lang } = useLang();
  const [expandedSection, setExpandedSection] = useState<string>('overview');
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const sections = lang === 'fr' ? GUIDE_SECTIONS_FR : GUIDE_SECTIONS_EN;

  const handleExportPDF = () => {
    setExporting(true);
    try {
      const html = generatePDFContent(lang);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, '_blank');
      if (win) {
        win.onload = () => {
          win.print();
          setExporting(false);
        };
      } else {
        // Fallback: download as HTML
        const a = document.createElement('a');
        a.href = url;
        a.download = `guide-professeur-erp-${lang}.html`;
        a.click();
        setExporting(false);
      }
    } catch {
      setExporting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'oklch(0.72 0.15 200 / 20%)', color: 'oklch(0.72 0.14 200)' }}>
              <BookMarked size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)' }}>
                {lang === 'fr' ? 'Guide du Professeur' : 'Teacher Guide'}
              </h1>
              <p className="text-sm" style={{ color: 'oklch(0.50 0.010 255)' }}>
                Programme 2 — ERP Integrated Business Simulator · Collège de la Concorde
              </p>
            </div>
          </div>
          {/* Export buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-60"
              style={{ background: 'oklch(0.72 0.15 200 / 20%)', color: 'oklch(0.72 0.14 200)', border: '1px solid oklch(0.72 0.14 200 / 30%)' }}>
              <Printer size={15} />
              {exporting ? (lang === 'fr' ? 'Génération...' : 'Generating...') : (lang === 'fr' ? 'Imprimer / PDF' : 'Print / PDF')}
            </button>
          </div>
        </div>

        {/* Programme summary */}
        <div className="grid sm:grid-cols-4 gap-4">
          {[
            { label: lang === 'fr' ? 'Durée totale' : 'Total Duration', value: '30 heures', icon: <Clock size={18} />, color: 'oklch(0.60 0.20 255)' },
            { label: lang === 'fr' ? 'Modules' : 'Modules', value: '5 modules', icon: <Target size={18} />, color: 'oklch(0.65 0.22 295)' },
            { label: lang === 'fr' ? 'Scénarios' : 'Scenarios', value: `${ERP_MODULES.reduce((a, m) => a + m.scenarios.length, 0)} scénarios`, icon: <Award size={18} />, color: 'oklch(0.78 0.16 70)' },
            { label: lang === 'fr' ? 'Systèmes ERP' : 'ERP Systems', value: 'SAP · D365 · Odoo', icon: <Users size={18} />, color: 'oklch(0.72 0.16 162)' },
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
          {sections.map(section => (
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
            {lang === 'fr' ? 'Guide détaillé par module' : 'Detailed Guide by Module'}
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
                      {mod.duration} · {mod.scenarios.length} {lang === 'fr' ? 'scénarios' : 'scenarios'} · {mod.slides.length} slides
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
                        {lang === 'fr' ? 'Scénarios de simulation' : 'Simulation Scenarios'}
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.85 0.005 255)' }}>
              {lang === 'fr' ? 'Grille d\'évaluation officielle' : 'Official Assessment Grid'}
            </h2>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ background: 'oklch(0.78 0.16 70 / 15%)', color: 'oklch(0.78 0.14 70)', border: '1px solid oklch(0.78 0.14 70 / 30%)' }}>
              <Download size={12} />
              {lang === 'fr' ? 'Exporter PDF' : 'Export PDF'}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid oklch(1 0 0 / 8%)' }}>
                  {[
                    lang === 'fr' ? 'Composante' : 'Component',
                    lang === 'fr' ? 'Poids' : 'Weight',
                    lang === 'fr' ? 'Modalité' : 'Modality',
                    lang === 'fr' ? 'Seuil de réussite' : 'Pass Threshold'
                  ].map(h => (
                    <th key={h} className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: 'oklch(0.45 0.010 255)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    comp: lang === 'fr' ? 'Transactions simulées' : 'Simulated transactions',
                    poids: '30%',
                    modalite: lang === 'fr' ? 'Score automatique simulateur' : 'Automatic simulator score',
                    seuil: '18/30'
                  },
                  {
                    comp: lang === 'fr' ? 'Quiz & concepts ERP' : 'Quiz & ERP concepts',
                    poids: '20%',
                    modalite: lang === 'fr' ? 'Questions intégrées aux scénarios' : 'Integrated scenario questions',
                    seuil: '12/20'
                  },
                  {
                    comp: lang === 'fr' ? 'Simulation finale ERP-SIM-01' : 'Final simulation ERP-SIM-01',
                    poids: '50%',
                    modalite: lang === 'fr' ? 'Scénario intégré complet' : 'Complete integrated scenario',
                    seuil: '30/50'
                  },
                  {
                    comp: 'TOTAL',
                    poids: '100%',
                    modalite: lang === 'fr' ? 'Note finale Programme 2' : 'Final Grade Programme 2',
                    seuil: '60/100'
                  },
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

        {/* Quick checklist */}
        <div className="rounded-xl p-5" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(0.72 0.15 200 / 20%)' }}>
          <h2 className="text-base font-semibold mb-4" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.85 0.005 255)' }}>
            {lang === 'fr' ? 'Checklist avant le cours' : 'Pre-class Checklist'}
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {(lang === 'fr' ? [
              'Vérifier que tous les étudiants ont un compte étudiant actif',
              'Créer une cohorte pour le groupe de cours',
              'Assigner les scénarios selon le calendrier du cours',
              'Tester le simulateur avec le compte Admin',
              'Préparer les slides ERP-ARCH pour la première séance',
              'Activer le mode Monitoring pour suivre la progression',
              'Distribuer les identifiants de connexion aux étudiants',
              'Vérifier la connexion internet en salle de classe',
            ] : [
              'Verify all students have an active student account',
              'Create a cohort for the class group',
              'Assign scenarios according to the course schedule',
              'Test the simulator with the Admin account',
              'Prepare ERP-ARCH slides for the first session',
              'Activate Monitoring mode to track progress',
              'Distribute login credentials to students',
              'Check internet connection in the classroom',
            ]).map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle2 size={14} className="shrink-0 mt-0.5" style={{ color: 'oklch(0.72 0.16 162)' }} />
                <span className="text-xs" style={{ color: 'oklch(0.65 0.010 255)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
