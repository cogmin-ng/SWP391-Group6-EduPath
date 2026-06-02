import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import PublicRoute from "./PublicRoute";
import AdminLayout from "../layouts/AdminLayout";
import DashboardPage from "../pages/admin/DashboardPage";
import ProtectedRoute from "./ProtectedRoute";
import MenteeLayout from "../layouts/MenteeLayout";
import MenteeProfilePage from "../pages/mentee/MenteeProfilePage";
import MentorLayout from "../layouts/MentorLayout";
import MentorDashboardPage from "../pages/mentor/MentorDashboardPage";
import CreateRoadmapPage from "../pages/mentor/CreateRoadmapPage";
import NodeDetailsPage from "../pages/mentor/NodeDetailsPage";
import BecomeMentorPage from "../pages/mentee/BecomeMentorPage";

// Placeholder component for pages that are not yet implemented
function PlaceholderPage({ title }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">{title}</h1>
        <p className="text-slate-500">This page is under development.</p>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        }
      />

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
      <Route
        path="/admin"
        element={<Navigate to="/admin/dashboard" replace />}
      />

      <Route
        path="/mentee"
        element={<Navigate to="/mentee/homepage" replace />}
      />

      <Route
        path="/mentor"
        element={<Navigate to="/mentor/dashboard" replace />}
      />

      <Route
        path="/mentee/homepage"
        element={
          <ProtectedRoute allowedRoles={["MENTEE"]}>
            <MenteeLayout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mentee/profile"
        element={
          <ProtectedRoute allowedRoles={["MENTEE"]}>
            <MenteeProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Mentor Routes */}
      <Route
        path="/mentor"
        element={
          <ProtectedRoute allowedRoles={["MENTOR"]}>
            <MentorLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<MentorDashboardPage />} />
        <Route path="create-roadmap" element={<CreateRoadmapPage />} />
        <Route
          path="roadmaps/:roadmapId/nodes/:nodeId"
          element={<NodeDetailsPage />}
        />
        <Route
          path="roadmaps"
          element={<PlaceholderPage title="Manage My Roadmaps" />}
        />
        <Route
          path="reviews"
          element={<PlaceholderPage title="Pending Reviews" />}
        />
        <Route
          path="analytics"
          element={<PlaceholderPage title="Analytics" />}
        />
        <Route
          path="settings"
          element={<PlaceholderPage title="Settings" />}
        />
      </Route>
      <Route
        path="/profile/become-mentor"
        element={
          <ProtectedRoute allowedRoles={["MENTEE"]}>
            <BecomeMentorPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route
          path="users"
          element={<PlaceholderPage title="User Management" />}
        />
        <Route
          path="categories"
          element={<PlaceholderPage title="Category Management" />}
        />
        <Route
          path="roadmaps"
          element={<PlaceholderPage title="Roadmap Approval" />}
        />
        <Route
          path="mentors"
          element={<PlaceholderPage title="Mentor Requests" />}
        />
        <Route path="reports" element={<PlaceholderPage title="Reports" />} />
        <Route path="settings" element={<PlaceholderPage title="Settings" />} />
      </Route>

      {/* 404 Route */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
              <p className="text-slate-500 mb-6">
                Oops! The page you're looking for doesn't exist.
              </p>
              <a
                href="/admin/dashboard"
                className="text-indigo-600 font-semibold hover:underline"
              >
                Go back to Dashboard
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
}
