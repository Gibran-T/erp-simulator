// ============================================================
// Language Context — FR/EN Toggle
// ERP Integrated Business Simulator — Collège de la Concorde
// ============================================================
import React, { createContext, useContext, useState } from 'react';

export type Language = 'fr' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Navigation
  'nav.dashboard': { fr: 'Tableau de bord', en: 'Dashboard' },
  'nav.modules': { fr: 'Modules ERP', en: 'ERP Modules' },
  'nav.simulator': { fr: 'Simulateur', en: 'Simulator' },
  'nav.cohorts': { fr: 'Cohortes', en: 'Cohorts' },
  'nav.assignments': { fr: 'Travaux', en: 'Assignments' },
  'nav.monitoring': { fr: 'Suivi', en: 'Monitoring' },
  'nav.teacherGuide': { fr: 'Guide Professeur', en: 'Teacher Guide' },
  'nav.admin': { fr: 'Administration', en: 'Administration' },
  'nav.logout': { fr: 'Déconnexion', en: 'Logout' },
  // Dashboard
  'dashboard.greeting': { fr: 'Bonjour', en: 'Hello' },
  'dashboard.subtitle.teacher': { fr: 'Tableau de bord professeur — ERP Integrated Business Simulator', en: 'Teacher Dashboard — ERP Integrated Business Simulator' },
  'dashboard.subtitle.student': { fr: 'Tableau de bord étudiant — ERP Integrated Business Simulator', en: 'Student Dashboard — ERP Integrated Business Simulator' },
  'dashboard.subtitle.admin': { fr: 'Tableau de bord administrateur — ERP Integrated Business Simulator', en: 'Admin Dashboard — ERP Integrated Business Simulator' },
  'dashboard.modules': { fr: 'Modules ERP', en: 'ERP Modules' },
  'dashboard.scenarios': { fr: 'Scénarios', en: 'Scenarios' },
  'dashboard.students': { fr: 'Étudiants', en: 'Students' },
  'dashboard.hours': { fr: 'Heures de formation', en: 'Training Hours' },
  'dashboard.progress': { fr: 'Progression globale', en: 'Overall Progress' },
  'dashboard.recentActivity': { fr: 'Activité récente', en: 'Recent Activity' },
  'dashboard.moduleProgress': { fr: 'Progression par module', en: 'Module Progress' },
  'dashboard.quickAccess': { fr: 'Accès rapide', en: 'Quick Access' },
  'dashboard.startSimulator': { fr: 'Démarrer le simulateur', en: 'Start Simulator' },
  'dashboard.viewModules': { fr: 'Voir les modules', en: 'View Modules' },
  'dashboard.viewMonitoring': { fr: 'Voir le suivi', en: 'View Monitoring' },
  // Modules
  'modules.title': { fr: 'Modules ERP', en: 'ERP Modules' },
  'modules.subtitle': { fr: 'Programme 2 — 30 heures · SAP S/4HANA · Dynamics 365 · Odoo', en: 'Programme 2 — 30 hours · SAP S/4HANA · Dynamics 365 · Odoo' },
  'modules.slides': { fr: 'Slides', en: 'Slides' },
  'modules.scenarios': { fr: 'Scénarios', en: 'Scenarios' },
  'modules.hours': { fr: 'heures', en: 'hours' },
  'modules.start': { fr: 'Commencer', en: 'Start' },
  'modules.continue': { fr: 'Continuer', en: 'Continue' },
  // Simulator
  'sim.title': { fr: 'Simulateur ERP', en: 'ERP Simulator' },
  'sim.start': { fr: 'Démarrer la simulation', en: 'Start Simulation' },
  'sim.next': { fr: 'Étape suivante', en: 'Next Step' },
  'sim.prev': { fr: 'Précédent', en: 'Previous' },
  'sim.hint': { fr: 'Indice', en: 'Hint' },
  'sim.validate': { fr: 'Valider', en: 'Validate' },
  'sim.complete': { fr: 'Simulation terminée', en: 'Simulation Complete' },
  'sim.score': { fr: 'Score final', en: 'Final Score' },
  'sim.chooseSystem': { fr: 'Choisir le système ERP', en: 'Choose ERP System' },
  'sim.objective': { fr: 'Objectif pédagogique', en: 'Learning Objective' },
  'sim.steps': { fr: 'Étapes du scénario', en: 'Scenario Steps' },
  'sim.elapsed': { fr: 'Temps écoulé', en: 'Elapsed Time' },
  'sim.progression': { fr: 'Progression', en: 'Progress' },
  'sim.beginner': { fr: 'Débutant', en: 'Beginner' },
  'sim.intermediate': { fr: 'Intermédiaire', en: 'Intermediate' },
  'sim.advanced': { fr: 'Avancé', en: 'Advanced' },
  // Slides
  'slides.keyPoints': { fr: 'Points clés', en: 'Key Points' },
  'slides.systemRef': { fr: 'Référence dans les systèmes ERP', en: 'Reference in ERP Systems' },
  'slides.prev': { fr: 'Précédent', en: 'Previous' },
  'slides.next': { fr: 'Suivant', en: 'Next' },
  'slides.present': { fr: 'Mode présentation', en: 'Presentation Mode' },
  'slides.exitPresent': { fr: 'Quitter la présentation', en: 'Exit Presentation' },
  'slides.quiz': { fr: 'Quiz', en: 'Quiz' },
  'slides.quizTitle': { fr: 'Quiz de compréhension', en: 'Comprehension Quiz' },
  'slides.quizSubtitle': { fr: 'Testez vos connaissances sur ce module', en: 'Test your knowledge on this module' },
  'slides.quizCorrect': { fr: 'Bonne réponse !', en: 'Correct!' },
  'slides.quizWrong': { fr: 'Mauvaise réponse', en: 'Wrong answer' },
  'slides.quizExplanation': { fr: 'Explication', en: 'Explanation' },
  'slides.quizNext': { fr: 'Question suivante', en: 'Next Question' },
  'slides.quizFinish': { fr: 'Terminer le quiz', en: 'Finish Quiz' },
  'slides.quizResult': { fr: 'Résultat du quiz', en: 'Quiz Result' },
  'slides.quizRetry': { fr: 'Recommencer', en: 'Retry' },
  'slides.quizContinue': { fr: 'Continuer vers les scénarios', en: 'Continue to Scenarios' },
  // Teacher Guide
  'guide.title': { fr: 'Guide du Professeur', en: 'Teacher Guide' },
  'guide.exportPDF': { fr: 'Exporter en PDF', en: 'Export PDF' },
  'guide.exportPDFShort': { fr: 'PDF', en: 'PDF' },
  'guide.totalHours': { fr: 'Durée totale', en: 'Total Duration' },
  'guide.modules': { fr: 'Modules', en: 'Modules' },
  'guide.scenarios': { fr: 'Scénarios', en: 'Scenarios' },
  'guide.systems': { fr: 'Systèmes ERP', en: 'ERP Systems' },
  // Monitoring
  'monitoring.title': { fr: 'Suivi des étudiants', en: 'Student Monitoring' },
  'monitoring.activeStudents': { fr: 'Étudiants actifs', en: 'Active Students' },
  'monitoring.avgScore': { fr: 'Score moyen', en: 'Average Score' },
  'monitoring.avgCompletion': { fr: 'Complétion moyenne', en: 'Avg. Completion' },
  'monitoring.availableScenarios': { fr: 'Scénarios disponibles', en: 'Available Scenarios' },
  'monitoring.completionByModule': { fr: 'Complétion par module', en: 'Completion by Module' },
  'monitoring.studentDetail': { fr: 'Détail par étudiant', en: 'Student Detail' },
  // Login
  'login.title': { fr: 'Connexion', en: 'Login' },
  'login.subtitle': { fr: 'Accédez à votre environnement ERP simulé', en: 'Access your simulated ERP environment' },
  'login.email': { fr: 'Adresse courriel', en: 'Email Address' },
  'login.password': { fr: 'Mot de passe', en: 'Password' },
  'login.button': { fr: 'Se connecter', en: 'Sign In' },
  'login.demoAccess': { fr: 'Accès de démonstration', en: 'Demo Access' },
  'login.system': { fr: 'Système ERP de référence', en: 'Reference ERP System' },
  // Common
  'common.programme': { fr: 'Programme 2 — ERP', en: 'Programme 2 — ERP' },
  'common.hours': { fr: '30 heures', en: '30 hours' },
  'common.modules_count': { fr: '5 modules', en: '5 modules' },
  'common.back': { fr: 'Retour', en: 'Back' },
  'common.save': { fr: 'Enregistrer', en: 'Save' },
  'common.cancel': { fr: 'Annuler', en: 'Cancel' },
  'common.simulate': { fr: 'Simuler', en: 'Simulate' },
  'common.restart': { fr: 'Recommencer', en: 'Restart' },
  'common.completed': { fr: 'Complété', en: 'Completed' },
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('erp_lang') as Language) || 'fr';
  });

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem('erp_lang', l);
  };

  const t = (key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang] || entry['fr'] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
