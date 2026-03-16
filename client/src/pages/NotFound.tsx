import { Link } from 'wouter';
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{background:'oklch(0.10 0.015 255)',color:'oklch(0.85 0.005 255)'}}>
      <div className="text-6xl font-bold mb-4" style={{fontFamily:'Space Grotesk'}}>404</div>
      <div className="text-xl mb-6">Page introuvable</div>
      <Link href="/dashboard"><span className="px-4 py-2 rounded-lg text-sm" style={{background:'oklch(0.60 0.20 255)',color:'white'}}>Retour au tableau de bord</span></Link>
    </div>
  );
}
