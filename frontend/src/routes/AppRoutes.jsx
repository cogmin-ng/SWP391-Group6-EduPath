import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import PublicRoute from './PublicRoute';
import AdminLayout from '../layouts/AdminLayout';
import DashboardPage from '../pages/admin/DashboardPage';

// Placeholder components for other pages
const PlaceholderPage = ({ title }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
    <h1 className="text-2xl font-bold text-slate-800 mb-4">{title}</h1>
    <p className="text-slate-500">This page is currently under development.</p>
  </div>
);

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Redirect from /admin to admin dashboard for now */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="users" element={<PlaceholderPage title="User Management" />} />
        <Route path="categories" element={<PlaceholderPage title="Category Management" />} />
        <Route path="roadmaps" element={<PlaceholderPage title="Roadmap Approval" />} />
        <Route path="mentors" element={<PlaceholderPage title="Mentor Requests" />} />
        <Route path="reports" element={<PlaceholderPage title="Reports" />} />
        <Route path="settings" element={<PlaceholderPage title="Settings" />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
            <p className="text-slate-500 mb-6">Oops! The page you're looking for doesn't exist.</p>
            <a href="/admin/dashboard" className="text-indigo-600 font-semibold hover:underline">Go back to Dashboard</a>
          </div>
        </div>
      } />
    </Routes>
  );
}
