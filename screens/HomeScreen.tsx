
import React, { useMemo, useState } from 'react';
import { Screen, Member, NewsItem, ActivityPlan, Document, SystemNotification } from '../types';

interface HomeScreenProps {
  currentUser: Member | null;
  members: Member[];
  news: NewsItem[];
  activities?: ActivityPlan[];
  docs?: Document[];
  settings: { notifEnabled: boolean };
  systemNotifications: SystemNotification[];
  onNavigate: (screen: Screen, targetId?: string) => void;
  onClearNotifs?: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ currentUser, members, news, activities = [], docs = [], settings, systemNotifications, onNavigate, onClearNotifs }) => {
  const [viewingSystemNotif, setViewingSystemNotif] = useState<SystemNotification | null>(null);

  const apps = [
    { screen: Screen.MEMBERS, label: 'Quản lý Đoàn viên', icon: 'groups', color: 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' },
    { screen: Screen.LIBRARY, label: 'Thư viện số', icon: 'auto_stories', color: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' },
    { screen: Screen.ACTIVITY_REG, label: 'Đăng ký hoạt động', icon: 'event_available', color: 'bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400' },
    { screen: Screen.ATTENDANCE, label: 'Điểm danh', icon: 'qr_code_scanner', color: 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400' },
    { screen: Screen.REPORTS, label: 'Báo cáo', icon: 'description', color: 'bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400' },
    { screen: Screen.ANALYTICS, label: 'Phân tích', icon: 'monitoring', color: 'bg-primary/10 dark:bg-primary/20 text-primary' },
    { screen: Screen.ACTIVITY, label: 'Sáng kiến', icon: 'lightbulb', color: 'bg-yellow-500/10 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' },
    { screen: Screen.AI, label: 'Trợ lý AI IVAC', icon: 'auto_awesome', color: 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary' },
  ];

  const topFiveNews = useMemo(() => {
    return [...news]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [news]);

  const birthdayMembers = useMemo(() => {
    const currentMonth = new Date().getMonth() + 1;
    return members.filter(m => {
      if (!m.dob) return false;
      const birthMonth = parseInt(m.dob.split('-')[1]);
      return birthMonth === currentMonth;
    });
  }, [members]);

  const notifications = useMemo(() => {
    if (!settings.notifEnabled) return [];
    
    let list: any[] = [];
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // 1. Thông báo hệ thống gửi riêng (Personal reminders)
    if (currentUser) {
      const personalNotifs = systemNotifications.filter(n => n.targetMemberId === currentUser.id);
      personalNotifs.forEach(pn => {
        list.push({
          id: `sys-${pn.id}`,
          title: pn.title,
          desc: pn.message,
          icon: pn.type === 'warning' ? 'error' : pn.type === 'encouragement' ? 'military_tech' : 'assignment_late',
          color: pn.type === 'warning' ? 'text-rose-500 bg-rose-500/10' : pn.type === 'encouragement' ? 'text-amber-500 bg-amber-500/10' : 'text-blue-500 bg-blue-500/10',
          timestamp: new Date(pn.timestamp).getTime(),
          action: () => setViewingSystemNotif(pn) 
        });
      });
    }

    // 2. Hoạt động đang diễn ra (Điểm danh)
    const activeActs = activities.filter(a => {
      if (a.date !== todayStr) return false;
      const endDateTime = new Date(`${a.date}T${a.endTime}`).getTime();
      return now.getTime() <= endDateTime;
    });
    activeActs.forEach(act => {
      list.push({
        id: `active-${act.id}`,
        title: 'Hoạt động đang diễn ra',
        desc: `"${act.name}" đang mở cổng điểm danh. Đồng chí đã tham gia chưa?`,
        icon: 'qr_code_scanner',
        color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 dark:bg-purple-400/10',
        timestamp: now.getTime(),
        action: () => onNavigate(Screen.ATTENDANCE)
      });
    });

    // 3. Hoạt động mới
    const recentActs = activities.filter(act => {
      const actDate = new Date(act.date).getTime();
      const diff = actDate - now.getTime();
      return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000;
    });
    recentActs.forEach(act => {
      list.push({
        id: `new-act-${act.id}`,
        title: 'Hoạt động sắp tới',
        desc: `"${act.name}" diễn ra vào ${new Date(act.date).toLocaleDateString('vi-VN')}. Hãy đăng ký ngay!`,
        icon: 'event_note',
        color: 'text-orange-600 dark:text-orange-400 bg-orange-500/10 dark:bg-orange-400/10',
        timestamp: new Date(act.date).getTime(),
        action: () => onNavigate(Screen.ACTIVITY_REG)
      });
    });

    // Sắp xếp mới nhất lên đầu và chỉ lấy 10 mục
    return list.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
  }, [activities, systemNotifications, currentUser, settings.notifEnabled, onNavigate]);

  return (
    <div className="flex flex-col pb-32">
      <header className="px-6 py-6 flex items-center justify-between sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-30 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="h-10 w-16 bg-white rounded-xl shadow-lg flex items-center justify-center p-1 border border-primary/10">
            <div className="border-2 border-primary rounded-lg w-full h-full flex items-center justify-center">
               <span className="text-primary font-black text-[10px]">IVAC</span>
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-sm font-black tracking-tight text-gray-900 dark:text-white uppercase leading-none">CÔNG NGHỆ SỐ IVAC</h2>
            <span className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">Số hóa phong trào Đoàn</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onNavigate(Screen.AI)} className="p-2 text-gray-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">smart_toy</span>
          </button>
          <button 
            onClick={() => onNavigate(Screen.PROFILE)} 
            className="size-10 rounded-2xl overflow-hidden border-2 border-primary/20 hover:border-primary transition-all ring-4 ring-primary/5 shadow-sm"
          >
            <img src={currentUser?.avatar || "https://picsum.photos/100/100"} alt="Avatar" className="size-full object-cover" />
          </button>
        </div>
      </header>

      <div className="px-6 mt-4 mb-6">
        <div className="flex flex-col">
          <p className="text-sm font-medium text-gray-500 mb-0.5">Chào đồng chí,</p>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
            {currentUser?.name || 'Đoàn viên'}
          </h1>
          <div className="flex items-center gap-2 mt-2">
             <span className="text-[10px] font-black bg-primary/10 dark:bg-primary/20 text-primary px-2 py-0.5 rounded-lg uppercase tracking-wider border border-primary/20">
               {currentUser?.position}
             </span>
             <div className="size-1 rounded-full bg-gray-300 dark:bg-gray-700"></div>
             <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">{currentUser?.branch}</span>
          </div>
        </div>
      </div>

      {/* News Slider */}
      <div className="space-y-4 mb-8">
        <div className="px-6 flex items-center justify-between">
          <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-[0.2em]">Tin tức mới nhất</h2>
          <button onClick={() => onNavigate(Screen.NEWS)} className="text-[10px] font-black text-primary uppercase">Xem tất cả</button>
        </div>
        <div className="flex overflow-x-auto no-scrollbar gap-4 px-6 pb-2">
          {topFiveNews.map((item, idx) => (
            <div 
              key={item.id} 
              className="relative min-w-[280px] h-48 rounded-[2.5rem] overflow-hidden shadow-xl group cursor-pointer border border-gray-100 dark:border-white/5 shrink-0"
              onClick={() => onNavigate(Screen.NEWS)}
            >
              <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="News" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-5 w-full">
                <span className="px-2 py-0.5 bg-primary/90 text-[8px] font-black text-white rounded-full uppercase mb-1.5 inline-block backdrop-blur-sm">{item.category}</span>
                <h3 className="text-sm font-black text-white mb-0.5 line-clamp-2 leading-tight">{item.title}</h3>
                <p className="text-gray-300 text-[9px] font-medium line-clamp-1 opacity-80">{item.author} • {new Date(item.date).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {birthdayMembers.length > 0 && (
        <div className="px-6 mb-10">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-[#1a3a2a] dark:to-[#0f231a] rounded-[2.5rem] p-6 border border-primary/10 dark:border-primary/20 shadow-xl relative overflow-hidden transition-colors duration-300">
             <div className="relative z-10">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">cake</span>
                    Sinh nhật tháng {new Date().getMonth() + 1}
                  </h3>
                  <span className="text-[10px] text-gray-500 font-bold">{birthdayMembers.length} đồng chí</span>
               </div>
               <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
                 {birthdayMembers.map(member => (
                   <div key={member.id} className="flex flex-col items-center gap-2 shrink-0 group">
                      <div className="size-16 rounded-2xl border-2 border-primary/20 dark:border-primary/30 p-1 group-hover:border-primary transition-all bg-white dark:bg-surface-dark">
                         <img src={member.avatar || "https://picsum.photos/100/100"} alt={member.name} className="size-full object-cover rounded-xl" />
                      </div>
                      <p className="text-[10px] font-black text-gray-800 dark:text-white text-center leading-tight max-w-[70px]">{member.name.split(' ').pop()}</p>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        </div>
      )}

      <div className="px-6 mb-4 flex items-center justify-between">
        <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-[0.2em]">Hệ sinh thái Số</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 px-6 mb-10">
        {apps.map((app, idx) => (
          <button
            key={idx}
            onClick={() => onNavigate(app.screen)}
            className="flex flex-col items-start justify-between h-36 p-5 rounded-[2rem] bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 hover:border-primary/20 transition-all group relative overflow-hidden shadow-lg hover:shadow-xl"
          >
            <div className={`flex items-center justify-center size-12 rounded-2xl transition-transform group-hover:scale-110 shadow-md ${app.color}`}>
              <span className="material-symbols-outlined text-[28px]">{app.icon}</span>
            </div>
            <div className="flex flex-col items-start">
               <span className="text-xs font-black text-gray-800 dark:text-white leading-tight z-10 group-hover:text-primary transition-colors">{app.label}</span>
               <div className="w-4 h-0.5 bg-gray-200 dark:bg-gray-700 mt-2 transition-all group-hover:w-8 group-hover:bg-primary"></div>
            </div>
          </button>
        ))}
      </div>

      <div className="px-6 mb-12 space-y-4">
        <div className="flex items-center justify-between">
           <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-[0.2em]">Thông báo</h2>
           {systemNotifications.length > 0 && onClearNotifs && (
             <button 
               onClick={onClearNotifs}
               className="flex items-center gap-1 text-[10px] font-black text-rose-500 uppercase hover:opacity-70 transition-opacity"
             >
               <span className="material-symbols-outlined text-sm">delete_sweep</span>
               Xoá sạch
             </button>
           )}
        </div>
        <div className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div 
                key={notif.id} 
                onClick={notif.action}
                className="bg-white dark:bg-surface-dark/50 border border-gray-100 dark:border-white/5 rounded-3xl p-5 flex items-center gap-4 group cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-sm"
              >
                <div className={`size-11 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${notif.color}`}>
                  <span className="material-symbols-outlined text-xl">{notif.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-black text-gray-800 dark:text-white leading-none">{notif.title}</h4>
                  <p className="text-[11px] text-gray-500 font-medium mt-1.5 leading-relaxed line-clamp-2">{notif.desc}</p>
                </div>
                <span className="material-symbols-outlined text-gray-300 dark:text-gray-700 group-hover:text-primary transition-colors">chevron_right</span>
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-surface-dark/20 border border-dashed border-gray-200 dark:border-white/5 rounded-[2.5rem] py-10 text-center flex flex-col items-center gap-2 opacity-60">
               <span className="material-symbols-outlined text-3xl text-gray-300 dark:text-gray-700">notifications_none</span>
               <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest italic">Hiện chưa có thông báo mới</p>
            </div>
          )}
        </div>
        {notifications.length >= 10 && (
          <p className="text-center text-[9px] font-bold text-gray-400 uppercase tracking-widest pt-2">Đang hiển thị 10 thông báo gần nhất</p>
        )}
      </div>

      {/* SYSTEM NOTIFICATION DETAIL MODAL */}
      {viewingSystemNotif && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
           <div className={`w-full max-w-sm rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-500 flex flex-col ${
             viewingSystemNotif.type === 'encouragement' ? 'bg-emerald-950/90' :
             viewingSystemNotif.type === 'warning' ? 'bg-rose-950/90' : 'bg-blue-950/90'
           }`}>
              <div className="p-8 pb-4 flex flex-col items-center text-center">
                 <div className={`size-16 rounded-3xl flex items-center justify-center shadow-xl mb-4 ${
                   viewingSystemNotif.type === 'encouragement' ? 'bg-emerald-500 text-white' :
                   viewingSystemNotif.type === 'warning' ? 'bg-rose-500 text-white' : 'bg-blue-500 text-white'
                 }`}>
                    <span className="material-symbols-outlined text-3xl">
                      {viewingSystemNotif.type === 'encouragement' ? 'military_tech' :
                       viewingSystemNotif.type === 'warning' ? 'warning' : 'info'}
                    </span>
                 </div>
                 <h2 className="text-lg font-black text-white uppercase tracking-tight">{viewingSystemNotif.title}</h2>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                   {new Date(viewingSystemNotif.timestamp).toLocaleDateString('vi-VN')}
                 </p>
              </div>

              <div className="px-8 py-6 bg-white/5 mx-6 rounded-[2rem] border border-white/5">
                 <p className="text-sm font-medium text-gray-200 leading-relaxed text-center italic">
                   "{viewingSystemNotif.message}"
                 </p>
              </div>

              <div className="p-8 pt-4 flex flex-col items-center">
                 <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Ban Chấp hành Đoàn</p>
                 <p className="text-xs font-black text-primary uppercase">{viewingSystemNotif.senderName}</p>
                 
                 <div className="w-full flex gap-3 mt-8">
                    <button 
                      onClick={() => setViewingSystemNotif(null)}
                      className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest"
                    >
                      Đóng
                    </button>
                    <button 
                      onClick={() => {
                        const targetId = viewingSystemNotif.metadata?.targetId;
                        const targetScreen = viewingSystemNotif.metadata?.screen || Screen.ACTIVITY_REG;
                        setViewingSystemNotif(null);
                        // Điều hướng kèm targetId để mở chi tiết Sáng kiến
                        onNavigate(targetScreen, targetId);
                      }}
                      className="flex-2 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                    >
                      {viewingSystemNotif.type === 'encouragement' ? 'Tham gia ngay' : 'Xem chi tiết'}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
