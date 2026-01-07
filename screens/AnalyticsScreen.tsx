
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface AnalyticsScreenProps {
  onBack: () => void;
}

const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({ onBack }) => {
  const genderData = [
    { name: 'Nam', value: 60 },
    { name: 'Nữ', value: 40 },
  ];

  const barData = [
    { name: 'T1', value: 40 },
    { name: 'T3', value: 65 },
    { name: 'T6', value: 50 },
    { name: 'T9', value: 85 },
    { name: 'T12', value: 92 },
  ];

  const COLORS = ['#009454', '#2d5e4b'];

  return (
    <div className="flex flex-col pb-24">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-background-dark/95 backdrop-blur-md px-4 py-4 border-b border-white/5">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full hover:bg-white/10">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-bold">Dashboard Phân tích</h2>
          <div className="flex items-center gap-1 text-[10px] text-gray-500">
            Tháng 10, 2023 <span className="material-symbols-outlined text-xs">expand_more</span>
          </div>
        </div>
        <button className="size-10 flex items-center justify-center rounded-full bg-white/5">
          <span className="material-symbols-outlined">filter_list</span>
        </button>
      </header>

      <div className="p-4 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-dark p-5 rounded-2xl border border-white/5 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-lg">groups</span>
              </div>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">+5%</span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Tổng đoàn viên</p>
              <p className="text-2xl font-bold">1,240</p>
            </div>
          </div>
          <div className="bg-surface-dark p-5 rounded-2xl border border-white/5 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-lg">payments</span>
              </div>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">+12%</span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Đoàn phí đã thu</p>
              <p className="text-2xl font-bold">85%</p>
            </div>
          </div>
        </div>

        <div className="bg-surface-dark p-6 rounded-2xl border border-white/5 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold">Tỷ lệ giới tính</h3>
            <button className="text-xs text-primary font-medium">Chi tiết</button>
          </div>
          <div className="flex items-center gap-6 h-32">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    innerRadius={35}
                    outerRadius={50}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute left-1/4 translate-x-4 top-1/2 -translate-y-1/2 text-center pointer-events-none">
                <p className="text-[10px] text-gray-500">Tổng</p>
                <p className="text-xs font-bold">1.2k</p>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              {genderData.map((d, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                    <span className="text-xs text-gray-400">{d.name}</span>
                  </div>
                  <span className="text-xs font-bold">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-surface-dark p-6 rounded-2xl border border-white/5 shadow-sm">
           <h3 className="font-bold mb-4">Biểu đồ rèn luyện</h3>
           <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <Bar dataKey="value" fill="#009454" radius={[4, 4, 0, 0]} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666' }} />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-bold px-1">Cần chú ý</h3>
          <div className="space-y-2">
            {[
              { name: 'Nguyễn Văn An', branch: 'Chi đoàn 1', issue: 'Vắng sinh hoạt 3 lần', icon: 'warning', color: 'text-amber-500 bg-amber-500/10' },
              { name: 'Chi đoàn Kỹ thuật', branch: 'Đơn vị', issue: 'Chưa nộp báo cáo tháng', icon: 'report', color: 'text-red-500 bg-red-500/10' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-surface-dark rounded-2xl border border-white/5">
                <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${item.color}`}>
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{item.name}</p>
                  <p className="text-xs text-gray-500 truncate">{item.branch} • {item.issue}</p>
                </div>
                <span className="material-symbols-outlined text-gray-500">chevron_right</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsScreen;
