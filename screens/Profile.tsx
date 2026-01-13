
import React from 'react';
import { Screen } from '../types';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface ProfileProps {
  onNavigate: (screen: Screen) => void;
}

const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
  const chartData = [
    { name: 'T1', value: 65 },
    { name: 'T3', value: 72 },
    { name: 'T6', value: 81 },
    { name: 'T9', value: 85 },
    { name: 'T12', value: 88 },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark pb-10">
      {/* App Bar */}
      <div className="sticky top-0 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5 pt-12">
        <div className="flex items-center justify-between p-4 pt-0">
          <button onClick={() => onNavigate(Screen.HOME)} className="size-10 flex items-center justify-center rounded-full hover:bg-black/5">
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h2 className="font-bold text-lg">Hồ sơ Đoàn viên</h2>
          <button className="size-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
            <span className="material-symbols-outlined">qr_code_2</span>
          </button>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <div className="size-28 rounded-full border-4 border-white dark:border-surface-dark shadow-2xl overflow-hidden ring-4 ring-primary/20">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSmQVtzmHbP5iBpGggtTwLNhanHSgF1MOZCNUZWSrTI5t9kKBfyEKyiMeNbFuLT875MeBIzpVS41UbjmJicFbYboHgCKDge01CZIBNbVk8k2QrvbrkA5-UReG3ZFMOyP-Q5ZQBSL_SVX2vRDG8fpOQ5tJNEhv-7CHI3NeJr6fVAX0BV99DcWeHO8NnRD8ISEjSjlnNZU1CP36e26RZpx63v1dLNN71ElM1Clr-gmxq01nKgOssdEwVURD4g8cwOm6wZ8XH0SUaDYFS" className="w-full h-full object-cover" alt="Profile" />
            </div>
            <div className="absolute bottom-1 right-1 bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border-2 border-white dark:border-surface-dark">
              <span className="material-symbols-outlined text-[12px] fill-1">verified</span> Đoàn viên
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black">Nguyễn Văn A</h1>
            <p className="text-primary font-semibold text-sm mt-1">Bí thư Chi đoàn - Khối Văn phòng</p>
          </div>
          <div className="flex gap-3">
             <button className="px-5 py-2 bg-primary text-white rounded-full text-xs font-bold shadow-lg shadow-primary/30 active:scale-95 flex items-center gap-2">
               <span className="material-symbols-outlined text-base">edit</span> Cập nhật
             </button>
             <button className="px-5 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full text-xs font-bold active:scale-95 flex items-center gap-2">
               <span className="material-symbols-outlined text-base">share</span> Chia sẻ
             </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Năm TG', value: '5', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/20', icon: 'calendar_month' },
            { label: 'Hoạt động', value: '24', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-500/20', icon: 'local_activity' },
            { label: 'Điểm RL', value: '92', color: 'text-primary', bg: 'bg-primary/10', icon: 'stars' },
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm text-center">
              <div className={`size-8 rounded-full ${s.bg} ${s.color} mx-auto mb-2 flex items-center justify-center`}>
                <span className="material-symbols-outlined text-base">{s.icon}</span>
              </div>
              <p className="text-xl font-black">{s.value}</p>
              <p className="text-[9px] uppercase font-bold text-slate-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Training Points Chart */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Điểm rèn luyện</h3>
            <button className="text-xs font-bold text-primary flex items-center">
               Chi tiết <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
          <div className="bg-[#1a382d] rounded-3xl p-6 shadow-xl relative overflow-hidden h-56">
             <div className="absolute top-0 right-0 size-32 bg-primary/20 blur-3xl rounded-full"></div>
             <div className="flex justify-between items-end mb-4 relative z-10">
               <div>
                 <p className="text-white/50 text-xs font-bold">Năm 2023</p>
                 <h4 className="text-white text-3xl font-black mt-1">88<span className="text-lg text-white/40 font-normal">/100</span></h4>
               </div>
               <div className="bg-primary/20 px-3 py-1 rounded-full border border-primary/30 flex items-center gap-1">
                 <span className="material-symbols-outlined text-[#0bda46] text-sm">trending_up</span>
                 <span className="text-[#0bda46] text-xs font-black">+5%</span>
               </div>
             </div>
             
             <div className="h-28 w-full relative z-10 -ml-4 -mr-4">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#009454" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#009454" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" hide />
                      <YAxis hide />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#8dceb2" 
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                        strokeWidth={3}
                      />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
             <div className="flex justify-between mt-2 px-1 relative z-10">
                {['T1', 'T3', 'T6', 'T9', 'T12'].map((t, i) => (
                  <span key={i} className={`text-[10px] font-bold ${i === 4 ? 'text-white' : 'text-white/40'}`}>{t}</span>
                ))}
             </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="bg-white dark:bg-surface-dark p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm space-y-5">
           <div className="flex items-center justify-between mb-2">
             <h3 className="font-bold">Thông tin cá nhân</h3>
             <button className="text-slate-400"><span className="material-symbols-outlined text-[18px]">visibility</span></button>
           </div>
           {[
             { icon: 'cake', label: 'Ngày sinh', value: '01/01/1995' },
             { icon: 'group_add', label: 'Ngày vào Đoàn', value: '26/03/2010' },
             { icon: 'badge', label: 'Chức vụ', value: 'Bí thư Chi đoàn' },
           ].map((info, idx) => (
             <div key={idx} className="flex items-center gap-4">
               <div className="size-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500">
                 <span className="material-symbols-outlined">{info.icon}</span>
               </div>
               <div className="flex-1 border-b border-gray-100 dark:border-white/5 pb-2">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{info.label}</p>
                 <p className="text-sm font-bold mt-0.5">{info.value}</p>
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
