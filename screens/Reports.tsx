
import React from 'react';
import { Screen } from '../types';

interface ReportsProps {
  onNavigate: (screen: Screen) => void;
}

const Reports: React.FC<ReportsProps> = ({ onNavigate }) => {
  const reports = [
    { title: 'Báo cáo công tác Đoàn quý III/2023', date: '15/10/2023', type: 'PDF', size: '1.2 MB', status: 'Đã duyệt' },
    { title: 'Kế hoạch hoạt động tháng 11', date: '28/10/2023', type: 'DOCX', size: '450 KB', status: 'Chờ duyệt' },
    { title: 'Danh sách khen thưởng đợt 2', date: '05/11/2023', type: 'PDF', size: '890 KB', status: 'Đã duyệt' },
    { title: 'Nghị quyết đại hội Chi đoàn 2024', date: '10/11/2023', type: 'PDF', size: '2.1 MB', status: 'Mới' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-hidden">
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-white/5">
        <button onClick={() => onNavigate(Screen.HOME)} className="size-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold">Văn bản đi/đến</h1>
        <button className="size-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10">
          <span className="material-symbols-outlined">filter_list</span>
        </button>
      </header>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {['Tất cả', 'Văn bản đến', 'Văn bản đi', 'Dự thảo'].map((f, i) => (
            <button key={i} className={`shrink-0 h-9 px-5 rounded-full text-xs font-bold transition-all ${i === 0 ? 'bg-primary text-white' : 'bg-white dark:bg-white/5 text-slate-500 border border-gray-200 dark:border-white/10'}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3">
          {reports.map((report, idx) => (
            <div key={idx} className="bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 flex items-center gap-4 active:scale-[0.98] transition-all">
              <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${report.type === 'PDF' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                <span className="material-symbols-outlined text-[32px]">{report.type === 'PDF' ? 'picture_as_pdf' : 'description'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-sm truncate pr-2">{report.title}</h3>
                  <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                    report.status === 'Đã duyệt' ? 'bg-green-100 text-green-700' : 
                    report.status === 'Mới' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {report.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                  <span>{report.date}</span>
                  <span>•</span>
                  <span>{report.size}</span>
                </div>
              </div>
              <button className="p-2 text-slate-300 hover:text-primary">
                <span className="material-symbols-outlined">download</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <button className="fixed bottom-24 right-6 size-14 rounded-full bg-primary text-white shadow-xl shadow-primary/40 flex items-center justify-center active:scale-95 transition-all z-30">
        <span className="material-symbols-outlined text-[28px]">upload_file</span>
      </button>
    </div>
  );
};

export default Reports;
