
import React from 'react';
import { Screen } from '../types';

interface SettingsProps {
  onNavigate: (screen: Screen) => void;
}

const Settings: React.FC<SettingsProps> = ({ onNavigate }) => {
  const sections = [
    {
      title: 'Tài khoản',
      items: [
        { icon: 'person', label: 'Hồ sơ người dùng', desc: 'Cập nhật thông tin cá nhân', color: 'bg-blue-100 text-blue-600' },
        { icon: 'lock_reset', label: 'Đổi mật khẩu', color: 'bg-emerald-100 text-emerald-600' },
      ]
    },
    {
      title: 'Quản trị hệ thống',
      items: [
        { icon: 'admin_panel_settings', label: 'Quản lý phân quyền', desc: 'Phân công vai trò cán bộ', color: 'bg-orange-100 text-orange-600' },
        { icon: 'history', label: 'Nhật ký hệ thống', badge: '3 Mới', color: 'bg-purple-100 text-purple-600' },
        { icon: 'auto_awesome', label: 'Cấu hình AI', desc: 'Tùy chỉnh gợi ý thông minh', color: 'bg-primary/20 text-primary', toggle: true },
      ]
    },
    {
      title: 'Chung',
      items: [
        { icon: 'notifications', label: 'Thông báo đẩy', toggle: true, color: 'bg-rose-100 text-rose-600' },
        { icon: 'dark_mode', label: 'Giao diện tối', toggle: true, color: 'bg-slate-100 text-slate-600' },
      ]
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark pb-10">
      <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-white/5">
        <button onClick={() => onNavigate(Screen.HOME)} className="size-10 flex items-center justify-center rounded-full hover:bg-black/5">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold">Cài đặt</h1>
        <button className="size-10 flex items-center justify-center rounded-full">
           <span className="material-symbols-outlined">settings</span>
        </button>
      </header>

      <div className="p-4 flex flex-col gap-6">
        <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
           <div className="flex items-center gap-4">
              <div className="relative">
                 <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0-bx3PZQ6rJJu4pdTPVb9Yp0XcQzVdlQUa49aPQvYz920IrfCAbPM0UPLJICg4I6NsSVPkxHwkjxMM2gCksEIHAFVQO7Ep4GM77mFzeXGMKsjaL0sa0hy4AVQMy4SPIOCySDNhKH8-ii8CBhchVIv9s-kiJX3L1JewJBtt7Oqm_deFxwZaaj88KuSYYsJ5ZPpdBYB0Fn7DreBjO6vc-meS-D4d1RwbL00RKnslVciT5WEXnLCXZqwkI2bz2DNGHe0E0YRiyWR7Q-I" 
                    className="size-20 rounded-full object-cover ring-4 ring-primary/20" 
                    alt="Profile" 
                 />
                 <div className="absolute bottom-0 right-0 bg-primary border-2 border-white dark:border-surface-dark rounded-full p-1">
                    <span className="material-symbols-outlined text-white text-[14px]">verified_user</span>
                 </div>
              </div>
              <div className="flex-1">
                 <h3 className="text-xl font-bold">Nguyễn Văn A</h3>
                 <span className="inline-block bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded mt-1">QUẢN TRỊ VIÊN</span>
                 <p className="text-sm text-slate-500 mt-1">Chi Đoàn Kỹ Thuật</p>
              </div>
           </div>
        </div>

        {sections.map((section, idx) => (
          <div key={idx} className="space-y-3">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">{section.title}</h4>
            <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/5 divide-y divide-gray-100 dark:divide-white/5">
              {section.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer group transition-colors">
                  <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm truncate">{item.label}</p>
                      {item.badge && <span className="bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>}
                    </div>
                    {item.desc && <p className="text-xs text-slate-400 truncate mt-0.5">{item.desc}</p>}
                  </div>
                  {item.toggle ? (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  ) : (
                    <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <button 
          onClick={() => window.location.reload()}
          className="w-full mt-4 h-14 bg-white dark:bg-white/5 border border-red-200 dark:border-red-900/30 rounded-2xl flex items-center justify-center gap-2 text-red-500 font-bold active:scale-[0.98] transition-all"
        >
          <span className="material-symbols-outlined">logout</span> Đăng xuất
        </button>
        <p className="text-center text-[10px] text-slate-400 font-bold">Phiên bản 2.4.0 (Build 2024)</p>
      </div>
    </div>
  );
};

export default Settings;
