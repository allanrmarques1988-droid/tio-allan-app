import React from 'react';
import { Camera, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useProfilePhoto } from '../hooks/useProfilePhoto';

interface ProfileHeaderProps {
  name: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name }) => {
  const { photo, updatePhoto } = useProfilePhoto();

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updatePhoto(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center text-center space-y-4 py-8"
    >
      <div className="relative group">
        <div className="w-32 h-32 rounded-full border-4 border-gold p-1 shadow-[0_0_40px_rgba(255,184,0,0.4)] relative overflow-hidden bg-premium-black">
          {photo ? (
            <img 
              src={photo} 
              alt={name}
              className="w-full h-full rounded-full object-cover"
              referrerPolicy="no-referrer"
              onError={() => updatePhoto('')}
            />
          ) : (
            <div className="w-full h-full rounded-full flex items-center justify-center bg-white/5">
              <User className="w-12 h-12 text-gold/50" />
            </div>
          )}
          
          <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <Camera className="w-6 h-6 text-white mb-1" />
            <span className="text-[8px] font-black uppercase text-white">Alterar Foto</span>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handlePhotoUpload}
            />
          </label>
        </div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gold/20 blur-3xl -z-10 animate-pulse" />
      </div>

      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight uppercase italic text-white">{name}</h1>
        <p className="text-gold font-bold tracking-widest text-[10px] uppercase">Especialista em crescimento no TikTok e lives</p>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;
