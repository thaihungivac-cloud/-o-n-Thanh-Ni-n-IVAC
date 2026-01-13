
import React from 'react';
import { Screen } from '../types';

interface HomeProps {
  onNavigate: (screen: Screen) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const menuItems = [
    { icon: 'groups', label: 'Quản lý Đoàn viên', screen: Screen.MEMBERS, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/20' },
    { icon: 'description', label: 'Văn bản đi/đến', screen: Screen.REPORTS, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-500/20' },
    // Fix: Changed Screen.ADD_ACTIVITY to Screen.ACTIVITY_REG as it is the correct enum property
    { icon: 'calendar_month', label: 'Đăng ký lịch họp', screen: Screen.ACTIVITY_REG, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-500/20' },
    { icon: 'emoji_events', label: 'Khen thưởng', screen: Screen.HOME, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-500/20' },
    { icon: 'payments', label: 'Đóng Đoàn phí', screen: Screen.HOME, color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-500/20' },
    // Fix: Changed Screen.CHAT to Screen.AI as it is the correct enum property for the AI assistant
    { icon: 'chat', label: 'Trợ lý AI', screen: Screen.AI, color: 'text-primary', bg: 'bg-primary/10' },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark no-scrollbar">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">diversity_3</span>
          </div>
          <h2 className="font-bold text-lg">Đoàn TN IVAC</h2>
        </div>
        <div className="flex items-center gap-3">
           <button onClick={() => onNavigate(Screen.SETTINGS)} className="size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center text-slate-500">
             <span className="material-symbols-outlined">settings</span>
           </button>
           <div className="size-9 rounded-full overflow-hidden border border-gray-200 dark:border-white/10">
             <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCW4QFhuIlY7xKmbpzZUKmvxqkUStRDfSjaX9Wy6fplsZ7CXBzIQg_lEYmDZO_A48GBiJHIs3mNWBRWV8NYob7oJEzrkb0DiiXVciit3Mh-YBfFKEA3PTPkzK9jSrS1gLbBW3l1MzefZcgGw45MA0EV1wkNK88wohi-C5iTPBBf7wN7KVcywgRHGtaZyPYquUy5LJue7EL8aMaeIEMfW4eaRvxS-5Sab0vdRIM2-NwmPZhNsbBSbHUcLPIcw1dOywYo2hHHI24WfZjX" className="w-full h-full object-cover" alt="User avatar" />
           </div>
        </div>
      </header>

      {/* Greeting */}
      <div className="px-4 pt-6 pb-2">
        <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Chào mừng trở lại,</p>
        <h3 className="text-2xl font-bold mt-0.5">Nguyễn Văn A</h3>
      </div>

      {/* Featured News */}
      <div className="p-4">
        <div className="relative rounded-2xl overflow-hidden shadow-lg group">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7MOdytLJEKoXK_b6-Hqj3jDkYgd-gWrsgQAYU-vgM2EAmwtwhGvMSGgotCQHpJqRfUc4xsQYpCGAli68ClF9IeN4Zzl4zNK88wohi-C5iTPBBf7wN7KVcywgRHGtaZyPYquUy5LJue7EL8aMaeIEMfW4eaRvxS-5Sab0vdRIM2-NwmPZhNsbBSbHUcLPIcw1dOywYo2hHHI24WfZjX" 
            className="w-full aspect-[16/10] object-cover transition-transform duration-700 group-hover:scale-105" 
            alt="Activities" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5">
            <span className="px-2.5 py-1 mb-3 text-[10px] font-bold text-white uppercase bg-primary rounded w-fit tracking-wider">Tin Nổi Bật</span>
            <h4 className="text-xl font-bold text-white mb-1">Hoạt động chào mừng 26/3</h4>
            <p className="text-gray-300 text-xs mb-4 line-clamp-2">Cập nhật các hoạt động mới nhất và lịch trình sự kiện chào mừng ngày thành lập Đoàn.</p>
            <button onClick={() => onNavigate(Screen.NEWS)} className="text-primary text-sm font-bold flex items-center gap-1">
              Xem chi tiết <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* App Grid */}
      <div className="px-4 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">Ứng dụng</h2>
          <button className="text-xs font-semibold text-primary">Xem tất cả</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {menuItems.map((item, idx) => (
            <button 
              key={idx}
              onClick={() => onNavigate(item.screen)}
              className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm active:scale-95 transition-all"
            >
              <div className={`flex items-center justify-center size-12 rounded-full ${item.bg} ${item.color}`}>
                <span className="material-symbols-outlined text-[28px]">{item.icon}</span>
              </div>
              <span className="text-xs font-semibold text-center">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Birthday Card */}
      <div className="px-4 mb-12">
        <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-100 dark:border-white/5 flex items-center gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute -right-6 -top-6 size-24 bg-primary/10 rounded-full blur-2xl"></div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-[20px] fill-1">cake</span>
              <p className="text-primary text-[10px] font-bold uppercase tracking-widest">Nhắc nhở</p>
            </div>
            <h5 className="font-bold">Sinh nhật hôm nay</h5>
            <p className="text-sm text-slate-500 dark:text-gray-400">Nguyễn Văn B - Ban Tuyên giáo</p>
            <button className="mt-3 px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-lg flex items-center gap-1 active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-[16px]">send</span> Gửi lời chúc
            </button>
          </div>
          <div className="size-20 rounded-lg overflow-hidden border-2 border-white dark:border-white/10 shrink-0">
             <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzsxmSWbjEcdRJayZOvyokG_p8C4xXCqynLZTfL3mZaRJjWVaNyNpu1RrxOYAJNSU94iyAXeJ2kbolwqabIi-rZB_mIv3h5_k1ZXCuIqPeTTN9U2fhUyfjWwLlN8UdZDZbSq4DTrVOt_NN91mMBY9yWUmM5QPdzGDsLtdrBz0rwRlailbPT2gk3Loczsh9Q0tH_y1MzpkhgXsXzYbcMFfKmY685URSM_z79e7LhuJ-44nWXo2iRr11-0ah15z_FCxjSbA5MnUVHcto" className="w-full h-full object-cover" alt="Birthday person" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
