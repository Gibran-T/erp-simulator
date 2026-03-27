/**
 * LoginPage — ERP Integrated Business Simulator
 * Dual login: student tab and teacher/admin tab.
 * Uses tRPC backend authentication.
 */
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import { Layers, BookOpen, GraduationCap, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { trpc } from '@/lib/trpc';

type LoginTab = 'student' | 'teacher';

export default function LoginPage() {
  const { loginAsStudent, loginAsTeacher } = useAuth();
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<LoginTab>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = tab === 'student'
        ? await loginAsStudent(email, password)
        : await loginAsTeacher(email, password);
      if (result.success) {
        toast.success('Connexion réussie !');
        navigate('/dashboard');
      } else {
        setError(result.error || 'Email ou mot de passe incorrect.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      background: 'oklch(0.08 0.015 255)',
    }}>
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(oklch(0.6 0.15 255) 1px, transparent 1px), linear-gradient(90deg, oklch(0.6 0.15 255) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      <div className="relative w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{
            background: 'linear-gradient(135deg, oklch(0.55 0.22 255), oklch(0.45 0.20 290))',
          }}>
            <Layers size={32} color="white" />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'oklch(0.95 0.005 255)', fontFamily: 'Space Grotesk, sans-serif' }}>
            ERP Simulator
          </h1>
          <p className="text-sm mt-1" style={{ color: 'oklch(0.55 0.01 255)' }}>
            Collège de la Concordia
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{
          background: 'oklch(0.12 0.015 255)',
          border: '1px solid oklch(0.22 0.02 255)',
          boxShadow: '0 24px 64px oklch(0 0 0 / 60%)',
        }}>
          {/* Tabs */}
          <div className="flex rounded-xl p-1 mb-6" style={{ background: 'oklch(0.08 0.01 255)' }}>
            <button
              onClick={() => { setTab('student'); setError(''); }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: tab === 'student' ? 'oklch(0.55 0.22 255)' : 'transparent',
                color: tab === 'student' ? 'white' : 'oklch(0.55 0.01 255)',
              }}
            >
              <BookOpen size={15} />
              Étudiant
            </button>
            <button
              onClick={() => { setTab('teacher'); setError(''); }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: tab === 'teacher' ? 'oklch(0.55 0.22 255)' : 'transparent',
                color: tab === 'teacher' ? 'white' : 'oklch(0.55 0.01 255)',
              }}
            >
              <GraduationCap size={15} />
              Professeur
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'oklch(0.75 0.01 255)' }}>
                Adresse email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={tab === 'student' ? 'prenom.nom@laconcorde.ca' : 'prof@laconcorde.ca'}
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: 'oklch(0.08 0.01 255)',
                  border: '1px solid oklch(0.25 0.02 255)',
                  color: 'oklch(0.92 0.005 255)',
                }}
                onFocus={e => e.target.style.borderColor = 'oklch(0.55 0.22 255)'}
                onBlur={e => e.target.style.borderColor = 'oklch(0.25 0.02 255)'}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'oklch(0.75 0.01 255)' }}>
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: 'oklch(0.08 0.01 255)',
                    border: '1px solid oklch(0.25 0.02 255)',
                    color: 'oklch(0.92 0.005 255)',
                  }}
                  onFocus={e => e.target.style.borderColor = 'oklch(0.55 0.22 255)'}
                  onBlur={e => e.target.style.borderColor = 'oklch(0.25 0.02 255)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                  style={{ color: 'oklch(0.50 0.01 255)' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm" style={{
                background: 'oklch(0.20 0.08 25 / 40%)',
                border: '1px solid oklch(0.45 0.15 25 / 50%)',
                color: 'oklch(0.75 0.12 25)',
              }}>
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all mt-2"
              style={{
                background: loading ? 'oklch(0.40 0.15 255)' : 'linear-gradient(135deg, oklch(0.55 0.22 255), oklch(0.45 0.20 290))',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-5 pt-4" style={{ borderTop: '1px solid oklch(0.18 0.02 255)' }}>
            <p className="text-xs text-center mb-2" style={{ color: 'oklch(0.40 0.01 255)' }}>
              Comptes de démonstration
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setTab('teacher'); setEmail('prof@laconcorde.ca'); setPassword('prof123'); }}
                className="px-3 py-2 rounded-lg text-xs transition-all"
                style={{ background: 'oklch(0.15 0.02 255)', color: 'oklch(0.60 0.01 255)', border: '1px solid oklch(0.20 0.02 255)' }}
              >
                👩‍🏫 Professeur
              </button>
              <button
                onClick={() => { setTab('student'); setEmail('student@laconcorde.ca'); setPassword('student123'); }}
                className="px-3 py-2 rounded-lg text-xs transition-all"
                style={{ background: 'oklch(0.15 0.02 255)', color: 'oklch(0.60 0.01 255)', border: '1px solid oklch(0.20 0.02 255)' }}
              >
                🎓 Étudiant
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: 'oklch(0.35 0.01 255)' }}>
          Votre compte est créé par votre professeur.
        </p>
      </div>
    </div>
  );
}
