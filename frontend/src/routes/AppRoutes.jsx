import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import ExplorePage from "../pages/ExplorePage";
import RoadmapDetailPage from "../pages/RoadmapDetailPage";
import MyRoadmapsPage from "../pages/mentee/MyRoadmapsPage";
import RoadmapLearningPage from "../pages/mentee/RoadmapLearningPage";
import PublicRoute from "./PublicRoute";
import AdminLayout from "../layouts/AdminLayout";
import DashboardPage from "../pages/admin/DashboardPage";
import RoadmapApprovalPage from "../pages/admin/RoadmapApprovalPage";
import UserManagementPage from "../pages/admin/UserManagementPage";
import ProtectedRoute from "./ProtectedRoute";
import MentorRequestPage from "../pages/admin/MentorRequestPage";
import MenteeLayout from "../layouts/MenteeLayout";
import MenteeProfilePage from "../pages/mentee/MenteeProfilePage";
import MenteeBadgesPage from "../pages/mentee/MenteeBadgesPage";
import MentorLayout from "../layouts/MentorLayout";
import MentorDashboardPage from "../pages/mentor/MentorDashboardPage";
import MentorRoadmapsPage from "../pages/mentor/MentorRoadmapsPage";
import MentorLearnersPage from "../pages/mentor/MentorLearnersPage";
import CreateRoadmapPage from "../pages/mentor/CreateRoadmapPage";
import EditRoadmapPage from "../pages/mentor/EditRoadmapPage";
import NodeEditorPage from "../pages/mentor/NodeEditorPage";
import MentorProfilePage from "../pages/mentor/MentorProfilePage";
import NodeDetailsPage from "../pages/mentor/NodeDetailsPage";
import BecomeMentorPage from "../pages/mentee/BecomeMentorPage";
import MenteeNodeDetailsPage from "../pages/mentee/MenteeNodeDetailsPage";
import QuizPage from "../pages/mentee/QuizPage";
import RoadmapQuizPage from "../pages/mentee/RoadmapQuizPage";
import ContributionHistoryPage from "../pages/mentee/ContributionHistoryPage";
import MyCertificatesPage from "../pages/mentee/MyCertificatesPage";
import CertificateDetailPage from "../pages/mentee/CertificateDetailPage";
import PendingTipsPage from "../pages/mentor/PendingTipsPage";
import UploadMaterialsPage from "../pages/mentor/UploadMaterialsPage";
import CreateQuizPage from "../pages/mentor/CreateQuizPage";
import MentorRoadmapLearningPage from "../pages/mentor/MentorRoadmapLearningPage";
import MentorRoadmapDetailPage from "../pages/mentor/MentorRoadmapDetailPage";
import QuestionBankPage from "../pages/mentor/QuestionBankPage";
import PersonalNotesPage from "../pages/mentee/PersonalNotesPage";

import CategoryManagementPage from "../pages/admin/CategoryManagementPage";

// Placeholder component for pages that are not yet implemented
// Force reload
function PlaceholderPage({ title }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">{title}</h1>
        <p className="text-slate-500">Trang này đang trong quá trình phát triển.</p>
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
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPasswordPage />
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

      <Route
        path="/mentee/badges"
        element={
          <ProtectedRoute allowedRoles={["MENTEE"]}>
            <MenteeBadgesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mentee/contributions"
        element={
          <ProtectedRoute allowedRoles={["MENTEE"]}>
            <ContributionHistoryPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mentee/notes"
        element={
          <ProtectedRoute allowedRoles={["MENTEE"]}>
            <PersonalNotesPage />
          </ProtectedRoute>
        }
      />

      {/* Mentee Certificates */}
      <Route
        path="/my-certificates"
        element={
          <ProtectedRoute allowedRoles={["MENTEE"]}>
            <MyCertificatesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-certificates/:id"
        element={
          <ProtectedRoute allowedRoles={["MENTEE"]}>
            <CertificateDetailPage />
          </ProtectedRoute>
        }
      />

      {/* Mentee Node Details */}
      <Route
        path="/mentee/roadmaps/:roadmapId/nodes/:nodeId"
        element={
          <ProtectedRoute allowedRoles={["MENTEE"]}>
            <MenteeNodeDetailsPage />
          </ProtectedRoute>
        }
      />

      {/* Mentee Quiz */}
      <Route
        path="/mentee/roadmaps/:roadmapId/nodes/:nodeId/quiz"
        element={
          <ProtectedRoute allowedRoles={["MENTEE"]}>
            <QuizPage />
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
        <Route path="learners" element={<MentorLearnersPage />} />
        <Route path="create-roadmap" element={<CreateRoadmapPage />} />
        <Route path="roadmaps/:roadmapId" element={<MentorRoadmapDetailPage />} />
        <Route path="roadmaps/:roadmapId/learn" element={<MentorRoadmapLearningPage />} />
        <Route path="roadmaps/:roadmapId/edit" element={<EditRoadmapPage />} />
        <Route path="roadmaps/:roadmapId/nodes/:nodeId/edit" element={<NodeEditorPage />} />
        <Route path="profile" element={<MentorProfilePage />} />
        <Route
          path="roadmaps/:roadmapId/nodes/:nodeId"
          element={<NodeDetailsPage />}
        />
        <Route
          path="roadmaps/:roadmapId/nodes/:nodeId/upload-materials"
          element={<UploadMaterialsPage />}
        />
        <Route
          path="roadmaps/:roadmapId/nodes/:nodeId/quiz/create"
          element={<CreateQuizPage />}
        />
        <Route
          path="roadmaps/:roadmapId/nodes/:nodeId/quiz/:quizId/edit"
          element={<CreateQuizPage />}
        />
        <Route
          path="roadmaps"
          element={<MentorRoadmapsPage />}
        />
        <Route
          path="question-bank"
          element={<QuestionBankPage />}
        />
        <Route
          path="reviews"
          element={<PendingTipsPage />}
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
          <ProtectedRoute allowedRoles={["MENTEE", "MENTOR"]}>
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
          element={<UserManagementPage />}
        />
        <Route
          path="categories"
          element={<CategoryManagementPage />}
        />
        <Route
          path="roadmaps"
          element={<RoadmapApprovalPage />}
        />
        <Route
          path="mentors"
          element={<MentorRequestPage />}
        />
      </Route>

      {/* Explore & Roadmap Routes */}
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/explore/:slug" element={<RoadmapDetailPage />} />
      <Route path="/roadmaps" element={<MyRoadmapsPage />} />
      <Route path="/roadmaps/:slug/learn" element={<RoadmapLearningPage />} />
      <Route path="/roadmaps/:slug/learn/quiz" element={<RoadmapQuizPage />} />

      {/* 404 Route */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
              <p className="text-slate-500 mb-6">
                Rất tiếc! Trang bạn đang tìm kiếm không tồn tại.
              </p>
              <a
                href="/admin/dashboard"
                className="text-indigo-600 font-semibold hover:underline"
              >
                Quay lại Bảng điều khiển
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
}
