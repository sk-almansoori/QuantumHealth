import React from 'react';
import { Header } from './components/layout/Header';
import { AuthProvider } from './components/auth/AuthProvider';
import { Dashboard } from './components/dashboard/Dashboard';
import { UserProfile } from './components/dashboard/UserProfile';
import { HealthMetrics } from './components/dashboard/HealthMetrics';
import { ActivityChart } from './components/dashboard/ActivityChart';
import { AIHealthInsights } from './components/dashboard/AIHealthInsights';
import { DashboardTasks } from './components/dashboard/DashboardTasks';
import { useThemeStore } from './stores/themeStore';
import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

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

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AuthProvider>
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
              </Routes>
            </ErrorBoundary>
          </main>
        </AuthProvider>
      </div>
    </div>
  );
}