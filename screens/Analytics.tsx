
import React from 'react';
import { Screen } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface AnalyticsProps {
  onNavigate: (screen: Screen) => void;
}

const Analytics: React.FC<AnalyticsProps> = ({ onNavigate }) => {
  const genderData = [
    { name: 'Nam', value: 60, color: '#009454' },
    { name: 'Nữ', value: 40, color: '#2d5e4b' },
  ];

  const activityData = [
    { month: 'T1', value: 45 },
    { month: 'T2', value: 52 },
    { month: 'T3', value: 78 },
    { month: 'T4', value: 65 },
    { month: 'T5', value: 89 },
    { month: 'T6', value: 120 },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-50 flex flex-col p-4 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold">Dashboard Phân tích</h1>
          <button className="size-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-500">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>
        <div className="flex items-center gap-1 text-sm text-slate-500 font-medium">
          <span>Tháng 10, 2023</span>
          <span className="material-symbols-outlined text-base">expand_more</span>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {['Toàn trường', 'Kỹ thuật', 'Văn phòng', 'Kinh doanh'].map((f, i) => (
            <button 
              key={i} 
              className={`shrink-0 h-9 px-5 rounded-full text-xs font-bold transition-all ${
                i === 0 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-slate-600 dark:text-gray-400'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
             <div className="flex items-center justify-between mb-4">
               <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                 <span className="material-symbols-outlined text-lg">groups</span>
               </div>
               <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">+5%</span>
             </div>
             <p className="text-xs font-medium text-slate-500">Tổng đoàn viên</p>
             <p className="text-2xl font-black mt-1">1,240</p>
          </div>
          <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
             <div className="flex items-center justify-between mb-4">
               <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                 <span className="material-symbols-outlined text-lg">payments</span>
               </div>
               <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">+12%</span>
             </div>
             <p className="text-xs font-medium text-slate-500">Đoàn phí đã thu</p>
             <p className="text-2xl font-black mt-1">85%</p>
          </div>
        </div>

        {/* Gender Pie Chart */}
        <div className="bg-white dark:bg-surface-dark p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
           <div className="flex items-center justify-between mb-6">
             <h3 className="font-bold">Tỷ lệ giới tính</h3>
             <button className="text-xs font-bold text-primary">Chi tiết</button>
           </div>
           <div className="flex items-center justify-between gap-4">
             <div className="size-32 shrink-0">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                      data={genderData}
                      innerRadius={45}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                 </PieChart>
               </ResponsiveContainer>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <p className="text-[8px] uppercase font-bold text-slate-400">Tổng</p>
                  <p className="text-sm font-black">1,240</p>
               </div>
             </div>
             <div className="flex-1 space-y-4">
               {genderData.map((item, idx) => (
                 <div key={idx} className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <div className="size-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                     <span className="text-xs font-medium">{item.name}</span>
                   </div>
                   <span className="text-xs font-black">{item.value}%</span>
                 </div>
               ))}
             </div>
           </div>
        </div>

        {/* Warnings */}
        <div className="space-y-4">
           <div className="flex items-center justify-between">
             <h3 className="font-bold">Cần chú ý</h3>
             <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Top cảnh báo</span>
           </div>
           <div className="space-y-3">
             {[
               { icon: 'warning', name: 'Nguyễn Văn An', desc: 'Vắng sinh hoạt 3 lần', color: 'text-amber-500', bg: 'bg-amber-500/10' },
               { icon: 'report', name: 'Chi đoàn Kỹ thuật', desc: 'Chưa nộp báo cáo tháng', color: 'text-red-500', bg: 'bg-red-500/10' },
             ].map((item, idx) => (
               <div key={idx} className="bg-white dark:bg-surface-dark p-3 rounded-xl border border-gray-100 dark:border-white/5 flex items-center gap-4">
                 <div className={`size-10 rounded-full flex items-center justify-center ${item.bg} ${item.color}`}>
                   <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                 </div>
                 <div className="flex-1 min-w-0">
                   <p className="text-sm font-bold truncate">{item.name}</p>
                   <p className="text-xs text-slate-500 truncate">{item.desc}</p>
                 </div>
                 <button className="p-2 text-slate-400">
                   <span className="material-symbols-outlined text-lg">chevron_right</span>
                 </button>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
