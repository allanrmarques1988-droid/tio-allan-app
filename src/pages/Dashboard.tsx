import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Course } from '../types';
import { Link } from 'react-router-dom';
import { Play, BookOpen, Clock, LayoutGrid } from 'lucide-react';
import { motion } from 'motion/react';

const Dashboard: React.FC = () => {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase italic">Meus Treinamentos</h1>
            <p className="text-gray-500 font-medium">Continue de onde você parou.</p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
            <button className="p-2 bg-gray-100 rounded-md text-black"><LayoutGrid className="w-4 h-4" /></button>
            <button className="p-2 text-gray-400 hover:text-black transition-colors"><BookOpen className="w-4 h-4" /></button>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto">
              <BookOpen className="text-gray-300 w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-gray-900">Nenhum curso disponível</h3>
              <p className="text-gray-500">Fique atento! Novos treinamentos serão adicionados em breve.</p>
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
                className="group bg-white rounded-3xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:shadow-black/5 transition-all hover:-translate-y-1"
              >
                <Link to={`/course/${course.id}`}>
                  <div className="aspect-video relative overflow-hidden bg-gray-100">
                    {course.thumbnailUrl ? (
                      <img 
                        src={course.thumbnailUrl} 
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="text-gray-300 w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <div className="bg-white text-black font-bold px-4 py-2 rounded-full flex items-center gap-2 text-sm">
                        <Play className="w-4 h-4 fill-black" />
                        Acessar Agora
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <Clock className="w-3 h-3" />
                        Adicionado recentemente
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-black transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
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
  );
};

export default Dashboard;
