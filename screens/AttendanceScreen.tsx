
import React from 'react';

interface AttendanceScreenProps {
  onBack: () => void;
}

const AttendanceScreen: React.FC<AttendanceScreenProps> = ({ onBack }) => {
  const branches = [
    { name: 'Chi đoàn Kỹ thuật', count: 18, total: 20, color: 'bg-primary' },
    { name: 'Chi đoàn Văn phòng', count: 10, total: 10, color: 'bg-primary' },
    { name: 'Chi đoàn Sản xuất', count: 45, total: 60, color: 'bg-orange-400' },
    { name: 'Chi đoàn Kho vận', count: 12, total: 30, color: 'bg-red-400' },
  ];

  return (
    <div className="flex flex-col pb-24">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-background-dark/95 backdrop-blur-md px-4 py-4 border-b border-white/5">
        <button onClick={onBack} className="flex size-10 items-center justify-center rounded-full hover:bg-white/10">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold">Điểm danh</h2>
        <div className="size-10"></div>
      </header>

      <main className="p-4 space-y-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-[#007a45] p-6 shadow-lg text-white">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
          <div className="relative z-10 flex flex-col gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-semibold backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-green-300 animate-pulse"></span>
                Đang diễn ra
              </span>
              <h1 className="mt-2 text-2xl font-bold leading-tight">Đại hội Chi đoàn IVAC 2024</h1>
              <p className="text-sm font-medium opacity-80">Hội trường A • 08:00 - 11:30</p>
            </div>
            <button className="flex items-center justify-center gap-2 rounded-xl bg-white text-primary py-3 font-bold hover:bg-gray-50 active:scale-95 transition-all">
              <span className="material-symbols-outlined">qr_code_scanner</span>
              Quét QR
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-bold">Điểm danh thủ công</h3>
            <button className="text-xs text-primary font-medium">Nhập nhiều</button>
          </div>
          <div className="bg-surface-dark rounded-2xl p-4 border border-white/5 shadow-sm space-y-4">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Mã đoàn viên</span>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 material-symbols-outlined text-[20px]">badge</span>
                <input 
                  type="text" 
                  className="w-full bg-background-dark border-white/10 rounded-xl pl-10 py-3 text-sm focus:ring-primary focus:border-primary"
                  placeholder="VD: IVAC001"
                />
              </div>
            </div>
            <button className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-sm font-bold transition-colors">
              Xác nhận điểm danh
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-bold">Thống kê</h3>
            <span className="text-[10px] text-gray-500 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">update</span> Vừa xong
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-dark rounded-2xl p-5 flex flex-col items-center justify-center border border-white/5">
              <span className="text-3xl font-black text-primary">85</span>
              <span className="text-xs font-medium text-gray-500">Đã điểm danh</span>
            </div>
            <div className="bg-surface-dark rounded-2xl p-5 flex flex-col items-center justify-center border border-white/5">
              <span className="text-3xl font-black text-gray-600">15</span>
              <span className="text-xs font-medium text-gray-500">Vắng mặt</span>
            </div>
          </div>
          
          <div className="bg-surface-dark rounded-2xl p-5 border border-white/5 space-y-5">
            <h4 className="text-sm font-semibold">Tiến độ theo Chi đoàn</h4>
            {branches.map((b, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-medium text-gray-300">{b.name}</span>
                  <span className={`text-xs font-bold ${b.color.replace('bg-', 'text-')}`}>
                    {b.count}/{b.total} ({Math.round((b.count/b.total)*100)}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-background-dark">
                  <div className={`h-full rounded-full ${b.color}`} style={{ width: `${(b.count/b.total)*100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AttendanceScreen;
