
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Member, Idea, IdeaCategory, IdeaStatus, BranchName, Screen, SystemNotification, IdeaComment } from '../types';

interface ActivityScreenProps {
  onBack: () => void;
  currentUser: Member | null;
  onSendNotification: (notif: Omit<SystemNotification, 'id' | 'timestamp' | 'isRead'>) => void;
  initialId: string | null;
}

const ActivityScreen: React.FC<ActivityScreenProps> = ({ onBack, currentUser, onSendNotification, initialId }) => {
  const [activeTab, setActiveTab] = useState<'explore' | 'my'>('explore');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [viewingIdea, setViewingIdea] = useState<Idea | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('Tất cả');
  
  // Quản lý trạng thái Admin phê duyệt
  const [adminAction, setAdminAction] = useState<'review' | 'implement' | 'complete' | null>(null);
  const [adminPoints, setAdminPoints] = useState<number>(0);
  const [adminReason, setAdminReason] = useState('');

  const [ideas, setIdeas] = useState<Idea[]>(() => {
    const saved = localStorage.getItem('ivac_ideas');
    if (saved) return JSON.parse(saved);
    return [];
  });

  useEffect(() => {
    const now = new Date().getTime();
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
    const validIdeas = ideas.filter(idea => {
      if ((idea.status === 'rejected_review' || idea.status === 'rejected_impl') && idea.rejectedAt) {
        const rejectedTime = new Date(idea.rejectedAt).getTime();
        return (now - rejectedTime) < oneWeekMs;
      }
      return true;
    });
    if (validIdeas.length !== ideas.length) {
      setIdeas(validIdeas);
    }
    localStorage.setItem('ivac_ideas', JSON.stringify(validIdeas));
  }, [ideas]);

  useEffect(() => {
    if (initialId) {
      const target = ideas.find(i => i.id === initialId);
      if (target) {
        setViewingIdea(target);
        if (target.authorId === currentUser?.id) setActiveTab('my');
      }
    }
  }, [initialId, ideas, currentUser]);

  const isAdmin = currentUser?.role === 'admin' || currentUser?.position.includes('Bí thư');

  const [formData, setFormData] = useState<Partial<Idea>>({
    title: '',
    content: '',
    category: 'Số hoá',
    branch: 'Đoàn cơ sở',
    attachmentUrl: ''
  });

  const availableYears = useMemo(() => {
    const years = new Set<string>();
    ideas.forEach(i => years.add(new Date(i.date).getFullYear().toString()));
    return ['Tất cả', ...Array.from(years).sort((a, b) => b.localeCompare(a))];
  }, [ideas]);

  const processedIdeas = useMemo(() => {
    let list = [...ideas];
    
    // 1. Lọc theo Tab
    if (activeTab === 'explore') {
      list = list.filter(i => ['reviewing', 'implementing', 'completed'].includes(i.status));
      if (isAdmin) {
        const pendings = ideas.filter(i => i.status === 'pending');
        list = [...new Set([...list, ...pendings])];
      }
    } else {
      list = list.filter(i => i.authorId === currentUser?.id);
    }

    // 2. Lọc theo Năm
    if (selectedYear !== 'Tất cả') {
      list = list.filter(i => new Date(i.date).getFullYear().toString() === selectedYear);
    }

    // 3. Lọc theo Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(i => i.title.toLowerCase().includes(q) || i.content.toLowerCase().includes(q) || i.authorName.toLowerCase().includes(q));
    }

    // 4. Sáng kiến Nổi bật
    const completedIdeas = list.filter(i => i.status === 'completed');
    let featuredId: string | null = null;
    if (completedIdeas.length > 0) {
      const sortedByInteraction = [...completedIdeas].sort((a, b) => {
        const scoreA = (a.likes?.length || 0) + (a.comments?.length || 0);
        const scoreB = (b.likes?.length || 0) + (b.comments?.length || 0);
        return scoreB - scoreA;
      });
      featuredId = sortedByInteraction[0].id;
    }

    // 5. Sáng kiến Mới nhất
    const newestId = list.length > 0 ? [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].id : null;

    // 6. Sắp xếp
    return list.sort((a, b) => {
      if (a.id === featuredId) return -1;
      if (b.id === featuredId) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }).map(idea => ({
      ...idea,
      isFeatured: idea.id === featuredId,
      isNew: idea.id === newestId && idea.id !== featuredId
    }));
  }, [ideas, activeTab, currentUser, searchQuery, isAdmin, selectedYear]);

  const handleSubmit = () => {
    if (!formData.title || !formData.content || !formData.branch) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }
    const newIdea: Idea = {
      id: Date.now().toString(),
      title: formData.title,
      content: formData.content,
      category: (formData.category as IdeaCategory) || 'Số hoá',
      branch: (formData.branch as BranchName) || 'Đoàn cơ sở',
      attachmentUrl: formData.attachmentUrl,
      authorId: currentUser?.id || 'unknown',
      authorName: currentUser?.name || 'Đoàn viên',
      status: 'pending',
      points: 0,
      likes: [],
      comments: [],
      date: new Date().toISOString()
    };

    setIdeas(prev => [newIdea, ...prev]);
    setIsModalOpen(false);
    setFormData({ title: '', content: '', category: 'Số hoá', branch: 'Đoàn cơ sở', attachmentUrl: '' });
    
    onSendNotification({
      targetMemberId: 'admin_1',
      senderName: currentUser?.name || 'Hệ thống',
      title: 'Sáng kiến mới cần thẩm định',
      message: `Đồng chí ${currentUser?.name} vừa gửi sáng kiến mới: "${newIdea.title}".`,
      type: 'reminder',
      metadata: { screen: Screen.ACTIVITY, targetId: newIdea.id }
    });
    alert("Gửi sáng kiến thành công! Hệ thống đang chờ Admin thẩm định.");
  };

  const handleAdminApproval = (id: string, action: 'approve' | 'reject') => {
    const target = ideas.find(i => i.id === id);
    if (!target) return;

    let newStatus: IdeaStatus = target.status;
    let notifTitle = '';
    let notifMsg = '';

    if (adminAction === 'review') {
      if (action === 'approve') {
        newStatus = 'reviewing';
        notifTitle = 'Sáng kiến đã được xác nhận thẩm định';
        notifMsg = `Sáng kiến "${target.title}" đã chuyển sang trạng thái "Đang Thẩm định" và hiển thị công khai.`;
      } else {
        newStatus = 'rejected_review';
        notifTitle = 'Sáng kiến bị từ chối thẩm định';
        notifMsg = `Rất tiếc, sáng kiến "${target.title}" bị từ chối thẩm định. Lý do: ${adminReason}`;
      }
    } else if (adminAction === 'implement') {
      if (action === 'approve') {
        newStatus = 'implementing';
        notifTitle = 'Chúc mừng bạn! Sáng kiến đã được duyệt';
        notifMsg = `Sáng kiến "${target.title}" đã được duyệt triển khai. Vui lòng xem lộ trình chi tiết.`;
      } else {
        newStatus = 'rejected_impl';
        notifTitle = 'Từ chối triển khai sáng kiến';
        notifMsg = `Sáng kiến "${target.title}" không được duyệt triển khai. Lý do: ${adminReason}`;
      }
    } else if (adminAction === 'complete') {
      newStatus = 'completed';
      notifTitle = 'Sáng kiến đã được áp dụng thành công';
      notifMsg = `Tuyệt vời! Sáng kiến "${target.title}" đã được áp dụng. Bạn nhận được ${adminPoints} điểm rèn luyện.`;
    }

    const updatedIdeas = ideas.map(i => i.id === id ? {
      ...i,
      status: newStatus,
      points: adminPoints || i.points,
      reason: action === 'reject' ? adminReason : '',
      rejectedAt: action === 'reject' ? new Date().toISOString() : undefined
    } : i);

    setIdeas(updatedIdeas);
    const refreshedIdea = updatedIdeas.find(i => i.id === id) || null;
    setViewingIdea(refreshedIdea);
    setIsAdminPanelOpen(false);
    setAdminAction(null);
    setAdminReason('');

    onSendNotification({
      targetMemberId: target.authorId,
      senderName: currentUser?.name || 'Admin',
      title: notifTitle,
      message: notifMsg,
      type: action === 'approve' ? 'encouragement' : 'warning',
      metadata: { screen: Screen.ACTIVITY, targetId: id }
    });
    
    alert(action === 'approve' ? "Thao tác phê duyệt thành công!" : "Đã từ chối sáng kiến.");
  };

  const handleLike = (id: string) => {
    if (!currentUser) return;
    setIdeas(prev => prev.map(i => {
      if (i.id === id) {
        const isLiked = i.likes.includes(currentUser.id);
        const updated = {
          ...i,
          likes: isLiked ? i.likes.filter(uid => uid !== currentUser.id) : [...i.likes, currentUser.id]
        };
        if (viewingIdea?.id === id) setViewingIdea(updated);
        
        // Phản hồi trực tiếp cho thao tác Like
        alert(isLiked ? "Đã bỏ thích sáng kiến." : "Đã thích sáng kiến thành công!");
        
        return updated;
      }
      return i;
    }));
  };

  const handleAddComment = (id: string) => {
    if (!currentUser || !commentInput.trim()) return;
    const newComment: IdeaComment = {
      id: Date.now().toString(),
      memberId: currentUser.id,
      memberName: currentUser.name,
      content: commentInput,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setIdeas(prev => prev.map(i => {
      if (i.id === id) {
        const updated = { ...i, comments: [...(i.comments || []), newComment] };
        if (viewingIdea?.id === id) setViewingIdea(updated);
        return updated;
      }
      return i;
    }));
    setCommentInput('');
    alert("Đã gửi bình luận thành công!");
  };

  const getStatusInfo = (status: IdeaStatus) => {
    switch (status) {
      case 'pending': return { label: 'Gửi đi', color: 'text-gray-400', bg: 'bg-gray-400/10', icon: 'send' };
      case 'reviewing': return { label: 'Đang Thẩm định', color: 'text-blue-500', bg: 'bg-blue-500/10', icon: 'visibility' };
      case 'rejected_review': return { label: 'Từ chối Thẩm định', color: 'text-red-500', bg: 'bg-red-500/10', icon: 'cancel' };
      case 'implementing': return { label: 'Đang triển khai', color: 'text-amber-500', bg: 'bg-amber-500/10', icon: 'potted_plant' };
      case 'rejected_impl': return { label: 'Từ chối duyệt', color: 'text-rose-500', bg: 'bg-rose-500/10', icon: 'close' };
      case 'completed': return { label: 'Đã áp dụng', color: 'text-primary', bg: 'bg-primary/10', icon: 'verified' };
    }
  };

  return (
    <div className="flex flex-col pb-32 min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
      <header className="sticky top-0 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-6 py-5 flex items-center justify-between border-b border-gray-200 dark:border-white/5">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-800 dark:text-white transition-all">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
           <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Cổng Sáng kiến</h2>
           <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em] mt-1">IVAC DIGITAL INNOVATION</span>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="size-10 flex items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined font-black">add</span>
        </button>
      </header>

      <main className="p-6 space-y-6">
        {/* Banner */}
        <div className="bg-primary rounded-[2.5rem] p-8 text-white shadow-2xl shadow-primary/30 relative overflow-hidden group">
           <div className="absolute -right-4 -top-4 size-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
           <div className="relative z-10 space-y-2">
              <h3 className="text-xl font-black leading-tight">Gửi sáng kiến,<br/>Nhận điểm rèn luyện</h3>
              <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest leading-relaxed italic">
                Đồng chí hãy gửi sáng kiến để đóng góp<br/>vào sự phát triển chung của IVAC.
              </p>
           </div>
        </div>

        {/* Tabs & Filter Bar */}
        <div className="space-y-4">
           <div className="flex p-1.5 bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
              <button 
                onClick={() => setActiveTab('explore')}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'explore' ? 'bg-primary text-white shadow-lg' : 'text-gray-500'}`}
              >
                Khám phá
              </button>
              <button 
                onClick={() => setActiveTab('my')}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'my' ? 'bg-primary text-white shadow-lg' : 'text-gray-500'}`}
              >
                Của tôi
              </button>
           </div>

           <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary">search</span>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 rounded-2xl pl-12 pr-6 py-4 text-xs text-gray-900 dark:text-white outline-none focus:ring-2 ring-primary/20 shadow-sm"
                  placeholder="Tìm tên sáng kiến, tác giả..."
                />
              </div>
              <div className="relative w-32">
                <select 
                  value={selectedYear}
                  onChange={e => setSelectedYear(e.target.value)}
                  className="w-full h-full bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 rounded-2xl px-4 text-[10px] font-black uppercase text-gray-800 dark:text-white outline-none focus:ring-2 ring-primary/20 shadow-sm appearance-none"
                >
                  {availableYears.map(y => <option key={y} value={y}>{y === 'Tất cả' ? 'NĂM: ALL' : `NĂM: ${y}`}</option>)}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 pointer-events-none text-sm">expand_more</span>
              </div>
           </div>
        </div>

        {/* Ideas List */}
        <div className="space-y-4">
           {processedIdeas.map((idea) => {
             const status = getStatusInfo(idea.status);
             const isLiked = currentUser ? idea.likes.includes(currentUser.id) : false;
             
             return (
               <div key={idea.id} className={`bg-white dark:bg-surface-dark rounded-[2.5rem] border shadow-xl p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 relative overflow-hidden transition-all ${idea.isFeatured ? 'border-yellow-400/50 ring-2 ring-yellow-400/5' : 'border-gray-100 dark:border-white/5'}`}>
                  
                  {/* Badges Right Corner */}
                  <div className="absolute top-4 right-6 flex flex-col items-end gap-1.5 z-10">
                    {idea.isFeatured && (
                      <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-[8px] font-black px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse uppercase tracking-widest">
                        <span className="material-symbols-outlined text-[10px] material-symbols-fill">star</span>
                        Nổi bật
                      </div>
                    )}
                    {idea.isNew && (
                      <div className="bg-emerald-500 text-white text-[8px] font-black px-2.5 py-1 rounded-full shadow-lg uppercase tracking-widest">
                        Mới
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-start pr-16">
                     <div className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${status.bg} ${status.color} flex items-center gap-1.5`}>
                        <span className="material-symbols-outlined text-[12px]">{status.icon}</span>
                        {status.label}
                     </div>
                  </div>

                  <div className="space-y-1">
                     <h4 className="text-sm font-black text-gray-900 dark:text-white leading-tight pr-10">{idea.title}</h4>
                     <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{idea.category} • {idea.branch}</p>
                     <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 mt-2">"{idea.content}"</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-white/5">
                     <div className="flex items-center gap-3 min-w-0">
                        <div className="size-8 rounded-xl bg-gray-100 dark:bg-background-dark flex items-center justify-center text-primary font-black text-[10px] shrink-0 border border-gray-200 dark:border-white/5">
                           {idea.authorName.split(' ').pop()?.charAt(0)}
                        </div>
                        <div className="flex flex-col min-w-0">
                           <span className="text-[10px] font-black text-gray-900 dark:text-white leading-none truncate">{idea.authorName}</span>
                           <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mt-1 truncate">{new Date(idea.date).toLocaleDateString('vi-VN')}</span>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleLike(idea.id)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all ${isLiked ? 'bg-primary border-primary text-white shadow-lg' : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 text-gray-400'}`}
                        >
                           <span className={`material-symbols-outlined text-sm ${isLiked ? 'material-symbols-fill' : ''}`}>favorite</span>
                           <span className="text-[10px] font-black">{idea.likes.length}</span>
                        </button>
                        <button onClick={() => setViewingIdea(idea)} className="size-9 bg-primary/10 text-primary rounded-xl flex items-center justify-center border border-primary/20">
                           <span className="material-symbols-outlined text-sm">visibility</span>
                        </button>
                     </div>
                  </div>
               </div>
             );
           })}

           {processedIdeas.length === 0 && (
             <div className="py-20 text-center flex flex-col items-center gap-4 opacity-30">
                <span className="material-symbols-outlined text-6xl">lightbulb</span>
                <p className="text-[10px] font-black uppercase tracking-widest">Chưa có sáng kiến nào phù hợp</p>
             </div>
           )}
        </div>
      </main>

      {/* MODAL: ADD NEW IDEA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
           <div className="bg-surface-dark w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
              <header className="p-8 bg-primary text-white flex justify-between items-center shrink-0">
                 <h2 className="text-xl font-black uppercase tracking-tight">Đề xuất Sáng kiến</h2>
                 <button onClick={() => setIsModalOpen(false)} className="size-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all active:scale-90"><span className="material-symbols-outlined">close</span></button>
              </header>
              
              <div className="p-8 space-y-6 overflow-y-auto no-scrollbar flex-1">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Lĩnh vực *</label>
                    <div className="grid grid-cols-2 gap-2">
                       {['Số hoá', 'Kỹ thuật', 'Quy trình', 'Văn hoá đoàn', 'Khác'].map(cat => (
                         <button 
                           key={cat}
                           onClick={() => setFormData({...formData, category: cat as any})}
                           className={`py-3 rounded-2xl text-[10px] font-black uppercase border transition-all ${formData.category === cat ? 'bg-primary border-primary text-white' : 'bg-background-dark border-white/10 text-gray-500'}`}
                         >
                           {cat}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Đơn vị *</label>
                    <select 
                      value={formData.branch} 
                      onChange={e => setFormData({...formData, branch: e.target.value as any})}
                      className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary outline-none text-sm font-bold appearance-none"
                    >
                      {['Đoàn cơ sở', 'Sản Xuất', 'Hậu Cần', 'Chất Lượng', 'Suối Dầu'].map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                 </div>

                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Tiêu đề sáng kiến *</label>
                    <input 
                      value={formData.title} 
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary outline-none text-sm font-bold" 
                      placeholder="VD: Số hóa hồ sơ đoàn viên..." 
                    />
                 </div>

                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Mô tả chi tiết *</label>
                    <textarea 
                      value={formData.content} 
                      onChange={e => setFormData({...formData, content: e.target.value})}
                      className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-5 text-white focus:border-primary outline-none text-xs font-medium min-h-[150px] leading-relaxed shadow-inner" 
                      placeholder="Trình bày vấn đề và giải pháp đề xuất..." 
                    />
                 </div>

                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Tệp đính kèm / Link báo chí</label>
                    <input 
                      value={formData.attachmentUrl} 
                      onChange={e => setFormData({...formData, attachmentUrl: e.target.value})}
                      className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary outline-none text-xs font-bold" 
                      placeholder="Dán link PDF hoặc bài viết tại đây..." 
                    />
                 </div>
              </div>

              <footer className="p-8 bg-background-dark/50 border-t border-white/5 flex gap-4 shrink-0">
                 <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-gray-500 font-black uppercase text-xs tracking-widest">Hủy</button>
                 <button onClick={handleSubmit} className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black uppercase text-xs shadow-xl shadow-primary/30 active:scale-95 transition-all">Gửi sáng kiến</button>
              </footer>
           </div>
        </div>
      )}

      {/* MODAL: VIEW IDEA DETAILS & COMMENTS */}
      {viewingIdea && (
        <div className="fixed inset-0 z-[110] flex flex-col bg-background-light dark:bg-background-dark animate-in slide-in-from-bottom duration-300">
           <header className="p-6 border-b border-gray-200 dark:border-white/5 flex items-center justify-between sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10">
              <button onClick={() => setViewingIdea(null)} className="size-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-white transition-all active:scale-90"><span className="material-symbols-outlined">close</span></button>
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">Chi tiết Sáng kiến</h2>
              <div className="size-10"></div>
           </header>
           
           <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar pb-32">
              <div className="space-y-4">
                 <div className="flex justify-between items-start">
                    <div className="space-y-1">
                       <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${getStatusInfo(viewingIdea.status).bg} ${getStatusInfo(viewingIdea.status).color}`}>
                          {getStatusInfo(viewingIdea.status).label}
                       </span>
                       <h1 className="text-2xl font-black text-gray-900 dark:text-white leading-tight mt-2">{viewingIdea.title}</h1>
                    </div>
                    {viewingIdea.status === 'completed' && (
                       <div className="bg-primary/10 p-3 rounded-2xl border border-primary/20 text-center">
                          <p className="text-[8px] font-black text-primary uppercase">Điểm thưởng</p>
                          <p className="text-xl font-black text-primary">+{viewingIdea.points}</p>
                       </div>
                    )}
                 </div>

                 <div className="flex items-center gap-4 py-4 border-y border-gray-100 dark:border-white/5">
                    <div className="size-10 rounded-xl bg-primary text-white flex items-center justify-center font-black">
                       {viewingIdea.authorName.charAt(0)}
                    </div>
                    <div>
                       <p className="text-xs font-black text-gray-900 dark:text-white">{viewingIdea.authorName}</p>
                       <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{viewingIdea.branch} • {new Date(viewingIdea.date).toLocaleDateString('vi-VN')}</p>
                    </div>
                 </div>

                 <div className="bg-gray-50 dark:bg-surface-dark p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/5">
                    <h3 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">Mô tả sáng kiến</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic whitespace-pre-wrap">"{viewingIdea.content}"</p>
                 </div>

                 {viewingIdea.attachmentUrl && (
                    <div className="space-y-2">
                       <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Tài liệu tham khảo</h3>
                       <a href={viewingIdea.attachmentUrl} target="_blank" className="w-full flex items-center justify-between p-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl group hover:border-primary">
                          <div className="flex items-center gap-3">
                             <span className="material-symbols-outlined text-primary">link</span>
                             <span className="text-[11px] font-bold text-gray-900 dark:text-white truncate max-w-[200px]">Xem tệp đính kèm / Link bài viết</span>
                          </div>
                          <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">open_in_new</span>
                       </a>
                    </div>
                 )}

                 {(viewingIdea.status === 'rejected_review' || viewingIdea.status === 'rejected_impl') && viewingIdea.reason && (
                    <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-3xl">
                       <p className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">warning</span> Lý do từ chối của Admin
                       </p>
                       <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 italic leading-relaxed">{viewingIdea.reason}</p>
                    </div>
                 )}
              </div>

              {/* KHU VỰC BÌNH LUẬN */}
              <div className="space-y-6 pt-6 border-t border-gray-100 dark:border-white/5">
                 <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                   <span className="material-symbols-outlined text-primary">chat_bubble</span>
                   Bình luận ({viewingIdea.comments?.length || 0})
                 </h3>
                 
                 <div className="space-y-4">
                   {viewingIdea.comments?.map(comment => (
                     <div key={comment.id} className="flex gap-4 animate-in fade-in slide-in-from-left-2 duration-300">
                       <div className="size-9 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center shrink-0 border border-gray-200 dark:border-white/10">
                         <span className="text-primary font-black text-[10px]">{comment.memberName.charAt(0)}</span>
                       </div>
                       <div className="flex-1 space-y-1">
                         <div className="flex items-center justify-between">
                           <span className="text-xs font-black text-gray-900 dark:text-white">{comment.memberName}</span>
                           <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{comment.timestamp}</span>
                         </div>
                         <div className="bg-gray-100 dark:bg-white/5 px-4 py-2.5 rounded-2xl rounded-tl-none border border-gray-200 dark:border-white/5">
                           <p className="text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed">{comment.content}</p>
                         </div>
                       </div>
                     </div>
                   ))}
                   {(viewingIdea.comments?.length || 0) === 0 && (
                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic text-center py-4">Chưa có bình luận nào cho sáng kiến này</p>
                   )}
                 </div>
              </div>
           </div>

           {/* CHÂN TRANG */}
           <div className="fixed bottom-0 left-0 right-0 p-6 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-gray-200 dark:border-white/10 flex flex-col gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] z-20">
              <div className="flex gap-2 bg-white dark:bg-surface-dark p-2 rounded-2xl border border-gray-100 dark:border-white/5 shadow-inner">
                 <input 
                   type="text" 
                   value={commentInput}
                   onChange={e => setCommentInput(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && handleAddComment(viewingIdea.id)}
                   className="flex-1 bg-transparent border-none text-xs font-bold text-gray-900 dark:text-white outline-none focus:ring-0 px-3 py-2"
                   placeholder="Thảo luận về sáng kiến này..."
                 />
                 <button 
                   onClick={() => handleAddComment(viewingIdea.id)}
                   disabled={!commentInput.trim()}
                   className="size-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-all disabled:opacity-50"
                 >
                   <span className="material-symbols-outlined text-lg">send</span>
                 </button>
              </div>

              {isAdmin && (
                <div className="flex gap-2">
                  {viewingIdea.status === 'pending' && (
                    <button 
                      onClick={() => {setAdminAction('review'); setIsAdminPanelOpen(true);}}
                      className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/30"
                    >
                      Bắt đầu Thẩm định
                    </button>
                  )}
                  {viewingIdea.status === 'reviewing' && (
                    <button 
                      onClick={() => {setAdminAction('implement'); setIsAdminPanelOpen(true);}}
                      className="flex-1 py-4 bg-amber-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-amber-500/30"
                    >
                      Xác nhận Triển khai
                    </button>
                  )}
                  {viewingIdea.status === 'implementing' && (
                    <button 
                      onClick={() => {setAdminAction('complete'); setIsAdminPanelOpen(true);}}
                      className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/30"
                    >
                      Chốt Áp dụng & Cộng điểm
                    </button>
                  )}
                </div>
              )}
           </div>
        </div>
      )}

      {/* MODAL: ADMIN ACTION POPUP */}
      {isAdminPanelOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
           <div className="bg-surface-dark w-full max-w-sm rounded-[3.5rem] p-8 border border-white/10 shadow-2xl animate-in zoom-in-95 duration-300 space-y-6">
              <div className="text-center">
                 <h3 className="text-xl font-black text-white uppercase">Phê duyệt sáng kiến</h3>
                 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                    Giai đoạn: {adminAction === 'review' ? 'Thẩm định' : adminAction === 'implement' ? 'Triển khai' : 'Áp dụng'}
                 </p>
              </div>

              {(adminAction === 'complete' || adminAction === 'review') ? (
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Điểm rèn luyện dự kiến *</label>
                   <input 
                     type="number" 
                     value={adminPoints}
                     onChange={e => setAdminPoints(parseInt(e.target.value) || 0)}
                     className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-4 text-white font-black text-xl text-center shadow-inner"
                   />
                </div>
              ) : null}

              {(adminAction !== 'complete') && (
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Ghi chú (Nếu từ chối)</label>
                   <textarea 
                     value={adminReason}
                     onChange={e => setAdminReason(e.target.value)}
                     className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-4 text-white text-xs min-h-[100px] shadow-inner"
                     placeholder="Nhập lý do nếu đồng chí từ chối..."
                   />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                 <button 
                   onClick={() => handleAdminApproval(viewingIdea!.id, 'reject')}
                   className="py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
                 >
                   {adminAction === 'complete' ? 'Huỷ bỏ' : 'Từ chối'}
                 </button>
                 <button 
                   onClick={() => handleAdminApproval(viewingIdea!.id, 'approve')}
                   className="py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/30 active:scale-95 transition-all"
                 >
                   Xác nhận
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ActivityScreen;
