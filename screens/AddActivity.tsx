
import React, { useState } from 'react';
import { Screen } from '../types';

interface AddActivityProps {
  onNavigate: (screen: Screen) => void;
}

const AddActivity: React.FC<AddActivityProps> = ({ onNavigate }) => {
  const [step, setStep] = useState(1);

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark h-screen overflow-hidden">
      <header className="shrink-0 px-4 py-4 flex items-center justify-between bg-white dark:bg-background-dark border-b border-gray-200 dark:border-white/5">
        <button onClick={() => onNavigate(Screen.HOME)} className="size-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10">
          <span className="material-symbols-outlined">close</span>
        </button>
        <h1 className="text-lg font-bold">Tạo Hoạt động Mới</h1>
        <div className="size-10"></div>
      </header>

      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-8 px-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className={`size-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-200 dark:bg-white/10 text-slate-500'}`}>
                {s}
              </div>
              {s < 3 && <div className={`h-1 flex-1 mx-2 rounded-full ${step > s ? 'bg-primary' : 'bg-slate-200 dark:bg-white/10'}`}></div>}
            </div>
          ))}
        </div>

        <main className="space-y-6">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400">Tên hoạt động</label>
                <input type="text" className="w-full h-12 bg-white dark:bg-surface-dark border-gray-200 dark:border-white/5 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium" placeholder="Ví dụ: Chiến dịch mùa hè xanh" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400">Loại hoạt động</label>
                <select className="w-full h-12 bg-white dark:bg-surface-dark border-gray-200 dark:border-white/5 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium">
                  <option>Tình nguyện</option>
                  <option>Hội họp</option>
                  <option>Thể thao / Văn nghệ</option>
                  <option>Khác</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400">Mô tả ngắn</label>
                <textarea rows={4} className="w-full bg-white dark:bg-surface-dark border-gray-200 dark:border-white/5 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium resize-none" placeholder="Mô tả nội dung chính của hoạt động..."></textarea>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Ngày bắt đầu</label>
                  <input type="date" className="w-full h-12 bg-white dark:bg-surface-dark border-gray-200 dark:border-white/5 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Giờ bắt đầu</label>
                  <input type="time" className="w-full h-12 bg-white dark:bg-surface-dark border-gray-200 dark:border-white/5 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400">Địa điểm</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">location_on</span>
                  <input type="text" className="w-full pl-10 h-12 bg-white dark:bg-surface-dark border-gray-200 dark:border-white/5 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium" placeholder="Hội trường A, IVAC..." />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-10">
              <div className="size-24 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-[48px]">check_circle</span>
              </div>
              <h2 className="text-xl font-bold">Xác nhận thông tin</h2>
              <p className="text-sm text-slate-500">Vui lòng kiểm tra kỹ các thông tin trước khi đăng tải hoạt động lên hệ thống.</p>
              
              <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-gray-100 dark:border-white/5 text-left mt-6">
                 <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-white/5">
                    <span className="text-xs text-slate-400">Tên hoạt động</span>
                    <span className="text-sm font-bold">Lao động vệ sinh 26/3</span>
                 </div>
                 <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-white/5">
                    <span className="text-xs text-slate-400">Ngày diễn ra</span>
                    <span className="text-sm font-bold">20/03/2024</span>
                 </div>
                 <div className="flex justify-between items-center pt-3">
                    <span className="text-xs text-slate-400">Đơn vị chủ trì</span>
                    <span className="text-sm font-bold">BCH Đoàn IVAC</span>
                 </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <footer className="mt-auto p-4 flex gap-3 border-t border-gray-200 dark:border-white/5 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md pb-10">
        {step > 1 && (
          <button onClick={() => setStep(s => s - 1)} className="flex-1 h-14 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 rounded-xl font-bold active:scale-95 transition-all">Quay lại</button>
        )}
        <button 
          onClick={() => step < 3 ? setStep(s => s + 1) : onNavigate(Screen.HOME)} 
          className="flex-[2] h-14 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 active:scale-95 transition-all"
        >
          {step === 3 ? 'Hoàn tất & Đăng' : 'Tiếp theo'}
        </button>
      </footer>
    </div>
  );
};

export default AddActivity;
