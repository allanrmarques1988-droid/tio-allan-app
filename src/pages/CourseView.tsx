import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Course, Module, Lesson } from '../types';
import { useAuth } from '../components/AuthContext';
import { Play, ChevronRight, BookOpen, Clock, LayoutGrid, CheckCircle2, Trophy } from 'lucide-react';
import { motion } from 'motion/react';

const CourseView: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<{ [key: string]: Lesson[] }>({});
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      const docRef = doc(db, 'courses', courseId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCourse({ id: docSnap.id, ...docSnap.data() } as Course);
      }
    };

    fetchCourse();

    const modulesQuery = query(
      collection(db, `courses/${courseId}/modules`),
      orderBy('order', 'asc')
    );

    const unsubscribeModules = onSnapshot(modulesQuery, (snapshot) => {
      const modulesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Module[];
      setModules(modulesData);

      // Fetch lessons for each module
      modulesData.forEach(module => {
        const lessonsQuery = query(
          collection(db, `courses/${courseId}/modules/${module.id}/lessons`),
          orderBy('order', 'asc')
        );
        onSnapshot(lessonsQuery, (lessonSnapshot) => {
          const lessonsData = lessonSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Lesson[];
          setLessons(prev => ({ ...prev, [module.id]: lessonsData }));
        });
      });
      setLoading(false);
    });

    let unsubscribeProgress: (() => void) | undefined;
    if (user) {
      const progressQuery = query(
        collection(db, 'progress'),
        where('userId', '==', user.uid),
        where('courseId', '==', courseId)
      );

      unsubscribeProgress = onSnapshot(progressQuery, (snapshot) => {
        const completedIds = snapshot.docs.map(doc => doc.data().lessonId);
        setCompletedLessons(completedIds);
      });
    }

    return () => {
      unsubscribeModules();
      if (unsubscribeProgress) unsubscribeProgress();
    };
  }, [courseId, user]);

  if (loading || !course) return (
    <div className="min-h-screen flex items-center justify-center bg-premium-black">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-premium-black">
      {/* Hero Section */}
      <div className="bg-black text-white py-16 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src={course.thumbnailUrl || "https://picsum.photos/seed/course/1920/1080?blur=10"} 
            className="w-full h-full object-cover"
            alt=""
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 space-y-4 md:space-y-6">
          <div className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-gray-500">
            <Link to="/lessons" className="hover:text-gold transition-colors">Cursos</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white truncate max-w-[150px] md:max-w-none">{course.title}</span>
          </div>
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.9]">
              {course.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-400 font-medium leading-relaxed">
              {course.description}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 md:gap-6 pt-4">
            <div className="flex items-center gap-2 text-xs md:text-sm font-bold">
              <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-gold" />
              {modules.length} Módulos
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm font-bold">
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-gold" />
              Acesso Vitalício
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto p-4 md:p-8 mt-0 md:-mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="premium-card p-4 md:p-8 space-y-8">
              {/* Total Course Progress */}
              {Object.values(lessons).flat().length > 0 && (
                <div className="p-4 md:p-6 bg-gold/5 rounded-3xl border border-gold/20 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center shrink-0">
                        <Trophy className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <h3 className="text-xs md:text-sm font-black uppercase tracking-widest text-gold">Seu Progresso Total</h3>
                        <p className="text-[10px] md:text-xs font-bold text-gray-400">Continue focado no seu crescimento!</p>
                      </div>
                    </div>
                    <div className="text-left md:text-right">
                      <span className="text-xl md:text-2xl font-black italic text-gold">
                        {Math.round((completedLessons.length / Object.values(lessons).flat().length) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${(completedLessons.length / Object.values(lessons).flat().length) * 100}%` 
                      }}
                      className="h-full bg-gradient-to-r from-gold to-yellow-500 shadow-[0_0_20px_rgba(255,184,0,0.3)]"
                    />
                  </div>
                  <div className="flex justify-between text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                    <span>{completedLessons.length} Aulas Concluídas</span>
                    <span>{Object.values(lessons).flat().length} Aulas no Total</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <h2 className="text-xl md:text-2xl font-black tracking-tight uppercase italic">Conteúdo do Treinamento</h2>
                <div className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {Object.values(lessons).flat().length} Aulas no total
                </div>
              </div>

              <div className="space-y-6">
                {modules.map((module, mIndex) => (
                  <motion.div 
                    key={module.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: mIndex * 0.1 }}
                    className="space-y-4"
                  >
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-white/5 rounded-xl flex items-center justify-center font-black text-gold text-sm md:text-base shrink-0">
                            {String(mIndex + 1).padStart(2, '0')}
                          </div>
                          <h3 className="text-base md:text-lg font-bold text-white uppercase tracking-tight">{module.title}</h3>
                        </div>

                        {/* Module Progress Bar */}
                        {lessons[module.id] && lessons[module.id].length > 0 && (
                          <div className="flex items-center gap-4 min-w-0 md:min-w-[200px] w-full md:w-auto">
                            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ 
                                  width: `${(lessons[module.id].filter(l => completedLessons.includes(l.id)).length / lessons[module.id].length) * 100}%` 
                                }}
                                className="h-full bg-gold shadow-[0_0_10px_rgba(255,184,0,0.5)]"
                              />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gold/80 shrink-0">
                              {lessons[module.id].filter(l => completedLessons.includes(l.id)).length}/{lessons[module.id].length}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid gap-2 pl-4 md:pl-14">
                      {lessons[module.id]?.map((lesson, lIndex) => {
                        const isCompleted = completedLessons.includes(lesson.id);
                        return (
                          <Link 
                            key={lesson.id}
                            to={`/course/${courseId}/lesson/${lesson.id}`}
                            className={`group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all active:scale-[0.99] gap-4
                              ${isCompleted 
                                ? 'bg-gold/5 border-gold/20 hover:bg-gold/10' 
                                : 'bg-white/5 border-white/5 hover:bg-gold hover:text-black hover:border-gold'}`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                                ${isCompleted ? 'bg-gold/20' : 'bg-white/10 group-hover:bg-black/10'}`}>
                                <Play className={`w-4 h-4 fill-current ${isCompleted ? 'text-gold' : ''}`} />
                              </div>
                              <span className="font-bold text-sm tracking-tight">{lesson.title}</span>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-4">
                              <span className={`text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-60
                                ${isCompleted ? 'text-gold' : ''}`}>
                                {isCompleted ? 'Concluída' : 'Vídeo Aula'}
                              </span>
                              <CheckCircle2 className={`w-5 h-5 transition-colors shrink-0
                                ${isCompleted ? 'text-gold' : 'text-white/20 group-hover:text-black/20'}`} />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="premium-card p-8 sticky top-24">
              <div className="space-y-6">
                <div className="aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                  <img 
                    src={course.thumbnailUrl || "https://picsum.photos/seed/course/800/600"} 
                    className="w-full h-full object-cover"
                    alt=""
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-black uppercase tracking-widest text-gray-500">Instrutor</h4>
                    <p className="font-bold text-white">Tio Allan</p>
                    <p className="text-[10px] text-gold font-bold uppercase tracking-widest">Especialista em crescimento no TikTok e lives</p>
                  </div>
                  <div className="h-px bg-white/5" />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-medium">Nível</span>
                      <span className="font-bold text-gold">ELITE</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-medium">Idioma</span>
                      <span className="font-bold">Português</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-medium">Certificado</span>
                      <span className="font-bold">Incluso</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseView;
