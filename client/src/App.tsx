import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

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
import NotFound from "./pages/NotFound";

function AppRouter() {
  const { isAuthenticated } = useAuth();
  const [location] = useLocation();

  if (!isAuthenticated && location !== '/login') {
    return <LoginPage />;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

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
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <AppRouter />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
