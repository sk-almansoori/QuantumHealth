import React from 'react';
import { Header } from './components/layout/Header';
import { AuthProvider } from './components/auth/AuthProvider';
import { Dashboard } from './components/dashboard/Dashboard';
import { UserProfile } from './components/dashboard/UserProfile';
import { HealthMetrics } from './components/dashboard/HealthMetrics';
import { ActivityChart } from './components/dashboard/ActivityChart';
import { AIHealthInsights } from './components/dashboard/AIHealthInsights';
import { DashboardTasks } from './components/dashboard/DashboardTasks';
import { GeneratedPlan } from './components/dashboard/GeneratedPlan';
import { useThemeStore } from './stores/themeStore';
import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { HealthFormProvider } from './contexts/HealthFormContext';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" className="p-4 bg-red-100 text-red-700 rounded">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary} className="mt-2 px-4 py-2 bg-red-600 text-white rounded">
        Try again
      </button>
    </div>
  );
}

export default function App() {
  const { isDarkMode } = useThemeStore();
  console.log('Rendering App component');

  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AuthProvider>
          <HealthFormProvider>
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/metrics" element={<HealthMetrics />} />
                  <Route path="/activity" element={<ActivityChart />} />
                  <Route path="/health-guide" element={<AIHealthInsights />} />
                  <Route path="/dashboard-tasks" element={<DashboardTasks />} />
                  <Route path="/generated-plan" element={<GeneratedPlan />} />
                </Routes>
              </ErrorBoundary>
            </main>
          </HealthFormProvider>
        </AuthProvider>
      </div>
      <link rel="manifest" href="/manifest.json" />
    </div>
  );
}