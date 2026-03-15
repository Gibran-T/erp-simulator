import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import {
  LogOut, LayoutDashboard, BookOpen, Users, ClipboardList,
  BarChart2, Settings, ChevronRight, Menu, X, ChevronLeft,
  ChevronRight as ChevronRightIcon, MonitorPlay, Moon, Sun, Globe,
  Presentation
} from "lucide-react";
import Login from "@/pages/Login";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029779635/KgVchfh3nwnwCSCPgkNzAq/concorde-logo_73f38483.png";
const APP_VERSION = "v1.0";

interface FioriShellProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export default function FioriShell({ children, title, breadcrumbs }: FioriShellProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => { window.location.href = "/"; },
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7] dark:bg-[#0a1628]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#0070f2] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("Chargement du simulateur...", "Loading simulator...")}
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const isTeacher = user?.role === "teacher" || user?.role === "admin";

  const COURSE_NAME = t(
    "Gestion intégrée des stocks et performance logistique",
    "Integrated Stock Management & Logistics Performance"
  );
  const PROGRAMME_CODE = t("Programme 1 — TEC.LOG", "Program 1 — TEC.LOG");

  const navItems = isTeacher
    ? [
        { href: "/teacher", label: t("Tableau de bord", "Dashboard"), icon: LayoutDashboard },
        { href: "/teacher/cohorts", label: t("Cohortes", "Cohorts"), icon: Users },
        { href: "/teacher/scenarios", label: t("Scénarios", "Scenarios"), icon: BookOpen },
        { href: "/teacher/assignments", label: t("Assignments", "Assignments"), icon: ClipboardList },
        { href: "/teacher/monitor", label: t("Monitoring", "Monitoring"), icon: BarChart2 },
        { href: "/student/scenarios", label: t("Simulateur", "Simulator"), icon: MonitorPlay },
      ]
    : [
        { href: "/student/scenarios", label: t("Mes Scénarios", "My Scenarios"), icon: BookOpen },
        { href: "/student/slides", label: t("Slides", "Slides"), icon: Presentation },
      ];

  if (user?.role === "admin") {
    navItems.push({ href: "/admin", label: t("Administration", "Administration"), icon: Settings });
  }

  return (
    <div className={`min-h-screen flex flex-col ${theme === "dark" ? "bg-[#0a1628]" : "bg-[#f7f7f7]"}`}>
      {/* ── Shell Bar ─────────────────────────────────────────────────────── */}
      <header className="fiori-shell-bar z-50 fixed top-0 left-0 right-0">
        {/* Logo + Institutional title */}
        <div className="flex items-center gap-3 mr-4 shrink-0">
          <img
            src={LOGO_URL}
            alt="Collège de la Concorde"
            className="h-7 object-contain brightness-0 invert"
          />
          <div className="hidden md:block border-l border-white/20 pl-3">
            <p className="text-xs font-semibold text-white leading-tight">Collège de la Concorde — Montréal</p>
            <p className="text-[10px] text-white/60 leading-tight">
              {t("Simulateur pédagogique ERP/WMS", "ERP/WMS Pedagogical Simulator")}
            </p>
          </div>
        </div>

        {/* Course name — prominent center badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md shrink-0" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)" }}>
          <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest hidden sm:block">{PROGRAMME_CODE}</span>
          <span className="text-white/40 text-[10px] hidden sm:block">—</span>
          <span className="text-[11px] font-semibold text-white hidden lg:block">{COURSE_NAME}</span>
        </div>

        {/* Nav — desktop (collapsible) */}
        {!navCollapsed && (
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location === item.href || location.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    active ? "bg-white/20 text-white" : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon size={13} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
        {navCollapsed && <div className="flex-1" />}

        {/* Nav collapse toggle (desktop) */}
        <button
          onClick={() => setNavCollapsed((v) => !v)}
          className="hidden md:flex items-center justify-center w-6 h-6 rounded text-white/50 hover:text-white hover:bg-white/10 transition-colors mr-1"
          title={navCollapsed ? t("Afficher la navigation", "Show navigation") : t("Réduire la navigation", "Collapse navigation")}
        >
          {navCollapsed ? <ChevronRightIcon size={13} /> : <ChevronLeft size={13} />}
        </button>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileMenuOpen((v) => !v)}
          className="md:hidden flex items-center justify-center w-8 h-8 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors mr-1"
          title="Menu"
        >
          {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
        </button>

        {/* ── Right controls: Lang + Dark + User + Logout ─────────────────── */}
        <div className="flex items-center gap-2 ml-auto shrink-0">

          {/* Language toggle FR/EN */}
          <button
            onClick={() => setLanguage(language === "FR" ? "EN" : "FR")}
            className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold font-mono text-white/80 hover:text-white hover:bg-white/15 transition-colors border border-white/20"
            title={language === "FR" ? "Switch to English" : "Passer en français"}
          >
            <Globe size={11} />
            {language === "FR" ? "FR" : "EN"}
          </button>

          {/* Dark mode toggle */}
          {toggleTheme && (
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-7 h-7 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              title={theme === "dark" ? t("Mode clair", "Light mode") : t("Mode sombre", "Dark mode")}
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          )}

          {/* Slides shortcut */}
          <Link
            href={isTeacher ? "/teacher/slides" : "/student/slides"}
            className="hidden sm:flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors border border-white/10"
            title={t("Accéder aux slides", "Access slides")}
          >
            <Presentation size={11} />
            <span>{t("Slides", "Slides")}</span>
          </Link>

          {/* Version */}
          <span className="text-[10px] text-white/40 font-mono hidden lg:block">{APP_VERSION}</span>

          {/* User info */}
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium text-white leading-tight">{user?.name || user?.email}</p>
            <p className="text-[10px] text-white/60 capitalize">{user?.role}</p>
          </div>

          {/* Logout */}
          <button
            onClick={() => logout.mutate()}
            className="text-white/70 hover:text-white transition-colors p-1"
            title={t("Déconnexion", "Sign out")}
          >
            <LogOut size={15} />
          </button>
        </div>
      </header>

      {/* ── Mobile Nav Dropdown ─────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed top-[44px] left-0 right-0 z-50 bg-[#0f2a44] border-b border-white/10 shadow-lg md:hidden">
          <nav className="flex flex-col py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location === item.href || location.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors ${
                    active ? "bg-white/15 text-white" : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon size={15} />
                  {item.label}
                </Link>
              );
            })}
            {/* Mobile: lang + dark mode */}
            <div className="flex items-center gap-3 px-5 py-3 border-t border-white/10">
              <button
                onClick={() => setLanguage(language === "FR" ? "EN" : "FR")}
                className="flex items-center gap-1 text-xs font-bold text-white/70 hover:text-white"
              >
                <Globe size={13} />
                {language === "FR" ? "FR → EN" : "EN → FR"}
              </button>
              {toggleTheme && (
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-1 text-xs text-white/70 hover:text-white"
                >
                  {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
                  {theme === "dark" ? t("Mode clair", "Light mode") : t("Mode sombre", "Dark mode")}
                </button>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* ── Page Header (breadcrumbs + title) ─────────────────────────────── */}
      {(title || breadcrumbs) && (
        <div className={`fixed top-[44px] left-0 right-0 z-40 border-b px-6 py-2.5 ${
          theme === "dark"
            ? "bg-[#0d2137] border-[#1a3a5c]"
            : "bg-white border-[#d9d9d9]"
        }`}>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className={`flex items-center gap-1 text-xs mb-0.5 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
              {breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight size={10} />}
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-[#0070f2]">{crumb.label}</Link>
                  ) : (
                    <span className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>{crumb.label}</span>
                  )}
                </span>
              ))}
            </div>
          )}
          {title && (
            <h1 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-[#0f2a44]"}`}>
              {title}
            </h1>
          )}
        </div>
      )}

      {/* ── Main Content ───────────────────────────────────────────────────── */}
      <main className={`flex-1 ${title || breadcrumbs ? "mt-[88px]" : "mt-[44px]"} p-6`}>
        {children}
      </main>

      {/* ── Institutional Footer ───────────────────────────────────────────── */}
      <footer className={`border-t mt-auto ${theme === "dark" ? "bg-[#0d2137] border-[#1a3a5c]" : "bg-white border-[#e0e0e0]"}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <img
              src={LOGO_URL}
              alt="Collège de la Concorde"
              className={`h-5 object-contain ${theme === "dark" ? "opacity-40 brightness-0 invert" : "opacity-60"}`}
            />
            <div>
              <p className={`text-[10px] leading-snug ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                © 2026 Collège de la Concorde — Montréal. {t("Tous droits réservés.", "All rights reserved.")}
              </p>
              <p className={`text-[10px] leading-snug ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`}>
                {t(
                  "Usage pédagogique uniquement. Reproduction, diffusion ou utilisation commerciale interdite sans autorisation.",
                  "For educational use only. Reproduction, distribution or commercial use prohibited without authorization."
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <p className={`text-[10px] font-mono ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                {APP_VERSION} — Mini-WMS ERP/WMS Simulator
              </p>
              <p className={`text-[10px] ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                {PROGRAMME_CODE} — {COURSE_NAME}
              </p>
            </div>
            <Link href="/legal" className="text-[10px] text-[#0070f2] hover:underline">
              {t("Mentions légales", "Legal notices")}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
