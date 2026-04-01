import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Home from './pages/Home';
import VideoLessons from './pages/VideoLessons';
import CourseView from './pages/CourseView';
import LessonView from './pages/LessonView';
import AdminPanel from './pages/AdminPanel';
import PixPayment from './pages/PixPayment';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  // O sistema só libera se o 'access_key' no navegador for igual à sua senha secreta
  const hasAccess = localStorage.getItem('access_key') === 'ELITE2026'; // Mude a senha aqui se quiser

  if (loading) return <div className="bg-premium-black min-h-screen" />;
  if (!user) return <Navigate to="/login" replace />;
  if (!hasAccess) return <Navigate to="/checkout/pix" replace />;

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <div className="min-h-screen bg-premium-black">
      <Navbar />
      <Routes>
        <Route path="/" element={<PixPayment />} />
        <Route path="/login" element={<Login />} />
        <Route path="/checkout/pix" element={<PixPayment />} />
        <Route path="/dashboard" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/lessons" element={<ProtectedRoute><VideoLessons /></ProtectedRoute>} />
        <Route path="/course/:courseId" element={<ProtectedRoute><CourseView /></ProtectedRoute>} />
        <Route path="/course/:courseId/lesson/:lessonId" element={<ProtectedRoute><LessonView /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider><Router><AppRoutes /></Router></AuthProvider>
  );
}
