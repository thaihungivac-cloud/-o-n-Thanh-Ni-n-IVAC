
export enum Screen {
  ONBOARDING = 'ONBOARDING',
  LOGIN = 'LOGIN',
  HOME = 'HOME',
  ATTENDANCE = 'ATTENDANCE',
  ACTIVITY_REG = 'ACTIVITY_REG',
  PROFILE = 'PROFILE',
  NEWS = 'NEWS',
  ACTIVITY = 'ACTIVITY',
  AI = 'AI',
  SETTINGS = 'SETTINGS',
  MEMBERS = 'MEMBERS',
  LIBRARY = 'LIBRARY',
  ANALYTICS = 'ANALYTICS',
  REPORTS = 'REPORTS'
}

export type YouthPosition = 'Bí thư đoàn cơ sở' | 'Phó bí thư đoàn cơ sở' | 'Bí thư chi đoàn' | 'Phó bí thư chi đoàn' | 'Uỷ viên' | 'Đoàn viên';
export type BranchName = 'Đoàn cơ sở' | 'Hậu Cần' | 'Sản Xuất' | 'Chất Lượng' | 'Suối Dầu';
export type MemberRole = 'admin' | 'editor' | 'user';

export interface Member {
  id: string;
  code: string;
  name: string;
  gender: 'Nam' | 'Nữ' | 'Khác';
  dob: string;
  joinDate: string;
  position: YouthPosition;
  branch: string;
  phone: string;
  email: string;
  password?: string; // Mật khẩu đăng nhập
  notes: string;
  status: 'active' | 'transfer' | 'leave';
  avatar?: string;
  role: MemberRole;
}

export interface SystemNotification {
  id: string;
  targetMemberId: string;
  senderName: string;
  title: string;
  message: string;
  type: 'warning' | 'encouragement' | 'reminder';
  timestamp: string;
  isRead: boolean;
  metadata?: {
    screen?: Screen;
    targetId?: string;
  };
}

// Định nghĩa cho Sáng kiến
export type IdeaCategory = 'Số hoá' | 'Kỹ thuật' | 'Quy trình' | 'Văn hoá đoàn' | 'Khác';
export type IdeaStatus = 'pending' | 'reviewing' | 'rejected_review' | 'implementing' | 'rejected_impl' | 'completed';

export interface IdeaComment {
  id: string;
  memberId: string;
  memberName: string;
  content: string;
  timestamp: string;
}

export interface Idea {
  id: string;
  title: string;
  category: IdeaCategory;
  branch: BranchName;
  content: string;
  attachmentUrl?: string;
  authorId: string;
  authorName: string;
  status: IdeaStatus;
  points: number;
  reason?: string; // Lý do từ chối của Admin
  likes: string[];
  comments: IdeaComment[];
  date: string;
  rejectedAt?: string; // Thời điểm bị từ chối để tính 1 tuần biến mất
}

export interface NewsComment {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar?: string;
  content: string;
  timestamp: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  image: string;
  link?: string;
  date: string;
  author: string;
  category: 'Hoạt động' | 'Thông báo' | 'Tin tức' | 'Đoàn thể';
  views: number;
  likes: string[];
  comments: NewsComment[];
}

export interface ParticipantDetail {
  memberId: string;
  timestamp: string;
  verifiedBy?: string;
}

export interface ActivityPlan {
  id: string;
  name: string;
  leader?: string;
  location?: string;
  date: string;
  startTime: string;
  endTime: string;
  points: number;
  branch: BranchName | 'Đoàn cơ sở';
  status: 'upcoming' | 'completed' | 'cancelled';
  participants: ParticipantDetail[];
  attendees: ParticipantDetail[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Document {
  id: string;
  type: string;
  name: string;
  code: string;
  date: string;
  expiryDate: string;
  url: string;
  dept: string;
}
