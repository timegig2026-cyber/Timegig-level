export type TabId = 'gigs' | 'seekers' | 'chat' | 'notifications' | 'referral' | 'wallet' | 'profile' | 'admin';

export interface TabConfig {
  id: TabId;
  label: string;
  description: string;
}

export interface Gig {
  id: string;
  title: string;
  description: string;
  budget: number;
  category: 'Design' | 'Development' | 'Writing' | 'Marketing' | 'Video';
  seekerName: string;
  status: 'open' | 'applied' | 'assigned' | 'completed';
  deadline: string;
  images?: string[];
  province?: string;
  location?: string;
}

export interface Seeker {
  id: string;
  name: string;
  company: string;
  bio: string;
  avatarColor: string;
  activeGigsCount: number;
  rating: number;
  category: string;
  images?: string[];
  province?: string;
  location?: string;
  budget?: number;
}

export interface ChatAttachment {
  type: 'image' | 'video';
  url: string;
}

export interface ChatMessage {
  id: string;
  sender: 'me' | 'them';
  text: string;
  timestamp: string;
  attachments?: ChatAttachment[];
  reactions?: string[];
}

export interface ChatThread {
  id: string;
  participantName: string;
  avatarColor: string;
  avatarUrl?: string;
  lastMessage: string;
  unread: boolean;
  messages: ChatMessage[];
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  unread: boolean;
  type: 'info' | 'success' | 'alert' | 'wallet';
}

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'earning';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending';
}

export interface Proof {
  id: number;
  user: string;
  image: string;
  status: 'pending' | 'approved' | 'rejected';
  coins?: number;
  price?: string;
}

export interface UserProfileData {
  name: string;
  surname: string;
  email: string;
  bio: string;
  hourlyRate: number;
  skills: string[];
  province: string;
  location: string;
  contactInfo: string;
  socialLinks: string[];
  profilePic?: string;
  pin?: string;
}

export interface FriendRequest {
  id: string;
  senderName: string;
  avatarColor: string;
  avatarUrl?: string;
  timestamp: string;
}

export interface Contact {
  id: string;
  name: string;
  avatarColor: string;
  avatarUrl?: string;
  status: 'online' | 'offline';
  lastSeen?: string;
}

export interface Referral {
  id: string;
  email: string;
  status: 'Invited' | 'Joined';
  reward: number;
  date: string;
  isValid?: boolean;
  topupAmount?: number;
  hasBecomeAgent?: boolean;
}

export interface AgentCashout {
  id: string;
  agentName: string;
  agentEmail: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  isEarly: boolean;
  isMidTier?: boolean;
  bankName?: string;
  accountNumber?: string;
  accountHolderName?: string;
  rawRewardsTotal?: number;
  rawTopupsTotal?: number;
}


