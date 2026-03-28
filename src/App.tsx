/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Home from './pages/Home';
import VideoLessons from './pages/VideoLessons';
import CourseView from './pages/CourseView';
import LessonView from './pages/LessonView';
import AdminPanel from './pages/AdminPanel';

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-premium-black">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/" />;

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <div className="min-h-screen bg-premium-black">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lessons" element={<VideoLessons />} />
        <Route path="/course/:courseId" element={<CourseView />} />
        <Route path="/course/:courseId/lesson/:lessonId" element={<LessonView />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

