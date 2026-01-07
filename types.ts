
export enum Screen {
  ONBOARDING = 'ONBOARDING',
  LOGIN = 'LOGIN',
  HOME = 'HOME',
  ATTENDANCE = 'ATTENDANCE',
  NEWS = 'NEWS',
  PROFILE = 'PROFILE',
  ANALYTICS = 'ANALYTICS',
  ACTIVITY = 'ACTIVITY',
  AI = 'AI',
  SETTINGS = 'SETTINGS',
  MEMBERS = 'MEMBERS'
}

export interface Member {
  id: string;
  name: string;
  code: string;
  branch: string;
  position?: string;
  status: 'active' | 'transfer' | 'leave';
  avatar?: string;
}

export interface Activity {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  icon: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
