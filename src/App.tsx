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
  // Verifica se o "ticket" de pagamento existe no navegador do aluno
  const hasPaid = localStorage.getItem('elite_access') === 'true';

  if (loading) return <div className="bg-premium-black min-h-screen" />;
  
  if (!user) return <Navigate to="/login" />;
  
  // Se não tem o ticket, manda para o Pix obrigatoriamente
  if (!hasPaid) return <Navigate to="/checkout/pix" />;

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <div className="min-h-screen bg-premium-black">
      <Navbar />
      <Routes>
        {/* Telas que o aluno vê antes de entrar */}
        <Route path="/login" element={<Login />} />
        <Route path="/checkout/pix" element={<PixPayment />} />

        {/* Telas que só abrem APÓS o pagamento */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/lessons" element={<ProtectedRoute><VideoLessons /></ProtectedRoute>} />
        <Route path="/course/:courseId" element={<ProtectedRoute><CourseView /></ProtectedRoute>} />
        <Route path="/course/:courseId/lesson/:lessonId" element={<ProtectedRoute><LessonView /></ProtectedRoute>} />
        
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
