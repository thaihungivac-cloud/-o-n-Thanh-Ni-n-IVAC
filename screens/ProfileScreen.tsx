
import React, { useState, useRef, useMemo } from 'react';
import { Member, YouthPosition, BranchName, ActivityPlan } from '../types';

interface ProfileScreenProps {
  currentUser: Member | null;
  members: Member[];
  activities: ActivityPlan[];
  onUpdate: (updatedMember: Member) => void;
  onLogout: () => void;
  onBack: () => void;
  onShowToast: (msg: string, type: 'success' | 'error') => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ currentUser, members, activities, onUpdate, onLogout, onBack, onShowToast }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<Member>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentUser) return null;

  const handleSave = () => {
    if (!editData.name) {
      onShowToast("Họ tên không được để trống!", "error");
      return;
    }
    onUpdate({ ...currentUser, ...editData } as Member);
    setIsEditModalOpen(false);
    onShowToast("Cập nhật hồ sơ thành công!", "success");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ ...currentUser, avatar: reader.result as string });
        onShowToast("Đã cập nhật ảnh đại diện!", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col pb-32 bg-background-dark min-h-screen text-white">
      <header className="sticky top-0 z-40 px-6 py-5 border-b border-white/5 flex items-center justify-between backdrop-blur-md">
        <button onClick={onBack} className="flex size-10 items-center justify-center rounded-full hover:bg-white/5 transition-all text-white">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="text-lg font-black uppercase tracking-tighter">Hồ sơ cá nhân</h2>
        <button onClick={() => { if(window.confirm("Đồng chí chắc chắn muốn đăng xuất?")) onLogout(); }} className="size-10 flex items-center justify-center text-rose-500">
           <span className="material-symbols-outlined">logout</span>
        </button>
      </header>

      <div className="px-6 py-10 flex flex-col items-center">
        <div className="relative group cursor-pointer mb-6" onClick={() => fileInputRef.current?.click()}>
          <img src={currentUser.avatar || "https://picsum.photos/200/200"} className="size-32 rounded-full object-cover border-4 border-primary shadow-2xl" alt="Profile" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined">photo_camera</span>
          </div>
        </div>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        <h1 className="text-2xl font-black">{currentUser.name}</h1>
        <p className="text-sm text-primary font-bold uppercase tracking-widest mt-1">{currentUser.position}</p>
      </div>

      <div className="px-6 space-y-4">
        <div className="bg-surface-dark/30 border border-white/5 rounded-[2.5rem] p-6 space-y-4 shadow-xl">
           <div className="flex flex-col gap-1">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Gmail cá nhân</p>
              <p className="font-bold text-sm">{currentUser.email}</p>
           </div>
           <div className="flex flex-col gap-1 border-t border-white/5 pt-4">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Đơn vị</p>
              <p className="font-bold text-sm">{currentUser.branch}</p>
           </div>
        </div>
        
        <div className="flex flex-col gap-3">
          <button onClick={() => { setEditData(currentUser); setIsEditModalOpen(true); }} className="w-full py-5 bg-primary text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all">
            Chỉnh sửa thông tin
          </button>
          <button onClick={() => { if(window.confirm("Đăng xuất ngay bây giờ?")) onLogout(); }} className="w-full py-5 bg-white/5 border border-white/10 rounded-[2rem] font-black uppercase text-xs tracking-widest text-gray-400">
            Đăng xuất
          </button>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
           <div className="bg-surface-dark w-full max-w-lg rounded-[3rem] p-8 space-y-4 border border-white/10 shadow-2xl">
              <h2 className="text-xl font-black uppercase text-center">Cập nhật hồ sơ</h2>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Họ và tên</label>
                <input value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-primary" placeholder="Nhập họ tên..." />
              </div>
              <div className="flex gap-4 pt-4">
                 <button onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 text-gray-500 font-black uppercase text-xs">Hủy</button>
                 <button onClick={handleSave} className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black uppercase text-xs shadow-xl active:scale-95 transition-all">Lưu hồ sơ</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;
