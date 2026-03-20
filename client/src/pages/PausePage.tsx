// PausePage — ERP Integrated Business Simulator
// Full-screen pause message for the professor to project during class transitions
// Route: /pause — navigate here and project on screen to signal students to stop
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';

const COLLEGE_LOGO = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029779635/h8ynqFBCEuYgutk3aFBMKE/college-concorde-logo_3c09f745.jpg';

export default function PausePage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [time, setTime] = useState(new Date());

  // Live clock
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // ESC key to exit
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') navigate(-1 as unknown as string);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  const timeStr = time.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center select-none"
      style={{ background: 'oklch(0.07 0.015 255)', zIndex: 9999 }}
    >
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-5"
        style={{ borderBottom: '1px solid oklch(1 0 0 / 6%)' }}>
        <img src={COLLEGE_LOGO} alt="Collège de la Concorde" className="h-8 object-contain rounded" />
        <div className="font-mono text-lg font-bold" style={{ color: 'oklch(0.55 0.010 255)' }}>{timeStr}</div>
      </div>

      {/* Main content */}
      <div className="text-center px-8 max-w-2xl">
        {/* Pause icon */}
        <div className="flex items-center justify-center gap-5 mb-10">
          <div className="w-10 h-28 rounded-xl" style={{ background: 'oklch(0.78 0.16 70)' }} />
          <div className="w-10 h-28 rounded-xl" style={{ background: 'oklch(0.78 0.16 70)' }} />
        </div>

        <h1
          className="text-5xl font-black mb-4 tracking-tight"
          style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)', letterSpacing: '-0.02em' }}
        >
          PAUSE
        </h1>

        <p
          className="text-xl font-semibold mb-2"
          style={{ color: 'oklch(0.78 0.16 70)' }}
        >
          Attendez les instructions du professeur
        </p>

        <p
          className="text-base"
          style={{ color: 'oklch(0.45 0.010 255)' }}
        >
          Ne fermez pas votre navigateur · Votre progression est sauvegardée
        </p>
      </div>

      {/* Bottom bar — only visible to professor/admin */}
      {(user?.role === 'teacher' || user?.role === 'admin') && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-4 px-8 py-5"
          style={{ borderTop: '1px solid oklch(1 0 0 / 6%)' }}>
          <span className="text-xs" style={{ color: 'oklch(0.40 0.010 255)' }}>
            Mode Pause actif — visible sur le projecteur
          </span>
          <button
            onClick={() => navigate(-1 as unknown as string)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: 'oklch(0.78 0.16 70)', color: 'oklch(0.10 0.015 255)' }}
          >
            ▶ Reprendre le cours
          </button>
          <span className="text-xs" style={{ color: 'oklch(0.35 0.010 255)' }}>ou appuyez sur Échap</span>
        </div>
      )}
    </div>
  );
}
