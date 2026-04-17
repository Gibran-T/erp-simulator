import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { StudentsProvider } from "./contexts/StudentsContext";

// Pages
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ModulesPage from "./pages/ModulesPage";
import ModuleDetailPage from "./pages/ModuleDetailPage";
import SimulatorPage from "./pages/SimulatorPage";
import ScenarioPage from "./pages/ScenarioPage";
import CohortsPage from "./pages/CohortsPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import MonitoringPage from "./pages/MonitoringPage";
import TeacherGuidePage from "./pages/TeacherGuidePage";
import AdminPage from "./pages/AdminPage";
import NotFound from './pages/NotFound';
import PausePage from './pages/PausePage';
import AcceptInvitePage from './pages/AcceptInvitePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
function AppRouter() {
  const { isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'oklch(0.08 0.015 255)' }}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm" style={{ color: 'oklch(0.55 0.01 255)' }}>Chargement...</p>
        </div>
      </div>
    );
  }
  const publicPaths = ['/login', '/pause', '/forgot-password'];
  const isPublicPath = publicPaths.includes(location)
    || location.startsWith('/invite/')
    || location.startsWith('/reset-password/');
  if (!isAuthenticated && !isPublicPath) {
    return <LoginPage />;
  }
  if (!isAuthenticated && location === '/login') {
    return <LoginPage />;
  }

  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={DashboardPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/modules" component={ModulesPage} />
      <Route path="/modules/:moduleId" component={ModuleDetailPage} />
      <Route path="/simulator" component={SimulatorPage} />
      <Route path="/simulator/:scenarioId" component={ScenarioPage} />
      <Route path="/cohorts" component={CohortsPage} />
      <Route path="/assignments" component={AssignmentsPage} />
      <Route path="/monitoring" component={MonitoringPage} />
      <Route path="/teacher-guide" component={TeacherGuidePage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/pause" component={PausePage} />
      <Route path="/invite/:token" component={AcceptInvitePage} />
      <Route path="/forgot-password" component={ForgotPasswordPage} />
      <Route path="/reset-password/:token" component={ResetPasswordPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <LanguageProvider>
        <StudentsProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <AppRouter />
          </TooltipProvider>
        </AuthProvider>
        </StudentsProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
