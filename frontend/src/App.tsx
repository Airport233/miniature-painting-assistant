import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import EmailVerifiedPage from './pages/EmailVerifiedPage';
import WorkspacePage from './pages/WorkspacePage';
import PaintsPage from './pages/PaintsPage';
import RecipesPage from './pages/RecipesPage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/common/Layout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes - no sidebar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<EmailVerifiedPage />} />

        {/* Protected routes - with sidebar */}
        <Route element={<Layout />}>
          <Route
            path="/paints"
            element={
              <ProtectedRoute>
                <PaintsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workspace"
            element={
              <ProtectedRoute>
                <WorkspacePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipes"
            element={
              <ProtectedRoute>
                <RecipesPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/workspace" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
