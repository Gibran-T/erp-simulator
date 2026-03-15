import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { user, loading } = useAuth();
  const [mandant, setMandant] = useState("800");
  const [utilisateur, setUtilisateur] = useState("");
  const [numeroEtudiant, setNumeroEtudiant] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [langue, setLangue] = useState("FR");

  const handleLogin = () => {
    window.location.href = getLoginUrl();
  };

  const handleTeacherLogin = () => {
    window.location.href = getLoginUrl();
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #0a1628 0%, #0d2137 50%, #0a1628 100%)" }}
      >
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#0070f2] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (user) {
    window.location.href = user.role === "admin" ? "/teacher" : "/student/scenarios";
    return null;
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(135deg, #0a1628 0%, #0d2137 50%, #0a1628 100%)" }}
    >
      {/* Top bar */}
      <div
        className="w-full flex items-center justify-between px-6 py-2 border-b"
        style={{ borderColor: "#1a3a5c", background: "rgba(10,22,40,0.95)" }}
      >
        <div className="flex items-center gap-3">
          {/* College logo area */}
          <div
            className="w-8 h-8 rounded flex items-center justify-center text-white font-bold text-xs"
            style={{ background: "#0070f2" }}
          >
            CC
          </div>
          <div>
            <p className="text-white text-xs font-semibold leading-tight">Collège de la Concorde — Montréal</p>
            <p className="text-gray-400 text-[10px]">Simulateur pédagogique ERP/WMS</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-500">v1.0 — Mini-WMS ERP/WMS Simulator</p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl flex gap-10 items-center">

          {/* Left — branding */}
          <div className="flex-1 hidden lg:block">
            <div className="mb-6">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-semibold mb-4"
                style={{ background: "rgba(0,112,242,0.15)", color: "#4da6ff", border: "1px solid rgba(0,112,242,0.3)" }}
              >
                PROGRAMME 1 — TEC.LOG
              </div>
              <h1 className="text-3xl font-bold text-white leading-tight mb-2">
                Gestion intégrée des stocks<br />
                <span style={{ color: "#4da6ff" }}>et performance logistique</span>
              </h1>
              <p className="text-gray-400 text-sm leading-relaxed mt-4">
                Simulateur ERP/WMS pédagogique inspiré de SAP S/4HANA.<br />
                Apprenez la gestion d'entrepôt par la pratique transactionnelle réelle.
              </p>
            </div>

            {/* Module list */}
            <div className="space-y-2 mt-8">
              {[
                { num: "M1", title: "Fondements ERP/WMS", color: "#4da6ff" },
                { num: "M2", title: "Exécution d'entrepôt", color: "#4da6ff" },
                { num: "M3", title: "Contrôle des stocks et réapprovisionnement", color: "#4da6ff" },
                { num: "M4", title: "Indicateurs de performance logistique", color: "#4da6ff" },
                { num: "M5", title: "Simulation opérationnelle intégrée", color: "#4da6ff" },
              ].map((m) => (
                <div key={m.num} className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded text-xs font-bold flex items-center justify-center shrink-0"
                    style={{ background: "rgba(0,112,242,0.2)", color: m.color, border: "1px solid rgba(0,112,242,0.3)" }}
                  >
                    {m.num}
                  </div>
                  <p className="text-gray-300 text-xs">{m.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — SAP login panel */}
          <div className="w-full max-w-sm">
            {/* SAP-style header bar */}
            <div
              className="rounded-t px-5 py-3 flex items-center justify-between"
              style={{ background: "#1a3a5c", borderBottom: "2px solid #0070f2" }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded text-white font-bold text-[10px] flex items-center justify-center"
                  style={{ background: "#0070f2" }}
                >
                  SAP
                </div>
                <div>
                  <p className="text-white text-xs font-semibold">Mini-WMS ERP/WMS</p>
                  <p className="text-gray-400 text-[9px]">Collège de la Concorde</p>
                </div>
              </div>
              <span
                className="text-[9px] font-semibold px-2 py-0.5 rounded"
                style={{ background: "rgba(0,112,242,0.2)", color: "#4da6ff", border: "1px solid rgba(0,112,242,0.3)" }}
              >
                S/4HANA
              </span>
            </div>

            {/* Login form */}
            <div
              className="rounded-b px-5 py-6 space-y-4"
              style={{ background: "#0d1f35", border: "1px solid #1a3a5c", borderTop: "none" }}
            >
              {/* Mandant */}
              <div>
                <label className="block text-[10px] font-semibold mb-1" style={{ color: "#8ab4d4" }}>
                  Mandant
                </label>
                <input
                  value={mandant}
                  onChange={(e) => setMandant(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm rounded focus:outline-none"
                  style={{
                    background: "#0a1628",
                    border: "1px solid #1a3a5c",
                    color: "#e0e8f0",
                    fontFamily: "monospace",
                  }}
                />
              </div>

              {/* Utilisateur */}
              <div>
                <label className="block text-[10px] font-semibold mb-1" style={{ color: "#8ab4d4" }}>
                  Utilisateur
                </label>
                <input
                  value={utilisateur}
                  onChange={(e) => setUtilisateur(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm rounded focus:outline-none"
                  placeholder="Votre identifiant"
                  style={{
                    background: "#0a1628",
                    border: "1px solid #1a3a5c",
                    color: "#e0e8f0",
                  }}
                />
              </div>

              {/* Numéro étudiant */}
              <div>
                <label className="block text-[10px] font-semibold mb-1" style={{ color: "#8ab4d4" }}>
                  Numéro étudiant
                </label>
                <input
                  value={numeroEtudiant}
                  onChange={(e) => setNumeroEtudiant(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm rounded focus:outline-none"
                  placeholder="Ex: 2025-12345"
                  style={{
                    background: "#0a1628",
                    border: "1px solid #1a3a5c",
                    color: "#e0e8f0",
                    fontFamily: "monospace",
                  }}
                />
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block text-[10px] font-semibold mb-1" style={{ color: "#8ab4d4" }}>
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm rounded focus:outline-none"
                  placeholder="••••••••"
                  style={{
                    background: "#0a1628",
                    border: "1px solid #1a3a5c",
                    color: "#e0e8f0",
                  }}
                />
              </div>

              {/* Langue */}
              <div>
                <label className="block text-[10px] font-semibold mb-1" style={{ color: "#8ab4d4" }}>
                  Langue
                </label>
                <select
                  value={langue}
                  onChange={(e) => setLangue(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm rounded focus:outline-none"
                  style={{
                    background: "#0a1628",
                    border: "1px solid #1a3a5c",
                    color: "#e0e8f0",
                  }}
                >
                  <option value="FR">FR — Français</option>
                  <option value="EN">EN — English</option>
                </select>
              </div>

              {/* Divider */}
              <div style={{ borderTop: "1px solid #1a3a5c" }} />

              {/* Login buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleLogin}
                  className="w-full py-2 text-sm font-semibold rounded transition-opacity hover:opacity-90"
                  style={{ background: "#0070f2", color: "#fff" }}
                >
                  Connexion Étudiant
                </button>
                <button
                  onClick={handleTeacherLogin}
                  className="w-full py-2 text-sm font-semibold rounded transition-opacity hover:opacity-90"
                  style={{ background: "transparent", color: "#4da6ff", border: "1px solid #1a3a5c" }}
                >
                  Connexion Enseignant / Admin
                </button>
              </div>

              {/* Info note */}
              <p className="text-[10px] text-center" style={{ color: "#4a6a8a" }}>
                Authentification sécurisée via Manus OAuth.<br />
                Usage pédagogique uniquement.
              </p>
            </div>

            {/* Bottom badge */}
            <div className="mt-3 text-center">
              <p className="text-[10px]" style={{ color: "#2a4a6a" }}>
                © 2026 Collège de la Concorde — Montréal · Tous droits réservés
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="w-full px-6 py-2 flex items-center justify-between border-t"
        style={{ borderColor: "#1a3a5c", background: "rgba(10,22,40,0.95)" }}
      >
        <p className="text-[10px]" style={{ color: "#2a4a6a" }}>
          Programme 1 — TEC.LOG | Gestion intégrée des stocks et performance logistique
        </p>
        <p className="text-[10px]" style={{ color: "#2a4a6a" }}>
          v1.0 — Mini-WMS ERP/WMS Simulator
        </p>
      </div>
    </div>
  );
}
