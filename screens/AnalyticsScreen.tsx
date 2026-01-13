
import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from 'recharts';
import { Member, ActivityPlan, BranchName, SystemNotification } from '../types';

interface AnalyticsScreenProps {
  onBack: () => void;
  members: Member[];
  activities: ActivityPlan[];
  currentUser: Member | null;
  onSendNotification: (notif: Omit<SystemNotification, 'id' | 'timestamp' | 'isRead'>) => void;
}

const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({ onBack, members, activities, currentUser, onSendNotification }) => {
  const [selectedBranch, setSelectedBranch] = useState<string>('TẤT CẢ');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [viewMode, setViewMode] = useState<'monthly' | 'annual'>('monthly');
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const isStaff = currentUser?.role === 'admin' || currentUser?.role === 'editor';

  const branches: string[] = ['TẤT CẢ', 'Sản Xuất', 'Hậu Cần', 'Chất Lượng', 'Suối Dầu'];
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 16 }, (_, i) => 2020 + i);

  const analyticsData = useMemo(() => {
    const now = new Date().getTime();
    const filteredMembers = selectedBranch === 'TẤT CẢ' 
      ? members 
      : members.filter(m => m.branch.includes(selectedBranch));

    const activitiesInPeriod = activities.filter(act => {
      const d = new Date(act.date);
      const isYearMatch = d.getFullYear() === selectedYear;
      if (viewMode === 'annual') return isYearMatch;
      return isYearMatch && (d.getMonth() + 1) === selectedMonth;
    });

    const targetBranchNames: BranchName[] = ['Sản Xuất', 'Chất Lượng', 'Hậu Cần', 'Suối Dầu'];
    const activityBranchStats = targetBranchNames.map(name => {
      const count = activitiesInPeriod.filter(act => act.branch === name).length;
      return { name, count };
    });

    const regularMembers = filteredMembers.filter(m => m.role === 'user');
    
    const memberStats = regularMembers.map(m => {
      let registeredCount = 0;
      let attendedCount = 0;
      let totalPoints = 0;
      let violationCount = 0; // Số lần vi phạm thực tế (Đăng ký nhưng không đi và HĐ đã chốt)

      activitiesInPeriod.forEach(act => {
        const isRegistered = act.participants.some(p => p.memberId === m.id);
        const isAttended = act.attendees.some(p => p.memberId === m.id);
        const endDateTime = new Date(`${act.date}T${act.endTime}`).getTime();
        const isFinished = now > endDateTime;

        if (isRegistered) registeredCount++;
        if (isAttended) {
          attendedCount++;
          totalPoints += act.points;
        }

        // Logic vi phạm: Hoạt động đã kết thúc + đã đăng ký + không có dữ liệu điểm danh
        if (isFinished && isRegistered && !isAttended) {
          violationCount++;
        }
      });

      return {
        id: m.id,
        name: m.name,
        branch: m.branch,
        avatar: m.avatar,
        points: totalPoints,
        attendedCount,
        registeredCount,
        violationCount
      };
    });

    const top3 = [...memberStats].sort((a, b) => b.points - a.points).slice(0, 3).filter(m => m.points > 0);

    const top10ChartData = [...memberStats]
      .filter(m => m.points > 0)
      .sort((a, b) => b.points - a.points)
      .slice(0, 10)
      .map(m => ({
        name: m.name.split(' ').pop(),
        points: m.points,
        fullName: m.name
      }));

    const warnings = {
      // Chỉ nhắc nhở những người có trên 2 lần vi phạm (từ lần thứ 3)
      violation: [...memberStats]
        .filter(m => m.violationCount > 2)
        .sort((a, b) => b.violationCount - a.violationCount)[0],
        
      lowParticipation: [...memberStats]
        .filter(m => m.attendedCount > 0)
        .sort((a, b) => a.attendedCount - b.attendedCount)[0],
        
      lowPoints: [...memberStats]
        .filter(m => m.points > 0)
        .sort((a, b) => a.points - b.points)[0]
    };

    return {
      memberCount: filteredMembers.length,
      activityBranchStats,
      top3,
      top10ChartData,
      avgPoints: memberStats.length > 0 ? Math.round(memberStats.reduce((s, m) => s + m.points, 0) / memberStats.length) : 0,
      totalPoints: memberStats.reduce((s, m) => s + m.points, 0),
      warnings
    };
  }, [members, activities, selectedBranch, selectedYear, selectedMonth, viewMode]);

  const handleSendReminder = (targetId: string, targetName: string, type: 'warning' | 'encouragement' | 'reminder', title: string, message: string) => {
    if (!isStaff) return;
    onSendNotification({
      targetMemberId: targetId,
      senderName: currentUser?.name || 'Cán bộ Đoàn',
      title,
      message,
      type
    });
    alert(`Đã gửi thông báo ${title.toLowerCase()} tới đồng chí ${targetName}!`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-dark pb-24 font-display">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-background-dark/95 backdrop-blur-md px-6 py-6 border-b border-white/5">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-xl bg-white/5 text-white hover:bg-white/10 transition-all">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex flex-col items-center flex-1">
          <h2 className="text-xl font-black text-white tracking-tight uppercase">Phân tích & Vinh danh</h2>
          <div className="flex gap-4 mt-1">
            {viewMode === 'monthly' && (
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

      <main className="p-6 space-y-8">
        {/* Filter Area */}
        <div className="space-y-4">
          <div className="flex p-1.5 bg-surface-dark rounded-2xl border border-white/5">
            <button onClick={() => setViewMode('monthly')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${viewMode === 'monthly' ? 'bg-background-dark text-primary shadow-lg border border-primary/20' : 'text-gray-500'}`}>Theo Tháng</button>
            <button onClick={() => setViewMode('annual')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${viewMode === 'annual' ? 'bg-background-dark text-primary shadow-lg border border-primary/20' : 'text-gray-500'}`}>Theo Năm</button>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {branches.map((br) => (
              <button key={br} onClick={() => setSelectedBranch(br)} className={`shrink-0 px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-wider border transition-all ${selectedBranch === br ? 'bg-primary border-primary text-white shadow-lg' : 'bg-surface-dark border-white/5 text-gray-500'}`}>{br === 'TẤT CẢ' ? 'TẤT CẢ' : `Chi đoàn ${br}`}</button>
            ))}
          </div>
        </div>

        {/* VINH DANH TOP 3 */}
        <section className="space-y-5">
           <div className="text-center">
              <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-yellow-500">military_tech</span>
                Bảng vàng vinh danh
              </h3>
              <p className="text-[10px] font-bold text-primary uppercase mt-1 tracking-widest">Gương mặt tiêu biểu {selectedBranch}</p>
           </div>

           <div className="space-y-3">
              {analyticsData.top3[0] && (
                <div className="relative group animate-in slide-in-from-top duration-700">
                   <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500/50 via-amber-500/20 to-yellow-500/50 rounded-[2.5rem] blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                   <div className="relative bg-surface-dark p-6 rounded-[2.5rem] border border-yellow-500/30 flex items-center gap-6 shadow-[0_0_30px_rgba(234,179,8,0.1)]">
                      <div className="relative shrink-0">
                         <div className="size-20 rounded-2xl border-2 border-yellow-500 p-1 bg-background-dark shadow-xl">
                            <img src={analyticsData.top3[0].avatar} className="size-full object-cover rounded-xl" />
                         </div>
                         <div className="absolute -top-3 -right-3 size-9 bg-yellow-500 rounded-full flex items-center justify-center border-4 border-surface-dark shadow-lg">
                            <span className="material-symbols-outlined text-white text-xl material-symbols-fill">workspace_premium</span>
                         </div>
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-2">
                            <h4 className="text-lg font-black text-white truncate">{analyticsData.top3[0].name}</h4>
                         </div>
                         <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{analyticsData.top3[0].branch}</p>
                         <div className="flex items-center gap-3 mt-2">
                            <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 text-[10px] font-black rounded-lg">QUÁN QUÂN</span>
                            <span className="text-xs font-black text-white">{analyticsData.top3[0].points} <span className="text-[10px] text-gray-500 font-bold">ĐIỂM RL</span></span>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {analyticsData.top3[1] && (
                <div className="bg-surface-dark/60 p-5 rounded-[2.2rem] border border-white/5 flex items-center gap-5 animate-in slide-in-from-top duration-700 delay-200">
                   <div className="relative shrink-0">
                      <div className="size-14 rounded-2xl border-2 border-gray-400 p-1 bg-background-dark">
                         <img src={analyticsData.top3[1].avatar} className="size-full object-cover rounded-xl" />
                      </div>
                      <div className="absolute -top-2 -right-2 size-7 bg-gray-400 rounded-full flex items-center justify-center border-3 border-surface-dark">
                         <span className="text-[10px] font-black text-white">2</span>
                      </div>
                   </div>
                   <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-white truncate">{analyticsData.top3[1].name}</h4>
                      <div className="flex items-center justify-between mt-1">
                         <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{analyticsData.top3[1].branch}</p>
                         <span className="text-[11px] font-black text-gray-300">{analyticsData.top3[1].points}đ</span>
                      </div>
                   </div>
                </div>
              )}

              {analyticsData.top3[2] && (
                <div className="bg-surface-dark/40 p-4 rounded-[2rem] border border-white/5 flex items-center gap-5 animate-in slide-in-from-top duration-700 delay-400">
                   <div className="relative shrink-0">
                      <div className="size-12 rounded-xl border-2 border-orange-700 p-0.5 bg-background-dark">
                         <img src={analyticsData.top3[2].avatar} className="size-full object-cover rounded-lg" />
                      </div>
                      <div className="absolute -top-1.5 -right-1.5 size-6 bg-orange-700 rounded-full flex items-center justify-center border-2 border-surface-dark">
                         <span className="text-[9px] font-black text-white">3</span>
                      </div>
                   </div>
                   <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black text-white truncate">{analyticsData.top3[2].name}</h4>
                      <div className="flex items-center justify-between mt-1">
                         <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">{analyticsData.top3[2].branch}</p>
                         <span className="text-[10px] font-black text-gray-400">{analyticsData.top3[2].points}đ</span>
                      </div>
                   </div>
                </div>
              )}
           </div>
        </section>

        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-dark/50 p-6 rounded-[2.5rem] border border-white/5 shadow-xl space-y-4">
            <div className="flex justify-between items-start">
              <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">analytics</span>
              </div>
              <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded-lg">AVG</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-tight">Điểm trung bình/ĐV</p>
              <p className="text-3xl font-black text-white mt-1">{analyticsData.avgPoints}đ</p>
            </div>
          </div>
          <div className="bg-surface-dark/50 p-6 rounded-[2.5rem] border border-white/5 shadow-xl space-y-4">
            <div className="flex justify-between items-start">
              <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">hotel_class</span>
              </div>
              <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded-lg">TOTAL</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-tight">Tổng điểm tích lũy</p>
              <p className="text-3xl font-black text-white mt-1">{analyticsData.totalPoints.toLocaleString()}đ</p>
            </div>
          </div>
        </div>

        {/* POINTS BAR CHART */}
        <div className="bg-surface-dark/50 p-7 rounded-[2.5rem] border border-white/5 shadow-xl">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Tổng điểm rèn luyện (Top 10)</h3>
              <span className="text-[9px] font-black text-primary bg-primary/10 px-2 py-1 rounded-lg uppercase tracking-widest">Xếp hạng</span>
           </div>
           <div className="h-64 w-full">
              {analyticsData.top10ChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={analyticsData.top10ChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} interval={0} tick={{ fill: '#6b7280', fontSize: 9, fontWeight: 800 }} dy={10} />
                      <YAxis hide hide allowDecimals={false} />
                      <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#162e24', border: '1px solid #ffffff10', borderRadius: '12px' }} />
                      <Bar dataKey="points" fill="#fbbf24" radius={[8, 8, 0, 0]} barSize={25}>
                         <LabelList dataKey="points" position="top" style={{ fill: '#fbbf24', fontSize: 10, fontWeight: 'bold' }} />
                      </Bar>
                   </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-30">
                  <span className="material-symbols-outlined text-4xl mb-2">trending_flat</span>
                  <p className="text-[10px] font-black uppercase tracking-widest">Chưa có dữ liệu điểm rèn luyện</p>
                </div>
              )}
           </div>
        </div>

        {/* TẦN SUẤT HOẠT ĐỘNG CHART */}
        <div className="bg-surface-dark/50 p-7 rounded-[2.5rem] border border-white/5 shadow-xl">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Tần suất hoạt động</h3>
              <span className="text-[9px] font-black text-primary bg-primary/10 px-2 py-1 rounded-lg uppercase tracking-widest">Chi đoàn</span>
           </div>
           <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={analyticsData.activityBranchStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} interval={0} tick={{ fill: '#6b7280', fontSize: 9, fontWeight: 800 }} dy={10} />
                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 700 }} />
                    <Bar dataKey="count" fill="#009454" radius={[8, 8, 0, 0]} barSize={40}>
                       <LabelList dataKey="count" position="top" style={{ fill: '#009454', fontSize: 10, fontWeight: 'bold' }} />
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* CẦN CHÚ Ý (WARNINGS) */}
        <section className="space-y-4">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-black text-rose-500 uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-500">warning</span>
                Cần chú ý & Nhắc nhở
              </h3>
              <span className="text-[9px] font-bold text-gray-500 uppercase">Đối soát đoàn viên</span>
           </div>

           <div className="space-y-3">
              {analyticsData.warnings.violation ? (
                <div className="bg-rose-500/5 border border-rose-500/20 rounded-[2rem] p-5 flex items-center gap-4 animate-in fade-in slide-in-from-right duration-500">
                   <div className="relative">
                      <img src={analyticsData.warnings.violation.avatar} className="size-12 rounded-xl object-cover grayscale-[0.5]" />
                      <div className="absolute -top-1 -right-1 size-5 bg-rose-500 rounded-full flex items-center justify-center border-2 border-background-dark">
                         <span className="material-symbols-outlined text-white text-[10px] font-black">close</span>
                      </div>
                   </div>
                   <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black text-white uppercase truncate">Vi phạm chuyên cần</h4>
                      <p className="text-[10px] text-rose-500 font-bold mt-0.5">Đ/c {analyticsData.warnings.violation.name} vắng {analyticsData.warnings.violation.violationCount} lần hoạt động đã kết thúc</p>
                   </div>
                   {isStaff && (
                     <button 
                       onClick={() => handleSendReminder(analyticsData.warnings.violation!.id, analyticsData.warnings.violation!.name, 'warning', 'Cảnh báo chuyên cần', `Đồng chí đã bỏ vắng ${analyticsData.warnings.violation!.violationCount} hoạt động đã chốt danh sách. Vui lòng nghiêm túc chấp hành nội quy!`)} 
                       className="px-3 py-2 bg-rose-500 text-white rounded-xl text-[8px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                     >
                        Cảnh báo
                     </button>
                   )}
                </div>
              ) : (
                <div className="p-5 border border-dashed border-white/5 rounded-[2rem] text-center opacity-40">
                   <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Không có vi phạm nghiêm trọng (>2 lần)</p>
                </div>
              )}

              {analyticsData.warnings.lowParticipation && (
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-[2rem] p-5 flex items-center gap-4 animate-in fade-in slide-in-from-right duration-700 delay-100">
                   <div className="relative">
                      <img src={analyticsData.warnings.lowParticipation.avatar} className="size-12 rounded-xl object-cover" />
                      <div className="absolute -top-1 -right-1 size-5 bg-amber-500 rounded-full flex items-center justify-center border-2 border-background-dark text-white text-[10px] font-black">!</div>
                   </div>
                   <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black text-white uppercase truncate">Tham gia thấp</h4>
                      <p className="text-[10px] text-amber-500 font-bold mt-0.5">Đ/c {analyticsData.warnings.lowParticipation.name} mới tham gia {analyticsData.warnings.lowParticipation.attendedCount} HĐ</p>
                   </div>
                   {isStaff && (
                     <button 
                       onClick={() => handleSendReminder(analyticsData.warnings.lowParticipation!.id, analyticsData.warnings.lowParticipation!.name, 'encouragement', 'Khích lệ tham gia', `Đồng chí hãy tích cực tham gia các phong trào Đoàn hơn nhé, hiện tại đồng chí mới tham gia ${analyticsData.warnings.lowParticipation!.attendedCount} hoạt động.`)} 
                       className="px-3 py-2 bg-amber-500 text-white rounded-xl text-[8px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                     >
                        Khích lệ
                     </button>
                   )}
                </div>
              )}

              {analyticsData.warnings.lowPoints && (
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-[2rem] p-5 flex items-center gap-4 animate-in fade-in slide-in-from-right duration-700 delay-200">
                   <div className="relative">
                      <img src={analyticsData.warnings.lowPoints.avatar} className="size-12 rounded-xl object-cover" />
                      <div className="absolute -top-1 -right-1 size-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-background-dark text-white text-[10px] font-black">?</div>
                   </div>
                   <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black text-white uppercase truncate">Điểm rèn luyện thấp</h4>
                      <p className="text-[10px] text-blue-400 font-bold mt-0.5">Đ/c {analyticsData.warnings.lowPoints.name} hiện có {analyticsData.warnings.lowPoints.points} điểm RL</p>
                   </div>
                   {isStaff && (
                     <button 
                       onClick={() => handleSendReminder(analyticsData.warnings.lowPoints!.id, analyticsData.warnings.lowPoints!.name, 'reminder', 'Đôn đốc điểm rèn luyện', `Hiện tại điểm rèn luyện của đồng chí đang ở mức thấp (${analyticsData.warnings.lowPoints!.points} điểm). Hãy nỗ lực tích lũy thêm!`)} 
                       className="px-3 py-2 bg-blue-500 text-white rounded-xl text-[8px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                     >
                        Đôn đốc
                     </button>
                   )}
                </div>
              )}
           </div>
        </section>
      </main>

      {/* Selectors */}
      {showYearPicker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
          <div className="bg-surface-dark w-full max-w-xs rounded-[3rem] p-6 border border-white/10 shadow-2xl max-h-[70vh] overflow-y-auto no-scrollbar text-center">
            <h3 className="text-white font-black uppercase mb-4 tracking-widest text-xs">Năm phân tích</h3>
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
          <div className="bg-surface-dark w-full max-w-sm rounded-[3rem] p-6 border border-white/10 shadow-2xl text-center">
             <h3 className="text-white font-black uppercase mb-4 tracking-widest text-xs">Tháng phân tích</h3>
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

export default AnalyticsScreen;
