export type UserRole = 'admin' | 'member';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  createdAt: any; // Firestore Timestamp
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  createdAt: any;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  order: number;
  createdAt: any;
}

export interface Lesson {
  id: string;
  courseId: string;
  moduleId: string;
  title: string;
  videoUrl: string;
  description?: string;
  order: number;
  createdAt: any;
}

export interface Progress {
  id: string;
  userId: string;
  lessonId: string;
  courseId: string;
  completedAt: any;
}
