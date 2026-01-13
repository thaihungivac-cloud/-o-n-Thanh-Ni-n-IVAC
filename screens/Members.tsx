
import React from 'react';
import { Screen } from '../types';

interface MembersProps {
  onNavigate: (screen: Screen) => void;
}

const Members: React.FC<MembersProps> = ({ onNavigate }) => {
  const members = [
    { name: 'Nguyễn Văn An', code: '1023', branch: 'Kỹ thuật', role: 'Phó Bí thư', status: 'Hoạt động', statusColor: 'bg-green-500', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcYst-YYpKoeFxrYPUzLBNgJ4M6MKYwfpIvParg2BFDrl2ns1Fr3Zuj9BGzbT1OTUKewpY8VQYjkZgTlZt3fIrzXTTAby8ATgcOD4QQDaD6WJLEz2JGIjOVDn03N4n8vRIIlYjUcmGWVrwd8aHeLErF5_nBVpDDwz9QLhx5finPx-tRq-UtJs0drUhF6r3x7G51hRoNFp2Rh0j16SRoJH5eKCdFhtlIlqJ_oT_8ja7t7-7pftqy9QmsiPAyVU_7T7m-eMjnRDxhXS4' },
    { name: 'Trần Thị Bích', code: '1024', branch: 'Kinh doanh', role: '', status: 'Chuyển SH', statusColor: 'bg-yellow-500', avatar: '' },
    { name: 'Lê Văn Cường', code: '1025', branch: 'Kế toán', role: '', status: 'Hoạt động', statusColor: 'bg-green-500', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTd8F319Jkt_0be1kypjUcKc5E4vkQ36wv2v9xKcY_1NaI2litCJnPt_CF5E-M_wp5rSIG3PlLS7Lph0W_3cbqDwRKnzRwLsYqVFKs1o1dbh0_-3ao135po9aKWDUXMMqUAo73-PLP7M-G92VfjkO_PRIY6yYKbDFDA0fHNTnx3fKGMeFBaD96KvGPFPwsqGwRc1l5z_zS9fH3Tb1kavi0nWZ1Ts8E79a5mr-hy3PabpVhMGHNOV1qhwSUcmU0QlZ4zdShYiRQP6Jr' },
    { name: 'Phạm Minh', code: '1026', branch: 'Nhân sự', role: '', status: 'Nghỉ thai sản', statusColor: 'bg-slate-400', avatar: '' },
    { name: 'Hoàng Thị Thảo', code: '1027', branch: 'Sản xuất', role: 'Ủy viên BCH', status: 'Hoạt động', statusColor: 'bg-green-500', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYYAGmEnpACVnhjlJg8I1bxbJoOtBVuMkaOr9j-tpOdCx8CLApcgCEuOIrxWtKiDCKXqofw8Vpir4lX0ht3R4TJyqn3tBWsywk6gsVIKyiCcsUivkx9DdTxur0rUkeV7K40qf3H2Ab-Xpb1acSqNE8-gs_VcvatW7M0RJ8nzfDpgRyJeL3yiDMrmeJQYDgODEu1NM3oQbyLwh1l3qFjcx2jLznRY15Y6p9SBNksiXPUR3Bb8blacz4Xxx1ZN4Zt4UK_OfF1gKv1dWS' },
  ];

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <header className="shrink-0 bg-primary px-4 py-4 flex items-center justify-between shadow-md text-white z-50">
        <button onClick={() => onNavigate(Screen.HOME)} className="size-10 flex items-center justify-center rounded-full hover:bg-white/10">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-bold">Danh sách Đoàn viên</h1>
        <button className="size-10 flex items-center justify-center rounded-full hover:bg-white/10">
          <span className="material-symbols-outlined">add</span>
        </button>
      </header>

      <div className="shrink-0 pt-4 pb-2 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm z-40 space-y-3">
        <div className="px-4 relative">
          <span className="absolute left-7 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên hoặc mã..."
            className="w-full h-12 bg-white dark:bg-surface-dark border-none rounded-xl pl-12 pr-12 text-sm focus:ring-primary shadow-sm"
          />
          <button className="absolute right-7 top-1/2 -translate-y-1/2 text-primary">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto px-4 no-scrollbar pb-1">
           {['Tất cả', 'Đang hoạt động', 'Chuyển sinh hoạt', 'Ban chấp hành'].map((f, i) => (
             <button key={i} className={`shrink-0 h-9 px-5 rounded-full text-xs font-bold transition-all ${i === 0 ? 'bg-primary text-white shadow-md' : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-slate-500'}`}>
               {f}
             </button>
           ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 no-scrollbar pb-24">
         {members.map((m, idx) => (
           <div key={idx} className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-white/5 p-4 flex items-center gap-4 shadow-sm group active:bg-slate-50 dark:active:bg-white/10 transition-colors">
              <div className="relative shrink-0">
                <div className="size-14 rounded-full border-2 border-primary/20 overflow-hidden bg-slate-100 flex items-center justify-center font-black text-primary">
                   {m.avatar ? <img src={m.avatar} className="w-full h-full object-cover" alt={m.name} /> : m.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className={`absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-white dark:border-surface-dark ${m.statusColor}`}></div>
              </div>
              <div className="flex-1 min-w-0">
                 <div className="flex items-start justify-between">
                   <h3 className="font-bold text-sm truncate">{m.name}</h3>
                   <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${m.status === 'Hoạt động' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{m.status}</span>
                 </div>
                 <p className="text-[10px] text-slate-500 mt-0.5">Mã ĐV: {m.code} • Chi đoàn {m.branch}</p>
                 {m.role && <p className="text-[10px] font-bold text-primary mt-1">{m.role}</p>}
              </div>
              <span className="material-symbols-outlined text-slate-300">chevron_right</span>
           </div>
         ))}
         
         <div className="py-6 flex justify-center text-primary gap-2 items-center">
            <div className="size-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            <span className="text-xs font-bold">Đang tải thêm...</span>
         </div>
      </div>

      <button className="fixed bottom-24 right-6 size-14 rounded-full bg-primary text-white shadow-xl shadow-primary/40 flex items-center justify-center active:scale-95 transition-all z-30">
        <span className="material-symbols-outlined text-[28px]">person_add</span>
      </button>
    </div>
  );
};

export default Members;
