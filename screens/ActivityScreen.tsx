
import React from 'react';

interface ActivityScreenProps {
  onBack: () => void;
}

const ActivityScreen: React.FC<ActivityScreenProps> = ({ onBack }) => {
  const activities = [
    { name: 'Họp chi đoàn tháng 10', loc: 'Hội trường A', time: '15/10/2023 - 09:00 AM', status: 'Sắp tới', icon: 'calendar_month' },
    { name: 'Tập huấn kỹ năng mềm', loc: 'Phòng họp 2', time: '20/10/2023 - 08:00 AM', status: 'Sắp tới', icon: 'school' },
    { name: 'Hiến máu nhân đạo', loc: 'Sảnh chính', time: '01/10/2023 - 07:00 AM', status: 'Đã xong', icon: 'volunteer_activism' },
  ];

  return (
    <div className="flex flex-col pb-24 h-full bg-background-dark">
      <header className="sticky top-0 z-40 bg-background-dark/95 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-white/5">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold">Hoạt động</h2>
        <button className="size-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined">filter_list</span>
        </button>
      </header>

      <div className="p-4 space-y-4">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 material-symbols-outlined">search</span>
          <input 
            type="text" 
            className="w-full bg-surface-dark border-none rounded-xl pl-10 py-3 text-sm focus:ring-primary"
            placeholder="Tìm kiếm hoạt động..."
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {['Tất cả', 'Sắp tới', 'Đã hoàn thành', 'Đã hủy'].map((chip, idx) => (
            <button 
              key={idx}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border ${idx === 0 ? 'bg-primary border-primary text-white' : 'bg-surface-dark border-white/5 text-gray-400'}`}
            >
              {chip}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {activities.map((a, idx) => (
            <div key={idx} className={`p-4 rounded-2xl bg-surface-dark border border-white/5 flex gap-4 hover:bg-white/5 transition-colors cursor-pointer group ${a.status === 'Đã xong' ? 'opacity-60' : ''}`}>
              <div className="size-14 rounded-2xl bg-background-dark flex items-center justify-center shrink-0 shadow-inner">
                <span className="material-symbols-outlined text-primary text-2xl">{a.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-sm truncate group-hover:text-primary transition-colors">{a.name}</h3>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${
                    a.status === 'Sắp tới' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-gray-700 text-gray-400 border-gray-600'
                  }`}>
                    {a.status}
                  </span>
                </div>
                <div className="flex flex-col gap-1 mt-2">
                  <div className="flex items-center gap-1 text-[10px] text-gray-500">
                    <span className="material-symbols-outlined text-xs">location_on</span>
                    {a.loc}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-500">
                    <span className="material-symbols-outlined text-xs">schedule</span>
                    {a.time}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-24 right-6 z-50">
        <button className="flex items-center justify-center size-14 rounded-full bg-primary text-white shadow-lg shadow-primary/40 hover:scale-105 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-[32px]">add</span>
        </button>
      </div>
    </div>
  );
};

export default ActivityScreen;
