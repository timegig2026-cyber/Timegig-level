import React, { useEffect, useState } from 'react';
import SettingsView from './components/SettingsView';
import { Briefcase, Users, MessageSquare, Wallet as WalletIcon, Gift, MoreHorizontal, CircleUserRound, Shield, Settings, Bell, Sparkles, Globe } from 'lucide-react';
import AdminDashboard from './components/AdminDashboard';
import Wallet from './components/Wallet';
import GigsView from './components/GigsView';
import SeekersView from './components/SeekersView';
import ChatView from './components/ChatView';
import UserProfileView from './components/UserProfileView';
import NotificationsView from './components/NotificationsView';
import ReferralView from './components/ReferralView';
import { Proof, Gig, Seeker, ChatThread, UserProfileData, NotificationItem, Referral, AgentCashout, ChatAttachment, FriendRequest, Contact } from './types';

const parsePrice = (priceStr?: string): number => {
  if (!priceStr) return 0;
  let clean = priceStr.replace(/[R$]/g, '').trim();
  if (clean.includes(',') && clean.includes('.')) {
    clean = clean.replace(/,/g, '');
  } else if (clean.includes(',')) {
    const parts = clean.split(',');
    if (parts[parts.length - 1].length === 2) {
      clean = clean.replace(/,/g, '.');
    } else {
      clean = clean.replace(/,/g, '');
    }
  }
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
};

const formatPrice = (val: number): string => {
  return 'R' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export default function App() {
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState('home');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('walletBalance');
    return saved ? parseInt(saved, 10) : 1500;
  });

  const [referralProfit, setReferralProfit] = useState<number>(() => {
    const saved = localStorage.getItem('referralProfit');
    return saved ? parseFloat(saved) : 450.00;
  });

  useEffect(() => {
    localStorage.setItem('walletBalance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('referralProfit', referralProfit.toString());
  }, [referralProfit]);

  // Gigs state
  const [gigs, setGigs] = useState<Gig[]>(() => {
    const saved = localStorage.getItem('gigsList');
    return saved ? JSON.parse(saved) : [
      { id: 'gig-1', title: 'Translate Legal Document', description: 'Translate a 5-page legal agreement from English to Spanish.', budget: 200, category: 'Writing', seekerName: 'Apex Law', status: 'open', deadline: '2026-07-20' },
      { id: 'gig-2', title: 'Logo Redesign', description: 'Modernize the brand identity for a solar panel startup.', budget: 450, category: 'Design', seekerName: 'EcoPower', status: 'open', deadline: '2026-07-25' },
      { id: 'gig-3', title: 'Build React Component', description: 'Create a reusable, accessible multi-select dropdown component.', budget: 150, category: 'Development', seekerName: 'Initech', status: 'assigned', deadline: '2026-07-18' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('gigsList', JSON.stringify(gigs));
  }, [gigs]);

  // Seekers state
  const [seekers, setSeekers] = useState<Seeker[]>(() => {
    const saved = localStorage.getItem('seekersList');
    return saved ? JSON.parse(saved) : [
      { id: 'seeker-1', name: 'Apex Law', company: 'Apex Legal Group', bio: 'Corporate legal services and consultancies.', avatarColor: 'bg-indigo-500 text-white', activeGigsCount: 1, rating: 4.8, category: 'Writing' },
      { id: 'seeker-2', name: 'EcoPower', company: 'EcoPower Solar', bio: 'Pioneering local clean-energy solutions.', avatarColor: 'bg-emerald-500 text-white', activeGigsCount: 2, rating: 4.9, category: 'Design' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('seekersList', JSON.stringify(seekers));
  }, [seekers]);

  // Chat threads state
  const [threads, setThreads] = useState<ChatThread[]>(() => {
    const saved = localStorage.getItem('chatThreads');
    return saved ? JSON.parse(saved) : [
      {
        id: 'thread-1',
        participantName: 'Apex Law Support',
        avatarColor: 'bg-indigo-500 text-white',
        avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100&h=100',
        lastMessage: 'Let us schedule a call tomorrow.',
        unread: true,
        messages: [
          { id: 'msg-1', sender: 'them', text: 'Hello! I saw your proposal on our translation project.', timestamp: '10:15 AM' },
          { id: 'msg-2', sender: 'me', text: 'Hi! Yes, I have done extensive work with legal documents. Here is an example of a recent translation:', timestamp: '10:17 AM' },
          { id: 'msg-2-5', sender: 'me', text: '', timestamp: '10:18 AM', attachments: [{ type: 'image', url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=400&h=300' }] },
          { id: 'msg-2-6', sender: 'them', text: 'Looks great! Can you also send a short introductory video?', timestamp: '10:19 AM' },
          { id: 'msg-2-7', sender: 'me', text: 'Sure, here is my intro:', timestamp: '10:20 AM', attachments: [{ type: 'video', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' }] },
          { id: 'msg-3', sender: 'them', text: 'Let us schedule a call tomorrow.', timestamp: '10:21 AM' }
        ]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('chatThreads', JSON.stringify(threads));
  }, [threads]);

  const [activeThreadId, setActiveThreadId] = useState<string>('thread-1');

  // User profile state
  const [profile, setProfile] = useState<UserProfileData>(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : {
      name: 'CurrentUser',
      surname: 'Surname',
      email: 'user@example.com',
      bio: 'Professional freelance developer specializing in React and responsive CSS layouts.',
      hourlyRate: 50,
      skills: ['React', 'TypeScript', 'Tailwind CSS'],
      province: 'Gauteng',
      location: 'Johannesburg',
      contactInfo: '+27 12 345 6789',
      socialLinks: ['https://linkedin.com/in/currentuser'],
      profilePic: '',
      pin: ''
    };
  });

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }, [profile]);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [apiIngressEnabled, setApiIngressEnabled] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : [
      { id: 'notif-1', title: 'Welcome to TimeGiG!', description: 'Complete tasks or refer friends to earn extra cash.', timestamp: 'Just now', unread: true, type: 'info' },
      { id: 'notif-2', title: 'Wallet Topup Approved', description: 'Your deposit has been successfully verified.', timestamp: '2 hours ago', unread: false, type: 'wallet' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (title: string, description: string, type: 'info' | 'success' | 'alert' | 'wallet') => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      description,
      timestamp: 'Just now',
      unread: true,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Agent & Referral States
  const [isVerifiedAgent, setIsVerifiedAgent] = useState<boolean>(() => {
    return localStorage.getItem('isVerifiedAgent') === 'true';
  });

  const [referrals, setReferrals] = useState<Referral[]>(() => {
    const saved = localStorage.getItem('referrals');
    return saved ? JSON.parse(saved) : [
      { id: 'ref-1', name: 'Zama Khoza', email: 'zama@example.com', registeredAt: '2026-07-10', topupAmount: 150.00, hasBecomeAgent: false },
      { id: 'ref-2', name: 'Sipho Zuma', email: 'sipho@example.com', registeredAt: '2026-07-11', topupAmount: 50.00, hasBecomeAgent: true },
      { id: 'ref-3', name: 'Lerato Mokoena', email: 'lerato@example.com', registeredAt: '2026-07-12', topupAmount: 200.00, hasBecomeAgent: false },
      { id: 'ref-4', name: 'Thabo Ndlovu', email: 'thabo@example.com', registeredAt: '2026-07-12', topupAmount: 0.00, hasBecomeAgent: false },
      { id: 'ref-5', name: 'Nomvula Cele', email: 'nomvula@example.com', registeredAt: '2026-07-13', topupAmount: 80.00, hasBecomeAgent: false },
    ];
  });

  const [proofs, setProofs] = useState<Proof[]>(() => {
    const saved = localStorage.getItem('proofs');
    return saved ? JSON.parse(saved) : [
      { id: 1, user: 'John Doe', image: 'https://images.unsplash.com/photo-1554224155-8d04cb27cd6c?auto=format&fit=crop&q=80&w=200', status: 'pending', coins: 1000, price: 'R10,00' },
      { id: 2, user: 'Jane Smith', image: 'https://images.unsplash.com/photo-1554224155-8d04cb27cd6c?auto=format&fit=crop&q=80&w=200', status: 'pending', coins: 40000, price: 'R400,00' },
    ];
  });

  const [agentCashouts, setAgentCashouts] = useState<AgentCashout[]>(() => {
    const saved = localStorage.getItem('agentCashouts');
    return saved ? JSON.parse(saved) : [
      { id: 'cashout-1', agentName: 'Zama Khoza (Sample)', agentEmail: 'zama@example.com', amount: 150.00, status: 'approved', date: '2026-07-13', isEarly: true, bankName: 'Standard Bank', accountNumber: '1234567890', accountHolderName: 'Z Khoza' },
    ];
  });

  // Friend Requests & Contacts State
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(() => {
    const saved = localStorage.getItem('friendRequests');
    return saved ? JSON.parse(saved) : [
      { id: 'req-1', senderName: 'Sarah Jenkins', avatarColor: 'bg-pink-500', timestamp: '2 hours ago' },
      { id: 'req-2', senderName: 'Mike Ross', avatarColor: 'bg-blue-600', timestamp: 'Yesterday' }
    ];
  });

  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('contacts');
    return saved ? JSON.parse(saved) : [
      { id: 'con-1', name: 'Zama Khoza', avatarColor: 'bg-emerald-500', status: 'online' },
      { id: 'con-2', name: 'Sipho Zuma', avatarColor: 'bg-amber-500', status: 'offline', lastSeen: '2 hours ago' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('friendRequests', JSON.stringify(friendRequests));
  }, [friendRequests]);

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('isVerifiedAgent', isVerifiedAgent.toString());
  }, [isVerifiedAgent]);

  useEffect(() => {
    localStorage.setItem('referrals', JSON.stringify(referrals));
  }, [referrals]);

  useEffect(() => {
    localStorage.setItem('agentCashouts', JSON.stringify(agentCashouts));
  }, [agentCashouts]);

  useEffect(() => {
    localStorage.setItem('proofs', JSON.stringify(proofs));
  }, [proofs]);

  const [stats, setStats] = useState(() => {
      const saved = localStorage.getItem('stats');
      const initial = saved ? JSON.parse(saved) : [
          { label: 'Live Profit Balance', value: 'R12,450.00', color: 'border-blue-500' },
          { label: 'Admin Profit (Net)', value: 'R8,100.00', color: 'border-green-500' },
          { label: 'Active Users', value: '1,284', color: 'border-violet-500' },
          { label: 'Online Visits', value: '452', color: 'border-cyan-500' },
          { label: 'Proof of Payment', value: '2', color: 'border-blue-400' },
          { label: 'Referral Profit Balance', value: 'R0.00', color: 'border-emerald-500' },
          { label: 'Total Owed to Agents', value: 'R0.00', color: 'border-amber-500' },
          { label: 'Total Referral Agents', value: '1', color: 'border-purple-500' },
      ];
      // Keep all stats
      return initial;
  });
  
  useEffect(() => {
    localStorage.setItem('stats', JSON.stringify(stats));
  }, [stats]);

  // Synchronize stats dynamically based on other states
  useEffect(() => {
    const pendingProofsCount = proofs.filter(p => p.status === 'pending').length.toString();
    const pendingCashoutsTotal = agentCashouts
      .filter(c => c.status === 'pending')
      .reduce((sum, c) => sum + c.amount, 0);

    const totalReferralTopups = referrals.reduce((sum, r) => sum + (r.topupAmount || 0), 0);
    const validRefs = referrals.filter(r => (r.topupAmount || 0) > 0).length;
    // User requested: "For every referral... user will receive 50% and admin 50%"
    const commissionRate = 0.50; 
    const commissionEarnings = totalReferralTopups * commissionRate;

    // Active Agent count (Current user is verified + referred ones who became agents)
    const activeAgentsCount = (isVerifiedAgent ? 1 : 0) + referrals.filter(r => r.hasBecomeAgent).length;

    setStats(prev => prev.map(s => {
      if (s.label === 'Proof of Payment') {
        return { ...s, value: pendingProofsCount };
      }
      if (s.label === 'Total Owed to Agents') {
        return { ...s, value: `R${pendingCashoutsTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` };
      }
      if (s.label === 'Referral Profit Balance') {
        return { ...s, value: `R${commissionEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` };
      }
      if (s.label === 'Admin Profit (Net)') {
        // We update this in handleApproveProof now, but let's keep it consistent
        return s;
      }
      if (s.label === 'Total Referral Agents') {
        return { ...s, value: activeAgentsCount.toString() };
      }
      return s;
    }));

    // Sync referralProfit state for Wallet view with calculated commission
    setReferralProfit(commissionEarnings);
  }, [proofs, agentCashouts, referrals, isVerifiedAgent]);
  
  const handleNormalAppLinkClick = () => {
    setStats(prevStats => prevStats.map(s => {
      if (s.label === 'Online Visits') {
        const currentVal = parseInt(s.value.replace(/,/g, ''), 10) || 0;
        const newVal = currentVal + 1;
        return { ...s, value: newVal.toLocaleString() };
      }
      return s;
    }));
    showToast("Normal App Link clicked! Online Visits incremented in Admin Dashboard.");
  };

  const handleAcceptFriendRequest = (requestId: string) => {
    const request = friendRequests.find(r => r.id === requestId);
    if (request) {
      const newContact: Contact = {
        id: `con-${Date.now()}`,
        name: request.senderName,
        avatarColor: request.avatarColor,
        avatarUrl: request.avatarUrl,
        status: 'online'
      };
      setContacts(prev => [...prev, newContact]);
      setFriendRequests(prev => prev.filter(r => r.id !== requestId));
      showToast(`${request.senderName} is now in your contact list!`);
    }
  };

  const handleRejectFriendRequest = (requestId: string) => {
    setFriendRequests(prev => prev.filter(r => r.id !== requestId));
    showToast("Friend request ignored.");
  };

  const handleAddFriend = (name: string, avatarColor: string) => {
    // Check if already in contacts or has pending request
    if (contacts.find(c => c.name === name)) {
      showToast(`${name} is already your friend!`);
      return;
    }
    showToast(`Friend request sent to ${name}!`);
  };

  const handleStartConversation = (contact: Contact) => {
    // Check if thread exists
    const existingThread = threads.find(t => t.participantName === contact.name);
    if (existingThread) {
      setActiveThreadId(existingThread.id);
    } else {
      // Create new thread
      const newThread: ChatThread = {
        id: `thread-${Date.now()}`,
        participantName: contact.name,
        avatarColor: contact.avatarColor,
        avatarUrl: contact.avatarUrl,
        lastMessage: "Conversation started",
        unread: false,
        messages: []
      };
      setThreads(prev => [newThread, ...prev]);
      setActiveThreadId(newThread.id);
    }
  };

  const handleApproveProof = (id: number) => {
    const proofToApprove = proofs.find(p => p.id === id);
    if (!proofToApprove || proofToApprove.status !== 'pending') return;

    // 1. Update proofs status to approved
    setProofs(prevProofs => prevProofs.map(p => p.id === id ? { ...p, status: 'approved' as const } : p));

    // 2. Add coins to wallet balance
    if (proofToApprove.coins) {
      setBalance(b => b + proofToApprove.coins!);
    }

    // 3. Update referrals list if the user is a referral
    const isReferral = referrals.some(r => r.name === proofToApprove.user);
    if (isReferral) {
      setReferrals(prev => prev.map(r => {
        if (r.name === proofToApprove.user) {
          const topupVal = parsePrice(proofToApprove.price);
          return { ...r, topupAmount: (r.topupAmount || 0) + topupVal };
        }
        return r;
      }));
    }

    // 4. Parse price and add to Live Profit Balance and Admin Profit (Net)
    if (proofToApprove.price) {
      const addedProfit = parsePrice(proofToApprove.price);
      
      // Referral logic: 50% to user (as referral profit), 50% to admin
      const adminShare = isReferral ? addedProfit * 0.5 : addedProfit;
      const userShare = isReferral ? addedProfit * 0.5 : 0;

      // If approved payment is R20 or more and it's the current user, verify the agent
      if (addedProfit >= 20.00 && proofToApprove.user === 'CurrentUser') {
        setIsVerifiedAgent(true);
        addNotification(
          "Agent Status Verified! 🎉",
          `We approved your top-up of R${addedProfit.toFixed(2)}. You are now a verified agent!`,
          "success"
        );
        showToast("You are now a Verified Referral Agent!");
      }

      setStats(prevStats => prevStats.map(s => {
        if (s.label === 'Live Profit Balance') {
          const currentVal = parsePrice(s.value);
          const newVal = currentVal + addedProfit;
          return { ...s, value: formatPrice(newVal) };
        }
        if (s.label === 'Admin Profit (Net)') {
          const currentVal = parsePrice(s.value);
          const newVal = currentVal + adminShare;
          return { ...s, value: formatPrice(newVal) };
        }
        return s;
      }));
    }
  };

  const handleRejectProof = (id: number) => {
    setProofs(prevProofs => prevProofs.map(p => p.id === id ? { ...p, status: 'rejected' as const } : p));
  };

  const handleApproveAgentCashout = (id: string) => {
    const cashout = agentCashouts.find(c => c.id === id);
    if (!cashout || cashout.status !== 'pending') return;

    setAgentCashouts(prev => prev.map(c => c.id === id ? { ...c, status: 'approved' } : c));

    if (cashout.agentEmail === profile.email) {
      addNotification(
        "Agent Cashout Approved! 💸",
        `Your cashout request of R${cashout.amount.toFixed(2)} was approved! Check your bank account.`,
        "success"
      );
    } else {
      addNotification(
        "Agent Cashout Approved",
        `Withdraw request of R${cashout.amount.toFixed(2)} for ${cashout.agentName} has been approved and paid out.`,
        "success"
      );
    }
    showToast(`Approved cashout of R${cashout.amount.toFixed(2)}!`);
  };

  const handleRejectAgentCashout = (id: string) => {
    const cashout = agentCashouts.find(c => c.id === id);
    if (!cashout || cashout.status !== 'pending') return;

    setAgentCashouts(prev => prev.map(c => c.id === id ? { ...c, status: 'rejected' } : c));

    if (cashout.agentEmail === profile.email) {
      addNotification(
        "Agent Cashout Rejected ⚠️",
        `Your cashout request of R${cashout.amount.toFixed(2)} was rejected. Please contact support.`,
        "alert"
      );
    } else {
      addNotification(
        "Agent Cashout Rejected",
        `Withdraw request of R${cashout.amount.toFixed(2)} for ${cashout.agentName} was rejected.`,
        "alert"
      );
    }
    showToast(`Rejected cashout of R${cashout.amount.toFixed(2)}!`);
  };

  const handleRequestAgentCashout = (
    amount: number,
    isEarly: boolean,
    bankName: string,
    accountNumber: string,
    accountHolderName: string,
    rawRewards?: number,
    rawTopups?: number
  ) => {
    const newCashout: AgentCashout = {
      id: `cashout-${Date.now()}`,
      agentName: profile.name,
      agentEmail: profile.email,
      amount: amount,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      isEarly: isEarly,
      bankName: bankName,
      accountNumber: accountNumber,
      accountHolderName: accountHolderName,
      rawRewardsTotal: rawRewards,
      rawTopupsTotal: rawTopups
    };
    setAgentCashouts(prev => [newCashout, ...prev]);
    addNotification(
      "Agent Cashout Requested 💳",
      `You requested a withdrawal of R${amount.toFixed(2)} to ${bankName}.`,
      "wallet"
    );
    showToast(`Withdrawal request of R${amount.toFixed(2)} submitted!`);
  };

  const handleResetDashboard = () => {
    setProofs([]);
    setBalance(0);
    setIsVerifiedAgent(false);
    setReferrals([
      { id: 'ref-1', name: 'Zama Khoza', email: 'zama@example.com', registeredAt: '2026-07-10', topupAmount: 150.00, hasBecomeAgent: false },
      { id: 'ref-2', name: 'Sipho Zuma', email: 'sipho@example.com', registeredAt: '2026-07-11', topupAmount: 50.00, hasBecomeAgent: true },
      { id: 'ref-3', name: 'Lerato Mokoena', email: 'lerato@example.com', registeredAt: '2026-07-12', topupAmount: 200.00, hasBecomeAgent: false },
      { id: 'ref-4', name: 'Thabo Ndlovu', email: 'thabo@example.com', registeredAt: '2026-07-12', topupAmount: 0.00, hasBecomeAgent: false },
      { id: 'ref-5', name: 'Nomvula Cele', email: 'nomvula@example.com', registeredAt: '2026-07-13', topupAmount: 80.00, hasBecomeAgent: false },
    ]);
    setAgentCashouts([
      { id: 'cashout-1', agentName: 'Zama Khoza (Sample)', agentEmail: 'zama@example.com', amount: 150.00, status: 'approved', date: '2026-07-13', isEarly: true, bankName: 'Standard Bank', accountNumber: '1234567890', accountHolderName: 'Z Khoza' },
    ]);
    setStats([
      { label: 'Live Profit Balance', value: 'R0.00', color: 'border-blue-500' },
      { label: 'Admin Profit (Net)', value: 'R0.00', color: 'border-green-500' },
      { label: 'Active Users', value: '0', color: 'border-violet-500' },
      { label: 'Online Visits', value: '0', color: 'border-cyan-500' },
      { label: 'Proof of Payment', value: '0', color: 'border-blue-400' },
      { label: 'Referral Profit Balance', value: 'R0.00', color: 'border-emerald-500' },
      { label: 'Total Owed to Agents', value: 'R0.00', color: 'border-amber-500' },
      { label: 'Total Referral Agents', value: '0', color: 'border-purple-500' },
    ]);
  };

  const navItems = [
    { label: 'GiGs', icon: Briefcase, color: 'text-black' },
    { label: 'Seekers', icon: Users, color: 'text-black' },
    { label: 'Chat', icon: MessageSquare, color: 'text-black' },
    { label: 'Wallet', icon: WalletIcon, color: 'text-black' },
    { label: 'Referral', icon: Gift, color: 'text-black' },
    { label: 'Settings', icon: Settings, color: 'text-black' },
  ];

  const hasUnreadNotifications = notifications.some(n => n.unread);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className={`text-slate-800 flex flex-col relative ${activeLabel === 'Chat' ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      {/* Tool-themed Wallpaper with Blur */}
      <div 
        className="fixed inset-0 z-[-1] pointer-events-none"
        style={{
          backgroundImage: `url('/src/assets/images/tools_background_1784053847225.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(4px) brightness(0.95)',
          opacity: 0.6
        }}
      />
      
      {activeLabel !== 'Chat' && (
      <header className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 z-40 shadow-xs shrink-0">
        <div className="max-w-5xl mx-auto flex flex-col gap-4">
          <div className="grid grid-cols-3 items-center">
            <div />
            <h1 className="text-center font-bold text-lg text-black cursor-pointer tracking-tight hover:opacity-85 transition-opacity" onClick={() => { setCurrentView('home'); setActiveLabel(null); }}>
              TimeGiG
            </h1>
            <div className="flex items-center justify-end gap-1 relative">
              <button 
                onClick={() => {
                  setCurrentView('admin');
                  setActiveLabel(null);
                }} 
                className="text-black hover:opacity-70 p-2 cursor-pointer"
                title="Admin Dashboard"
              >
                <Shield className="w-6 h-6" />
              </button>

              {/* Notification Bell with wiggle dance if unread exists */}
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} 
                className={`text-black hover:opacity-70 p-2 relative transition-all cursor-pointer ${hasUnreadNotifications ? 'animate-wiggle' : ''}`} 
                title="Notifications"
              >
                <Bell className={`w-6 h-6 ${hasUnreadNotifications ? 'fill-black text-black' : 'text-black'}`} />
                {hasUnreadNotifications && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-1 ring-white animate-pulse" />
                )}
              </button>

              <button 
                onClick={() => {
                  setCurrentView('profile');
                  setActiveLabel(null);
                }} 
                className="text-black dark:text-white hover:opacity-70 p-2 cursor-pointer"
                title="User Profile"
              >
                <CircleUserRound className="w-6 h-6" />
              </button>
              
              {/* Notification Popover Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-12 top-full mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in">
                  <div className="p-3 bg-white border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Notifications</span>
                    <button onClick={() => setIsNotificationsOpen(false)} className="text-[10px] text-slate-400 hover:text-slate-600 font-bold uppercase tracking-wider">Close</button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <NotificationsView 
                      notifications={notifications}
                      onMarkAsRead={handleMarkAsRead}
                      onMarkAllAsRead={handleMarkAllAsRead}
                      onDeleteNotification={handleDeleteNotification}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      )}

      {/* Fixed Bottom Navigation Bar */}
      {activeLabel !== 'Chat' && (
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-2.5 z-40 shadow-[0_-2px_10_rgba(0,0,0,0.05)] grid grid-cols-6 items-center max-w-full overflow-hidden">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button 
              key={index} 
              onClick={() => {
                if (item.label === 'Settings') {
                  setCurrentView('settings');
                  setActiveLabel(null);
                  return;
                }
                const nextLabel = activeLabel === item.label ? null : item.label;
                setActiveLabel(nextLabel);
                if (item.label === 'Chat' && nextLabel === 'Chat') {
                  setActiveThreadId("");
                }
                if (item.label === 'Wallet') {
                  setCurrentView(nextLabel ? 'wallet' : 'home');
                } else {
                  setCurrentView('home');
                }
              }}
              className="flex flex-col items-center justify-center gap-1 group cursor-pointer w-full"
            >
              <Icon className={`w-5 h-5 ${activeLabel === item.label ? 'text-blue-600 dark:text-blue-400 scale-110' : 'text-slate-900 dark:text-slate-400 opacity-70 group-hover:opacity-100'} transition-all`} />
              <span className={`text-[8px] font-bold transition-all truncate w-full text-center ${
                activeLabel === item.label ? 'text-slate-900 dark:text-slate-100 opacity-100' : 'text-slate-900 dark:text-slate-400 opacity-0 md:opacity-70 group-hover:opacity-100'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
      )}
      
      {/* View Switcher Panels */}
      {currentView === 'admin' && (
        <div className="pb-24">
          <AdminDashboard 
            proofs={proofs} 
            stats={stats} 
            onApproveProof={handleApproveProof}
            onRejectProof={handleRejectProof}
            onResetDashboard={handleResetDashboard}
            agentCashouts={agentCashouts}
            onApproveAgentCashout={handleApproveAgentCashout}
            onRejectAgentCashout={handleRejectAgentCashout}
          />
        </div>
      )}

      {currentView === 'wallet' && (
        <div className="pb-24">
          <Wallet 
            onBack={() => { setCurrentView('home'); setActiveLabel(null); }} 
            addProof={(proof: Proof) => {
              setProofs([...proofs, proof]);
              addNotification("Payment Proof Uploaded", `A payment proof of ${proof.price} has been submitted for admin verification.`, "wallet");
              showToast("Proof of payment submitted successfully!");
            }} 
            balance={balance}
            setBalance={setBalance}
            referralProfit={referralProfit}
          />
        </div>
      )}

      {currentView === 'profile' && (
        <div className="max-w-5xl mx-auto p-4 md:p-6 pb-24">
          <button 
            onClick={() => setCurrentView('home')} 
            className="mb-4 text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
          >
            ← Back to Home
          </button>
          <UserProfileView 
            profile={profile}
            onUpdateProfile={setProfile}
            onShowToast={showToast}
            onBack={() => setCurrentView('home')}
          />
        </div>
      )}

      {currentView === 'settings' && (
        <div className="flex-1 overflow-hidden">
          <SettingsView 
            onClose={() => setCurrentView('home')} 
            notificationsEnabled={notificationsEnabled}
            onToggleNotifications={() => setNotificationsEnabled(!notificationsEnabled)}
            apiIngressEnabled={apiIngressEnabled}
            onToggleApiIngress={() => setApiIngressEnabled(!apiIngressEnabled)}
          />
        </div>
      )}

      {currentView === 'home' && (
        <main className={activeLabel === 'Chat' ? "w-full flex-1 overflow-hidden flex flex-col" : "max-w-5xl mx-auto p-4 md:p-6 flex-1 pb-24"}>
          {activeLabel === 'GiGs' && (
            <GigsView 
              gigs={gigs}
              currentUserName={profile.name}
              onAddGig={(gig: Gig) => {
                setGigs([gig, ...gigs]);
                showToast(`Gig "${gig.title}" published successfully!`);
                addNotification("Gig Published", `You have listed a new gig: "${gig.title}".`, "info");
              }}
              onUpdateGig={(updatedGig: Gig) => {
                setGigs(gigs.map(g => g.id === updatedGig.id ? updatedGig : g));
                showToast(`Gig updated!`);
              }}
              onDeleteGig={(id: string) => {
                setGigs(gigs.filter(g => g.id !== id));
                showToast(`Gig deleted!`);
              }}
              onApplyGig={(id: string) => {
                const gig = gigs.find(g => g.id === id);
                if (gig) {
                  if (gig.seekerName === profile.name) {
                    showToast("You cannot apply to your own gig.");
                    return;
                  }
                  const existingThread = threads.find(t => t.participantName === gig.seekerName);
                  let threadId = existingThread?.id;
                  const messageText = `Hi, I am interested in your gig: ${gig.title}`;
                  if (!existingThread) {
                    threadId = `thread-${Date.now()}`;
                    const newThread: ChatThread = {
                      id: threadId,
                      participantName: gig.seekerName,
                      avatarColor: 'bg-indigo-500 text-white',
                      lastMessage: messageText,
                      unread: false,
                      messages: [{
                        id: `msg-${Date.now()}`,
                        sender: 'me',
                        text: messageText,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      }]
                    };
                    setThreads([newThread, ...threads]);
                  } else {
                    const newMessage = {
                      id: `msg-${Date.now()}`,
                      sender: 'me' as const,
                      text: messageText,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };
                    setThreads(prev => prev.map(t => t.id === existingThread.id ? { ...t, lastMessage: newMessage.text, messages: [...t.messages, newMessage] } : t));
                  }
                  setActiveThreadId(threadId!);
                  setActiveLabel('Chat');
                }
                showToast("Application submitted successfully to seeker!");
                addNotification("Gig Applied", "Your application has been received.", "success");
              }}
              onShowToast={showToast}
            />
          )}

          {activeLabel === 'Seekers' && (
            <SeekersView 
              seekers={seekers}
              currentUserName={profile.name}
              onAddSeeker={(seeker: Seeker) => {
                setSeekers([seeker, ...seekers]);
                showToast(`Seeker profile for "${seeker.name}" added.`);
              }}
              onUpdateSeeker={(updatedSeeker: Seeker) => {
                setSeekers(seekers.map(s => s.id === updatedSeeker.id ? updatedSeeker : s));
                showToast(`Seeker profile updated!`);
              }}
              onDeleteSeeker={(id: string) => {
                setSeekers(seekers.filter(s => s.id !== id));
                showToast(`Seeker profile deleted!`);
              }}
              onContactSeeker={(seekerName: string) => {
                if (seekerName === profile.name) {
                  showToast("You cannot contact yourself.");
                  return;
                }
                const existingThread = threads.find(t => t.participantName === seekerName);
                let threadId = existingThread?.id;
                const messageText = `Hi ${seekerName}, I am interested in collaborating with you.`;
                if (!existingThread) {
                  threadId = `thread-${Date.now()}`;
                  const newThread: ChatThread = {
                    id: threadId,
                    participantName: seekerName,
                    avatarColor: 'bg-teal-500 text-white',
                    lastMessage: messageText,
                    unread: false,
                    messages: [{
                      id: `msg-${Date.now()}`,
                      sender: 'me',
                      text: messageText,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }]
                  };
                  setThreads([newThread, ...threads]);
                } else {
                  const newMessage = {
                    id: `msg-${Date.now()}`,
                    sender: 'me' as const,
                    text: messageText,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  };
                  setThreads(prev => prev.map(t => t.id === existingThread.id ? { ...t, lastMessage: newMessage.text, messages: [...t.messages, newMessage] } : t));
                }
                setActiveThreadId(threadId!);
                setActiveLabel('Chat');
                showToast("Contact request sent to seeker!");
              }}
              onShowToast={showToast}
            />
          )}

          {activeLabel === 'Chat' && (
            <ChatView 
              threads={threads}
              activeThreadId={activeThreadId}
              onSetActiveThreadId={setActiveThreadId}
              onBack={() => setActiveLabel(null)}
              friendRequests={friendRequests}
              contacts={contacts}
              onAcceptRequest={handleAcceptFriendRequest}
              onRejectRequest={handleRejectFriendRequest}
              onAddFriend={handleAddFriend}
              onStartConversation={handleStartConversation}
              onSendMessage={(threadId: string, text: string, attachments?: ChatAttachment[]) => {
                const newMessage = { 
                  id: `msg-${Date.now()}`, 
                  sender: 'me' as const, 
                  text, 
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  attachments
                };
                setThreads(prev => prev.map(t => t.id === threadId ? { ...t, lastMessage: text, messages: [...t.messages, newMessage] } : t));
                
                // Simulate quick auto-reply from the Seeker
                setTimeout(() => {
                  const replyText = `Thanks for your message! We will review your application soon.`;
                  const replyMessage = { 
                    id: `msg-${Date.now() + 1}`, 
                    sender: 'them' as const, 
                    text: replyText, 
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                  };
                  setThreads(prev => prev.map(t => t.id === threadId ? { ...t, lastMessage: replyText, unread: true, messages: [...t.messages, replyMessage] } : t));
                  if (notificationsEnabled) {
                    addNotification("New Message Received", "Apex Law Support replied to your chat.", "info");
                  }
                }, 2000);
              }}
              onAddReaction={(threadId: string, messageId: string, emoji: string) => {
                setThreads(prev => prev.map(t => {
                  if (t.id === threadId) {
                    return {
                      ...t,
                      messages: t.messages.map(m => {
                        if (m.id === messageId) {
                          return {
                            ...m,
                            reactions: [...(m.reactions || []), emoji]
                          };
                        }
                        return m;
                      })
                    };
                  }
                  return t;
                }));
              }}
              onEditMessage={(threadId: string, messageId: string, newText: string) => {
                setThreads(prev => prev.map(t => {
                  if (t.id === threadId) {
                    return {
                      ...t,
                      messages: t.messages.map(m => {
                        if (m.id === messageId) {
                          return { ...m, text: newText };
                        }
                        return m;
                      }),
                      lastMessage: t.messages[t.messages.length - 1].id === messageId ? newText : t.lastMessage
                    };
                  }
                  return t;
                }));
              }}
              onDeleteMessage={(threadId: string, messageId: string) => {
                setThreads(prev => prev.map(t => {
                  if (t.id === threadId) {
                    const filteredMessages = t.messages.filter(m => m.id !== messageId);
                    return {
                      ...t,
                      messages: filteredMessages,
                      lastMessage: filteredMessages.length > 0 ? filteredMessages[filteredMessages.length - 1].text || 'Media' : 'No messages'
                    };
                  }
                  return t;
                }));
              }}
              onDeleteThread={(threadId: string) => {
                setThreads(prev => prev.filter(t => t.id !== threadId));
                if (activeThreadId === threadId) {
                  setActiveThreadId("");
                }
                addNotification("Conversation Deleted", "The chat has been permanently removed.", "info");
              }}
            />
          )}

          {activeLabel === 'Referral' && (
            <ReferralView
              referrals={referrals}
              onAddReferral={(ref) => setReferrals(prev => [...prev, ref])}
              onUpdateReferral={(ref) => setReferrals(prev => prev.map(r => r.id === ref.id ? ref : r))}
              onResetReferrals={() => setReferrals([])}
              onShowToast={showToast}
              balance={balance}
              setBalance={setBalance}
              isVerifiedAgent={isVerifiedAgent}
              setIsVerifiedAgent={setIsVerifiedAgent}
              onAddNotification={addNotification}
              onNormalLinkClick={handleNormalAppLinkClick}
              onRequestAgentCashout={handleRequestAgentCashout}
              agentCashouts={agentCashouts}
              userName={profile.name}
            />
          )}



          {/* Fallback landing page dashboard */}
          {!activeLabel && (
            <div className="py-8 max-w-3xl mx-auto text-center space-y-6">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/30 border border-indigo-100 rounded-3xl p-8 space-y-4 shadow-xs">
                <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">Freelancer Hub</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Welcome to TimeGiG</h2>
                <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                  The ultimate local gig and micro-tasking marketplace. Work with verified seekers, chat in real-time, and make fast deposits with automated agent credit verification.
                </p>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <button onClick={() => setActiveLabel('GiGs')} className="px-4 py-2 bg-indigo-600 text-white font-semibold text-xs rounded-xl shadow-xs hover:bg-indigo-700 transition-all cursor-pointer">Explore GiGs</button>
                  <button onClick={handleNormalAppLinkClick} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5">
                    <Globe className="w-4 h-4" /> Click Normal App Link
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left pt-2">
                <div className="p-5 border border-slate-200 rounded-2xl bg-white space-y-1 shadow-xs">
                  <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-indigo-500" /> High-Budget Gigs</h4>
                  <p className="text-[11px] text-slate-500">Apply to diverse tasks like copywriting, design, and web development directly.</p>
                </div>
                <div className="p-5 border border-slate-200 rounded-2xl bg-white space-y-1 shadow-xs">
                  <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5"><Users className="w-4 h-4 text-emerald-500" /> Verified Seekers</h4>
                  <p className="text-[11px] text-slate-500">Work securely with rated and verified organizations across South Africa.</p>
                </div>
                <div className="p-5 border border-slate-200 rounded-2xl bg-white space-y-1 shadow-xs">
                  <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5"><WalletIcon className="w-4 h-4 text-sky-500" /> Fast Credits</h4>
                  <p className="text-[11px] text-slate-500">Top up from R20.00 using local banking slips, automatically approved by our agent system.</p>
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* Styled Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold flex items-center gap-2 z-50 border border-slate-800 transition-all">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          {toast}
        </div>
      )}
    </div>
  );
}

