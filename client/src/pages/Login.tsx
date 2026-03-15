import { getLoginUrl } from "@/const";
import { LogIn, Package, ArrowRight, ShieldCheck, BarChart3, BookOpen } from "lucide-react";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029779635/KgVchfh3nwnwCSCPgkNzAq/concorde-logo_73f38483.png";

const features = [
  {
    icon: Package,
    title: "Cycle logistique complet",
    desc: "PO → GR → SO → GI → CC → Conformité — simulé en temps réel",
  },
  {
    icon: ShieldCheck,
    title: "Moteur de conformité",
    desc: "Validation automatique des dépendances et calcul de score ERP",
  },
  {
    icon: BarChart3,
    title: "Surveillance pédagogique",
    desc: "Tableau de bord enseignant avec monitoring des simulations",
  },
  {
    icon: BookOpen,
    title: "Mode démonstration",
    desc: "Explications approfondies et transparence du backend WMS",
  },
];

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a1628] relative overflow-hidden">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(#4a9eff 1px, transparent 1px), linear-gradient(90deg, #4a9eff 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Subtle gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-[#0070f2] opacity-[0.06] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-[#0a4fa8] opacity-[0.08] rounded-full blur-[100px] pointer-events-none" />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-8 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <img
            src={LOGO_URL}
            alt="Collège de la Concorde"
            className="h-7 object-contain brightness-0 invert opacity-90"
          />
          <div className="border-l border-white/20 pl-3">
            <p className="text-[11px] font-semibold text-white/80 leading-tight tracking-wide uppercase">
              Collège de la Concorde — Montréal
            </p>
            <p className="text-[10px] text-white/40 leading-tight">Département Technologies de l'information</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-white/30 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
            v1.0
          </span>
          <span className="text-[10px] text-white/30">Mini-WMS ERP/WMS Simulator</span>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — branding + features */}
          <div>
            {/* SAP-style product badge */}
            <div className="inline-flex items-center gap-2 bg-[#0070f2]/10 border border-[#0070f2]/30 rounded-full px-3 py-1 mb-6">
              <div className="w-1.5 h-1.5 bg-[#0070f2] rounded-full" />
              <span className="text-[11px] font-medium text-[#4a9eff] tracking-wider uppercase">
                Simulateur pédagogique ERP/WMS
              </span>
            </div>

            <h1 className="text-4xl font-bold text-white leading-tight mb-2">
              Mini-WMS
              <span className="block text-[#4a9eff]">Concorde</span>
            </h1>
            <p className="text-sm text-white/50 mb-2 font-mono">
              inspiré SAP S/4HANA · Module 1 — Chaîne logistique
            </p>
            <p className="text-sm text-white/60 leading-relaxed mb-8 max-w-md">
              Simulez les processus fondamentaux d'un entrepôt ERP en entreprise. 
              Gérez les bons de commande, réceptions, commandes clients et conformité 
              dans un environnement pédagogique sécurisé.
            </p>

            {/* Feature list */}
            <div className="grid grid-cols-1 gap-3">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="flex items-start gap-3 group">
                    <div className="w-8 h-8 bg-[#0070f2]/10 border border-[#0070f2]/20 rounded flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#0070f2]/20 transition-colors">
                      <Icon size={14} className="text-[#4a9eff]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white/80">{f.title}</p>
                      <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right — login card */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-sm">
              {/* Card */}
              <div className="bg-white/[0.04] border border-white/10 rounded-xl p-8 backdrop-blur-sm">
                {/* Logo centered */}
                <div className="flex flex-col items-center mb-8">
                  <div className="bg-white rounded-lg px-4 py-2.5 mb-4 shadow-lg shadow-black/20">
                    <img
                      src={LOGO_URL}
                      alt="Collège de la Concorde"
                      className="h-9 object-contain"
                    />
                  </div>
                  <h2 className="text-base font-semibold text-white text-center">
                    Accès au simulateur
                  </h2>
                  <p className="text-xs text-white/40 text-center mt-1">
                    Connectez-vous avec votre compte institutionnel
                  </p>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-[10px] text-white/30 uppercase tracking-wider">Authentification</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Login button */}
                <a
                  href={getLoginUrl()}
                  className="flex items-center justify-center gap-2.5 w-full bg-[#0070f2] hover:bg-[#0058c7] text-white text-sm font-semibold py-3 px-4 rounded-lg transition-colors group"
                >
                  <LogIn size={15} />
                  Se connecter
                  <ArrowRight size={13} className="ml-auto opacity-60 group-hover:translate-x-0.5 transition-transform" />
                </a>

                {/* Info note */}
                <p className="text-[10px] text-white/25 text-center mt-4 leading-relaxed">
                  Accès réservé aux étudiants et enseignants<br />
                  du Collège de la Concorde inscrits au cours.
                </p>
              </div>

              {/* Below card */}
              <div className="mt-4 flex items-center justify-between px-1">
                <p className="text-[10px] text-white/20">
                  © 2026 Collège de la Concorde
                </p>
                <a href="/legal" className="text-[10px] text-white/30 hover:text-white/50 transition-colors">
                  Mentions légales
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom bar */}
      <footer className="relative z-10 border-t border-white/[0.06] px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="text-[10px] text-white/20">Montréal, Québec, Canada</span>
          <span className="text-[10px] text-white/20">www.collegedelaconcorde.ca</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
          <span className="text-[10px] text-white/30">Système opérationnel</span>
        </div>
      </footer>
    </div>
  );
}
