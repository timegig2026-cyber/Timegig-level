import React, { useState, useRef, useEffect } from 'react';
import { Send, Check, CheckCheck, Smile, Paperclip, MoreVertical, MessageSquare, ArrowLeft, X, ArrowDown, ArrowUp, User, Edit, Trash2, UserPlus, Users, Bell } from 'lucide-react';
import { ChatThread, ChatMessage, ChatAttachment, FriendRequest, Contact } from '../types';

interface ChatViewProps {
  threads: ChatThread[];
  activeThreadId: string;
  onSetActiveThreadId: (id: string) => void;
  onSendMessage: (threadId: string, text: string, attachments?: ChatAttachment[]) => void;
  onAddReaction: (threadId: string, messageId: string, emoji: string) => void;
  onEditMessage: (threadId: string, messageId: string, newText: string) => void;
  onDeleteMessage: (threadId: string, messageId: string) => void;
  onDeleteThread: (threadId: string) => void;
  friendRequests: FriendRequest[];
  contacts: Contact[];
  onAcceptRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
  onAddFriend: (name: string, avatarColor: string) => void;
  onStartConversation: (contact: Contact) => void;
  onBack?: () => void;
}

export default function ChatView({ 
  threads, 
  activeThreadId, 
  onSetActiveThreadId, 
  onSendMessage, 
  onAddReaction, 
  onEditMessage, 
  onDeleteMessage, 
  onDeleteThread, 
  friendRequests,
  contacts,
  onAcceptRequest,
  onRejectRequest,
  onAddFriend,
  onStartConversation,
  onBack 
}: ChatViewProps) {
  const [inputText, setInputText] = useState('');
  const [selectedAttachments, setSelectedAttachments] = useState<ChatAttachment[]>([]);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [fullscreenMedia, setFullscreenMedia] = useState<ChatAttachment | null>(null);
  const [fullscreenProfile, setFullscreenProfile] = useState<{name: string, avatarUrl?: string, avatarColor: string, bio?: string, skills?: string[]} | null>(null);
  const [emojiPickerTarget, setEmojiPickerTarget] = useState<{messageId: string, x: number, y: number} | null>(null);
  const [messageMenuTarget, setMessageMenuTarget] = useState<{messageId: string, x: number, y: number, text: string, isMe: boolean} | null>(null);
  const [threadMenuTarget, setThreadMenuTarget] = useState<{threadId: string, x: number, y: number, name: string} | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [activeTab, setActiveTab] = useState<'chats' | 'requests' | 'contacts'>('chats');
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);

  const activeThread = threads.find(t => t.id === activeThreadId);

  // Scroll to bottom when messages change or thread changes
  useEffect(() => {
    if (activeThread) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setShowScrollBottom(false);
    }
  }, [activeThread?.messages?.length, activeThreadId]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    // Show button if we're more than 300px from the bottom
    setShowScrollBottom(scrollHeight - scrollTop - clientHeight > 300);
    // Show top button if we're more than 300px from the top
    setShowScrollTop(scrollTop > 300);
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowScrollBottom(false);
  };

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    setShowScrollTop(false);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeThread) return;
    if (!inputText.trim() && selectedAttachments.length === 0) return;

    onSendMessage(activeThread.id, inputText, selectedAttachments.length > 0 ? selectedAttachments : undefined);
    setInputText('');
    setSelectedAttachments([]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: ChatAttachment[] = [];
    Array.from(files).forEach((file: File) => {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith('video') ? 'video' : ('image' as const);
      newAttachments.push({ type, url });
    });

    setSelectedAttachments(prev => [...prev, ...newAttachments]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setSelectedAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleMessageDoubleClick = (e: React.MouseEvent, messageId: string) => {
    e.preventDefault();
    setEmojiPickerTarget({
      messageId,
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleAddReaction = (emoji: string) => {
    if (emojiPickerTarget && activeThread) {
      onAddReaction(activeThread.id, emojiPickerTarget.messageId, emoji);
      setEmojiPickerTarget(null);
    }
  };

  const handlePressStart = (messageId: string, text: string, isMe: boolean, e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    longPressTimeout.current = setTimeout(() => {
      setMessageMenuTarget({ messageId, x: clientX, y: clientY, text, isMe });
    }, 1000);
  };

  const handleThreadPressStart = (threadId: string, name: string, e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    longPressTimeout.current = setTimeout(() => {
      setThreadMenuTarget({ threadId, x: clientX, y: clientY, name });
    }, 1000);
  };

  const handlePressEnd = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
  };

  const handleEditInit = () => {
    if (messageMenuTarget) {
      setEditingMessageId(messageMenuTarget.messageId);
      setEditValue(messageMenuTarget.text);
      setMessageMenuTarget(null);
    }
  };

  const handleDelete = () => {
    if (messageMenuTarget && activeThread) {
      onDeleteMessage(activeThread.id, messageMenuTarget.messageId);
      setMessageMenuTarget(null);
    }
  };

  const handleThreadDelete = () => {
    if (threadMenuTarget) {
      onDeleteThread(threadMenuTarget.threadId);
      setThreadMenuTarget(null);
    }
  };

  const submitEdit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (activeThread && editingMessageId && editValue.trim()) {
      onEditMessage(activeThread.id, editingMessageId, editValue);
      setEditingMessageId(null);
      setEditValue('');
    }
  };

  const emojiCategories = [
    { name: 'Smileys', emojis: ['😀', '😂', '😍', '😎', '🤔', '😴', '🙄', '🥳'] },
    { name: 'Gestures', emojis: ['👍', '👎', '👊', '✌️', '🤞', '🙏', '👏', '🤝'] },
    { name: 'Hearts', emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍'] },
    { name: 'Activities', emojis: ['⚽', '🏀', '🏈', '🎾', '🏐', '🏉', '🎱', '🎮'] },
    { name: 'Nature', emojis: ['🌸', '🍀', '🌞', '🔥', '🌊', '🌈', '⭐', '🌙'] }
  ];

  return (
    <div id="chat-view" className="flex flex-1 min-h-0 w-full bg-white animate-fade-in overflow-hidden">
      
      {/* Threads Sidebar */}
      <div className={`${activeThreadId && !showProfilePanel ? 'hidden md:flex' : 'flex'} flex-col border-r border-slate-100 w-full md:w-80 lg:w-96 shrink-0 h-full overflow-hidden bg-white z-10`}>
        <div className="p-4 border-b border-slate-100 bg-white space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              Chat Hub
            </h3>
            {onBack && (
              <button onClick={onBack} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer" title="Go back">
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="flex p-1 bg-slate-50 rounded-lg gap-1">
            <button 
              onClick={() => setActiveTab('chats')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[10px] font-bold transition-all ${activeTab === 'chats' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <MessageSquare className="w-3 h-3" />
              Chats
            </button>
            <button 
              onClick={() => setActiveTab('requests')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[10px] font-bold transition-all relative ${activeTab === 'requests' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <Bell className="w-3 h-3" />
              Requests
              {friendRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
              )}
            </button>
            <button 
              onClick={() => setActiveTab('contacts')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[10px] font-bold transition-all ${activeTab === 'contacts' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <Users className="w-3 h-3" />
              Contacts
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-1">
          {activeTab === 'chats' && (
            <>
              {threads.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center p-4">
                  <MessageSquare className="w-8 h-8 text-slate-200 mb-2" />
                  <p className="text-[10px] text-slate-400 font-medium">No active conversations</p>
                </div>
              ) : (
                threads.map((thread) => {
                  const isSelected = thread.id === activeThreadId;
                  const initials = thread.participantName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                  return (
                    <button
                      key={thread.id}
                      onClick={() => onSetActiveThreadId(thread.id)}
                      onMouseDown={(e) => handleThreadPressStart(thread.id, thread.participantName, e)}
                      onMouseUp={handlePressEnd}
                      onMouseLeave={handlePressEnd}
                      onTouchStart={(e) => handleThreadPressStart(thread.id, thread.participantName, e)}
                      onTouchEnd={handlePressEnd}
                      className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition-colors cursor-pointer select-none relative ${
                        isSelected ? 'bg-white border border-slate-200/80 shadow-xs' : 'hover:bg-slate-100 border border-transparent'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-full overflow-hidden flex items-center justify-center font-bold text-xs shrink-0 ${thread.avatarColor}`}>
                        {thread.avatarUrl ? (
                          <img src={thread.avatarUrl} alt={thread.participantName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          initials
                        )}
                      </div>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex justify-between items-baseline">
                          <span className="font-bold text-xs text-slate-800 truncate block">
                            {thread.participantName}
                          </span>
                          {thread.unread && (
                            <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate font-medium">
                          {thread.lastMessage}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-2 p-1">
              {friendRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center p-4">
                  <Bell className="w-8 h-8 text-slate-200 mb-2" />
                  <p className="text-[10px] text-slate-400 font-medium">No pending friend requests</p>
                </div>
              ) : (
                friendRequests.map((req) => (
                  <div key={req.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${req.avatarColor} text-white`}>
                        {req.avatarUrl ? (
                          <img src={req.avatarUrl} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          req.senderName[0].toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-slate-800 truncate">{req.senderName}</p>
                        <p className="text-[9px] text-slate-400">{req.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onAcceptRequest(req.id)}
                        className="flex-1 py-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => onRejectRequest(req.id)}
                        className="flex-1 py-1.5 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="space-y-1">
              {contacts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center p-4">
                  <Users className="w-8 h-8 text-slate-200 mb-2" />
                  <p className="text-[10px] text-slate-400 font-medium">No friends in your list yet</p>
                </div>
              ) : (
                contacts.map((contact) => (
                  <button 
                    key={contact.id} 
                    onClick={() => {
                      onStartConversation(contact);
                      setActiveTab('chats');
                    }}
                    className="w-full p-3 flex items-center gap-3 rounded-xl hover:bg-slate-50 transition-colors group relative text-left"
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${contact.avatarColor} text-white relative`}>
                      {contact.avatarUrl ? (
                        <img src={contact.avatarUrl} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        contact.name[0].toUpperCase()
                      )}
                      <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full ${contact.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{contact.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {contact.status === 'online' ? 'Online' : contact.lastSeen ? `Last seen ${contact.lastSeen}` : 'Offline'}
                      </p>
                    </div>
                    <div className="p-2 rounded-full text-indigo-600 opacity-0 group-hover:opacity-100 bg-indigo-50/0 group-hover:bg-indigo-50 transition-all">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Dialogue Window */}
      {activeThread ? (
        <div className={`flex-1 flex flex-col h-full bg-white min-w-0 ${showProfilePanel ? 'hidden lg:flex' : 'flex'}`}>
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
            <div className="flex items-center gap-3 cursor-pointer overflow-hidden" onClick={() => setShowProfilePanel(!showProfilePanel)}>
              {onBack && (
                <button onClick={(e) => { e.stopPropagation(); onBack(); }} className="md:hidden p-1.5 -ml-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer" title="Go back">
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div className={`w-9 h-9 rounded-full overflow-hidden flex items-center justify-center font-bold text-xs shrink-0 ${activeThread.avatarColor}`}>
                {activeThread.avatarUrl ? (
                  <img src={activeThread.avatarUrl} alt={activeThread.participantName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  activeThread.participantName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                )}
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-slate-900 text-xs truncate">{activeThread.participantName}</h4>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-slate-400 font-medium truncate">Online &bull; Verified Recruiter</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setShowProfilePanel(!showProfilePanel)}
                className={`p-2 rounded-full transition-colors ${showProfilePanel ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                title="Toggle Profile Info"
              >
                <User className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Viewport Wrapper */}
          <div className="flex-1 min-h-0 relative flex flex-col">
            <div 
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/20"
            >
              {activeThread.messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <p className="text-xs text-slate-400 font-medium">No messages in this chat yet. Start the conversation!</p>
                </div>
              ) : (
                activeThread.messages.map((msg, idx) => {
                  const isMe = msg.sender === 'me';
                  const prevMsg = idx > 0 ? activeThread.messages[idx - 1] : null;
                  
                  // Simple date check (assuming timestamp contains date info or is consistent)
                  // For a real app, we'd parse the date. Here we'll just check if it's a new day if the timestamp was ISO.
                  // Since these are mock strings, I'll just show the date if it's the first message or if we want to simulate a date change.
                  const showDate = !prevMsg || (idx === 0); 
                  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

                  return (
                    <React.Fragment key={msg.id}>
                      {showDate && (
                        <div className="flex justify-center my-6">
                          <span className="px-3 py-1 bg-slate-200/50 text-[9px] font-bold text-slate-500 rounded-full uppercase tracking-widest">
                            {currentDate}
                          </span>
                        </div>
                      )}
                      <div className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`}>
                        {/* Avatar */}
                        <div 
                          className="shrink-0 mb-1 cursor-pointer hover:scale-110 transition-transform"
                          onClick={() => {
                            if (isMe) {
                              setFullscreenProfile({
                                name: "Current User", 
                                avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
                                avatarColor: "bg-indigo-600",
                                bio: "Professional freelance developer specializing in React and responsive CSS layouts.",
                                skills: ['React', 'TypeScript', 'Tailwind CSS']
                              });
                            } else {
                              setFullscreenProfile({
                                name: activeThread.participantName,
                                avatarUrl: activeThread.avatarUrl,
                                avatarColor: activeThread.avatarColor,
                                bio: `Official recruitment partner for the ${activeThread.participantName.split(' ')[0]} network.`,
                                skills: ['Hiring', 'Support', 'Verification']
                              });
                            }
                          }}
                        >
                          <img 
                            src={isMe 
                              ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80" 
                              : (activeThread.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeThread.participantName)}&background=random`)} 
                            alt="Avatar" 
                            className="w-6 h-6 rounded-full object-cover border border-slate-100 shadow-sm bg-slate-100"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        
                        <div 
                          onDoubleClick={(e) => handleMessageDoubleClick(e, msg.id)}
                          onMouseDown={(e) => handlePressStart(msg.id, msg.text, isMe, e)}
                          onMouseUp={handlePressEnd}
                          onMouseLeave={handlePressEnd}
                          onTouchStart={(e) => handlePressStart(msg.id, msg.text, isMe, e)}
                          onTouchEnd={handlePressEnd}
                          className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-xs shadow-xs space-y-2 relative group cursor-pointer select-none transition-transform active:scale-[0.98] ${
                          isMe 
                            ? 'bg-indigo-600 text-white rounded-br-none' 
                            : 'bg-white border border-slate-100 text-slate-800 rounded-bl-none'
                        }`}>
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className={`grid gap-2 ${msg.attachments.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                              {msg.attachments.map((att, idx) => (
                                <div key={idx} className="relative w-full overflow-hidden rounded-lg bg-black/5">
                                  {att.type === 'image' ? (
                                    <img 
                                      src={att.url} 
                                      alt="Attachment" 
                                      className="w-full h-auto object-cover max-h-48 cursor-pointer hover:opacity-90 transition-opacity" 
                                      referrerPolicy="no-referrer"
                                      onClick={() => setFullscreenMedia(att)}
                                    />
                                  ) : (
                                    <video 
                                      src={att.url} 
                                      className="w-full h-auto max-h-48 cursor-pointer"
                                      onClick={() => setFullscreenMedia(att)}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          {editingMessageId === msg.id ? (
                            <div className="space-y-2">
                              <textarea
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className={`w-full p-2 text-xs rounded-md border focus:outline-hidden ${isMe ? 'bg-indigo-700 border-indigo-500 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                                autoFocus
                                rows={3}
                              />
                              <div className="flex justify-end gap-2">
                                <button onClick={() => setEditingMessageId(null)} className="px-2 py-1 rounded bg-black/10 hover:bg-black/20 text-[10px] font-bold">Cancel</button>
                                <button onClick={() => submitEdit()} className={`px-2 py-1 rounded text-[10px] font-bold ${isMe ? 'bg-white text-indigo-600' : 'bg-indigo-600 text-white'}`}>Save</button>
                              </div>
                            </div>
                          ) : (
                            msg.text && (
                              <p className="leading-relaxed whitespace-pre-wrap font-medium break-words">{msg.text}</p>
                            )
                          )}
                          <div className={`flex items-center justify-end gap-1 text-[9px] font-mono ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                            <span>{msg.timestamp}</span>
                            {isMe && <CheckCheck className="w-3 h-3" />}
                          </div>

                          {/* Reactions Display */}
                          {msg.reactions && msg.reactions.length > 0 && (
                            <div className={`absolute -bottom-2 ${isMe ? 'right-2' : 'left-2'} flex flex-wrap gap-1`}>
                              {Array.from(new Set(msg.reactions)).map((emoji, i) => (
                                <div key={i} className="bg-white border border-slate-100 rounded-full px-1.5 py-0.5 shadow-xs text-[10px] flex items-center gap-0.5 animate-in zoom-in duration-200">
                                  <span>{emoji}</span>
                                  <span className="text-[8px] text-slate-400 font-bold">
                                    {msg.reactions?.filter(r => r === emoji).length}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Fixed Scroll Buttons */}
            {showScrollTop && (
              <button 
                onClick={scrollToTop}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white shadow-lg border border-slate-100 text-indigo-600 hover:text-indigo-700 transition-all animate-bounce cursor-pointer"
                title="Scroll to top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            )}
            
            {showScrollBottom && (
              <button 
                onClick={scrollToBottom}
                className="absolute bottom-4 right-4 z-20 p-2 rounded-full bg-white shadow-lg border border-slate-100 text-indigo-600 hover:text-indigo-700 transition-all animate-bounce cursor-pointer"
                title="Scroll to bottom"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Input Chat Bar */}
          <div className="border-t border-slate-100 bg-white">
            {selectedAttachments.length > 0 && (
              <div className="px-4 py-2 flex flex-wrap gap-2 bg-slate-50 border-b border-slate-100 max-h-32 overflow-y-auto">
                {selectedAttachments.map((att, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden bg-white border border-slate-200 group">
                    {att.type === 'image' ? (
                      <img src={att.url} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                        <video src={att.url} className="w-full h-full object-cover opacity-50" />
                        <span className="absolute text-[8px] text-white font-bold uppercase">Video</span>
                      </div>
                    )}
                    <button 
                      onClick={() => removeAttachment(idx)}
                      className="absolute top-0.5 right-0.5 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-2 h-2" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <form onSubmit={handleSend} className="p-3 flex items-center gap-2 shrink-0">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                multiple 
                accept="image/*,video/*" 
                className="hidden" 
              />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer"
                title="Add attachment"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                type="text"
                placeholder={`Write message to ${activeThread.participantName}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-2 text-xs border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-300 text-slate-800 font-medium bg-slate-50/50"
              />
              <button 
                type="button" 
                className="p-2 rounded text-slate-900 hover:text-black hover:bg-slate-50 cursor-pointer"
                title="Emojis"
              >
                <Smile className="w-4 h-4" />
              </button>
              <button
                type="submit"
                className="p-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer shadow-xs"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3 bg-white">
          <p className="text-sm text-slate-400 font-medium">Please select a thread to start chatting.</p>
        </div>
      )}

      {/* Participant Profile Panel */}
      {activeThread && showProfilePanel && (
        <div className="w-full md:w-80 lg:w-96 shrink-0 border-l border-slate-100 bg-white h-full overflow-y-auto flex flex-col animate-in slide-in-from-right duration-300 z-30">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
            <h4 className="font-bold text-slate-900 text-xs">Contact Info</h4>
            <button 
              onClick={() => setShowProfilePanel(false)}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-900 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-6 flex flex-col items-center text-center space-y-4">
            <div className={`w-24 h-24 rounded-full overflow-hidden flex items-center justify-center font-bold text-2xl shadow-md ${activeThread.avatarColor}`}>
              {activeThread.avatarUrl ? (
                <img src={activeThread.avatarUrl} alt={activeThread.participantName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                activeThread.participantName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
              )}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{activeThread.participantName}</h3>
              <p className="text-xs text-slate-500 font-medium">Verified Client • Joined 2024</p>
            </div>
            
            <div className="w-full pt-4 space-y-4">
              <div className="text-left space-y-2">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">About</h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Representing the official support and recruitment channel for {activeThread.participantName.split(' ')[0]}. We handle all legal translations and development inquiries for the group.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Rating</p>
                  <p className="text-sm font-bold text-indigo-600">4.9 / 5.0</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Hired</p>
                  <p className="text-sm font-bold text-indigo-600">124 GiGs</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <button 
                  onClick={() => onAddFriend(activeThread.participantName, activeThread.avatarColor)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xs hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  Add as Friend
                </button>
                <button 
                  onClick={() => setFullscreenProfile({ 
                    name: activeThread.participantName, 
                    avatarUrl: activeThread.avatarUrl, 
                    avatarColor: activeThread.avatarColor,
                    bio: `Official recruitment partner for the ${activeThread.participantName.split(' ')[0]} network. We handle all legal translations and development inquiries.`,
                    skills: ['Hiring', 'Support', 'Verification', 'Translation']
                  })}
                  className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
                >
                  View Public Profile
                </button>
                <button className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer">
                  Report Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Profile Modal */}
      {fullscreenProfile && (
        <div 
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-white animate-in slide-in-from-bottom duration-500"
          onClick={() => setFullscreenProfile(null)}
        >
          <button 
            onClick={() => setFullscreenProfile(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="w-full max-w-2xl px-6 flex flex-col items-center text-center space-y-8" onClick={e => e.stopPropagation()}>
            <div className={`w-48 h-48 sm:w-64 sm:h-64 rounded-3xl overflow-hidden flex items-center justify-center font-bold text-6xl shadow-2xl ${fullscreenProfile.avatarColor}`}>
              {fullscreenProfile.avatarUrl ? (
                <img src={fullscreenProfile.avatarUrl} alt={fullscreenProfile.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                fullscreenProfile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
              )}
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">{fullscreenProfile.name}</h2>
                <p className="text-sm font-bold text-indigo-600 uppercase tracking-[0.2em]">Verified Senior Recruiter</p>
              </div>

              {fullscreenProfile.bio && (
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  {fullscreenProfile.bio}
                </p>
              )}

              {fullscreenProfile.skills && (
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {fullscreenProfile.skills.map((skill, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md border border-slate-200">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="flex flex-wrap justify-center gap-3 pt-4">
                <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100">Identity Verified</span>
                <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">Premium Member</span>
                <span className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 text-xs font-bold border border-amber-100">4.9 Star Rating</span>
              </div>

              <div className="pt-8 grid grid-cols-3 gap-8 border-t border-slate-100 mt-8">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Hires</p>
                  <p className="text-xl font-black text-slate-900">842</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Response</p>
                  <p className="text-xl font-black text-slate-900">&lt; 1 hr</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Success</p>
                  <p className="text-xl font-black text-slate-900">98%</p>
                </div>
              </div>
            </div>
            
            <div className="w-full pt-12">
              <button 
                onClick={() => setFullscreenProfile(null)}
                className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all cursor-pointer shadow-lg"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Media Modal */}
      {fullscreenMedia && (
        <div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 animate-in fade-in duration-300"
          onClick={() => setFullscreenMedia(null)}
        >
          <button 
            onClick={() => setFullscreenMedia(null)}
            className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="w-full max-w-5xl h-full flex items-center justify-center p-4">
            {fullscreenMedia.type === 'image' ? (
              <img 
                src={fullscreenMedia.url} 
                alt="Fullscreen" 
                className="max-w-full max-h-full object-contain shadow-2xl rounded-sm" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <video 
                src={fullscreenMedia.url} 
                controls 
                autoPlay
                className="max-w-full max-h-full shadow-2xl rounded-sm" 
              />
            )}
          </div>
        </div>
      )}

      {/* Emoji Picker Modal */}
      {emojiPickerTarget && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
          onClick={() => setEmojiPickerTarget(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-[280px] overflow-hidden border border-slate-100 animate-in zoom-in duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-3 border-b border-slate-100 flex items-center justify-between">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Reactions</h5>
              <button onClick={() => setEmojiPickerTarget(null)}><X className="w-3 h-3 text-slate-900" /></button>
            </div>
            <div className="max-h-60 overflow-y-auto p-2 space-y-4">
              {emojiCategories.map((cat, i) => (
                <div key={i} className="space-y-1.5">
                  <p className="text-[9px] font-bold text-slate-400 ml-1">{cat.name}</p>
                  <div className="grid grid-cols-4 gap-1">
                    {cat.emojis.map((emoji, j) => (
                      <button
                        key={j}
                        onClick={() => handleAddReaction(emoji)}
                        className="p-2 text-xl hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer active:scale-90"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Message Context Menu */}
      {messageMenuTarget && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
          onClick={() => setMessageMenuTarget(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-[200px] overflow-hidden border border-slate-100 animate-in zoom-in duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-2 space-y-1">
              {messageMenuTarget.isMe && (
                <button
                  onClick={handleEditInit}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Edit className="w-4 h-4 text-indigo-600" />
                  Edit Message
                </button>
              )}
              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Delete Message
              </button>
              <button
                onClick={() => setMessageMenuTarget(null)}
                className="w-full flex items-center justify-center p-2.5 text-[10px] font-bold text-slate-900 hover:text-black transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Thread Context Menu */}
      {threadMenuTarget && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
          onClick={() => setThreadMenuTarget(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-[240px] overflow-hidden border border-slate-100 animate-in zoom-in duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-50">
              <h5 className="text-xs font-bold text-slate-900 truncate">{threadMenuTarget.name}</h5>
              <p className="text-[10px] text-slate-400 font-medium">Manage conversation</p>
            </div>
            <div className="p-2 space-y-1">
              <button
                onClick={handleThreadDelete}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Delete Conversation
              </button>
              <button
                onClick={() => setThreadMenuTarget(null)}
                className="w-full flex items-center justify-center p-2.5 text-[10px] font-bold text-slate-900 hover:text-black transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
