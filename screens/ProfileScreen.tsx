
import React from 'react';

interface ProfileScreenProps {
  onBack: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col pb-32">
      <header className="sticky top-0 z-40 bg-background-dark/95 backdrop-blur-md px-4 py-4 border-b border-white/5 flex items-center justify-between">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full hover:bg-white/10">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="text-lg font-bold">Hồ sơ Đoàn viên</h2>
        <button className="size-10 flex items-center justify-center rounded-full bg-primary/20 text-primary">
          <span className="material-symbols-outlined">qr_code_2</span>
        </button>
      </header>

      <div className="px-6 py-8 flex flex-col items-center">
        <div className="relative group mb-4">
          <div className="absolute -inset-1 bg-gradient-to-br from-primary to-emerald-400 rounded-full blur opacity-75 group-hover:opacity-100 transition"></div>
          <div className="relative size-28 rounded-full border-4 border-background-dark overflow-hidden shadow-xl">
            <img src="https://picsum.photos/200/200?random=11" className="size-full object-cover" alt="Profile" />
          </div>
          <div className="absolute bottom-1 right-1 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-background-dark flex items-center gap-1">
             <span className="material-symbols-outlined text-[12px]">verified</span>
             Đoàn viên
          </div>
        </div>
        
        <h1 className="text-2xl font-bold">Nguyễn Văn A</h1>
        <p className="text-sm text-primary font-medium mt-1">Bí thư Chi đoàn - Khối Văn phòng</p>
        
        <div className="flex gap-3 mt-4">
          <button className="px-5 py-2 bg-primary text-white text-xs font-bold rounded-full shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">edit</span>
            Cập nhật
          </button>
          <button className="px-5 py-2 bg-white/10 text-white text-xs font-bold rounded-full border border-white/10 hover:bg-white/20 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">share</span>
            Chia sẻ
          </button>
        </div>
      </div>

      <div className="px-4 grid grid-cols-3 gap-3">
        {[
          { icon: 'calendar_month', value: '5', label: 'Năm TG', color: 'text-blue-400 bg-blue-400/10' },
          { icon: 'local_activity', value: '24', label: 'Hoạt động', color: 'text-orange-400 bg-orange-400/10' },
          { icon: 'stars', value: '92', label: 'Điểm RL', color: 'text-primary bg-primary/10' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-surface-dark border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-center">
            <div className={`size-10 rounded-full flex items-center justify-center ${stat.color}`}>
              <span className="material-symbols-outlined text-lg">{stat.icon}</span>
            </div>
            <p className="text-xl font-bold leading-none">{stat.value}</p>
            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="px-4 mt-8 space-y-4">
        <h3 className="font-bold px-1">Điểm rèn luyện</h3>
        <div className="bg-[#1a382d] rounded-2xl p-6 relative overflow-hidden shadow-xl border border-white/5">
           <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-white/60 text-xs">Năm 2023</p>
                <h4 className="text-2xl font-bold text-white mt-1">88<span className="text-sm text-white/40 font-normal">/100</span></h4>
              </div>
              <div className="bg-primary/20 backdrop-blur-sm px-3 py-1 rounded-full border border-primary/20 flex items-center gap-1">
                <span className="material-symbols-outlined text-green-400 text-sm">trending_up</span>
                <span className="text-green-400 text-xs font-bold">+5%</span>
              </div>
           </div>
           {/* Mock Chart SVG */}
           <div className="w-full h-24 mt-4">
              <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                <path d="M0,80 C50,70 100,85 150,50 C200,30 250,45 300,10" fill="none" stroke="#009454" strokeWidth="4" strokeLinecap="round" />
                <path d="M0,80 C50,70 100,85 150,50 C200,30 250,45 300,10 L300,100 L0,100 Z" fill="url(#grad)" opacity="0.2" />
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#009454" />
                    <stop offset="100%" stopColor="#0f231a" />
                  </linearGradient>
                </defs>
              </svg>
           </div>
        </div>
      </div>

      <div className="px-4 mt-8 space-y-4">
        <h3 className="font-bold px-1">Thông tin cá nhân</h3>
        <div className="bg-surface-dark rounded-2xl p-2 border border-white/5">
           {[
             { icon: 'cake', label: 'Ngày sinh', value: '01/01/1995' },
             { icon: 'group_add', label: 'Ngày vào Đoàn', value: '26/03/2010' },
             { icon: 'badge', label: 'Chức vụ', value: 'Bí thư Chi đoàn' },
           ].map((info, idx) => (
             <div key={idx} className={`flex items-center gap-4 p-4 ${idx !== 2 ? 'border-b border-white/5' : ''}`}>
               <div className="size-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                 <span className="material-symbols-outlined text-xl">{info.icon}</span>
               </div>
               <div>
                 <p className="text-[10px] uppercase font-bold text-gray-500">{info.label}</p>
                 <p className="text-sm font-semibold">{info.value}</p>
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
