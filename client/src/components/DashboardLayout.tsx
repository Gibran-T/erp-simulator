// DashboardLayout — ERP Integrated Business Simulator
// Design: Dark corporate ERP — Space Grotesk + DM Sans
// Features: FR/EN language toggle, Dark/Light mode toggle, translated nav
import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useLang } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  LayoutDashboard, BookOpen, Play, Users, ClipboardList,
  BarChart3, BookMarked, Settings, LogOut, Menu, X,
  Layers, Package, ShoppingCart, DollarSign, Zap, ChevronRight,
  Sun, Moon
} from 'lucide-react';

const LOGO_ICON = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029779635/h8ynqFBCEuYgutk3aFBMKE/erp-logo-icon_b069b4ac.png';

const MODULE_COLORS: Record<string, string> = {
  'erp-arch': 'oklch(0.65 0.22 295)',
  'mm': 'oklch(0.72 0.15 200)',
  'sd': 'oklch(0.72 0.16 162)',
  'fi': 'oklch(0.78 0.16 70)',
  'erp-sim': 'oklch(0.65 0.22 25)',
};

const MODULE_ICONS: Record<string, React.ReactNode> = {
  'erp-arch': <Layers size={14} />,
  'mm': <Package size={14} />,
  'sd': <ShoppingCart size={14} />,
  'fi': <DollarSign size={14} />,
  'erp-sim': <Zap size={14} />,
};

interface NavItem {
  labelKey: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { labelKey: 'nav.dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { labelKey: 'nav.modules', href: '/modules', icon: <BookOpen size={18} /> },
  { labelKey: 'nav.simulator', href: '/simulator', icon: <Play size={18} /> },
  { labelKey: 'nav.cohorts', href: '/cohorts', icon: <Users size={18} />, roles: ['admin', 'teacher'] },
  { labelKey: 'nav.assignments', href: '/assignments', icon: <ClipboardList size={18} /> },
  { labelKey: 'nav.monitoring', href: '/monitoring', icon: <BarChart3 size={18} />, roles: ['admin', 'teacher'] },
  { labelKey: 'nav.teacherGuide', href: '/teacher-guide', icon: <BookMarked size={18} />, roles: ['admin', 'teacher'] },
  { labelKey: 'nav.admin', href: '/admin', icon: <Settings size={18} />, roles: ['admin'] },
];

const ERP_MODULES = [
  { id: 'erp-arch', code: 'ERP-ARCH', name: 'Architecture ERP' },
  { id: 'mm', code: 'MM', name: 'Materials Management' },
  { id: 'sd', code: 'SD', name: 'Sales & Distribution' },
  { id: 'fi', code: 'FI', name: 'Financial Integration' },
  { id: 'erp-sim', code: 'ERP-SIM', name: 'Integrated Simulation' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useLang();
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modulesExpanded, setModulesExpanded] = useState(false);

  const visibleNav = NAV_ITEMS.filter(item =>
    !item.roles || item.roles.includes(user?.role || '')
  );

  const roleLabel = user?.role === 'admin'
    ? (lang === 'fr' ? 'Administrateur' : 'Administrator')
    : user?.role === 'teacher'
      ? (lang === 'fr' ? 'Professeur' : 'Teacher')
      : (lang === 'fr' ? 'Étudiant' : 'Student');

  const roleColor = user?.role === 'admin' ? 'oklch(0.65 0.22 25)' :
    user?.role === 'teacher' ? 'oklch(0.72 0.15 200)' : 'oklch(0.72 0.16 162)';

  // Light mode adjustments
  const isDark = theme === 'dark';
  const bg = isDark ? 'oklch(0.10 0.015 255)' : 'oklch(0.97 0.005 255)';
  const sidebarBg = isDark ? 'oklch(0.12 0.018 255)' : 'oklch(0.98 0.004 255)';
  const sidebarBorder = isDark ? 'oklch(1 0 0 / 6%)' : 'oklch(0 0 0 / 8%)';
  const headerBg = isDark ? 'oklch(0.11 0.016 255)' : 'oklch(0.99 0.003 255)';
  const headerBorder = isDark ? 'oklch(1 0 0 / 6%)' : 'oklch(0 0 0 / 8%)';
  const textPrimary = isDark ? 'oklch(0.93 0.005 255)' : 'oklch(0.15 0.015 255)';
  const textMuted = isDark ? 'oklch(0.50 0.010 255)' : 'oklch(0.45 0.010 255)';
  const navItemColor = isDark ? 'oklch(0.60 0.010 255)' : 'oklch(0.40 0.010 255)';
  const userCardBg = isDark ? 'oklch(0.16 0.020 255)' : 'oklch(0.94 0.006 255)';
  const programmeBadgeBg = isDark ? 'oklch(0.60 0.20 255 / 10%)' : 'oklch(0.60 0.20 255 / 8%)';
  const programmeBadgeBorder = isDark ? 'oklch(0.60 0.20 255 / 20%)' : 'oklch(0.60 0.20 255 / 25%)';

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: bg }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col w-64 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          background: sidebarBg,
          borderRight: `1px solid ${sidebarBorder}`,
          width: '256px',
          minWidth: '256px',
          flexShrink: 0
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: `1px solid ${sidebarBorder}` }}>
          <img src={LOGO_ICON} alt="ERP Logo" className="w-9 h-9 rounded-lg object-cover" />
          <div>
            <div className="text-sm font-bold leading-tight" style={{ fontFamily: 'Space Grotesk', color: textPrimary }}>
              ERP Simulator
            </div>
            <div className="text-xs" style={{ color: textMuted }}>
              Collège de la Concorde
            </div>
          </div>
          <button
            className="ml-auto lg:hidden"
            onClick={() => setSidebarOpen(false)}
            style={{ color: textMuted }}
          >
            <X size={18} />
          </button>
        </div>

        {/* User info */}
        <div className="px-4 py-3 mx-3 mt-3 rounded-lg" style={{ background: userCardBg }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: `${roleColor}30`, color: roleColor, border: `1px solid ${roleColor}50` }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold truncate" style={{ color: textPrimary }}>
                {user?.name}
              </div>
              <div className="text-xs" style={{ color: roleColor, fontSize: '10px' }}>
                {roleLabel} {user?.cohort ? `· ${user.cohort}` : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5">
          {visibleNav.map(item => {
            const isActive = location === item.href || (item.href !== '/dashboard' && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  style={{
                    color: isActive ? 'oklch(0.80 0.16 255)' : navItemColor,
                    background: isActive ? 'oklch(0.60 0.20 255 / 15%)' : 'transparent',
                    borderLeft: isActive ? '2px solid oklch(0.60 0.20 255)' : '2px solid transparent',
                  }}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span style={{ color: isActive ? 'oklch(0.80 0.16 255)' : navItemColor }}>
                    {item.icon}
                  </span>
                  <span className="text-sm">{t(item.labelKey)}</span>
                  {item.badge && (
                    <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full"
                      style={{ background: 'oklch(0.60 0.20 255 / 20%)', color: 'oklch(0.75 0.16 255)' }}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}

          {/* Modules quick access */}
          <div className="pt-3 pb-1">
            <button
              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider"
              style={{ color: isDark ? 'oklch(0.40 0.010 255)' : 'oklch(0.50 0.010 255)' }}
              onClick={() => setModulesExpanded(!modulesExpanded)}
            >
              <span>{lang === 'fr' ? 'Modules ERP' : 'ERP Modules'}</span>
              <ChevronRight size={12} className={`ml-auto transition-transform ${modulesExpanded ? 'rotate-90' : ''}`} />
            </button>
            {modulesExpanded && (
              <div className="mt-1 space-y-0.5">
                {ERP_MODULES.map(mod => (
                  <Link key={mod.id} href={`/modules/${mod.id}`}>
                    <div
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-all"
                      style={{
                        color: location === `/modules/${mod.id}` ? MODULE_COLORS[mod.id] : navItemColor,
                        background: location === `/modules/${mod.id}` ? `${MODULE_COLORS[mod.id]}15` : 'transparent'
                      }}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span style={{ color: MODULE_COLORS[mod.id] }}>{MODULE_ICONS[mod.id]}</span>
                      <span className="font-mono text-xs font-bold" style={{ color: MODULE_COLORS[mod.id] }}>{mod.code}</span>
                      <span className="truncate">{mod.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Programme badge */}
        <div className="px-3 pb-2">
          <div className="rounded-lg px-3 py-2 text-xs" style={{ background: programmeBadgeBg, border: `1px solid ${programmeBadgeBorder}` }}>
            <div className="font-semibold" style={{ color: 'oklch(0.75 0.16 255)' }}>Programme 2 — ERP</div>
            <div style={{ color: textMuted }}>{lang === 'fr' ? '30 heures · 5 modules' : '30 hours · 5 modules'}</div>
          </div>
        </div>

        {/* Logout */}
        <div className="px-3 pb-4" style={{ borderTop: `1px solid ${sidebarBorder}`, paddingTop: '12px' }}>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all"
            style={{ color: navItemColor }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'oklch(0.65 0.22 25)'; (e.currentTarget as HTMLElement).style.background = 'oklch(0.65 0.22 25 / 10%)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = navItemColor; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            <LogOut size={16} />
            <span>{t('nav.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-3 px-6 py-3 shrink-0"
          style={{ borderBottom: `1px solid ${headerBorder}`, background: headerBg }}>
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
            style={{ color: textMuted }}
          >
            <Menu size={20} />
          </button>
          <div className="flex-1">
            <div className="text-xs font-mono" style={{ color: isDark ? 'oklch(0.40 0.010 255)' : 'oklch(0.50 0.010 255)' }}>
              ERP Integrated Business Simulator
            </div>
          </div>

          {/* System indicators */}
          <div className="hidden md:flex items-center gap-2">
            <span className="sys-sap text-xs px-2 py-1 rounded font-mono">SAP S/4HANA</span>
            <span className="sys-dynamics text-xs px-2 py-1 rounded font-mono">Dynamics 365</span>
            <span className="sys-odoo text-xs px-2 py-1 rounded font-mono">Odoo</span>
          </div>

          {/* Language toggle FR / EN */}
          <div className="flex items-center rounded-md overflow-hidden"
            style={{ border: `1px solid ${isDark ? 'oklch(1 0 0 / 12%)' : 'oklch(0 0 0 / 12%)'}` }}>
            <button
              onClick={() => setLang('fr')}
              className="px-2.5 py-1 text-xs font-bold font-mono transition-all"
              style={{
                background: lang === 'fr' ? 'oklch(0.60 0.20 255 / 25%)' : 'transparent',
                color: lang === 'fr' ? 'oklch(0.80 0.16 255)' : (isDark ? 'oklch(0.45 0.010 255)' : 'oklch(0.55 0.010 255)')
              }}
            >FR</button>
            <button
              onClick={() => setLang('en')}
              className="px-2.5 py-1 text-xs font-bold font-mono transition-all"
              style={{
                background: lang === 'en' ? 'oklch(0.60 0.20 255 / 25%)' : 'transparent',
                color: lang === 'en' ? 'oklch(0.80 0.16 255)' : (isDark ? 'oklch(0.45 0.010 255)' : 'oklch(0.55 0.010 255)')
              }}
            >EN</button>
          </div>

          {/* Dark / Light mode toggle */}
          {toggleTheme && (
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-md flex items-center justify-center transition-all"
              style={{
                background: isDark ? 'oklch(1 0 0 / 6%)' : 'oklch(0 0 0 / 5%)',
                color: isDark ? 'oklch(0.65 0.010 255)' : 'oklch(0.45 0.010 255)',
                border: `1px solid ${isDark ? 'oklch(1 0 0 / 10%)' : 'oklch(0 0 0 / 10%)'}`
              }}
              title={theme === 'dark' ? (lang === 'fr' ? 'Mode clair' : 'Light mode') : (lang === 'fr' ? 'Mode sombre' : 'Dark mode')}
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
