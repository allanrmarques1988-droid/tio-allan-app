import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Crown, Settings, User, Home as HomeIcon, Play } from 'lucide-react';
import { auth } from '../firebase';
import { useAuth } from './AuthContext';
import { useProfilePhoto } from '../hooks/useProfilePhoto';

const Navbar: React.FC = () => {
  const { profile, isAdmin } = useAuth();
  const { photo } = useProfilePhoto();
  const navigate = useNavigate();

  return (
    <nav className="bg-premium-black border-b border-white/5 px-4 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
      <div className="flex items-center gap-4 md:gap-12">
        <Link to="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gold rounded-xl flex items-center justify-center shadow-lg shadow-gold/20 group-hover:scale-105 transition-transform">
            <Crown className="text-black w-5 h-5 md:w-6 md:h-6 fill-black" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-black text-sm md:text-lg tracking-tighter uppercase italic">TIO ALLAN</span>
            <span className="text-[8px] md:text-[10px] font-black text-gold uppercase tracking-[0.1em] md:tracking-[0.2em]">Elite do Crescimento</span>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center gap-4 lg:gap-8 text-xs font-black uppercase tracking-widest text-gray-500">
          <Link to="/" className="hover:text-gold transition-colors flex items-center gap-2">
            <HomeIcon className="w-4 h-4" />
            Início
          </Link>
          <Link to="/lessons" className="hover:text-gold transition-colors flex items-center gap-2">
            <Play className="w-4 h-4" />
            Aulas
          </Link>
          {isAdmin && (
            <Link to="/admin" className="hover:text-gold transition-colors flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Admin
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        <div className="hidden xl:flex items-center">
          <button className="px-4 py-2 bg-gold/10 border border-gold/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-gold cursor-default">
            Área de membros (em breve)
          </button>
        </div>

        <div className="flex items-center gap-2 md:gap-3 px-2 md:px-4 py-2 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-gold p-0.5 shadow-[0_0_10px_rgba(255,184,0,0.2)] bg-premium-black flex items-center justify-center shrink-0">
            {photo ? (
              <img 
                src={photo} 
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <User className="w-3 h-3 md:w-4 md:h-4 text-gold/50" />
            )}
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[10px] md:text-xs font-black uppercase italic tracking-tight text-white truncate max-w-[60px] md:max-w-none">{profile?.displayName || "Membro Elite"}</span>
            <span className="text-[7px] md:text-[8px] font-black text-gold uppercase tracking-widest">Premium</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
