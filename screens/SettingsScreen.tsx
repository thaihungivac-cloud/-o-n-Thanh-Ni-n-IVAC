
import React, { useState } from 'react';
import { Member, Screen, MemberRole } from '../types';

interface SettingsScreenProps {
  currentUser: Member | null;
  members: Member[];
  settings: { aiEnabled: boolean; notifEnabled: boolean; darkMode: boolean; };
  onUpdateSettings: React.Dispatch<React.SetStateAction<{ aiEnabled: boolean; notifEnabled: boolean; darkMode: boolean; }>>;
  onBack: () => void;
  onLogout: () => void;
  onNavigate: (screen: Screen) => void;
  onUpdateMember: (updatedMember: Member) => void;
  onShowToast: (msg: string, type: 'success' | 'error') => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ 
  currentUser, 
  members, 
  settings, 
  onUpdateSettings, 
  onBack, 
  onLogout, 
  onNavigate, 
  onUpdateMember,
  onShowToast
}) => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ old: '', new: '', confirm: '' });

  const handleChangePassword = () => {
    if (!passwordForm.old || !passwordForm.new || !passwordForm.confirm) {
      onShowToast("Vui lòng nhập đủ các trường!", "error");
      return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
      onShowToast("Mật khẩu mới không khớp!", "error");
      return;
    }
    onShowToast("Đổi mật khẩu thành công!", "success");
    setIsPasswordModalOpen(false);
  };

  const handleLogoutClick = () => {
    if (window.confirm("Đồng chí có chắc muốn đăng xuất?")) {
      onLogout();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-32 transition-colors duration-300">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-6 py-5 border-b border-gray-200 dark:border-white/5 transition-colors duration-300">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-gray-800 dark:text-white">
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <h2 className="text-lg font-black text-gray-900 dark:text-white">Cài đặt</h2>
        <div className="size-10"></div>
      </header>

      <div className="px-6 py-6">
        <div onClick={() => onNavigate(Screen.PROFILE)} className="bg-white dark:bg-surface-dark/40 border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-6 flex items-center gap-5 shadow-lg cursor-pointer transition-all active:scale-[0.98]">
          <img src={currentUser?.avatar} className="size-16 rounded-full object-cover border-2 border-primary/20" alt="Avatar" />
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-black text-gray-900 dark:text-white truncate">{currentUser?.name}</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">{currentUser?.position}</p>
          </div>
          <span className="material-symbols-outlined text-gray-300">chevron_right</span>
        </div>
      </div>

      <div className="px-6 space-y-4">
          <button onClick={() => setIsPasswordModalOpen(true)} className="w-full flex items-center gap-5 px-6 py-5 bg-white dark:bg-surface-dark rounded-[2rem] border border-gray-100 dark:border-white/5 text-left font-black uppercase text-xs transition-all active:scale-[0.98] shadow-sm">
             <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-xl">lock</span>
             </div>
             <span className="flex-1 dark:text-white">Đổi mật khẩu</span>
             <span className="material-symbols-outlined text-gray-300">chevron_right</span>
          </button>
          
          <button onClick={handleLogoutClick} className="w-full flex items-center gap-5 px-6 py-5 bg-rose-500/5 dark:bg-rose-500/10 rounded-[2rem] border border-rose-500/20 text-rose-500 text-left font-black uppercase text-xs transition-all active:scale-[0.98] shadow-sm">
             <div className="size-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                <span className="material-symbols-outlined text-xl">logout</span>
             </div>
             <span className="flex-1">Đăng xuất hệ thống</span>
          </button>
      </div>

      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
           <div className="bg-white dark:bg-surface-dark w-full max-w-lg rounded-[3rem] p-8 space-y-4 border border-white/10 shadow-2xl">
              <h2 className="text-xl font-black uppercase dark:text-white text-center">Đổi mật khẩu</h2>
              <div className="space-y-3">
                <input type="password" value={passwordForm.old} onChange={e => setPasswordForm({...passwordForm, old: e.target.value})} className="w-full bg-gray-100 dark:bg-background-dark border-none rounded-2xl px-5 py-4 dark:text-white" placeholder="Mật khẩu hiện tại" />
                <input type="password" value={passwordForm.new} onChange={e => setPasswordForm({...passwordForm, new: e.target.value})} className="w-full bg-gray-100 dark:bg-background-dark border-none rounded-2xl px-5 py-4 dark:text-white" placeholder="Mật khẩu mới" />
                <input type="password" value={passwordForm.confirm} onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})} className="w-full bg-gray-100 dark:bg-background-dark border-none rounded-2xl px-5 py-4 dark:text-white" placeholder="Xác nhận mật khẩu mới" />
              </div>
              <div className="flex gap-4 pt-4">
                 <button onClick={() => setIsPasswordModalOpen(false)} className="flex-1 py-4 font-black uppercase text-xs text-gray-500 tracking-widest">Hủy bỏ</button>
                 <button onClick={handleChangePassword} className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black uppercase text-xs shadow-xl active:scale-95 transition-all">Xác nhận</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SettingsScreen;
