
import React from 'react';
import { Screen } from '../types';

interface NewsProps {
  onNavigate: (screen: Screen) => void;
}

const News: React.FC<NewsProps> = ({ onNavigate }) => {
  const newsItems = [
    { 
      id: '1', 
      category: 'Phong trào', 
      date: '10/03/2024', 
      title: 'Kế hoạch Mùa hè xanh 2024 - Khởi động chiến dịch', 
      desc: 'Chi tiết kế hoạch chiến dịch tình nguyện Mùa hè xanh tại các địa bàn trọng điểm.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1UfTHxY33AgvEbF_J4d9V0GnEHQCSddEvi7qb2VsraZAcP8nR54B6n24LiDnRYqYgYliqJlmnswQdX6fiLNFk1aXJ026FiGsUjQW0MbzfG5JNB2O0igM9k0T3DQnoYSvi0l8pZD6L8WHYEvYEh9sQQSeVsJY8F17ROrOXmgOn23emEjn942ZiPEZZ0EbOGFahJiTIVomyWIHvD5D1oMh8rY5phrTVN3s_AaTc1vkNbU7LkZ0UJxCl-ZWvHs8dpkbjawRWc9HV9oeo' 
    },
    { 
      id: '2', 
      category: 'Thông báo', 
      date: '08/03/2024', 
      title: 'Họp ban chấp hành Đoàn trường mở rộng quý I/2024', 
      desc: 'Triệu tập các đồng chí Bí thư chi đoàn tham dự cuộc họp quan trọng.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYbfVCfwdwb5LvzvgWuOzlSCmYh8fvq3ku6Gd3x64ux-3jXTweIEktTwo_uu0hOMzvRdwAMJOm9AlnPkEi0rA2eUz0GN9WhiTV8IlytyrIqT7vSC4cwD6V6DLhFVsZXNJkLQ8XmknPQNPKS6-gO6ktUMPAVHBpt4F-8rxHEdmTH4K2ntZMqsQ-SHtdt4Xi4kiaDhFMMlO7YJVO2bn1PywnvAy8ero0jZgjTorQL_kbXD74ayRvpGI0cwz-LMIR80AXJMoPneeeLTBt' 
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-white/5">
        <button onClick={() => onNavigate(Screen.HOME)} className="size-10 flex items-center justify-center rounded-full hover:bg-black/5">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold">Tin tức / Báo tường</h1>
        <button className="size-10 flex items-center justify-center rounded-full">
           <span className="material-symbols-outlined">calendar_month</span>
        </button>
      </header>

      <main className="p-4 flex flex-col gap-6">
        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary">search</span>
          <input 
            type="text" 
            placeholder="Tìm kiếm tin tức..."
            className="w-full h-12 bg-white dark:bg-surface-dark border-none rounded-xl pl-10 pr-4 text-sm focus:ring-primary shadow-sm"
          />
        </div>

        {/* Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {['Tất cả', 'Hoạt động', 'Thông báo', 'Đoàn vụ', 'Phong trào'].map((f, i) => (
            <button key={i} className={`shrink-0 h-9 px-5 rounded-full text-xs font-bold transition-all ${i === 0 ? 'bg-primary text-white' : 'bg-white dark:bg-white/5 text-slate-500 border border-gray-200 dark:border-white/10'}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Featured */}
        <div>
          <h2 className="font-bold mb-3">Nổi bật</h2>
          <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-md group">
            <div className="h-48 overflow-hidden relative">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXIM58j1e1aC7RFLMn6Fn_sytNfLsJeEOP31FJR7N-bKMTWwdNLWE2sCkBXYsKVK8hPeRG5n72aOSxxe7vlyAa4itED2CeyQNsyyLsjgAisEFQybMtM3ZeTnmViQVntakqMsnhC07L7SUXiAER3DuQfKyfHgU21m_dqu5G6bBXr4ZOYT6HAIepNA1Qf0ilS7zeH1dJ9sAoot5YU24X0dDEfUxaxTOvzbQW0GMsr4vbm2L1uvVxV8o9c3wEnqhQDUOFlc_GBCZkpPPi" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Featured" />
              <div className="absolute bottom-2 left-2 bg-primary text-white text-[9px] font-bold px-2 py-1 rounded">Hoạt động</div>
            </div>
            <div className="p-4">
               <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold mb-2 uppercase tracking-widest">
                 <span className="material-symbols-outlined text-[14px]">calendar_today</span> 12/03/2024
               </div>
               <h3 className="font-bold text-lg leading-tight mb-2">Hoạt động Chào mừng ngày thành lập Đoàn 26/3</h3>
               <p className="text-slate-500 text-sm line-clamp-2">Đoàn thanh niên tổ chức chuỗi hoạt động chào mừng, bao gồm hội trại và các trò chơi vận động...</p>
            </div>
          </div>
        </div>

        {/* List */}
        <div>
           <h2 className="font-bold mb-3">Mới nhất</h2>
           <div className="flex flex-col gap-4">
             {newsItems.map(item => (
               <div key={item.id} className="bg-white dark:bg-surface-dark p-3 rounded-2xl flex gap-3 shadow-sm border border-gray-100 dark:border-white/5 relative">
                  <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-100">
                    <img src={item.imageUrl} className="w-full h-full object-cover" alt="News" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{item.category}</span>
                      <span className="text-[10px] text-slate-400 font-medium">• {item.date}</span>
                    </div>
                    <h4 className="font-bold text-sm leading-tight line-clamp-2">{item.title}</h4>
                  </div>
                  <button className="absolute top-2 right-2 text-slate-300">
                     <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
               </div>
             ))}
           </div>
        </div>
      </main>

      <button className="fixed bottom-24 right-6 size-14 rounded-full bg-primary text-white shadow-xl shadow-primary/40 flex items-center justify-center active:scale-95 transition-all z-30">
        <span className="material-symbols-outlined text-[32px]">add</span>
      </button>
    </div>
  );
};

export default News;
