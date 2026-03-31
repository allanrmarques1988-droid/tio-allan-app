import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Course } from '../types';
import { Link } from 'react-router-dom';
import { Play, Clock, BookOpen, Crown, LayoutGrid } from 'lucide-react';
import { motion } from 'motion/react';

const VideoLessons: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const coursesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Course[];
      setCourses(coursesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-premium-black">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tiktok-purple"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-premium-black text-white pb-20">
      {/* Hero Section - Estilo TikTok Premium */}
      <div className="relative min-h-[60vh] w-full overflow-hidden flex items-center py-12 md:py-0">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1611605698335-8b1569810432?q=80&w=1920&auto=format&fit=crop" 
            alt="Hero" 
            className="w-full h-full object-cover opacity-30 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-premium-black via-premium-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-premium-black via-transparent to-transparent" />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 md:px-6 flex flex-col justify-center space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4 md:space-y-6"
          >
            <div className="flex items-center gap-2 text-tiktok-cyan font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">
              <Crown className="w-4 h-4 fill-tiktok-cyan" />
              Conteúdo de Elite
            </div>
            <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">
              CURSOS <br /> <span className="text-tiktok-purple">LIBERADOS</span>
            </h1>
            <p className="max-w-xl text-gray-300 text-base md:text-lg font-medium leading-relaxed">
              Acesse agora as aulas exclusivas da Elite do Crescimento. 
              Estratégias validadas para você dominar o algoritmo.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Grid de Cursos Reais */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-10 relative z-20 space-y-12">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tight">Suas Aulas Disponíveis</h2>
            <div className="flex items-center gap-2 text-gray-500 font-bold text-[10px] uppercase tracking-widest">
              <LayoutGrid className="w-4 h-4" />
              Visualização Grade
            </div>
          </div>

          {courses.length === 0 ? (
            <div className="premium-card p-12 text-center space-y-4 border-dashed border-white/10">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto">
                <BookOpen className="text-gray-600 w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Nenhuma aula encontrada</h3>
                <p className="text-gray-400">Acesse o painel admin para cadastrar seus cursos.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group premium-card overflow-hidden hover:border-tiktok-purple/50 transition-all hover:-translate-y-1"
                >
                  <Link to={`/course/${course.id}`}>
                    <div className="aspect-video relative overflow-hidden bg-white/5">
                      {course.thumbnailUrl ? (
                        <img 
                          src={course.thumbnailUrl} 
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Play className="text-tiktok-purple/30 w-12 h-12" />
                        </div>
                      )}
                      {/* Overlay TikTok Style */}
                      <div className="absolute inset-0 bg-gradient-to-t from-tiktok-purple/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <div className="tiktok-button py-2 px-6 text-xs flex items-center gap-2">
                          <Play className="w-3 h-3 fill-white" />
                          Assistir Agora
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-tiktok-cyan">
                          <Clock className="w-3 h-3" />
                          Acesso Vitalício
                        </div>
                        <h3 className="text-xl font-black uppercase italic tracking-tight leading-tight group-hover:text-tiktok-cyan transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed font-medium">
                          {course.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoLessons;
