import './App.css'
import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import AyurvedicResultsPage from './pages/AyurvedicResults'
import AdminDashboardHome from './pages/dashboard/admin/AdminDashboardHome'
import UserDashboardHome from './pages/dashboard/user/UserDashboardHome'
import ArticlesSection from './pages/articles/ArticlesSection'
import DiscussionsPage from './pages/discussion/DiscussionsPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { AnimatePresence } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

function App() {
  const location = useLocation()
  const routeKey = location.pathname.startsWith('/articles') ? '/articles' : location.pathname

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={routeKey}>
        <Route path="/" element={<Landing />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboardHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/contribution-handle"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboardHome initialTab="Contributions" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/user"
          element={
            <ProtectedRoute role="user">
              <UserDashboardHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/user/symptoms-analyzer"
          element={
            <ProtectedRoute role="user">
              <UserDashboardHome initialTab="Analyzer" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/user/saved"
          element={
            <ProtectedRoute role="user">
              <UserDashboardHome initialTab="Saved" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/user/history"
          element={
            <ProtectedRoute role="user">
              <UserDashboardHome initialTab="History" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/user/contributions"
          element={
            <ProtectedRoute role="user">
              <UserDashboardHome initialTab="Contributions" />
            </ProtectedRoute>
          }
        />
        <Route path="/articles" element={<ArticlesSection />} />
        <Route path="/articles/:seriesSlug/:chapterSlug/:topicSlug" element={<ArticlesSection />} />
        <Route path="/discussions" element={<DiscussionsPage />} />
        <Route path="/ayurvedic-results" element={<AyurvedicResultsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

export default App
