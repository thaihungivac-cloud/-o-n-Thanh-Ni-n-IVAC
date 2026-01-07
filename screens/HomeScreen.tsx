
import React from 'react';
import { Screen } from '../types';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const apps = [
    { screen: Screen.MEMBERS, label: 'Quản lý Đoàn viên', icon: 'groups', color: 'bg-blue-500/20 text-blue-400' },
    { screen: Screen.NEWS, label: 'Văn bản đi/đến', icon: 'description', color: 'bg-orange-500/20 text-orange-400' },
    { screen: Screen.ATTENDANCE, label: 'Đăng ký lịch họp', icon: 'calendar_month', color: 'bg-purple-500/20 text-purple-400' },
    { screen: Screen.ANALYTICS, label: 'Thi đua khen thưởng', icon: 'emoji_events', color: 'bg-yellow-500/20 text-yellow-400' },
    { screen: Screen.ACTIVITY, label: 'Đóng Đoàn phí', icon: 'payments', color: 'bg-teal-500/20 text-teal-400' },
    { screen: Screen.AI, label: 'Trợ lý AI', icon: 'auto_awesome', color: 'bg-primary/20 text-primary' },
  ];

  return (
    <div className="flex flex-col pb-24">
      <header className="px-4 py-4 flex items-center justify-between sticky top-0 bg-background-dark/95 backdrop-blur-md z-30">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">diversity_3</span>
          </div>
          <h2 className="text-lg font-bold">Đoàn TN IVAC</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onNavigate(Screen.AI)} className="p-2 text-gray-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined">smart_toy</span>
          </button>
          <button onClick={() => onNavigate(Screen.SETTINGS)} className="size-9 rounded-full overflow-hidden border border-white/10">
            <img src="https://picsum.photos/100/100?random=2" alt="Avatar" />
          </button>
        </div>
      </header>

      <div className="px-4 mt-2">
        <p className="text-sm text-gray-400">Chào mừng trở lại,</p>
        <h1 className="text-2xl font-bold mt-0.5">Nguyễn Văn A</h1>
      </div>

      <div className="p-4">
        <div className="relative h-56 rounded-2xl overflow-hidden shadow-xl group cursor-pointer" onClick={() => onNavigate(Screen.NEWS)}>
          <img src="https://picsum.photos/800/400?random=3" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="News" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-5 w-full">
            <span className="px-2 py-1 bg-primary text-[10px] font-bold rounded uppercase mb-2 inline-block">Tin nổi bật</span>
            <h3 className="text-xl font-bold text-white mb-2">Hoạt động chào mừng 26/3</h3>
            <p className="text-gray-300 text-xs line-clamp-1">Cập nhật lịch trình sự kiện chào mừng ngày thành lập Đoàn TNCS Hồ Chí Minh.</p>
          </div>
        </div>
      </div>

      <div className="px-4">
        <div className="bg-surface-dark border border-white/5 rounded-2xl p-4 flex gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 size-24 bg-primary/10 rounded-full blur-2xl -mr-6 -mt-6"></div>
          <div className="flex-1 flex flex-col gap-3 relative z-10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">cake</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Nhắc nhở</span>
            </div>
            <div>
              <p className="text-base font-bold">Sinh nhật hôm nay</p>
              <p className="text-sm text-gray-400">Trần Thị Bích - Ban Chấp Hành</p>
            </div>
            <button className="w-fit px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">send</span>
              Gửi lời chúc
            </button>
          </div>
          <div className="size-20 rounded-xl overflow-hidden border-2 border-white/5 shrink-0">
             <img src="https://picsum.photos/100/100?random=4" className="w-full h-full object-cover" alt="Birthday" />
          </div>
        </div>
      </div>

      <div className="px-4 mt-8 mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Ứng dụng</h2>
        <button onClick={() => onNavigate(Screen.MEMBERS)} className="text-xs font-medium text-primary">Xem tất cả</button>
      </div>

      <div className="grid grid-cols-2 gap-3 px-4">
        {apps.map((app, idx) => (
          <button
            key={idx}
            onClick={() => onNavigate(app.screen)}
            className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl bg-surface-dark border border-white/5 hover:bg-white/10 transition-all text-center group"
          >
            <div className={`flex items-center justify-center size-12 rounded-full transition-transform group-hover:scale-110 ${app.color}`}>
              <span className="material-symbols-outlined text-[28px]">{app.icon}</span>
            </div>
            <span className="text-xs font-medium text-gray-300">{app.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomeScreen;
