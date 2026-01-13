
import React, { useState, useMemo, useRef } from 'react';
import { Member, NewsItem, NewsComment } from '../types';

interface NewsScreenProps {
  currentUser: Member | null;
  news: NewsItem[];
  setNews: React.Dispatch<React.SetStateAction<NewsItem[]>>;
  onBack: () => void;
}

const NewsScreen: React.FC<NewsScreenProps> = ({ currentUser, news, setNews, onBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingNews, setViewingNews] = useState<NewsItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [commentInput, setCommentInput] = useState('');
  const [activeShareId, setActiveShareId] = useState<string | null>(null);
  
  const imageUploadRef = useRef<HTMLInputElement>(null);
  
  const canManageNews = currentUser?.role === 'admin' || currentUser?.role === 'editor';

  const [formData, setFormData] = useState<Partial<NewsItem>>({
    title: '',
    content: '',
    link: '',
    image: '',
    category: 'Hoạt động'
  });

  const categories = ['Tất cả', 'Hoạt động', 'Thông báo', 'Tin tức', 'Đoàn thể'];

  const newestId = useMemo(() => {
    if (news.length === 0) return null;
    return [...news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].id;
  }, [news]);

  const interactionData = useMemo(() => {
    const scoredNews = news.map(n => ({
      ...n,
      score: n.views + (n.likes?.length || 0) * 2 + (n.comments?.length || 0) * 3
    }));

    const filtered = scoredNews.filter(n => {
      const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Tất cả' || n.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    let featured: any = null;
    if (filtered.length > 0) {
      featured = [...filtered].sort((a, b) => b.score - a.score)[0];
    }

    const list = filtered
      .filter(n => !featured || n.id !== featured.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { featured, list };
  }, [news, searchQuery, selectedCategory]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.title || !formData.content) {
      alert("Đồng chí vui lòng nhập đầy đủ tiêu đề và nội dung.");
      return;
    }
    if (editingId) {
      setNews(prev => prev.map(n => n.id === editingId ? { 
        ...n, 
        ...formData, 
        author: currentUser?.name || n.author 
      } as NewsItem : n));
      alert("Cập nhật bài viết thành công!");
    } else {
      const newItem: NewsItem = {
        id: Date.now().toString(),
        title: formData.title!,
        content: formData.content!,
        image: formData.image || `https://picsum.photos/800/400?random=${Math.floor(Math.random() * 100)}`,
        link: formData.link,
        date: new Date().toISOString(),
        author: currentUser?.name || 'Cán bộ Đoàn',
        category: (formData.category as any) || 'Hoạt động',
        views: 0,
        likes: [],
        comments: []
      };
      setNews(prev => [newItem, ...prev]);
      alert("Đăng tin thành công!");
    }
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ title: '', content: '', link: '', image: '', category: 'Hoạt động' });
  };

  const handleViewDetails = (item: NewsItem) => {
    setNews(prev => prev.map(n => n.id === item.id ? { ...n, views: n.views + 1 } : n));
    setViewingNews({ ...item, views: item.views + 1 });
  };

  const handleLike = (id: string) => {
    if (!currentUser) return;
    setNews(prev => prev.map(n => {
      if (n.id === id) {
        const isLiked = n.likes.includes(currentUser.id);
        const newLikes = isLiked 
          ? n.likes.filter(uid => uid !== currentUser.id)
          : [...n.likes, currentUser.id];
        
        const updatedItem = { ...n, likes: newLikes };
        if (viewingNews?.id === id) setViewingNews(updatedItem);
        
        // Phản hồi thao tác Thích bài viết
        alert(isLiked ? "Đã bỏ thích bài viết." : "Đã thích bài viết thành công!");
        
        return updatedItem;
      }
      return n;
    }));
  };

  const handleShare = async (e: React.MouseEvent, item: NewsItem) => {
    e.stopPropagation();
    e.preventDefault();
    
    setActiveShareId(item.id);
    setTimeout(() => setActiveShareId(null), 1500);

    const shareUrl = `${window.location.origin}${window.location.pathname}?newsId=${item.id}`;
    const shareData = {
      title: item.title,
      text: `[IVAC NEWS] ${item.title}\nXem chi tiết tại hệ thống Đoàn Thanh niên IVAC.`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          await navigator.clipboard.writeText(shareUrl);
          alert('Đã sao chép liên kết vào bộ nhớ tạm.');
        }
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert('Đã sao chép liên kết vào bộ nhớ tạm.');
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation(); 
    if (window.confirm('Đồng chí có chắc chắn muốn xoá vĩnh viễn bài viết này không?')) {
      if (viewingNews?.id === id) setViewingNews(null);
      setNews(currentNews => currentNews.filter(n => n.id !== id));
      alert("Đã xoá bài viết thành công!");
    }
  };

  const handleAddComment = (id: string) => {
    if (!currentUser || !commentInput.trim()) return;
    const newComment: NewsComment = {
      id: Date.now().toString(),
      memberId: currentUser.id,
      memberName: currentUser.name,
      memberAvatar: currentUser.avatar,
      content: commentInput,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
    setNews(prev => prev.map(n => {
      if (n.id === id) {
        const updatedItem = { ...n, comments: [...n.comments, newComment] };
        if (viewingNews?.id === id) setViewingNews(updatedItem);
        return updatedItem;
      }
      return n;
    }));
    setCommentInput('');
    alert("Đã gửi bình luận thành công!");
  };

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'Hoạt động': return 'text-emerald-500';
      case 'Thông báo': return 'text-orange-500';
      case 'Tin tức': return 'text-blue-500';
      case 'Đoàn thể': return 'text-purple-500';
      default: return 'text-primary';
    }
  };

  const renderNewsCard = (item: NewsItem, isFeatured = false) => {
    const isNewest = item.id === newestId;
    const isSharingCurrent = activeShareId === item.id;
    const catColor = getCategoryColor(item.category);

    if (isFeatured) {
      return (
        <div 
          key={item.id}
          onClick={() => handleViewDetails(item)}
          className="bg-white dark:bg-surface-dark rounded-[2.5rem] overflow-hidden border border-primary/20 ring-2 ring-primary/5 shadow-2xl flex flex-col group transition-all cursor-pointer relative"
        >
          <div className="relative h-64">
            <img src={item.image} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" alt="Featured News" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            
            <div className="absolute top-4 left-4">
              <span className="bg-primary/90 backdrop-blur-md text-white text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest">{item.category}</span>
            </div>

            <div className="absolute top-4 right-4 flex gap-2">
              <div className="size-9 rounded-full bg-yellow-400 text-black flex items-center justify-center shadow-lg border-2 border-white/20">
                <span className="material-symbols-outlined material-symbols-fill text-lg">star</span>
              </div>
              {isNewest && (
                <div className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg ring-2 ring-white/20">
                  NEW
                </div>
              )}
            </div>
          </div>

          <div className="p-6 space-y-3">
            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              <span className="material-symbols-outlined text-xs">calendar_today</span>
              {new Date(item.date).toLocaleDateString('vi-VN')}
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{item.content}</p>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
               <span className="text-[10px] font-black text-primary uppercase">Bởi: {item.author}</span>
               <div className="flex gap-2">
                 <button onClick={(e) => handleShare(e, item)} className={`size-9 rounded-xl flex items-center justify-center transition-all ${isSharingCurrent ? 'bg-primary text-white scale-110' : 'bg-primary/10 text-primary'}`}>
                   <span className="material-symbols-outlined text-base">share</span>
                 </button>
                 {canManageNews && (
                   <button onClick={(e) => { e.stopPropagation(); setEditingId(item.id); setFormData(item); setIsModalOpen(true); }} className="size-9 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400">
                     <span className="material-symbols-outlined text-base">edit</span>
                   </button>
                 )}
               </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div 
        key={item.id}
        onClick={() => handleViewDetails(item)}
        className="bg-white dark:bg-surface-dark/60 rounded-[1.8rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-lg p-3 flex gap-4 group transition-all hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer"
      >
        <div className="size-24 sm:size-28 shrink-0 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10">
          <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="News Thumb" />
        </div>
        
        <div className="flex-1 min-w-0 flex flex-col justify-center space-y-1">
          <div className="flex items-center gap-2">
            <span className={`text-[9px] font-black uppercase tracking-widest ${catColor}`}>{item.category}</span>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{new Date(item.date).toLocaleDateString('vi-VN')}</span>
          </div>
          
          <h4 className="text-[13px] font-black text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {item.title}
          </h4>
          
          <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1 opacity-70">
            {item.content}
          </p>

          <div className="flex items-center gap-3 pt-1">
             <span className="flex items-center gap-1 text-[8px] font-black text-gray-400">
               <span className="material-symbols-outlined text-[10px]">thumb_up</span> {item.likes.length}
             </span>
             <span className="flex items-center gap-1 text-[8px] font-black text-gray-400">
               <span className="material-symbols-outlined text-[10px]">chat_bubble</span> {item.comments.length}
             </span>
          </div>
        </div>
        
        {canManageNews && (
          <div className="flex flex-col justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={(e) => { e.stopPropagation(); setEditingId(item.id); setFormData(item); setIsModalOpen(true); }} className="size-8 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
            <button onClick={(e) => handleDelete(e, item.id)} className="size-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
              <span className="material-symbols-outlined text-sm">delete</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col pb-32 min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
      <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-6 py-5 border-b border-gray-200 dark:border-white/5 flex items-center justify-between transition-colors">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-800 dark:text-white transition-all">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-black uppercase tracking-tighter text-gray-900 dark:text-white">Tin tức</h2>
        {canManageNews ? (
          <button 
            onClick={() => { setEditingId(null); setFormData({ title: '', content: '', link: '', image: '', category: 'Hoạt động' }); setIsModalOpen(true); }} 
            className="size-10 flex items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
        ) : <div className="size-10"></div>}
      </header>

      <div className="p-6 space-y-6">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary material-symbols-outlined">search</span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-surface-dark/50 border border-gray-200 dark:border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm text-gray-900 dark:text-white outline-none focus:ring-1 ring-primary/50 shadow-sm transition-colors"
            placeholder="Tìm kiếm tin bài..."
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border transition-all ${selectedCategory === cat ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30' : 'bg-white dark:bg-surface-dark border-gray-100 dark:border-white/5 text-gray-500'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {interactionData.featured && (
            <div className="space-y-4">
              <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-yellow-400 material-symbols-fill">star</span>
                Tiêu điểm quan trọng
              </h3>
              {renderNewsCard(interactionData.featured, true)}
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-2 flex items-center justify-between">
              Mới nhất
              <span className="text-[9px] lowercase font-normal italic opacity-60">Vuốt để xem thêm</span>
            </h3>
            <div className="space-y-3">
              {interactionData.list.map(item => renderNewsCard(item))}
            </div>
          </div>
          
          {interactionData.list.length === 0 && !interactionData.featured && (
            <div className="py-20 text-center space-y-3 opacity-50">
               <span className="material-symbols-outlined text-5xl">newspaper</span>
               <p className="text-xs font-black uppercase tracking-widest">Không có bài viết nào</p>
            </div>
          )}
        </div>
      </div>

      {viewingNews && (
        <div className="fixed inset-0 z-[100] bg-background-light dark:bg-background-dark flex flex-col animate-in fade-in duration-300 overflow-hidden">
          <header className="p-6 bg-background-light/95 dark:bg-background-dark/95 border-b border-gray-200 dark:border-white/5 flex items-center justify-between sticky top-0 z-10 transition-colors">
            <button onClick={() => setViewingNews(null)} className="size-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-white">
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest">Nội dung chi tiết</h3>
            
            <div className="size-10 flex items-center justify-center">
               {viewingNews.id === newestId ? (
                 <div className="bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest shadow-lg">NEW</div>
               ) : (interactionData.featured?.id === viewingNews.id) ? (
                 <div className="text-yellow-400 drop-shadow-md">
                   <span className="material-symbols-outlined material-symbols-fill text-3xl">star</span>
                 </div>
               ) : null}
            </div>
          </header>
          
          <main className="flex-1 overflow-y-auto no-scrollbar pb-40">
            <div className="h-72 relative">
              <img src={viewingNews.image} className="w-full h-full object-cover" alt="Hero" />
              <div className="absolute inset-0 bg-gradient-to-t from-background-light dark:from-background-dark via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                 <span className={`px-3 py-1 bg-white/10 backdrop-blur-md text-[10px] font-black rounded-lg uppercase tracking-widest shadow-lg border border-white/20 ${getCategoryColor(viewingNews.category)}`}>{viewingNews.category}</span>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-tight">{viewingNews.title}</h1>
                <div className="flex items-center gap-4 text-xs font-bold text-gray-500 uppercase">
                  <span>{new Date(viewingNews.date).toLocaleDateString('vi-VN')}</span>
                  <span>•</span>
                  <span>{viewingNews.author}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">visibility</span> {viewingNews.views}</span>
                </div>
              </div>
              
              <div className="flex gap-4 border-y border-gray-100 dark:border-white/5 py-4">
                 <button 
                  onClick={() => handleLike(viewingNews.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-xs uppercase transition-all ${viewingNews.likes.includes(currentUser?.id || '') ? 'bg-primary text-white shadow-lg' : 'bg-gray-100 dark:bg-white/5 text-gray-500'}`}
                 >
                   <span className={`material-symbols-outlined text-lg ${viewingNews.likes.includes(currentUser?.id || '') ? 'material-symbols-fill' : ''}`}>thumb_up</span>
                   {viewingNews.likes.length} Thích
                 </button>
                 
                 <button 
                   onClick={(e) => handleShare(e, viewingNews)} 
                   className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-xs uppercase transition-all shadow-xl active:scale-95 ${activeShareId === viewingNews.id ? 'bg-primary text-white shadow-primary/40' : 'bg-primary/10 text-primary border border-primary/20'}`}
                 >
                   <span className="material-symbols-outlined text-lg">share</span>
                   Chia sẻ
                 </button>
              </div>

              <div className="text-gray-700 dark:text-gray-200 leading-relaxed text-base font-medium whitespace-pre-line bg-gray-50 dark:bg-white/5 p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-inner">
                {viewingNews.content}
                
                {viewingNews.link && (
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
                    <a 
                      href={viewingNews.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between p-5 bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-3xl transition-all group shadow-md"
                    >
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg">
                          <span className="material-symbols-outlined">link</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black text-primary uppercase tracking-widest">Nguồn tin gốc</span>
                           <span className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">Xem bài báo gốc</span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">open_in_new</span>
                    </a>
                  </div>
                )}
              </div>

              <div className="space-y-6 pt-6">
                <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">chat_bubble</span>
                  Bình luận ({viewingNews.comments.length})
                </h3>
                
                <div className="space-y-4">
                  {viewingNews.comments.map(comment => (
                    <div key={comment.id} className="flex gap-4 animate-in fade-in slide-in-from-left-2 duration-300">
                      <div className="size-10 rounded-xl overflow-hidden shrink-0 border border-gray-200 dark:border-white/10">
                        <img src={comment.memberAvatar || `https://picsum.photos/100/100?random=${comment.id}`} className="size-full object-cover" />
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
                </div>
              </div>
            </div>
          </main>
          
          <footer className="fixed bottom-0 left-0 right-0 p-6 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-white/5">
            <div className="flex gap-3 bg-gray-50 dark:bg-surface-dark p-2 rounded-2xl border border-gray-200 dark:border-white/5 focus-within:border-primary transition-all shadow-inner">
              <input 
                type="text" 
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddComment(viewingNews.id)}
                className="flex-1 bg-transparent border-none text-xs font-bold text-gray-900 dark:text-white outline-none focus:ring-0 px-3"
                placeholder="Ý kiến của đồng chí..."
              />
              <button 
                onClick={() => handleAddComment(viewingNews.id)}
                disabled={!commentInput.trim()}
                className="size-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-lg">send</span>
              </button>
            </div>
          </footer>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="bg-surface-dark w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[90vh]">
            <div className="p-8 bg-primary text-white flex justify-between items-center shrink-0">
               <h2 className="text-xl font-black uppercase tracking-tight">{editingId ? 'Sửa bài viết' : 'Đăng tin mới'}</h2>
               <button onClick={() => setIsModalOpen(false)} className="size-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all active:scale-90"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="p-8 space-y-6 overflow-y-auto no-scrollbar flex-1">
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Tiêu đề bài viết *</label>
                  <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:border-primary outline-none text-sm font-bold transition-all" placeholder="Nhập tiêu đề tin bài..." />
               </div>
               
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Danh mục *</label>
                  <select 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value as any})} 
                    className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:border-primary outline-none text-sm font-bold appearance-none transition-all"
                  >
                    {categories.filter(c => c !== 'Tất cả').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
               </div>

               <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Ảnh bìa bài viết</label>
                  <input type="file" ref={imageUploadRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                  <div 
                    onClick={() => imageUploadRef.current?.click()}
                    className={`w-full aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden bg-background-dark/50 ${formData.image ? 'border-primary/50' : 'border-white/10 hover:border-primary/30'}`}
                  >
                    {formData.image ? (
                      <img src={formData.image} className="w-full h-full object-cover" alt="Cover Preview" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-500">
                        <span className="material-symbols-outlined text-4xl">add_photo_alternate</span>
                        <p className="text-[10px] font-black uppercase tracking-widest">Tải ảnh bìa lên</p>
                      </div>
                    )}
                  </div>
               </div>

               <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nội dung chi tiết *</label>
                  <textarea 
                    value={formData.content} 
                    onChange={e => setFormData({...formData, content: e.target.value})} 
                    className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary outline-none text-sm font-medium min-h-[150px] leading-relaxed transition-all" 
                    placeholder="Viết nội dung bài viết tại đây..."
                  />
               </div>

               <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nguồn tin gốc / Đường dẫn (Link)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary text-sm">link</span>
                    <input 
                      value={formData.link} 
                      onChange={e => setFormData({...formData, link: e.target.value})} 
                      className="w-full bg-background-dark border border-white/10 rounded-2xl pl-11 pr-5 py-3.5 text-white focus:border-primary outline-none text-xs font-bold transition-all" 
                      placeholder="Dán đường dẫn bài viết/báo gốc tại đây..." 
                    />
                  </div>
               </div>
            </div>
            <div className="p-8 bg-background-dark/50 border-t border-white/5 flex gap-4 shrink-0">
               <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-gray-500 font-black uppercase text-xs">Hủy</button>
               <button onClick={handleSave} className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black uppercase text-xs shadow-xl shadow-primary/30 active:scale-95 transition-all">Đăng bài</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsScreen;
