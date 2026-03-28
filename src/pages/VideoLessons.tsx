import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Course } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Lock, ChevronRight, Clock, LayoutGrid, BookOpen, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

  const defaultModules = [
    { 
      id: "mod-1",
      title: "Módulo 1: Começando no TikTok", 
      available: true,
      description: "O guia definitivo para criar sua conta e fazer seus primeiros vídeos virais.",
      thumbnail: "https://picsum.photos/seed/tiktok1/800/450",
      lessonsCount: 12
    },
    { 
      id: "mod-2",
      title: "Módulo 2: Crescimento", 
      available: false,
      description: "Estratégias avançadas de retenção e algoritmos para explodir seu perfil.",
      thumbnail: "https://picsum.photos/seed/growth/800/450",
      lessonsCount: 8
    },
    { 
      id: "mod-3",
      title: "Módulo 3: Monetização", 
      available: false,
      description: "Como transformar seguidores em dinheiro com lives e parcerias.",
      thumbnail: "https://picsum.photos/seed/money/800/450",
      lessonsCount: 15
    },
    { 
      id: "mod-4",
      title: "Módulo 4: Avançado", 
      available: false,
      description: "Escalando seu negócio e criando uma marca pessoal indestrutível.",
      thumbnail: "https://picsum.photos/seed/advanced/800/450",
      lessonsCount: 10
    },
  ];

  const [showLockedToast, setShowLockedToast] = useState(false);

  const navigate = useNavigate();

  const handleModuleClick = (id: string, available: boolean) => {
    if (!available) {
      setShowLockedToast(true);
      setTimeout(() => setShowLockedToast(false), 3000);
    } else {
      navigate(`/course/${id}`);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-premium-black">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-premium-black text-white pb-20">
      {/* Hero Section - Netflix Style */}
      <div className="relative min-h-[70vh] md:h-[60vh] w-full overflow-hidden flex items-center py-12 md:py-0">
        <div className="absolute inset-0">
          <img 
            src="https://picsum.photos/seed/hero-tiktok/1920/1080" 
            alt="Hero" 
            className="w-full h-full object-cover opacity-40 scale-105"
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
            <div className="flex items-center gap-2 text-gold font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">
              <Crown className="w-4 h-4 fill-gold" />
              Conteúdo Original
            </div>
            <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">
              TIO <br /> <span className="text-gold">ALLAN</span>
            </h1>
            <p className="text-gold font-black text-xs md:text-sm uppercase tracking-[0.4em]">Elite do Crescimento</p>
            <p className="max-w-xl text-gray-300 text-base md:text-lg font-medium leading-relaxed">
              O treinamento mais completo do Brasil para quem quer dominar o TikTok, 
              crescer audiência qualificada e viver 100% de lives e conteúdo digital.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link 
                to="/course/mod-1" 
                className="gold-button w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 text-lg"
              >
                <Play className="w-5 h-5 fill-black" />
                ASSISTIR AGORA
              </Link>
              <button className="w-full sm:w-auto bg-white/10 hover:bg-white/20 transition-all px-8 py-4 rounded-2xl font-black uppercase italic text-lg border border-white/10 backdrop-blur-md">
                MAIS INFORMAÇÕES
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-8 md:-mt-20 relative z-20 space-y-12">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tight">Módulos do Treinamento</h2>
            <div className="flex items-center gap-2 text-gray-500 font-bold text-[10px] md:text-xs uppercase tracking-widest">
              <LayoutGrid className="w-4 h-4" />
              Visualização Grade
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {defaultModules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, zIndex: 30 }}
                className="relative group"
              >
                <div 
                  onClick={() => handleModuleClick(module.id, module.available)}
                  className={`relative aspect-[16/9] rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer
                    ${module.available ? 'border-white/10 group-hover:border-gold shadow-2xl' : 'border-white/5 opacity-50 grayscale'}`}
                >
                  <img 
                    src={module.thumbnail} 
                    alt={module.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md
                        ${module.available ? 'bg-gold text-black' : 'bg-white/20 text-white'}`}>
                        {module.available ? "Liberado" : "Bloqueado"}
                      </span>
                      {!module.available && <Lock className="w-4 h-4 text-white/50" />}
                    </div>
                    <h3 className="text-lg font-black uppercase italic leading-tight group-hover:text-gold transition-colors">
                      {module.title}
                    </h3>
                  </div>

                  {/* Hover Info (Netflix Style) */}
                  <div className="absolute inset-0 bg-premium-black/95 opacity-0 group-hover:opacity-100 transition-all duration-300 p-6 flex flex-col justify-center space-y-4 translate-y-4 group-hover:translate-y-0">
                    <h3 className="text-xl font-black uppercase italic text-gold">{module.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed font-medium">
                      {module.description}
                    </p>
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
                      <span className="flex items-center gap-1"><Play className="w-3 h-3" /> {module.lessonsCount} Aulas</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 4h 20m</span>
                    </div>
                    {module.available ? (
                      <Link 
                        to={`/course/${module.id}`}
                        className="gold-button py-3 text-xs text-center"
                      >
                        COMEÇAR AGORA
                      </Link>
                    ) : (
                      <div className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                        CONTEÚDO BLOQUEADO
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Locked Toast */}
        <AnimatePresence>
          {showLockedToast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-8 py-4 rounded-2xl font-black uppercase italic shadow-[0_20px_50px_rgba(239,68,68,0.4)] flex items-center gap-3"
            >
              <Lock className="w-5 h-5" />
              Este módulo ainda não está liberado para você!
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-px bg-white/5 w-full" />

        {/* Real Courses from Firestore */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black uppercase italic tracking-tight">Cursos Complementares</h2>
            <Link to="/all-courses" className="text-gold text-xs font-black uppercase tracking-widest hover:underline">Ver Todos</Link>
          </div>
          {courses.length === 0 ? (
            <div className="premium-card p-12 text-center space-y-4 border-dashed border-white/10">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto">
                <BookOpen className="text-gray-600 w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Nenhum curso cadastrado</h3>
                <p className="text-gray-500">O administrador ainda não adicionou cursos reais.</p>
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
                  className="group premium-card overflow-hidden hover:bg-white/10 transition-all hover:-translate-y-1"
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
                          <Play className="text-gray-700 w-12 h-12" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <div className="gold-button py-2 px-4 text-xs flex items-center gap-2">
                          <Play className="w-3 h-3 fill-black" />
                          Acessar Agora
                        </div>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gold">
                          <Clock className="w-3 h-3" />
                          Conteúdo Premium
                        </div>
                        <h3 className="text-xl font-black uppercase italic tracking-tight leading-tight">
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
