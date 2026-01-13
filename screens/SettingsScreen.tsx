
import React, { useState, useMemo } from 'react';
import { Member, Screen, MemberRole } from '../types';

interface SettingsScreenProps {
  currentUser: Member | null;
  members: Member[];
  settings: {
    aiEnabled: boolean;
    notifEnabled: boolean;
    darkMode: boolean;
  };
  onUpdateSettings: React.Dispatch<React.SetStateAction<{
    aiEnabled: boolean;
    notifEnabled: boolean;
    darkMode: boolean;
  }>>;
  onBack: () => void;
  onLogout: () => void;
  onNavigate: (screen: Screen) => void;
  onUpdateMember: (updatedMember: Member) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ 
  currentUser, 
  members, 
  settings, 
  onUpdateSettings,
  onBack, 
  onLogout, 
  onNavigate, 
  onUpdateMember 
}) => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isRolesModalOpen, setIsRolesModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ old: '', new: '', confirm: '' });
  const [roleSearchQuery, setRoleSearchQuery] = useState('');

  if (!currentUser) return null;

  // Quyền tối cao dành cho Admin hệ thống
  const isSystemAdmin = currentUser.role === 'admin';

  const stats = useMemo(() => {
    return {
      admin: members.filter(m => m.role === 'admin').length,
      editor: members.filter(m => m.role === 'editor').length,
      user: members.filter(m => m.role === 'user').length,
    };
  }, [members]);

  const displayedRoleMembers = useMemo(() => {
    const query = roleSearchQuery.toLowerCase().trim();
    if (query === '') {
      // Nếu không search, chỉ hiện Admin và Editor
      return members.filter(m => m.role !== 'user');
    }
    // Nếu có search, tra cứu toàn bộ danh sách để Admin có thể thêm người mới
    return members.filter(m => 
      m.name.toLowerCase().includes(query) || 
      m.code.toLowerCase().includes(query)
    );
  }, [members, roleSearchQuery]);

  const toggleDarkMode = () => {
    onUpdateSettings(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const toggleNotifications = () => {
    onUpdateSettings(prev => ({ ...prev, notifEnabled: !prev.notifEnabled }));
  };

  const toggleAI = () => {
    onUpdateSettings(prev => ({ ...prev, aiEnabled: !prev.aiEnabled }));
  };

  const handleChangePassword = () => {
    if (!passwordForm.old || !passwordForm.new || !passwordForm.confirm) {
      alert("Đồng chí vui lòng điền đầy đủ các trường.");
      return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
      alert("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (passwordForm.new.length < 6) {
      alert("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }
    
    // Giả định cập nhật thành công
    onUpdateMember({ ...currentUser, password: passwordForm.new });
    alert("Đổi mật khẩu thành công!");
    setIsPasswordModalOpen(false);
    setPasswordForm({ old: '', new: '', confirm: '' });
  };

  const handleUpdateRole = (member: Member, newRole: MemberRole) => {
    if (!isSystemAdmin) return;
    if (member.id === currentUser.id && newRole !== 'admin') {
      alert("Đồng chí không thể tự hạ quyền của chính mình.");
      return;
    }
    onUpdateMember({ ...member, role: newRole });
    alert(`Đã cập nhật vai trò của đồng chí ${member.name} thành ${newRole.toUpperCase()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-32 transition-colors duration-300">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-6 py-5 border-b border-gray-200 dark:border-white/5">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-gray-800 dark:text-white">
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Cá nhân</h2>
        <div className="size-10"></div>
      </header>

      <div className="px-6 py-8 flex flex-col items-center">
        <div className="relative group mb-4">
          <div className="absolute -inset-1.5 bg-gradient-to-br from-primary to-emerald-400 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
          <div className="relative size-24 rounded-full border-4 border-white dark:border-background-dark overflow-hidden shadow-2xl">
            <img src={currentUser.avatar || "https://picsum.photos/200/200"} className="size-full object-cover" alt="Avatar" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-primary text-white size-8 rounded-full border-4 border-white dark:border-background-dark flex items-center justify-center shadow-lg">
             <span className="material-symbols-outlined text-sm">verified</span>
          </div>
        </div>
        <h1 className="text-xl font-black text-gray-900 dark:text-white">{currentUser.name}</h1>
        <p className="text-xs text-primary font-bold uppercase tracking-[0.2em] mt-1">{currentUser.position}</p>
      </div>

      <div className="space-y-8">
        {/* SECTION: TÀI KHOẢN */}
        <section>
          <div className="px-8 pb-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Tài khoản & Bảo mật</h3>
          </div>
          <div className="mx-6 bg-white dark:bg-surface-dark/40 rounded-[2.5rem] border border-gray-100 dark:border-white/5 overflow-hidden divide-y divide-gray-100 dark:divide-white/5 shadow-sm">
            <button onClick={() => onNavigate(Screen.PROFILE)} className="w-full flex items-center gap-5 px-6 py-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-left group">
              <div className="size-11 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-gray-800 dark:text-gray-200">Thông tin hồ sơ</p>
                <p className="text-[10px] text-gray-500 font-bold mt-0.5 uppercase tracking-wider">{currentUser.code}</p>
              </div>
              <span className="material-symbols-outlined text-gray-300">chevron_right</span>
            </button>
            <button onClick={() => setIsPasswordModalOpen(true)} className="w-full flex items-center gap-5 px-6 py-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-left group">
              <div className="size-11 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">lock_reset</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-gray-800 dark:text-gray-200">Đổi mật khẩu</p>
                <p className="text-[10px] text-gray-500 font-bold mt-0.5 uppercase tracking-wider">Cập nhật định kỳ để bảo mật</p>
              </div>
              <span className="material-symbols-outlined text-gray-300">chevron_right</span>
            </button>
          </div>
        </section>

        {/* SECTION: HỆ THỐNG */}
        <section>
          <div className="px-8 pb-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Quản trị hệ thống</h3>
          </div>
          <div className="mx-6 bg-white dark:bg-surface-dark/40 rounded-[2.5rem] border border-gray-100 dark:border-white/5 overflow-hidden divide-y divide-gray-100 dark:divide-white/5 shadow-sm">
            <button 
              onClick={() => setIsRolesModalOpen(true)} 
              className="w-full flex items-center gap-5 px-6 py-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-left group"
            >
              <div className="size-11 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">shield_person</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-gray-800 dark:text-gray-200">Quản lý phân quyền</p>
                <p className="text-[10px] text-gray-500 font-bold mt-0.5 uppercase tracking-wider">Xem danh sách cán bộ quản lý</p>
              </div>
              <span className="material-symbols-outlined text-gray-300">chevron_right</span>
            </button>
            
            {isSystemAdmin && (
              <div className="w-full flex items-center gap-5 px-6 py-5">
                <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">auto_awesome</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-gray-800 dark:text-gray-200">Trợ lý AI IVAC</p>
                  <p className="text-[10px] text-gray-500 font-bold mt-0.5 uppercase tracking-wider">Tính năng gợi ý thông minh</p>
                </div>
                <button 
                  onClick={toggleAI} 
                  className={`w-12 h-6 rounded-full relative transition-all duration-300 ${settings.aiEnabled ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-800'}`}
                >
                  <div className={`absolute top-1 size-4 bg-white rounded-full shadow-md transition-all duration-300 ${settings.aiEnabled ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* SECTION: GIAO DIỆN */}
        <section>
          <div className="px-8 pb-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Giao diện & Thông báo</h3>
          </div>
          <div className="mx-6 bg-white dark:bg-surface-dark/40 rounded-[2.5rem] border border-gray-100 dark:border-white/5 overflow-hidden divide-y divide-gray-100 dark:divide-white/5 shadow-sm">
            <div className="w-full flex items-center gap-5 px-6 py-5">
              <div className="size-11 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">notifications_active</span>
              </div>
              <div className="flex-1 text-sm font-black text-gray-800 dark:text-gray-200">Thông báo đẩy</div>
              <button 
                onClick={toggleNotifications} 
                className={`w-12 h-6 rounded-full relative transition-all duration-300 ${settings.notifEnabled ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-800'}`}
              >
                <div className={`absolute top-1 size-4 bg-white rounded-full shadow-md transition-all duration-300 ${settings.notifEnabled ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>
            <div className="w-full flex items-center gap-5 px-6 py-5">
              <div className="size-11 rounded-2xl bg-slate-500/10 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">dark_mode</span>
              </div>
              <div className="flex-1 text-sm font-black text-gray-800 dark:text-gray-200">Giao diện tối (Dark)</div>
              <button 
                onClick={toggleDarkMode} 
                className={`w-12 h-6 rounded-full relative transition-all duration-300 ${settings.darkMode ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-800'}`}
              >
                <div className={`absolute top-1 size-4 bg-white rounded-full shadow-md transition-all duration-300 ${settings.darkMode ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </section>
      </div>

      <div className="px-6 mt-12 mb-8">
        <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 py-5 bg-red-500/5 border border-red-500/20 text-red-500 rounded-[2rem] font-black uppercase tracking-widest text-xs active:scale-95 transition-all shadow-sm">
          <span className="material-symbols-outlined">logout</span> Đăng xuất tài khoản
        </button>
      </div>

      {/* MODAL: ĐỔI MẬT KHẨU */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
           <div className="bg-surface-dark w-full max-w-sm rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 flex flex-col animate-in zoom-in-95 duration-300">
              <header className="p-8 bg-primary text-white flex justify-between items-center">
                 <h2 className="text-xl font-black uppercase tracking-tight">Đổi mật khẩu</h2>
                 <button onClick={() => setIsPasswordModalOpen(false)} className="size-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"><span className="material-symbols-outlined">close</span></button>
              </header>
              <div className="p-8 space-y-5">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Mật khẩu cũ</label>
                    <input 
                      type="password"
                      value={passwordForm.old} 
                      onChange={e => setPasswordForm({...passwordForm, old: e.target.value})} 
                      className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary outline-none text-sm font-bold shadow-inner" 
                      placeholder="••••••••"
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Mật khẩu mới</label>
                    <input 
                      type="password"
                      value={passwordForm.new} 
                      onChange={e => setPasswordForm({...passwordForm, new: e.target.value})} 
                      className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary outline-none text-sm font-bold shadow-inner" 
                      placeholder="••••••••"
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Xác nhận mật khẩu mới</label>
                    <input 
                      type="password"
                      value={passwordForm.confirm} 
                      onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})} 
                      className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary outline-none text-sm font-bold shadow-inner" 
                      placeholder="••••••••"
                    />
                 </div>
              </div>
              <footer className="p-8 bg-background-dark/50 border-t border-white/5 flex gap-4">
                 <button onClick={() => setIsPasswordModalOpen(false)} className="flex-1 py-4 text-gray-500 font-black uppercase text-xs">Hủy</button>
                 <button onClick={handleChangePassword} className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black uppercase text-xs shadow-xl shadow-primary/30 active:scale-95 transition-all">Xác nhận đổi</button>
              </footer>
           </div>
        </div>
      )}

      {/* MODAL: QUẢN LÝ PHÂN QUYỀN */}
      {isRolesModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
           <div className="bg-surface-dark w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
              <header className="p-8 bg-orange-500 text-white flex justify-between items-center shrink-0">
                 <div className="flex flex-col">
                    <h2 className="text-xl font-black uppercase tracking-tight">Phân quyền Hệ thống</h2>
                    <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest mt-1">Quản lý vai trò Cán bộ</p>
                 </div>
                 <button onClick={() => setIsRolesModalOpen(false)} className="size-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"><span className="material-symbols-outlined">close</span></button>
              </header>
              
              {/* THỐNG KÊ */}
              <div className="px-8 pt-8 grid grid-cols-3 gap-3 shrink-0">
                 <div className="bg-primary/10 border border-primary/20 rounded-2xl p-3 text-center">
                    <p className="text-[9px] font-black text-primary uppercase mb-1">Admin</p>
                    <p className="text-xl font-black text-white">{stats.admin}</p>
                 </div>
                 <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-3 text-center">
                    <p className="text-[9px] font-black text-orange-500 uppercase mb-1">Editor</p>
                    <p className="text-xl font-black text-white">{stats.editor}</p>
                 </div>
                 <div className="bg-gray-500/10 border border-gray-500/20 rounded-2xl p-3 text-center">
                    <p className="text-[9px] font-black text-gray-400 uppercase mb-1">User</p>
                    <p className="text-xl font-black text-white">{stats.user}</p>
                 </div>
              </div>

              {/* TÌM KIẾM */}
              <div className="p-8 pb-4 shrink-0">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500 text-sm">search</span>
                  <input 
                    value={roleSearchQuery}
                    onChange={e => setRoleSearchQuery(e.target.value)}
                    className="w-full bg-background-dark border border-white/10 rounded-2xl pl-11 pr-5 py-3.5 text-white text-xs font-bold focus:border-orange-500 outline-none transition-all shadow-inner" 
                    placeholder="Tìm đoàn viên để thêm Editor..."
                  />
                </div>
                {roleSearchQuery === '' && (
                  <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mt-4 ml-1">Danh sách Admin & Editor hiện tại</p>
                )}
              </div>

              <div className="flex-1 overflow-y-auto px-8 pb-8 no-scrollbar space-y-3">
                 {displayedRoleMembers.map(m => (
                   <div key={m.id} className="bg-white/5 p-4 rounded-3xl border border-white/5 flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                         <div className="size-11 rounded-2xl overflow-hidden border-2 border-white/5">
                            <img src={m.avatar || "https://picsum.photos/100/100"} className="size-full object-cover" alt="Member" />
                         </div>
                         <div className="min-w-0">
                            <p className="text-sm font-black text-white truncate">{m.name}</p>
                            <p className="text-[9px] text-gray-500 font-bold uppercase">{m.code} • {m.role === 'admin' ? 'Hệ thống' : m.branch}</p>
                         </div>
                      </div>
                      
                      {isSystemAdmin ? (
                        <div className="flex bg-background-dark/50 p-1 rounded-xl border border-white/5">
                           {(['admin', 'editor', 'user'] as MemberRole[]).map(role => (
                             <button 
                               key={role}
                               onClick={() => handleUpdateRole(m, role)}
                               className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${m.role === role ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                             >
                               {role}
                             </button>
                           ))}
                        </div>
                      ) : (
                        <span className={`px-3 py-1.5 bg-white/5 border border-white/10 text-orange-500 text-[8px] font-black uppercase rounded-lg`}>
                          {m.role}
                        </span>
                      )}
                   </div>
                 ))}
                 {displayedRoleMembers.length === 0 && (
                   <div className="py-10 text-center opacity-30">
                      <span className="material-symbols-outlined text-4xl">person_search</span>
                      <p className="text-[10px] font-black uppercase tracking-widest mt-2">Không tìm thấy đoàn viên</p>
                   </div>
                 )}
              </div>
              
              <footer className="p-8 bg-background-dark/50 border-t border-white/5 flex flex-col items-center gap-3">
                 {!isSystemAdmin && (
                   <p className="text-[9px] text-rose-400 font-bold uppercase tracking-widest italic">* Chỉ Admin mới có quyền điều chỉnh vai trò</p>
                 )}
                 <button onClick={() => setIsRolesModalOpen(false)} className="w-full py-4 bg-white/5 border border-white/10 text-gray-400 font-black uppercase text-xs rounded-2xl">Đóng</button>
              </footer>
           </div>
        </div>
      )}
    </div>
  );
};

export default SettingsScreen;
