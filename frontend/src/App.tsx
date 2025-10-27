/**
 * Main App component for EchoNote
 * 
 * This component handles:
 * - Application routing with React Router
 * - Authentication state management
 * - Theme provider setup
 * - Protected route logic
 * - Loading states
 * 
 * Architecture:
 * - Uses Zustand for global state management
 * - Implements route protection based on authentication
 * - Provides theme context to all child components
 * - Handles navigation between public and protected routes
 */

import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { ThemeProvider } from '@/components/theme-provider'
import { Layout } from '@/components/layout'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { JournalPage } from '@/pages/JournalPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

function App() {
  // Get authentication state from Zustand store
  const { isAuthenticated, isLoading } = useAuthStore()

  // Show loading spinner while checking authentication status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    // Theme provider enables dark/light mode switching
    <ThemeProvider defaultTheme="system" storageKey="echonote-theme">
      <div className="min-h-screen gradient-bg">
        <Routes>
          {/* Public routes - redirect to dashboard if already authenticated */}
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />
            }
          />

          {/* Protected routes - require authentication */}
          <Route
            path="/*"
            element={
              isAuthenticated ? (
                // Wrap protected routes in Layout component for navigation
                <Layout>
                  <Routes>
                    {/* Redirect root path to dashboard */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    {/* Main application pages */}
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/journal" element={<JournalPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    {/* Catch-all route for unknown paths */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </Layout>
              ) : (
                // Redirect unauthenticated users to login
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
    </ThemeProvider>
  )
}

export default App
