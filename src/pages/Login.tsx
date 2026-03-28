import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../components/AuthContext';
import { useProfilePhoto } from '../hooks/useProfilePhoto';
import { LogIn, Crown } from 'lucide-react';
import { motion } from 'motion/react';

const Login: React.FC = () => {
  const { user, loading } = useAuth();
  const { photo } = useProfilePhoto();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleLogin = async () => {
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('O login foi cancelado. Por favor, tente novamente.');
      } else if (err.code === 'auth/cancelled-by-user') {
        setError('Login cancelado.');
      } else {
        console.error('Login failed:', err);
        setError('Ocorreu um erro ao tentar entrar. Tente novamente mais tarde.');
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-premium-black">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-premium-black text-white p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center space-y-10 relative z-10"
      >
        <div className="flex flex-col items-center gap-6">
          <div className="w-32 h-32 rounded-full border-4 border-gold p-1 shadow-[0_0_30px_rgba(255,184,0,0.3)] relative group bg-premium-black flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gold/20 blur-xl group-hover:bg-gold/40 transition-all" />
            {photo ? (
              <img 
                src={photo} 
                alt="Tio Allan"
                className="w-full h-full rounded-full object-cover relative z-10 border border-gold/50"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full rounded-full flex items-center justify-center bg-white/5 relative z-10">
                <Crown className="w-12 h-12 text-gold/50" />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">
              TIO <span className="text-gold">ALLAN</span>
            </h1>
            <p className="text-gold font-black text-[10px] md:text-xs uppercase tracking-[0.3em]">Elite do Crescimento</p>
            <p className="text-gray-400 font-semibold text-base md:text-lg max-w-[280px] mx-auto leading-tight">
              Especialista em crescimento no TikTok e lives
            </p>
          </div>
        </div>

        <div className="premium-card p-10 space-y-8">
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-gold">
              <Crown className="w-5 h-5 fill-gold" />
              <span className="text-xs font-black uppercase tracking-[0.3em]">Membro Elite</span>
            </div>
            <h2 className="text-2xl font-bold leading-tight">Torne-se membro da Elite e desbloqueie conteúdos exclusivos</h2>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-xs font-bold text-red-400"
            >
              {error}
            </motion.div>
          )}

          <button 
            onClick={handleLogin}
            className="gold-button w-full flex items-center justify-center gap-3"
          >
            <LogIn className="w-5 h-5" />
            ENTRAR E ACESSAR AGORA
          </button>
        </div>

        <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-black">
          Plataforma Exclusiva | 2026
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
