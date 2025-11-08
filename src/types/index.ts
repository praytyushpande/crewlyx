export interface User {
  id: string;
  _id?: string; // MongoDB ID
  name: string;
  email: string;
  age: number;
  skills: string[];
  profilePhoto: string;
  bio?: string;
  location?: string;
  experience?: string;
  interests?: string[];
  lookingFor?: 'co-founder' | 'hackathon-partner' | 'project-collaborator' | 'mentor' | 'any';
  availability?: 'full-time' | 'part-time' | 'weekends' | 'flexible';
  createdAt: Date;
}

export interface SwipeAction {
  userId: string;
  targetUserId: string;
  action: 'like' | 'pass';
  timestamp: Date;
}

export interface Match {
  id: string;
  users: [string, string];
  createdAt: Date;
  lastMessage?: Date;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface ProfileFormData {
  name: string;
  email: string;
  password: string;
  age: number;
  skills: string[];
  profilePhoto: File | null;
  bio: string;
  location: string;
  experience: string;
  interests: string[];
  lookingFor: User['lookingFor'];
  availability: User['availability'];
}