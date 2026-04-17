/**
 * ResetPasswordPage — ERP Integrated Business Simulator
 * Student/teacher sets a new password via a reset token link.
 * Route: /reset-password/:token
 */
import { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useLang } from '@/contexts/LanguageContext';
import { Layers, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, KeyRound } from 'lucide-react';

export default function ResetPasswordPage() {
  const { lang } = useLang();
  const { token } = useParams<{ token: string }>();
  const [, navigate] = useLocation();
  const isFr = lang === 'fr';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Validate token
  const { data: resetInfo, isLoading: loadingToken, error: tokenError } = trpc.password.getResetInfo.useQuery(
    { token: token ?? '' },
    { enabled: !!token, retry: false }
  );

  const resetPassword = trpc.password.resetPassword.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError(isFr ? 'Les mots de passe ne correspondent pas.' : 'Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError(isFr ? 'Le mot de passe doit contenir au moins 6 caractères.' : 'Password must be at least 6 characters.');
      return;
    }
    setSubmitting(true);
    try {
      await resetPassword.mutateAsync({ token: token ?? '', newPassword });
      setSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : (isFr ? 'Une erreur est survenue.' : 'An error occurred.');
      setError(msg);
    } finally {
      setSubmitting(false);
    }
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

  const labelStyle = {
    color: 'oklch(0.75 0.01 255)',
    fontSize: '0.875rem',
    fontWeight: 500,
    display: 'block',
    marginBottom: '0.375rem',
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
                {isFr ? 'Réinitialiser le mot de passe' : 'Reset password'}
              </h2>
              {resetInfo && (
                <p className="text-xs" style={{ color: 'oklch(0.55 0.01 255)' }}>
                  {isFr ? `Compte : ` : `Account: `}
                  <span style={{ color: 'oklch(0.70 0.18 255)' }}>{resetInfo.email}</span>
                </p>
              )}
            </div>
          </div>

          {/* Loading */}
          {loadingToken && (
            <div className="flex flex-col items-center gap-3 py-8">
              <Loader2 size={32} className="animate-spin" style={{ color: 'oklch(0.65 0.18 255)' }} />
              <p style={{ color: 'oklch(0.65 0.01 255)', fontSize: '0.875rem' }}>
                {isFr ? 'Vérification du lien…' : 'Verifying link…'}
              </p>
            </div>
          )}

          {/* Invalid token */}
          {!loadingToken && tokenError && (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <AlertCircle size={40} style={{ color: 'oklch(0.65 0.20 25)' }} />
              <p className="font-semibold" style={{ color: 'oklch(0.85 0.005 255)' }}>
                {isFr ? 'Lien invalide ou expiré' : 'Invalid or expired link'}
              </p>
              <p style={{ color: 'oklch(0.55 0.01 255)', fontSize: '0.875rem' }}>
                {isFr ? 'Ce lien de réinitialisation n\'est plus valide.' : 'This reset link is no longer valid.'}
              </p>
              <button
                onClick={() => navigate('/forgot-password')}
                className="mt-2 px-5 py-2 rounded-xl text-sm font-semibold"
                style={{ background: 'linear-gradient(135deg, oklch(0.55 0.22 255), oklch(0.45 0.20 290))', color: 'white' }}
              >
                {isFr ? 'Demander un nouveau lien' : 'Request a new link'}
              </button>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <CheckCircle size={40} style={{ color: 'oklch(0.65 0.20 145)' }} />
              <p className="font-semibold text-lg" style={{ color: 'oklch(0.85 0.005 255)' }}>
                {isFr ? 'Mot de passe mis à jour !' : 'Password updated!'}
              </p>
              <p style={{ color: 'oklch(0.55 0.01 255)', fontSize: '0.875rem' }}>
                {isFr ? 'Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.' : 'You can now log in with your new password.'}
              </p>
              <button
                onClick={() => navigate('/login')}
                className="mt-3 px-6 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: 'linear-gradient(135deg, oklch(0.55 0.22 255), oklch(0.45 0.20 290))', color: 'white' }}
              >
                {isFr ? 'Se connecter' : 'Log in'}
              </button>
            </div>
          )}

          {/* Form */}
          {!loadingToken && resetInfo && !success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New password */}
              <div>
                <label style={labelStyle}>{isFr ? 'Nouveau mot de passe' : 'New password'}</label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{ ...inputStyle, paddingRight: '3rem' }}
                    onFocus={e => (e.target.style.borderColor = 'oklch(0.55 0.22 255)')}
                    onBlur={e => (e.target.style.borderColor = 'oklch(0.25 0.02 255)')}
                  />
                  <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1" style={{ color: 'oklch(0.50 0.01 255)' }}>
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label style={labelStyle}>{isFr ? 'Confirmer le mot de passe' : 'Confirm password'}</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{ ...inputStyle, paddingRight: '3rem' }}
                    onFocus={e => (e.target.style.borderColor = 'oklch(0.55 0.22 255)')}
                    onBlur={e => (e.target.style.borderColor = 'oklch(0.25 0.02 255)')}
                  />
                  <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1" style={{ color: 'oklch(0.50 0.01 255)' }}>
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm" style={{ background: 'oklch(0.20 0.08 25 / 40%)', border: '1px solid oklch(0.45 0.15 25 / 50%)', color: 'oklch(0.75 0.12 25)' }}>
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: submitting ? 'oklch(0.40 0.15 255)' : 'linear-gradient(135deg, oklch(0.55 0.22 255), oklch(0.45 0.20 290))',
                  color: 'white',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                }}
              >
                {submitting
                  ? (isFr ? 'Mise à jour…' : 'Updating…')
                  : (isFr ? 'Mettre à jour le mot de passe' : 'Update password')}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs mt-4" style={{ color: 'oklch(0.35 0.01 255)' }}>
          Collège de la Concorde · ERP-SIM · Prof. Thiago Gibran
        </p>
      </div>
    </div>
  );
}
