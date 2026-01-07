
import React from 'react';

interface MembersScreenProps {
  onBack: () => void;
}

const MembersScreen: React.FC<MembersScreenProps> = ({ onBack }) => {
  const members = [
    { name: 'Nguyễn Văn An', code: '1023', branch: 'Kỹ thuật', role: 'Phó Bí thư', status: 'active', color: 'bg-green-500' },
    { name: 'Trần Thị Bích', code: '1024', branch: 'Kinh doanh', role: '', status: 'transfer', color: 'bg-yellow-500' },
    { name: 'Lê Văn Cường', code: '1025', branch: 'Kế toán', role: '', status: 'active', color: 'bg-green-500' },
    { name: 'Phạm Minh', code: '1026', branch: 'Nhân sự', role: '', status: 'leave', color: 'bg-gray-500' },
    { name: 'Hoàng Thị Thảo', code: '1027', branch: 'Sản xuất', role: 'Ủy viên BCH', status: 'active', color: 'bg-green-500' },
  ];

  return (
    <div className="flex flex-col pb-24">
      <header className="sticky top-0 z-50 bg-primary px-4 py-4 shadow-md flex items-center justify-between">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full text-white hover:bg-white/10">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h1 className="flex-1 text-center font-bold text-white">Danh sách Đoàn viên</h1>
        <button className="size-10 flex items-center justify-center rounded-full text-white hover:bg-white/10">
          <span className="material-symbols-outlined">add</span>
        </button>
      </header>

      <div className="sticky top-[64px] z-40 bg-background-dark/95 backdrop-blur-md p-4 space-y-3">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 material-symbols-outlined">search</span>
          <input 
            type="text" 
            className="w-full bg-surface-dark border-none rounded-xl pl-10 pr-12 py-3 text-sm focus:ring-primary"
            placeholder="Tìm theo tên hoặc mã..."
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-primary">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {['Tất cả', 'Đang hoạt động', 'Chuyển sinh hoạt', 'Ban chấp hành'].map((chip, idx) => (
            <button 
              key={idx}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border ${idx === 0 ? 'bg-primary border-primary text-white' : 'bg-surface-dark border-white/5 text-gray-400'}`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {members.map((m, idx) => (
          <div key={idx} className="bg-surface-dark rounded-2xl border border-white/5 shadow-sm p-4 flex items-center gap-4 hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="relative">
              <div className="size-14 rounded-full border-2 border-primary/20 overflow-hidden">
                <img src={`https://picsum.photos/100/100?random=${idx + 10}`} alt="M" />
              </div>
              <span className={`absolute bottom-0 right-0 size-3 rounded-full ring-2 ring-surface-dark ${m.color}`}></span>
            </div>
            <div className="flex-1 min-w-0">
               <div className="flex justify-between items-start">
                  <h3 className="font-bold truncate text-sm">{m.name}</h3>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-tighter ${
                    m.status === 'active' ? 'bg-green-500/20 text-green-500' : 
                    m.status === 'transfer' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-gray-500/20 text-gray-500'
                  }`}>
                    {m.status === 'active' ? 'Hoạt động' : m.status === 'transfer' ? 'Chuyển SH' : 'Nghỉ'}
                  </span>
               </div>
               <p className="text-[10px] text-gray-500 mt-0.5">Mã ĐV: {m.code} • Chi đoàn {m.branch}</p>
               {m.role && <p className="text-[10px] font-bold text-primary mt-1">{m.role}</p>}
            </div>
            <span className="material-symbols-outlined text-gray-600 group-hover:text-primary transition-colors">chevron_right</span>
          </div>
        ))}

        <div className="py-6 flex justify-center w-full">
          <div className="flex items-center gap-2 text-primary animate-pulse">
            <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-medium">Đang tải thêm...</span>
          </div>
        </div>
      </div>

      <button className="fixed bottom-24 right-6 z-50 size-14 rounded-full bg-primary text-white shadow-lg shadow-primary/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
        <span className="material-symbols-outlined text-[32px]">person_add</span>
      </button>
    </div>
  );
};

export default MembersScreen;
