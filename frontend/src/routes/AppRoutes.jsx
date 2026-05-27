import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import ExplorePage from '../pages/ExplorePage';
import LoginPage from '../pages/LoginPage';
import MyRoadmapsPage from '../pages/MyRoadmapsPage';
import RoadmapLearningPage from '../pages/RoadmapLearningPage';
import RoadmapDetailPage from '../pages/RoadmapDetailPage';
import RegisterPage from '../pages/RegisterPage';
import PublicRoute from './PublicRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/explore/:slug" element={<RoadmapDetailPage />} />
      <Route path="/roadmaps" element={<MyRoadmapsPage />} />
      <Route path="/roadmaps/:slug/learn" element={<RoadmapLearningPage />} />

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
    </Routes>
  );
}
