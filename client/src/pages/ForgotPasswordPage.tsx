/**
 * ForgotPasswordPage — ERP Integrated Business Simulator
 * Student/teacher enters email → system generates reset token →
 * displays the reset link directly on screen (copy + open button).
 * Route: /forgot-password
 */
import { useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useLang } from '@/contexts/LanguageContext';
import { Layers, AlertCircle, Copy, Check, ArrowLeft, KeyRound } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { lang } = useLang();
  const [, navigate] = useLocation();
  const isFr = lang === 'fr';

  const [email, setEmail] = useState('');
  const [resetUrl, setResetUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const forgotPassword = trpc.password.forgotPassword.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await forgotPassword.mutateAsync({ email });
      const url = `${window.location.origin}/reset-password/${result.token}`;
      setResetUrl(url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : (isFr ? 'Une erreur est survenue.' : 'An error occurred.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(resetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cardStyle = {
    background: 'oklch(0.11 0.015 255)',
    border: '1px solid oklch(0.20 0.025 255)',
    borderRadius: '1rem',
    padding: '2rem',
    width: '100%',
    maxWidth: '440px',
  };

  const inputStyle = {
    background: 'oklch(0.08 0.01 255)',
    border: '1px solid oklch(0.25 0.02 255)',
    color: 'oklch(0.92 0.005 255)',
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.75rem',
    fontSize: '0.875rem',
    outline: 'none',
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'oklch(0.08 0.015 255)' }}>
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(oklch(0.6 0.15 255) 1px, transparent 1px), linear-gradient(90deg, oklch(0.6 0.15 255) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />
      <div className="relative w-full max-w-md mx-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3" style={{ background: 'oklch(0.55 0.22 255 / 15%)', border: '1px solid oklch(0.55 0.22 255 / 30%)' }}>
            <Layers size={22} style={{ color: 'oklch(0.70 0.18 255)' }} />
          </div>
          <h1 className="text-xl font-bold" style={{ color: 'oklch(0.92 0.005 255)', fontFamily: 'Space Grotesk, sans-serif' }}>
            ERP-SIM
          </h1>
          <p className="text-sm mt-1" style={{ color: 'oklch(0.55 0.01 255)' }}>
            Collège de la Concorde
          </p>
        </div>

        <div style={cardStyle}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'oklch(0.55 0.22 255 / 15%)' }}>
              <KeyRound size={18} style={{ color: 'oklch(0.70 0.18 255)' }} />
            </div>
            <div>
              <h2 className="text-base font-bold" style={{ color: 'oklch(0.92 0.005 255)', fontFamily: 'Space Grotesk, sans-serif' }}>
                {isFr ? 'Mot de passe oublié ?' : 'Forgot password?'}
              </h2>
              <p className="text-xs" style={{ color: 'oklch(0.55 0.01 255)' }}>
                {isFr ? 'Entrez votre email pour recevoir un lien de réinitialisation.' : 'Enter your email to receive a reset link.'}
              </p>
            </div>
          </div>

          {!resetUrl ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'oklch(0.75 0.01 255)' }}>
                  {isFr ? 'Adresse email' : 'Email address'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={isFr ? 'votre@email.ca' : 'your@email.ca'}
                  required
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = 'oklch(0.55 0.22 255)')}
                  onBlur={e => (e.target.style.borderColor = 'oklch(0.25 0.02 255)')}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm" style={{ background: 'oklch(0.20 0.08 25 / 40%)', border: '1px solid oklch(0.45 0.15 25 / 50%)', color: 'oklch(0.75 0.12 25)' }}>
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: loading ? 'oklch(0.40 0.15 255)' : 'linear-gradient(135deg, oklch(0.55 0.22 255), oklch(0.45 0.20 290))',
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading
                  ? (isFr ? 'Génération du lien…' : 'Generating link…')
                  : (isFr ? 'Générer le lien de réinitialisation' : 'Generate reset link')}
              </button>
            </form>
          ) : (
            /* Reset link display */
            <div className="space-y-4">
              <div className="px-3 py-2.5 rounded-lg text-sm" style={{ background: 'oklch(0.15 0.06 145 / 30%)', border: '1px solid oklch(0.45 0.15 145 / 40%)', color: 'oklch(0.75 0.12 145)' }}>
                {isFr ? '✓ Lien généré avec succès. Copiez-le et partagez-le avec l\'utilisateur.' : '✓ Link generated successfully. Copy it and share it with the user.'}
              </div>

              <div>
                <p className="text-xs font-medium mb-2" style={{ color: 'oklch(0.65 0.01 255)' }}>
                  {isFr ? 'Lien de réinitialisation (valide 1 heure) :' : 'Reset link (valid for 1 hour):'}
                </p>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg" style={{ background: 'oklch(0.08 0.01 255)', border: '1px solid oklch(0.20 0.02 255)' }}>
                  <span className="flex-1 text-xs break-all" style={{ color: 'oklch(0.70 0.18 255)', fontFamily: 'monospace' }}>
                    {resetUrl}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex-shrink-0 p-1.5 rounded-lg transition-all"
                    style={{ background: copied ? 'oklch(0.45 0.15 145 / 20%)' : 'oklch(0.20 0.02 255)', color: copied ? 'oklch(0.65 0.18 145)' : 'oklch(0.65 0.01 255)' }}
                    title={isFr ? 'Copier' : 'Copy'}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <a
                href={resetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all"
                style={{ background: 'linear-gradient(135deg, oklch(0.55 0.22 255), oklch(0.45 0.20 290))', color: 'white', textDecoration: 'none' }}
              >
                {isFr ? 'Réinitialiser mon mot de passe →' : 'Reset my password →'}
              </a>
            </div>
          )}

          {/* Back to login */}
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-1.5 mt-5 text-sm transition-all"
            style={{ color: 'oklch(0.50 0.01 255)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'oklch(0.70 0.18 255)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'oklch(0.50 0.01 255)')}
          >
            <ArrowLeft size={14} />
            {isFr ? 'Retour à la connexion' : 'Back to login'}
          </button>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: 'oklch(0.35 0.01 255)' }}>
          Collège de la Concorde · ERP-SIM · Prof. Thiago Gibran
        </p>
      </div>
    </div>
  );
}
