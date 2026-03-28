import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Course, Module, Lesson } from '../types';
import { useAuth } from '../components/AuthContext';
import { Plus, Trash2, Edit, Save, X, Layout, BookOpen, Play, Settings, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

const AdminPanel: React.FC = () => {
  const { isAdmin } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const [courses, setCourses] = useState<Course[]>([]);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  
  const [newCourse, setNewCourse] = useState({ title: '', description: '', thumbnailUrl: '' });
  const [newModule, setNewModule] = useState({ title: '', order: 0 });
  const [newLesson, setNewLesson] = useState({ title: '', videoUrl: '', description: '', order: 0 });

  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    if (!isAdmin || !isAuthorized) return;

    const q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course)));
    });

    return () => unsubscribe();
  }, [isAdmin, isAuthorized]);

  useEffect(() => {
    if (!activeCourse || !isAuthorized) return;

    const q = query(collection(db, `courses/${activeCourse.id}/modules`), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setModules(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Module)));
    });

    return () => unsubscribe();
  }, [activeCourse, isAuthorized]);

  useEffect(() => {
    if (!activeCourse || !activeModule || !isAuthorized) return;

    const q = query(collection(db, `courses/${activeCourse.id}/modules/${activeModule.id}/lessons`), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLessons(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson)));
    });

    return () => unsubscribe();
  }, [activeCourse, activeModule, isAuthorized]);

  const handleCreateCourse = async () => {
    if (!newCourse.title) return;
    await addDoc(collection(db, 'courses'), {
      ...newCourse,
      createdAt: serverTimestamp(),
    });
    setNewCourse({ title: '', description: '', thumbnailUrl: '' });
  };

  const handleCreateModule = async () => {
    if (!activeCourse || !newModule.title) return;
    await addDoc(collection(db, `courses/${activeCourse.id}/modules`), {
      ...newModule,
      courseId: activeCourse.id,
      createdAt: serverTimestamp(),
    });
    setNewModule({ title: '', order: modules.length + 1 });
  };

  const handleCreateLesson = async () => {
    if (!activeCourse || !activeModule || !newLesson.title || !newLesson.videoUrl) return;
    await addDoc(collection(db, `courses/${activeCourse.id}/modules/${activeModule.id}/lessons`), {
      ...newLesson,
      courseId: activeCourse.id,
      moduleId: activeModule.id,
      createdAt: serverTimestamp(),
    });
    setNewLesson({ title: '', videoUrl: '', description: '', order: lessons.length + 1 });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '654321') {
      setIsAuthorized(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  if (!isAdmin) return (
    <div className="min-h-screen flex items-center justify-center bg-premium-black p-8">
      <div className="text-center space-y-4">
        <X className="w-12 h-12 text-red-500 mx-auto" />
        <h1 className="text-2xl font-bold">Acesso Restrito</h1>
        <p className="text-gray-500">Você não tem permissão para acessar esta página.</p>
      </div>
    </div>
  );

  if (!isAuthorized) return (
    <div className="min-h-screen flex items-center justify-center bg-premium-black p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="premium-card p-8 md:p-12 w-full max-w-md space-y-8 text-center"
      >
        <div className="space-y-4">
          <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto">
            <Settings className="w-8 h-8 text-gold" />
          </div>
          <h1 className="text-2xl font-black uppercase italic tracking-tight">Acesso Restrito</h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Digite a senha de administrador para continuar</p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <input 
            type="password" 
            placeholder="Senha de Acesso"
            className={`w-full bg-white/5 border ${passwordError ? 'border-red-500' : 'border-white/10'} rounded-2xl px-6 py-4 text-center font-black tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-gold/20 text-white`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          {passwordError && (
            <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">Senha incorreta!</p>
          )}
          <button type="submit" className="gold-button w-full py-4">
            VERIFICAR ACESSO
          </button>
        </form>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-premium-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase italic">Painel Administrativo</h1>
            <p className="text-gray-500 font-medium uppercase tracking-widest text-[8px] md:text-[10px]">Gerencie seus cursos, módulos e aulas.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="premium-card px-4 py-2 flex items-center gap-2 w-full sm:w-auto justify-center">
              <Settings className="w-4 h-4 text-gold" />
              <span className="text-xs font-black uppercase tracking-widest">Configurações</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Courses List */}
          <div className="space-y-6">
            <div className="premium-card p-4 md:p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg md:text-xl font-black uppercase italic tracking-tight text-gold">Cursos</h2>
                <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors shrink-0"><Plus className="w-4 h-4" /></button>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <input 
                    type="text" 
                    placeholder="Título do Curso" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold/20 text-white"
                    value={newCourse.title}
                    onChange={e => setNewCourse({...newCourse, title: e.target.value})}
                  />
                  <textarea 
                    placeholder="Descrição" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold/20 text-white min-h-[80px]"
                    value={newCourse.description}
                    onChange={e => setNewCourse({...newCourse, description: e.target.value})}
                  />
                  <input 
                    type="text" 
                    placeholder="URL da Thumbnail" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold/20 text-white"
                    value={newCourse.thumbnailUrl}
                    onChange={e => setNewCourse({...newCourse, thumbnailUrl: e.target.value})}
                  />
                  <button 
                    onClick={handleCreateCourse}
                    className="gold-button w-full py-3"
                  >
                    <Plus className="w-4 h-4" />
                    Criar Curso
                  </button>
                </div>

                <div className="h-px bg-white/5" />

                <div className="space-y-2">
                  {courses.map(course => (
                    <button
                      key={course.id}
                      onClick={() => { setActiveCourse(course); setActiveModule(null); }}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${activeCourse?.id === course.id ? 'bg-gold text-black border-gold' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Layout className={`w-4 h-4 ${activeCourse?.id === course.id ? 'text-black/60' : 'text-gray-500'}`} />
                        <span className="text-sm font-bold truncate uppercase italic tracking-tight">{course.title}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${activeCourse?.id === course.id ? 'text-black' : 'text-gray-700'}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Modules List */}
          <div className="space-y-6">
            <div className={`premium-card p-4 md:p-6 space-y-6 transition-opacity ${!activeCourse ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg md:text-xl font-black uppercase italic tracking-tight text-gold">Módulos</h2>
                <div className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest truncate max-w-[100px]">{activeCourse?.title}</div>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <input 
                    type="text" 
                    placeholder="Título do Módulo" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold/20 text-white"
                    value={newModule.title}
                    onChange={e => setNewModule({...newModule, title: e.target.value})}
                  />
                  <input 
                    type="number" 
                    placeholder="Ordem" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold/20 text-white"
                    value={newModule.order}
                    onChange={e => setNewModule({...newModule, order: parseInt(e.target.value)})}
                  />
                  <button 
                    onClick={handleCreateModule}
                    className="gold-button w-full py-3"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Módulo
                  </button>
                </div>

                <div className="h-px bg-white/5" />

                <div className="space-y-2">
                  {modules.map(module => (
                    <button
                      key={module.id}
                      onClick={() => setActiveModule(module)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${activeModule?.id === module.id ? 'bg-gold text-black border-gold' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen className={`w-4 h-4 ${activeModule?.id === module.id ? 'text-black/60' : 'text-gray-500'}`} />
                        <span className="text-sm font-bold truncate uppercase italic tracking-tight">{module.title}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${activeModule?.id === module.id ? 'text-black' : 'text-gray-700'}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Lessons List */}
          <div className="space-y-6">
            <div className={`premium-card p-4 md:p-6 space-y-6 transition-opacity ${!activeModule ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg md:text-xl font-black uppercase italic tracking-tight text-gold">Aulas</h2>
                <div className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest truncate max-w-[100px]">{activeModule?.title}</div>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <input 
                    type="text" 
                    placeholder="Título da Aula" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold/20 text-white"
                    value={newLesson.title}
                    onChange={e => setNewLesson({...newLesson, title: e.target.value})}
                  />
                  <input 
                    type="text" 
                    placeholder="URL do Vídeo" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold/20 text-white"
                    value={newLesson.videoUrl}
                    onChange={e => setNewLesson({...newLesson, videoUrl: e.target.value})}
                  />
                  <textarea 
                    placeholder="Descrição da Aula" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold/20 text-white min-h-[80px]"
                    value={newLesson.description}
                    onChange={e => setNewLesson({...newLesson, description: e.target.value})}
                  />
                  <input 
                    type="number" 
                    placeholder="Ordem" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold/20 text-white"
                    value={newLesson.order}
                    onChange={e => setNewLesson({...newLesson, order: parseInt(e.target.value)})}
                  />
                  <button 
                    onClick={handleCreateLesson}
                    className="gold-button w-full py-3"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Aula
                  </button>
                </div>

                <div className="h-px bg-white/5" />

                <div className="space-y-2">
                  {lessons.map(lesson => (
                    <div
                      key={lesson.id}
                      className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl"
                    >
                      <div className="flex items-center gap-3">
                        <Play className="w-4 h-4 text-gold" />
                        <span className="text-sm font-bold truncate uppercase italic tracking-tight">{lesson.title}</span>
                      </div>
                      <button 
                        onClick={async () => {
                          if (window.confirm('Excluir esta aula?')) {
                            await deleteDoc(doc(db, `courses/${activeCourse!.id}/modules/${activeModule!.id}/lessons`, lesson.id));
                          }
                        }}
                        className="p-1.5 text-gray-600 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
