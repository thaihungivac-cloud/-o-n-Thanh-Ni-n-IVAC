
import React, { useState } from 'react';
import { Screen } from '../types';

interface AttendanceProps {
  onNavigate: (screen: Screen) => void;
}

const Attendance: React.FC<AttendanceProps> = ({ onNavigate }) => {
  const [memberCode, setMemberCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-hidden h-screen">
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between px-4 py-3 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-200 dark:border-white/10 z-50">
        <button onClick={() => onNavigate(Screen.HOME)} className="size-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="font-bold text-lg">Điểm danh</h2>
        <div className="size-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 no-scrollbar pb-24">
        {/* Event Card */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary to-primary-dark p-6 text-white shadow-xl shrink-0">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
          <div className="relative z-10 flex flex-col gap-5">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-green-300 animate-pulse"></span>
                Đang diễn ra
              </span>
              <h1 className="mt-2 text-2xl font-black">Đại hội Chi đoàn IVAC 2024</h1>
              <p className="text-white/80 text-sm mt-1">Hội trường A • 08:00 - 11:30</p>
            </div>
            <button 
              onClick={() => setIsScanning(true)}
              className="w-full h-12 bg-white text-primary rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined">qr_code_scanner</span>
              <span>Quét QR Điểm danh</span>
            </button>
          </div>
        </div>

        {/* Manual Input */}
        <div className="space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Điểm danh thủ công</h3>
            <button className="text-xs font-semibold text-primary">Nhập nhiều</button>
          </div>
          <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-gray-200 dark:border-white/5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400">Mã đoàn viên</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">badge</span>
                <input 
                  type="text" 
                  value={memberCode}
                  onChange={(e) => setMemberCode(e.target.value)}
                  className="w-full pl-10 h-12 bg-slate-50 dark:bg-background-dark border-gray-200 dark:border-primary/20 rounded-xl focus:ring-primary focus:border-primary transition-all text-sm font-medium" 
                  placeholder="Ví dụ: IVAC001" 
                />
              </div>
            </div>
            <button className="w-full h-12 bg-slate-900 dark:bg-primary/20 text-white rounded-xl font-bold active:scale-[0.98] transition-all">
              Xác nhận điểm danh
            </button>
          </div>
        </div>

        {/* Realtime Stats */}
        <div className="space-y-4 shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Thống kê thực tế</h3>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">update</span> Vừa cập nhật
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col items-center">
              <span className="text-3xl font-black text-primary">85</span>
              <span className="text-xs font-medium text-slate-500">Đã điểm danh</span>
            </div>
            <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col items-center">
              <span className="text-3xl font-black text-slate-300">15</span>
              <span className="text-xs font-medium text-slate-500">Vắng mặt</span>
            </div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-gray-200 dark:border-white/5 shrink-0">
           <h4 className="font-bold text-sm mb-5">Tiến độ theo Chi đoàn</h4>
           <div className="space-y-5">
             {[
               { name: 'Kỹ thuật', current: 18, total: 20, color: 'bg-primary' },
               { name: 'Văn phòng', current: 10, total: 10, color: 'bg-primary' },
               { name: 'Sản xuất', current: 45, total: 60, color: 'bg-orange-500' },
               { name: 'Kho vận', current: 12, total: 30, color: 'bg-red-500' },
             ].map((item, idx) => (
               <div key={idx} className="space-y-2">
                 <div className="flex justify-between items-end">
                   <span className="text-sm font-medium">Chi đoàn {item.name}</span>
                   <span className={`text-[10px] font-bold ${item.current/item.total >= 0.8 ? 'text-primary' : 'text-slate-400'}`}>
                     {item.current}/{item.total} ({Math.round(item.current/item.total*100)}%)
                   </span>
                 </div>
                 <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                   <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.current/item.total*100}%` }}></div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </main>

      {/* QR Scanning Overlay Simulation */}
      {isScanning && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="absolute top-10 right-6">
              <button onClick={() => setIsScanning(false)} className="size-12 rounded-full bg-white/10 flex items-center justify-center text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
           </div>
           
           <div className="relative w-64 h-64 border-2 border-white/20 rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-slate-900/40"></div>
              {/* Scan indicator line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-primary shadow-[0_0_15px_rgba(0,148,84,1)] animate-[scan_2s_ease-in-out_infinite]"></div>
              
              {/* Corner indicators */}
              <div className="absolute top-4 left-4 size-6 border-t-4 border-l-4 border-primary rounded-tl-sm"></div>
              <div className="absolute top-4 right-4 size-6 border-t-4 border-r-4 border-primary rounded-tr-sm"></div>
              <div className="absolute bottom-4 left-4 size-6 border-b-4 border-l-4 border-primary rounded-bl-sm"></div>
              <div className="absolute bottom-4 right-4 size-6 border-b-4 border-r-4 border-primary rounded-br-sm"></div>
           </div>
           
           <div className="mt-12 text-center text-white">
              <h3 className="text-xl font-bold mb-2">Đưa mã QR vào khung hình</h3>
              <p className="text-white/60 text-sm">Hệ thống sẽ tự động quét khi nhận diện được mã.</p>
           </div>
           
           <div className="mt-auto pb-10 w-full">
              <button className="w-full h-14 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center gap-2 text-white font-bold active:bg-white/20">
                <span className="material-symbols-outlined">flashlight_on</span>
                Bật đèn flash
              </button>
           </div>
        </div>
      )}

      <style>{`
        @keyframes scan {
          0%, 100% { top: 0% }
          50% { top: 100% }
        }
      `}</style>
    </div>
  );
};

export default Attendance;
