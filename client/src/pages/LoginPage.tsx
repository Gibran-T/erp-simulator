import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Loader2, Eye, EyeOff } from 'lucide-react';

const HERO_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029779635/h8ynqFBCEuYgutk3aFBMKE/erp-hero-bg_e6e64180.png';
const LOGO = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029779635/h8ynqFBCEuYgutk3aFBMKE/erp-logo-icon_b069b4ac.png';
const DIAGRAM = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029779635/h8ynqFBCEuYgutk3aFBMKE/erp-modules-diagram_1e66f49d.png';

const SYSTEMS = [
  { id: 'sap', label: 'SAP S/4HANA', color: 'oklch(0.70 0.14 30)', bg: 'oklch(0.20 0.05 30 / 60%)' },
  { id: 'dynamics', label: 'Dynamics 365', color: 'oklch(0.72 0.16 255)', bg: 'oklch(0.15 0.06 255 / 60%)' },
  { id: 'odoo', label: 'Odoo ERP', color: 'oklch(0.72 0.16 162)', bg: 'oklch(0.15 0.06 162 / 60%)' },
];

const DEMO_CREDENTIALS = [
  { role: 'Admin', email: 'admin@concordia.ca', password: 'admin123', color: 'oklch(0.65 0.22 25)' },
  { role: 'Professeur', email: 'prof@concordia.ca', password: 'prof123', color: 'oklch(0.72 0.15 200)' },
  { role: 'Étudiant', email: 'student@concordia.ca', password: 'student123', color: 'oklch(0.72 0.16 162)' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedSystem, setSelectedSystem] = useState('sap');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const ok = await login(email, password);
    setLoading(false);
    if (ok) navigate('/dashboard');
    else setError('Identifiants incorrects. Utilisez les accès de démonstration ci-dessous.');
  };

  const fillDemo = (cred: typeof DEMO_CREDENTIALS[0]) => {
    setEmail(cred.email);
    setPassword(cred.password);
    setError('');
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'oklch(0.09 0.015 255)' }}>
      {/* Left panel — hero */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden">
        <img src={HERO_BG} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, oklch(0.09 0.015 255 / 80%) 0%, oklch(0.12 0.020 255 / 60%) 100%)' }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Header */}
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="Logo" className="w-10 h-10 rounded-xl" />
            <div>
              <div className="font-bold text-white" style={{ fontFamily: 'Space Grotesk', fontSize: '16px' }}>
                ERP Integrated Business Simulator
              </div>
              <div className="text-xs" style={{ color: 'oklch(0.55 0.010 255)' }}>
                Collège de la Concorde · Programme 2
              </div>
            </div>
          </div>

          {/* Diagram */}
          <div className="flex-1 flex items-center justify-center">
            <img src={DIAGRAM} alt="ERP Modules" className="max-w-lg w-full rounded-2xl opacity-90"
              style={{ filter: 'drop-shadow(0 0 40px oklch(0.60 0.20 255 / 20%))' }} />
          </div>

          {/* Bottom info */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'Space Grotesk' }}>
              Maîtrisez les systèmes ERP
            </h1>
            <p className="text-sm mb-6" style={{ color: 'oklch(0.65 0.010 255)', lineHeight: '1.6' }}>
              Simulez des transactions réelles dans SAP S/4HANA, Microsoft Dynamics 365 et Odoo.
              Cycles Procure-to-Pay, Order-to-Cash et intégration financière.
            </p>
            {/* System pills */}
            <div className="flex gap-3">
              {SYSTEMS.map(s => (
                <div key={s.id} className="px-3 py-1.5 rounded-full text-xs font-mono font-semibold"
                  style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}40` }}>
                  {s.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="w-full lg:w-[420px] flex flex-col justify-center px-8 py-12 shrink-0"
        style={{ background: 'oklch(0.11 0.016 255)', borderLeft: '1px solid oklch(1 0 0 / 6%)' }}>

        {/* Mobile logo */}
        <div className="flex items-center gap-3 mb-8 lg:hidden">
          <img src={LOGO} alt="Logo" className="w-9 h-9 rounded-xl" />
          <div className="font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>ERP Simulator</div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)' }}>
            Connexion
          </h2>
          <p className="text-sm" style={{ color: 'oklch(0.50 0.010 255)' }}>
            Accédez à votre environnement ERP simulé
          </p>
        </div>

        {/* System selector */}
        <div className="mb-6">
          <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: 'oklch(0.45 0.010 255)' }}>
            Système ERP de référence
          </label>
          <div className="grid grid-cols-3 gap-2">
            {SYSTEMS.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedSystem(s.id)}
                className="px-2 py-2 rounded-lg text-xs font-mono font-semibold transition-all"
                style={{
                  background: selectedSystem === s.id ? s.bg : 'oklch(0.15 0.016 255)',
                  color: selectedSystem === s.id ? s.color : 'oklch(0.45 0.010 255)',
                  border: `1px solid ${selectedSystem === s.id ? s.color + '60' : 'oklch(1 0 0 / 8%)'}`,
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'oklch(0.60 0.010 255)' }}>
              Adresse courriel
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="votre@concordia.ca"
              required
              className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
              style={{
                background: 'oklch(0.15 0.016 255)',
                border: '1px solid oklch(1 0 0 / 10%)',
                color: 'oklch(0.90 0.005 255)',
              }}
              onFocus={e => (e.target.style.borderColor = 'oklch(0.60 0.20 255 / 50%)')}
              onBlur={e => (e.target.style.borderColor = 'oklch(1 0 0 / 10%)')}
            />
          </div>
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'oklch(0.60 0.010 255)' }}>
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 pr-10 rounded-lg text-sm outline-none transition-all"
                style={{
                  background: 'oklch(0.15 0.016 255)',
                  border: '1px solid oklch(1 0 0 / 10%)',
                  color: 'oklch(0.90 0.005 255)',
                }}
                onFocus={e => (e.target.style.borderColor = 'oklch(0.60 0.20 255 / 50%)')}
                onBlur={e => (e.target.style.borderColor = 'oklch(1 0 0 / 10%)')}
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'oklch(0.45 0.010 255)' }}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-xs px-3 py-2 rounded-lg" style={{ background: 'oklch(0.65 0.22 25 / 15%)', color: 'oklch(0.75 0.18 25)', border: '1px solid oklch(0.65 0.22 25 / 30%)' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2"
            style={{
              background: 'oklch(0.60 0.20 255)',
              color: 'white',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Se connecter
          </button>
        </form>

        {/* Demo credentials */}
        <div className="mt-6">
          <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'oklch(0.40 0.010 255)' }}>
            Accès de démonstration
          </div>
          <div className="space-y-2">
            {DEMO_CREDENTIALS.map(cred => (
              <button
                key={cred.role}
                type="button"
                onClick={() => fillDemo(cred)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all"
                style={{
                  background: 'oklch(0.14 0.016 255)',
                  border: '1px solid oklch(1 0 0 / 6%)',
                  color: 'oklch(0.65 0.010 255)'
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = `${cred.color}40`)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'oklch(1 0 0 / 6%)')}
              >
                <span className="font-semibold" style={{ color: cred.color }}>{cred.role}</span>
                <span className="font-mono">{cred.email}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center text-xs" style={{ color: 'oklch(0.35 0.008 255)' }}>
          Collège de la Concorde · ERP Integrated Business Simulator<br />
          Programme 2 · SAP S/4HANA · Dynamics 365 · Odoo
        </div>
      </div>
    </div>
  );
}
