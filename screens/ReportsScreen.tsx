
import React, { useState, useMemo, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Member, ActivityPlan, BranchName } from '../types';

interface ReportsScreenProps {
  onBack: () => void;
  members: Member[];
  activities: ActivityPlan[];
  currentUser: Member | null;
}

interface ReportHistoryItem {
  id: string;
  name: string;
  timestamp: string;
  type: 'monthly' | 'annual';
  branch: string;
}

const COLORS = ['#009454', '#2d5e4b'];

const ReportsScreen: React.FC<ReportsScreenProps> = ({ onBack, members, activities, currentUser }) => {
  const [reportMode, setReportMode] = useState<'monthly' | 'annual'>('monthly');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedBranch, setSelectedBranch] = useState<string>('TẤT CẢ');
  const [emailRecipient, setEmailRecipient] = useState('');
  
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [selectedActivityForList, setSelectedActivityForList] = useState<ActivityPlan | null>(null);
  const [showPDFPreview, setShowPDFPreview] = useState(false);

  // Phân quyền: Chỉ admin và editor mới được xem chi tiết và lịch sử
  const canAccessAdminFeatures = currentUser?.role === 'admin' || currentUser?.role === 'editor';

  // Lịch sử báo cáo
  const [reportHistory, setReportHistory] = useState<ReportHistoryItem[]>(() => {
    const saved = localStorage.getItem('ivac_report_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ivac_report_history', JSON.stringify(reportHistory));
  }, [reportHistory]);

  const branches: string[] = ['TẤT CẢ', 'Sản Xuất', 'Hậu Cần', 'Chất Lượng', 'Suối Dầu'];
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 11 }, (_, i) => 2020 + i);

  // LOGIC TÍNH TOÁN BÁO CÁO TỔNG HỢP
  const reportData = useMemo(() => {
    const filterByPeriod = (dateStr: string, year: number, month?: number) => {
      const d = new Date(dateStr);
      const yearMatch = d.getFullYear() === year;
      if (reportMode === 'annual') return yearMatch;
      return yearMatch && (d.getMonth() + 1) === month;
    };

    const branchMembers = selectedBranch === 'TẤT CẢ' 
      ? members 
      : members.filter(m => m.branch.includes(selectedBranch));

    // Thống kê kỳ hiện tại
    const currentMembers = branchMembers.filter(m => {
       const joinDate = new Date(m.joinDate);
       if (reportMode === 'annual') return joinDate.getFullYear() <= selectedYear;
       return (joinDate.getFullYear() < selectedYear) || (joinDate.getFullYear() === selectedYear && (joinDate.getMonth() + 1) <= selectedMonth);
    });

    // Thống kê so sánh: 1 Năm trước đó
    const prevYearMembers = branchMembers.filter(m => {
       const joinDate = new Date(m.joinDate);
       const targetYear = selectedYear - 1;
       if (reportMode === 'annual') return joinDate.getFullYear() <= targetYear;
       return (joinDate.getFullYear() < targetYear) || (joinDate.getFullYear() === targetYear && (joinDate.getMonth() + 1) <= selectedMonth);
    });

    const diffCount = currentMembers.length - prevYearMembers.length;

    // Hoạt động
    const filteredActivities = activities.filter(act => {
      const branchMatch = selectedBranch === 'TẤT CẢ' || act.branch === selectedBranch;
      return branchMatch && filterByPeriod(act.date, selectedYear, selectedMonth);
    });

    const maleCount = currentMembers.filter(m => m.gender === 'Nam').length;
    const femaleCount = currentMembers.filter(m => m.gender === 'Nữ').length;
    
    const genderRatioData = [
      { name: 'Nam', value: currentMembers.length > 0 ? Math.round((maleCount / currentMembers.length) * 100) : 0 },
      { name: 'Nữ', value: currentMembers.length > 0 ? Math.round((femaleCount / currentMembers.length) * 100) : 0 }
    ];

    return {
      total: currentMembers.length,
      male: maleCount,
      female: femaleCount,
      genderRatioData,
      newMembers: branchMembers.filter(m => filterByPeriod(m.joinDate, selectedYear, selectedMonth)),
      memberList: currentMembers,
      activities: filteredActivities,
      prevTotal: prevYearMembers.length,
      diffCount
    };
  }, [members, activities, reportMode, selectedMonth, selectedYear, selectedBranch]);

  const handleExportPDF = () => {
    if (!canAccessAdminFeatures) {
      alert("Đồng chí không có quyền thực hiện thao tác này.");
      return;
    }
    setShowPDFPreview(true);
    const newReport: ReportHistoryItem = {
      id: Date.now().toString(),
      name: `Báo cáo ${reportMode === 'annual' ? 'Năm ' + selectedYear : 'Tháng ' + selectedMonth + '/' + selectedYear}`,
      timestamp: new Date().toLocaleString('vi-VN'),
      type: reportMode,
      branch: selectedBranch
    };
    setReportHistory(prev => [newReport, ...prev].slice(0, 5));
  };

  const clearHistory = () => {
    if (!canAccessAdminFeatures) return;
    if (window.confirm("Đồng chí có chắc muốn xóa sạch lịch sử báo cáo để giải phóng bộ nhớ?")) {
      setReportHistory([]);
      localStorage.removeItem('ivac_report_history');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-dark pb-24 font-display">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-background-dark/95 backdrop-blur-md px-6 py-6 border-b border-white/5">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-xl bg-white/5 text-white hover:bg-white/10 transition-all">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex flex-col items-center flex-1">
          <h2 className="text-xl font-black text-white tracking-tight uppercase">Báo cáo Tổng hợp</h2>
          <div className="flex gap-4 mt-1">
            {reportMode === 'monthly' && (
              <button onClick={() => setShowMonthPicker(true)} className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                Tháng {selectedMonth} <span className="material-symbols-outlined text-[10px]">expand_more</span>
              </button>
            )}
            <button onClick={() => setShowYearPicker(true)} className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-[0.2em]">
               Năm {selectedYear} <span className="material-symbols-outlined text-[10px]">expand_more</span>
            </button>
          </div>
        </div>
        <div className="size-10"></div>
      </header>

      <main className="p-6 space-y-6">
        {/* Filter Area */}
        <div className="space-y-4">
          <div className="flex p-1.5 bg-surface-dark rounded-2xl border border-white/5">
            <button onClick={() => setReportMode('monthly')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${reportMode === 'monthly' ? 'bg-background-dark text-primary shadow-lg border border-primary/20' : 'text-gray-500'}`}>Báo cáo Tháng</button>
            <button onClick={() => setReportMode('annual')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${reportMode === 'annual' ? 'bg-background-dark text-primary shadow-lg border border-primary/20' : 'text-gray-500'}`}>Báo cáo Năm</button>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {branches.map((br) => (
              <button key={br} onClick={() => setSelectedBranch(br)} className={`shrink-0 px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-wider border transition-all ${selectedBranch === br ? 'bg-primary border-primary text-white shadow-lg' : 'bg-surface-dark border-white/5 text-gray-500'}`}>{br === 'TẤT CẢ' ? 'TẤT CẢ' : br}</button>
            ))}
          </div>
        </div>

        {/* 1. Member Stats */}
        <section className="bg-surface-dark/50 p-6 rounded-[2.5rem] border border-white/5 shadow-xl space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Nhân sự & Tăng trưởng</h3>
            <span className="text-[9px] font-black text-primary bg-primary/10 px-2 py-1 rounded-lg">YOY {selectedYear - 1} - {selectedYear}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-background-dark rounded-3xl border border-white/5">
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Tổng số ĐV</p>
                <div className="flex items-center justify-between mt-1">
                   <p className="text-2xl font-black text-white">{reportData.total}</p>
                   <p className={`text-[10px] font-black ${reportData.diffCount >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {reportData.diffCount >= 0 ? '+' : ''}{reportData.diffCount}
                   </p>
                </div>
             </div>
             <div className="p-4 bg-background-dark rounded-3xl border border-white/5">
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Nam / Nữ</p>
                <p className="text-2xl font-black text-white mt-1">{reportData.male} / {reportData.female}</p>
             </div>
          </div>
        </section>

        {/* CƠ CẤU GIỚI TÍNH */}
        <section className="bg-surface-dark/50 p-7 rounded-[2.5rem] border border-white/5 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Cơ cấu giới tính</h3>
            <span className="text-[10px] text-primary font-black uppercase tracking-widest">{selectedBranch}</span>
          </div>
          <div className="flex items-center gap-8 h-40">
            <div className="w-1/2 h-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={reportData.genderRatioData} innerRadius={45} outerRadius={65} paddingAngle={8} dataKey="value" stroke="none">
                    {reportData.genderRatioData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-[9px] font-black text-gray-500 uppercase">Tổng</p>
                <p className="text-sm font-black text-white leading-none mt-1">{reportData.total}</p>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              {reportData.genderRatioData.map((d, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="size-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                    <span className="text-xs font-bold text-gray-400">{d.name}</span>
                  </div>
                  <span className="text-xs font-black text-white">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2. Activity Detail - RESTRICTED */}
        {canAccessAdminFeatures && (
          <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Hoạt động chi tiết</h3>
              <span className="text-[9px] font-bold text-gray-500 uppercase">{reportData.activities.length} Sự kiện</span>
            </div>
            <div className="space-y-3">
              {reportData.activities.map(act => (
                <div key={act.id} className="bg-surface-dark/40 p-4 rounded-3xl border border-white/5 flex items-center gap-4">
                  <div className="size-11 rounded-xl bg-white/5 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[8px] font-black text-gray-500 uppercase">{new Date(act.date).getDate()} Th{new Date(act.date).getMonth()+1}</span>
                    <span className="material-symbols-outlined text-primary text-sm">event</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-black text-white truncate">{act.name}</h4>
                    <p className="text-[9px] text-gray-500 font-bold uppercase mt-1">{act.branch} • {act.attendees.length} Đoàn viên có mặt</p>
                  </div>
                  <button 
                    onClick={() => setSelectedActivityForList(act)}
                    className="size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                  >
                    <span className="material-symbols-outlined text-lg">groups</span>
                  </button>
                </div>
              ))}
              {reportData.activities.length === 0 && (
                <p className="text-center py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest italic opacity-50">Không có hoạt động trong kỳ này</p>
              )}
            </div>
          </section>
        )}

        {/* 3. Actions Area - Everyone can see but export check role inside handler */}
        <section className="bg-surface-dark/30 p-6 rounded-[2.5rem] border border-white/5 space-y-5">
           <div className="bg-background-dark/50 p-2 rounded-2xl border border-white/5 flex gap-2">
              <input type="email" placeholder="Nhập Gmail nhận báo cáo..." value={emailRecipient} onChange={(e) => setEmailRecipient(e.target.value)} className="bg-transparent border-none text-xs font-bold text-white outline-none flex-1 px-3" />
              <button onClick={() => alert('Đã gửi email!')} className="size-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg"><span className="material-symbols-outlined text-sm">send</span></button>
           </div>
           <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleExportPDF} 
                className={`flex flex-col items-center gap-3 p-6 rounded-3xl group border transition-all ${canAccessAdminFeatures ? 'bg-rose-500/10 border-rose-500/20' : 'bg-gray-800/50 border-white/5 opacity-50 cursor-not-allowed'}`}
              >
                 <span className={`material-symbols-outlined text-3xl group-hover:scale-110 transition-transform ${canAccessAdminFeatures ? 'text-rose-500' : 'text-gray-600'}`}>picture_as_pdf</span>
                 <p className="text-[10px] font-black text-white uppercase">Xuất PDF</p>
              </button>
              <button 
                onClick={() => canAccessAdminFeatures ? alert('Sao lưu thành công!') : alert('Đồng chí không có quyền thực hiện thao tác này.')} 
                className={`flex flex-col items-center gap-3 p-6 rounded-3xl group border transition-all ${canAccessAdminFeatures ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-gray-800/50 border-white/5 opacity-50 cursor-not-allowed'}`}
              >
                 <span className={`material-symbols-outlined text-3xl group-hover:scale-110 transition-transform ${canAccessAdminFeatures ? 'text-emerald-500' : 'text-gray-600'}`}>cloud_upload</span>
                 <p className="text-[10px] font-black text-white uppercase">Backup Data</p>
              </button>
           </div>
        </section>

        {/* 4. History Area - RESTRICTED */}
        {canAccessAdminFeatures && (
          <section className="space-y-4 pb-12">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Lịch sử xuất (Tối đa 5)</h3>
                <button onClick={clearHistory} className="text-[9px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">delete_sweep</span> Xóa lịch sử
                </button>
             </div>
             <div className="space-y-3">
                {reportHistory.map(item => (
                  <div key={item.id} className="bg-surface-dark/20 p-4 rounded-3xl border border-white/5 flex items-center gap-4">
                     <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
                        <span className="material-symbols-outlined">description</span>
                     </div>
                     <div className="flex-1">
                        <p className="text-xs font-black text-white">{item.name}</p>
                        <p className="text-[9px] text-gray-500 font-bold uppercase">{item.timestamp} • {item.branch}</p>
                     </div>
                     <button onClick={() => alert('Đang tải bản ghi...') } className="size-9 bg-primary text-white rounded-lg flex items-center justify-center"><span className="material-symbols-outlined text-sm">download</span></button>
                  </div>
                ))}
                {reportHistory.length === 0 && (
                   <div className="py-10 text-center border border-dashed border-white/10 rounded-3xl opacity-30">
                      <p className="text-[9px] font-black uppercase tracking-widest">Trống</p>
                   </div>
                )}
             </div>
          </section>
        )}

        {!canAccessAdminFeatures && (
          <div className="p-10 text-center opacity-30 border-t border-white/5 pt-12">
             <span className="material-symbols-outlined text-5xl">lock_person</span>
             <p className="text-[11px] font-black uppercase tracking-widest mt-4 italic">
               Các tính năng báo cáo chi tiết và lịch sử<br/>chỉ dành cho Cán bộ Quản lý
             </p>
          </div>
        )}
      </main>

      {/* MODAL: VIEW PARTICIPANTS */}
      {selectedActivityForList && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-end justify-center p-0 animate-in fade-in duration-300">
           <div className="bg-surface-dark w-full max-w-md rounded-t-[3.5rem] flex flex-col max-h-[80vh] overflow-hidden animate-in slide-in-from-bottom duration-500">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-background-dark">
                 <div>
                    <h3 className="text-lg font-black text-white uppercase">Danh sách tham gia</h3>
                    <p className="text-[10px] text-primary font-bold uppercase mt-1">{selectedActivityForList.name}</p>
                 </div>
                 <button onClick={() => setSelectedActivityForList(null)} className="size-10 bg-white/5 rounded-full flex items-center justify-center text-white"><span className="material-symbols-outlined">close</span></button>
              </div>
              <div className="p-6 overflow-y-auto no-scrollbar space-y-3">
                 {selectedActivityForList.attendees.map((att, i) => {
                    const m = members.find(mem => mem.id === att.memberId);
                    return (
                       <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
                          <img src={m?.avatar} className="size-10 rounded-xl object-cover" />
                          <div className="flex-1">
                             <p className="text-xs font-black text-white">{m?.name}</p>
                             <p className="text-[9px] text-gray-500 uppercase">{m?.code} • {m?.branch}</p>
                          </div>
                          <span className="text-[9px] font-black text-primary bg-primary/10 px-2 py-1 rounded-lg uppercase">CÓ MẶT</span>
                       </div>
                    );
                 })}
                 {selectedActivityForList.attendees.length === 0 && <p className="text-center text-gray-500 text-xs py-10 font-black uppercase">Chưa có ai điểm danh</p>}
              </div>
           </div>
        </div>
      )}

      {/* PDF PREVIEW REPORT */}
      {showPDFPreview && (
        <div className="fixed inset-0 z-[200] bg-white flex flex-col animate-in fade-in duration-300">
           <header className="p-6 bg-primary text-white flex items-center justify-between shrink-0">
              <button onClick={() => setShowPDFPreview(false)} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                 <span className="material-symbols-outlined">arrow_back</span> Đóng
              </button>
              <h3 className="text-sm font-black uppercase tracking-tight">Bản xem trước Báo cáo PDF</h3>
              <button onClick={() => window.print()} className="size-10 bg-white/20 rounded-full flex items-center justify-center"><span className="material-symbols-outlined">print</span></button>
           </header>
           
           <div className="flex-1 overflow-y-auto p-10 bg-gray-50 text-gray-900 font-sans">
              <div className="max-w-3xl mx-auto bg-white shadow-2xl p-12 border-t-8 border-primary min-h-screen">
                 <div className="text-center mb-10 space-y-2">
                    <p className="text-xs font-bold uppercase text-gray-500">ĐOÀN CƠ SỞ IVAC - CHI ĐOÀN {selectedBranch}</p>
                    <div className="h-0.5 w-20 bg-primary mx-auto my-4"></div>
                    <h1 className="text-2xl font-black uppercase">BÁO CÁO TỔNG HỢP HOẠT ĐỘNG</h1>
                    <p className="text-sm font-bold text-gray-600">{reportMode === 'annual' ? `Năm ${selectedYear}` : `Tháng ${selectedMonth}/${selectedYear}`}</p>
                 </div>

                 <div className="mb-10">
                    <h4 className="text-sm font-black border-l-4 border-primary pl-3 uppercase mb-4 text-primary">I. Tình hình nhân sự & Tăng trưởng</h4>
                    <table className="w-full text-left text-sm border-collapse">
                       <tr className="bg-gray-100 font-bold border-b border-gray-200">
                          <th className="p-3">Hạng mục</th>
                          <th className="p-3">Số lượng</th>
                          <th className="p-3">Ghi chú</th>
                       </tr>
                       <tr className="border-b border-gray-100">
                          <td className="p-3">Tổng số đoàn viên</td>
                          <td className="p-3 font-bold">{reportData.total}</td>
                          <td className="p-3 text-[10px]">{reportData.diffCount >= 0 ? `Tăng ${reportData.diffCount}` : `Giảm ${Math.abs(reportData.diffCount)}`} so với năm trước</td>
                       </tr>
                       <tr className="border-b border-gray-100">
                          <td className="p-3">Tỷ lệ Nam / Nữ</td>
                          <td className="p-3 font-bold">{reportData.male} / {reportData.female}</td>
                          <td className="p-3 text-[10px]">{Math.round((reportData.male/reportData.total)*100)}% Nam</td>
                       </tr>
                       <tr className="border-b border-gray-100">
                          <td className="p-3">Phát triển mới kỳ này</td>
                          <td className="p-3 font-bold text-emerald-600">{reportData.newMembers.length}</td>
                          <td className="p-3 text-[10px]">Đoàn viên mới kết nạp</td>
                       </tr>
                    </table>
                 </div>

                 <div className="mb-10">
                    <h4 className="text-sm font-black border-l-4 border-primary pl-3 uppercase mb-4 text-primary">II. Thống kê hoạt động chi tiết</h4>
                    <div className="space-y-4">
                       {reportData.activities.map((act, i) => (
                          <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                             <div className="flex justify-between items-start mb-2">
                                <h5 className="font-black text-sm">{act.name}</h5>
                                <span className="text-[10px] font-bold text-gray-400">{new Date(act.date).toLocaleDateString('vi-VN')}</span>
                             </div>
                             <p className="text-[11px] text-gray-600">Địa điểm: {act.location || 'Văn phòng'}</p>
                             <div className="flex gap-4 mt-2">
                                <span className="text-[10px] font-bold text-primary">Có mặt: {act.attendees.length}</span>
                                <span className="text-[10px] font-bold text-gray-400">Đơn vị: {act.branch}</span>
                             </div>
                          </div>
                       ))}
                       {reportData.activities.length === 0 && <p className="text-xs italic text-gray-400">Không ghi nhận hoạt động trong kỳ.</p>}
                    </div>
                 </div>

                 <div className="mb-10">
                    <h4 className="text-sm font-black border-l-4 border-primary pl-3 uppercase mb-4 text-primary">III. Danh sách Đoàn viên hiện diện</h4>
                    <div className="grid grid-cols-2 gap-x-10 gap-y-2">
                       {reportData.memberList.slice(0, 20).map((m, i) => (
                          <div key={i} className="flex justify-between text-[10px] border-b border-gray-50 pb-1">
                             <span className="font-bold">{m.name}</span>
                             <span className="text-gray-400">{m.code}</span>
                          </div>
                       ))}
                       {reportData.memberList.length > 20 && <p className="text-[10px] text-gray-400 italic mt-2">... và {reportData.memberList.length - 20} đoàn viên khác.</p>}
                    </div>
                 </div>

                 <div className="mt-20 flex justify-between px-10">
                    <div className="text-center">
                       <p className="text-[10px] font-black uppercase mb-16">Người lập báo cáo</p>
                       <p className="text-xs font-bold">Hệ thống IVAC</p>
                    </div>
                    <div className="text-center">
                       <p className="text-[10px] font-black uppercase mb-16">Xác nhận Bí thư</p>
                       <div className="size-20 bg-gray-50 mx-auto mb-2 flex items-center justify-center border border-gray-200 rounded-lg">
                          <span className="material-symbols-outlined text-gray-200">check_circle</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
           
           <footer className="p-6 bg-gray-100 border-t border-gray-200 flex gap-4 shrink-0">
              <button onClick={() => setShowPDFPreview(false)} className="flex-1 py-4 bg-gray-200 text-gray-600 rounded-2xl font-black text-xs uppercase">Thoát</button>
              <button onClick={() => alert('Đang xuất tệp PDF thực tế...')} className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase shadow-xl flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-lg">download</span> Tải xuống bản PDF
              </button>
           </footer>
        </div>
      )}

      {/* Selector Pickers */}
      {showYearPicker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
          <div className="bg-surface-dark w-full max-w-xs rounded-[3rem] p-6 border border-white/10 shadow-2xl max-h-[70vh] overflow-y-auto no-scrollbar">
            <h3 className="text-white font-black uppercase text-center mb-4 tracking-widest text-xs">Chọn năm báo cáo</h3>
            <div className="grid grid-cols-2 gap-2">
              {years.map(y => (
                <button key={y} onClick={() => {setSelectedYear(y); setShowYearPicker(false);}} className={`py-4 rounded-xl text-xs font-black uppercase ${selectedYear === y ? 'bg-primary text-white shadow-lg' : 'bg-white/5 text-gray-400'}`}>{y}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showMonthPicker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
          <div className="bg-surface-dark w-full max-w-sm rounded-[3rem] p-6 border border-white/10 shadow-2xl">
             <h3 className="text-white font-black uppercase text-center mb-4 tracking-widest text-xs">Chọn tháng báo cáo</h3>
             <div className="grid grid-cols-4 gap-2">
                {months.map(m => (
                  <button key={m} onClick={() => {setSelectedMonth(m); setShowMonthPicker(false);}} className={`py-4 rounded-xl text-xs font-black ${selectedMonth === m ? 'bg-primary text-white shadow-lg' : 'bg-white/5 text-gray-400'}`}>{m}</button>
                ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsScreen;
