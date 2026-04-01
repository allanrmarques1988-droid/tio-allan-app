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

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { user, loading, isAdmin } = useAuth();
  const hasPaid = localStorage.getItem('elite_access') === 'true';

  if (loading) return <div className="bg-premium-black min-h-screen" />;
  
  // 1. Se não está logado, manda pro Login (Ninguém vê nada sem conta)
  if (!user) return <Navigate to="/login" replace />;

  // 2. Se for Admin, libera tudo direto
  if (isAdmin) return <>{children}</>;

  // 3. Se for usuário comum e NÃO tem o ticket de pagamento, manda pro Pix
  if (!hasPaid) return <Navigate to="/checkout/pix" replace />;

  // 4. Proteção extra para área Admin
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <div className="min-h-screen bg-premium-black">
      <Navbar />
      <Routes>
        {/* Rota inicial sempre será o Pix para quem não tem o "ticket" */}
        <Route path="/" element={<PixPayment />} />
        <Route path="/login" element={<Login />} />
        <Route path="/checkout/pix" element={<PixPayment />} />

        {/* Todas as rotas abaixo agora estão "Blindadas" */}
        <Route path="/dashboard" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/lessons" element={<ProtectedRoute><VideoLessons /></ProtectedRoute>} />
        <Route path="/course/:courseId" element={<ProtectedRoute><CourseView /></ProtectedRoute>} />
        <Route path="/course/:courseId/lesson/:lessonId" element={<ProtectedRoute><LessonView /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>} />

        {/* Qualquer outro link manda de volta pro início */}
        <Route path="*" element={<Navigate to="/" replace />} />
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
