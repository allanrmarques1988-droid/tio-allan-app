import React from 'react';
import ProfileHeader from '../components/ProfileHeader';
import { useAuth } from '../components/AuthContext';
import { Play, Users, Share2, Instagram, MessageCircle, Music2, Rocket, Flame, TrendingUp, MessageSquare, ExternalLink, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-premium-black text-white p-4 md:p-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        <ProfileHeader name="Tio Allan" />

        {/* Welcome Text */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center space-y-3"
        >
          <p className="text-gold/80 font-black text-xs uppercase tracking-[0.4em]">Plataforma Oficial</p>
          <h2 className="text-gray-300 font-medium text-xl italic max-w-xs mx-auto leading-relaxed">
            "Bem-vindo à sua plataforma de crescimento"
          </h2>
        </motion.div>

        {/* Section 2: Main Buttons */}
        <div className="grid grid-cols-1 gap-4 md:gap-6 max-w-md mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link 
              to="/lessons" 
              className="gold-button w-full flex items-center justify-center gap-4 py-6 md:py-10 text-xl md:text-2xl font-black italic shadow-[0_20px_50px_rgba(255,184,0,0.3)] border-2 border-white/20"
            >
              🎥 ACESSAR VIDEOAULAS
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button 
              onClick={() => document.getElementById('community-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full premium-card p-6 md:p-10 flex items-center justify-center gap-4 text-xl md:text-2xl font-black uppercase italic hover:bg-gold/10 transition-all border-2 border-gold/30 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
            >
              👥 COMUNIDADE & REDES
            </button>
          </motion.div>
        </div>

        {/* NEW SECTION: MINHAS REDES & COMUNIDADE */}
        <div id="community-section" className="space-y-16 pt-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter">
              MINHAS REDES & <span className="text-gold">COMUNIDADE</span>
            </h2>
            <div className="h-1 w-24 bg-gold mx-auto rounded-full" />
          </div>

          {/* SEÇÃO 1: REDES SOCIAIS */}
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black uppercase italic flex items-center justify-center gap-3">
                <span className="text-3xl">🌐</span> Conecte-se comigo
              </h3>
              <p className="text-gray-400 font-medium max-w-md mx-auto">
                Siga minhas redes para aprender estratégias todos os dias e acompanhar meu conteúdo ao vivo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.a 
                href="https://www.tiktok.com/@tioallanoficial" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
                className="premium-card p-6 flex flex-col items-center gap-4 border-white/10 hover:border-gold/50 hover:bg-white/5 transition-all group"
              >
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <Music2 className="w-6 h-6 text-gold" />
                </div>
                <div className="text-center">
                  <p className="font-black uppercase italic text-lg">TIKTOK OFICIAL</p>
                  <p className="text-[10px] text-gray-500 font-bold tracking-widest">@tioallanoficial</p>
                </div>
              </motion.a>

              <motion.a 
                href="https://www.tiktok.com/@crescercomtioallan" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
                className="premium-card p-6 flex flex-col items-center gap-4 border-white/10 hover:border-gold/50 hover:bg-white/5 transition-all group"
              >
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <Music2 className="w-6 h-6 text-gold" />
                </div>
                <div className="text-center">
                  <p className="font-black uppercase italic text-lg">TIKTOK RESERVA</p>
                  <p className="text-[10px] text-gray-500 font-bold tracking-widest">@crescercomtioallan</p>
                </div>
              </motion.a>

              <motion.a 
                href="https://www.instagram.com/allanrmarques1988" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
                className="premium-card p-6 flex flex-col items-center gap-4 border-white/10 hover:border-gold/50 hover:bg-white/5 transition-all group"
              >
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <Instagram className="w-6 h-6 text-gold" />
                </div>
                <div className="text-center">
                  <p className="font-black uppercase italic text-lg">INSTAGRAM</p>
                  <p className="text-[10px] text-gray-500 font-bold tracking-widest">@allanrmarques1988</p>
                </div>
              </motion.a>
            </div>
          </div>

          {/* SEÇÃO 2: GRUPO VIP */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="premium-card p-8 md:p-12 relative overflow-hidden border-gold/30 bg-gradient-to-br from-gold/10 to-transparent"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
              <div className="space-y-6 text-center lg:text-left">
                <div className="space-y-3">
                  <h3 className="text-2xl md:text-3xl font-black uppercase italic flex items-center justify-center lg:justify-start gap-3">
                    <span className="text-3xl md:text-4xl">👥</span> Grupo VIP Exclusivo
                  </h3>
                  <p className="text-gray-300 font-medium leading-relaxed text-base md:text-lg">
                    Acesse o grupo fechado onde você vai receber estratégias atualizadas, participar das lives e crescer mais rápido no TikTok.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  {[
                    { icon: <Rocket className="w-4 h-4" />, text: "Estratégias todos os dias" },
                    { icon: <Flame className="w-4 h-4" />, text: "Acesso às lives" },
                    { icon: <TrendingUp className="w-4 h-4" />, text: "Crescimento acelerado" },
                    { icon: <MessageSquare className="w-4 h-4" />, text: "Comunidade ativa" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs md:text-sm font-bold uppercase italic text-gold/90">
                      <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                        {item.icon}
                      </div>
                      <span className="text-left">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center space-y-4">
                <motion.a 
                  href="https://chat.whatsapp.com/L3YaqHxGlzEDZ5uV6lY2Nw" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="gold-button w-full py-4 md:py-6 text-lg md:text-xl flex items-center justify-center gap-3 shadow-[0_15px_40px_rgba(255,184,0,0.4)]"
                >
                  <MessageCircle className="w-6 h-6 fill-black" />
                  ENTRAR NO GRUPO VIP AGORA
                </motion.a>
                <div className="flex items-center gap-2 text-red-500 font-black uppercase italic text-[10px] md:text-xs tracking-widest animate-pulse">
                  <CheckCircle2 className="w-4 h-4" />
                  Vagas limitadas para manter a qualidade
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Section 8: Rodapé */}
        <footer className="text-center py-8 space-y-4">
          <div className="h-px bg-white/5 w-full mb-8" />
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">
            Plataforma exclusiva | Atualizações constantes | Suporte direto
          </p>
          <p className="text-[8px] text-gray-700 uppercase tracking-[0.1em] font-bold">
            © 2026 Tio Allan - Todos os direitos reservados
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
