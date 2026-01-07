
import React from 'react';

interface SettingsScreenProps {
  onBack: () => void;
  onLogout: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack, onLogout }) => {
  const sections = [
    {
      title: 'Tài khoản',
      items: [
        { label: 'Hồ sơ người dùng', desc: 'Cập nhật thông tin cá nhân', icon: 'person', color: 'bg-blue-500/10 text-blue-400' },
        { label: 'Đổi mật khẩu', desc: '', icon: 'lock_reset', color: 'bg-emerald-500/10 text-emerald-400' },
      ]
    },
    {
      title: 'Quản trị hệ thống',
      isAdmin: true,
      items: [
        { label: 'Quản lý phân quyền', desc: 'Phân công vai trò cán bộ', icon: 'admin_panel_settings', color: 'bg-orange-500/10 text-orange-400' },
        { label: 'Nhật ký hệ thống', desc: '3 Mới', icon: 'history', color: 'bg-purple-500/10 text-purple-400', badge: '3 Mới' },
        { label: 'Cấu hình AI', desc: 'Tùy chỉnh gợi ý thông minh', icon: 'auto_awesome', color: 'bg-primary/10 text-primary', toggle: true },
      ]
    },
    {
      title: 'Chung',
      items: [
        { label: 'Thông báo đẩy', desc: '', icon: 'notifications', color: 'bg-rose-500/10 text-rose-400', toggle: true },
        { label: 'Giao diện tối', desc: '', icon: 'dark_mode', color: 'bg-slate-500/10 text-slate-400', toggle: true },
      ]
    }
  ];

  return (
    <div className="flex flex-col pb-12">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-background-dark/95 backdrop-blur-md px-4 py-4 border-b border-white/5">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full hover:bg-white/10">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold">Cài đặt</h2>
        <div className="size-10"></div>
      </header>

      <div className="p-4">
        <div className="bg-surface-dark rounded-2xl p-5 border border-white/5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src="https://picsum.photos/100/100?random=15" className="size-20 rounded-full border-4 border-primary/20" alt="Avatar" />
              <div className="absolute bottom-0 right-0 bg-primary border-2 border-surface-dark rounded-full size-6 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[14px]">verified_user</span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold leading-none">Nguyễn Văn A</h3>
              <div className="mt-2 flex gap-2">
                 <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase">Quản trị viên</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Chi Đoàn Kỹ Thuật</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {sections.map((section, sIdx) => (
          <div key={sIdx}>
            <div className="px-6 pb-2 flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{section.title}</h3>
              {section.isAdmin && <span className="bg-primary text-white text-[8px] font-bold px-1.5 py-0.5 rounded">ADMIN</span>}
            </div>
            <div className="mx-4 bg-surface-dark rounded-2xl overflow-hidden border border-white/5 divide-y divide-white/5">
              {section.items.map((item, iIdx) => (
                <div key={iIdx} className="flex items-center gap-4 px-4 py-4 hover:bg-white/5 transition-colors cursor-pointer group">
                  <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold truncate">{item.label}</p>
                      {item.badge && <span className="bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>}
                    </div>
                    {item.desc && <p className="text-[10px] text-gray-500 truncate">{item.desc}</p>}
                  </div>
                  {item.toggle ? (
                    <div className="w-10 h-6 bg-primary rounded-full relative shadow-inner">
                      <div className="absolute right-0.5 top-0.5 size-5 bg-white rounded-full"></div>
                    </div>
                  ) : (
                    <span className="material-symbols-outlined text-gray-600 group-hover:text-primary transition-colors">chevron_right</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 mt-12 pb-12">
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 bg-surface-dark border border-red-500/30 p-4 rounded-2xl hover:bg-red-500/10 text-red-500 font-bold active:scale-[0.98] transition-all"
        >
          <span className="material-symbols-outlined">logout</span>
          Đăng xuất
        </button>
        <p className="text-center text-[10px] text-gray-700 mt-4">Phiên bản 2.4.0 (Build 2024)</p>
      </div>
    </div>
  );
};

export default SettingsScreen;
