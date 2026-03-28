import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, onSnapshot, query, orderBy, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Course, Module, Lesson } from '../types';
import { useAuth } from '../components/AuthContext';
import { Play, ChevronLeft, BookOpen, Clock, CheckCircle2, ChevronRight, Layout } from 'lucide-react';
import { motion } from 'motion/react';

const LessonView: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string, lessonId: string }>();
  const { profile } = useAuth();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessonsByModule, setLessonsByModule] = useState<{ [key: string]: Lesson[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId || !lessonId) return;

    const fetchData = async () => {
      const courseRef = doc(db, 'courses', courseId);
      const courseSnap = await getDoc(courseRef);
      if (courseSnap.exists()) {
        setCourse({ id: courseSnap.id, ...courseSnap.data() } as Course);
      }

      const lessonRef = doc(db, `courses/${courseId}/modules/any/lessons/${lessonId}`);
      // Since path is nested, we need to find the lesson across all modules
      // For simplicity in this demo, we'll fetch all and find it
    };

    fetchData();

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
          
          setLessonsByModule(prev => ({ ...prev, [module.id]: lessonsData }));
          
          const currentLesson = lessonsData.find(l => l.id === lessonId);
          if (currentLesson) setLesson(currentLesson);
        });
      });
      setLoading(false);
    });

    return () => unsubscribeModules();
  }, [courseId, lessonId]);

  const markAsCompleted = async () => {
    if (!profile || !lessonId || !courseId) return;
    const progressId = `${profile.uid}_${lessonId}`;
    await setDoc(doc(db, 'progress', progressId), {
      userId: profile.uid,
      lessonId,
      courseId,
      completedAt: serverTimestamp(),
    });
  };

  if (loading || !course || !lesson) return (
    <div className="min-h-screen flex items-center justify-center bg-premium-black">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-premium-black text-white flex flex-col lg:flex-row">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="bg-black/40 border-b border-white/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to={`/course/${courseId}`} className="p-2 hover:bg-white/10 rounded-xl transition-colors shrink-0">
              <ChevronLeft className="w-5 h-5 text-gold" />
            </Link>
            <div className="space-y-0.5 min-w-0">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 truncate">{course.title}</h4>
              <h1 className="text-sm font-bold tracking-tight truncate">{lesson.title}</h1>
            </div>
          </div>
          <button 
            onClick={markAsCompleted}
            className="gold-button w-full sm:w-auto px-4 py-2 text-xs flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Concluir Aula
          </button>
        </div>

        <div className="flex-1 bg-black flex items-center justify-center relative group">
          {/* Video Player Placeholder */}
          <div className="w-full aspect-video max-h-[80vh] bg-gray-900 flex items-center justify-center relative">
            <iframe 
              src={lesson.videoUrl.replace('watch?v=', 'embed/')}
              className="w-full h-full"
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        <div className="p-4 md:p-8 max-w-4xl mx-auto w-full space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gold">
              <Layout className="w-3 h-3" />
              Descrição da Aula
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase italic leading-none">{lesson.title}</h2>
            <p className="text-sm md:text-base text-gray-400 leading-relaxed font-medium">
              {lesson.description || "Nenhuma descrição disponível para esta aula."}
            </p>
          </div>
          
          <div className="h-px bg-white/5" />
          
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                <BookOpen className="w-6 h-6 text-gold" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-500">Material de Apoio</p>
                <p className="text-sm font-bold">Nenhum anexo disponível</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Playlist */}
      <div className="w-full lg:w-[400px] bg-premium-black border-l border-white/5 flex flex-col h-screen sticky top-0 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-black uppercase italic tracking-tight text-gold">Conteúdo do Curso</h3>
          <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
            {modules.length} Módulos
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {modules.map((module, mIndex) => (
            <div key={module.id} className="border-b border-white/5">
              <div className="bg-white/5 p-4 flex items-center gap-3">
                <div className="w-6 h-6 bg-gold rounded flex items-center justify-center text-[10px] font-black text-black">
                  {mIndex + 1}
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-gray-400">{module.title}</span>
              </div>
              <div className="p-2 space-y-1">
                {lessonsByModule[module.id]?.map((l) => (
                  <Link 
                    key={l.id}
                    to={`/course/${courseId}/lesson/${l.id}`}
                    className={`flex items-center gap-4 p-3 rounded-xl transition-all group ${l.id === lessonId ? 'bg-gold text-black' : 'hover:bg-white/5'}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${l.id === lessonId ? 'bg-black/10' : 'bg-white/5 group-hover:bg-white/10'}`}>
                      <Play className={`w-4 h-4 ${l.id === lessonId ? 'fill-black' : 'fill-gray-500'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold truncate ${l.id === lessonId ? 'text-black' : 'text-gray-300'}`}>{l.title}</p>
                      <p className={`text-[10px] font-medium ${l.id === lessonId ? 'text-black/60' : 'text-gray-500'}`}>Vídeo Aula</p>
                    </div>
                    {l.id === lessonId && <ChevronRight className="w-4 h-4" />}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LessonView;
