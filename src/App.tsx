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

// Este é o "Cadeado" do seu App
const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { user, loading, isAdmin, isSubscriber } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-premium-black">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tiktok-purple"></div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;

  // Se NÃO for admin e NÃO tiver pago, ele é mandado para o pagamento
  if (!isAdmin && !isSubscriber) {
    return <Navigate to="/checkout/pix" />;
  }

  if (adminOnly && !isAdmin) return <Navigate to="/" />;

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <div className="min-h-screen bg-premium-black">
      <Navbar />
      <Routes>
        {/* Rotas que qualquer um vê logado ou não */}
        <Route path="/login" element={<Login />} />
        <Route path="/checkout/pix" element={<PixPayment />} />

        {/* Rotas BLOQUEADAS (Só entra quem pagou) */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/lessons" element={<ProtectedRoute><VideoLessons /></ProtectedRoute>} />
        <Route path="/course/:courseId" element={<ProtectedRoute><CourseView /></ProtectedRoute>} />
        <Route path="/course/:courseId/lesson/:lessonId" element={<ProtectedRoute><LessonView /></ProtectedRoute>} />
        
        {/* Rota do Dono (Admin) */}
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>} />

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
