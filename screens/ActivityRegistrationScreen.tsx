
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ActivityPlan, BranchName, YouthPosition, Member, ParticipantDetail } from '../types';

interface ActivityRegistrationScreenProps {
  currentUser: Member | null;
  members: Member[];
  activities: ActivityPlan[];
  onUpdateActivities: React.Dispatch<React.SetStateAction<ActivityPlan[]>>;
  onBack: () => void;
}

const ActivityRegistrationScreen: React.FC<ActivityRegistrationScreenProps> = ({ currentUser, members, activities, onUpdateActivities, onBack }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  
  const [selectedActivityForList, setSelectedActivityForList] = useState<ActivityPlan | null>(null);
  const [selectedActivityForAttendance, setSelectedActivityForAttendance] = useState<ActivityPlan | null>(null);
  const [selectedActivityForQR, setSelectedActivityForQR] = useState<ActivityPlan | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null); 
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [showMonthSelector, setShowMonthSelector] = useState(false);

  const [leaderSearch, setLeaderSearch] = useState('');
  const [showLeaderSuggestions, setShowLeaderSuggestions] = useState(false);

  const [formData, setFormData] = useState<Partial<ActivityPlan>>({
    name: '',
    leader: '',
    location: '',
    date: '',
    startTime: '',
    endTime: '',
    points: 10,
    branch: 'Đoàn cơ sở'
  });

  const months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
  const years = Array.from({ length: 11 }, (_, i) => 2020 + i); 

  if (!currentUser) return null;

  const isAdmin = currentUser.position === 'Bí thư đoàn cơ sở' || currentUser.position === 'Phó bí thư đoàn cơ sở';

  const leaderSuggestions = useMemo(() => {
    if (!leaderSearch.trim()) return [];
    return members.filter(m => 
      (m.role === 'admin' || m.role === 'editor') && 
      (m.name.toLowerCase().includes(leaderSearch.toLowerCase()) || 
      m.code.toLowerCase().includes(leaderSearch.toLowerCase()))
    ).slice(0, 4);
  }, [leaderSearch, members]);

  const handleOpenForm = (act?: ActivityPlan) => {
    if (act) {
      setEditingId(act.id);
      setFormData(act);
      setLeaderSearch(act.leader || '');
    } else {
      setEditingId(null);
      setFormData({ 
        name: '', 
        leader: '', 
        location: '', 
        date: new Date().toISOString().split('T')[0], 
        startTime: '08:00', 
        endTime: '11:00', 
        points: 10, 
        branch: 'Đoàn cơ sở' 
      });
      setLeaderSearch('');
    }
    setIsFormOpen(true);
  };

  const handleSaveActivity = () => {
    if (!formData.name || !formData.date || !leaderSearch) {
      alert("Đồng chí vui lòng điền đầy đủ các thông tin bắt buộc (*)");
      return;
    }
    const finalData = { ...formData, leader: leaderSearch };
    if (editingId) {
      onUpdateActivities(prev => prev.map(a => a.id === editingId ? { ...a, ...finalData } as ActivityPlan : a));
      alert("Cập nhật hoạt động thành công!");
    } else {
      const newAct: ActivityPlan = {
        ...finalData as any,
        id: Date.now().toString(),
        status: 'upcoming',
        participants: [],
        attendees: []
      };
      onUpdateActivities(prev => [newAct, ...prev]);
      alert("Tạo hoạt động mới thành công!");
    }
    setIsFormOpen(false);
  };

  const handleToggleRegistration = (id: string) => {
    const act = activities.find(a => a.id === id);
    if (!act) return;

    const activityDateStr = `${act.date}T${act.startTime}`;
    const activityTime = new Date(activityDateStr).getTime();
    const now = Date.now();
    const oneDayInMs = 24 * 60 * 60 * 1000;

    if (activityTime - now < oneDayInMs && now < activityTime) {
      alert("Hệ thống đã tự động chốt danh sách (24h trước giờ bắt đầu). Không thể đăng ký hoặc hủy lúc này.");
      return;
    }

    const isCurrentlyJoined = act.participants.some(p => p.memberId === currentUser.id);
    onUpdateActivities(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          participants: isCurrentlyJoined 
            ? a.participants.filter(p => p.memberId !== currentUser.id) 
            : [...a.participants, { memberId: currentUser.id, timestamp: new Date().toLocaleString('vi-VN') }]
        };
      }
      return a;
    }));
    
    alert(isCurrentlyJoined ? "Đã huỷ đăng ký tham gia thành công." : "Đăng ký tham gia hoạt động thành công!");
  };

  const filteredActivities = useMemo(() => {
    return activities.filter(act => {
      const d = new Date(act.date);
      const isSameMonthYear = d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
      if (!isSameMonthYear) return false;
      if (selectedDay !== null) return d.getDate() === selectedDay;
      return true;
    }).sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [activities, selectedYear, selectedMonth, selectedDay]);

  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
    return Array.from({ length: 42 }, (_, i) => {
      const day = i - firstDayOfMonth + 1;
      return (day <= 0 || day > daysInMonth) ? null : day;
    });
  }, [selectedYear, selectedMonth]);

  const getDetailedStatus = (act: ActivityPlan) => {
    const now = Date.now();
    const startDateTime = new Date(`${act.date}T${act.startTime}`).getTime();
    const endDateTime = new Date(`${act.date}T${act.endTime}`).getTime();

    if (now > endDateTime) return { label: 'Đã kết thúc', color: 'text-gray-500', bg: 'bg-gray-500/10', finished: true };
    if (now >= startDateTime && now <= endDateTime) return { label: 'Đang diễn ra', color: 'text-primary', bg: 'bg-primary/10', pulse: true, active: true };
    return { label: 'Sắp diễn ra', color: 'text-blue-500', bg: 'bg-blue-500/10', upcoming: true };
  };

  const isLocked = (act: ActivityPlan) => {
    const status = getDetailedStatus(act);
    if (status.finished) return true;
    const now = Date.now();
    const activityDateStr = `${act.date}T${act.startTime}`;
    const activityTime = new Date(activityDateStr).getTime();
    return activityTime - now < 24 * 60 * 60 * 1000;
  };

  const handleOpenQR = (act: ActivityPlan) => {
    setSelectedActivityForQR(act);
    setIsQRModalOpen(true);
  };

  return (
    <div className="flex flex-col h-screen bg-background-dark font-display relative">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-background-dark/95 backdrop-blur-md px-6 py-5 border-b border-white/5 shadow-sm">
        <button onClick={onBack} className="flex size-10 items-center justify-center rounded-full hover:bg-white/10 text-white transition-all">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-black text-white uppercase tracking-tighter">Đăng ký hoạt động</h2>
        <div className="size-10 flex items-center justify-center">
          {isAdmin && (
            <button 
              onClick={() => handleOpenForm()} 
              className="size-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30 active:scale-90 transition-all"
            >
              <span className="material-symbols-outlined text-2xl">add</span>
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6">
        {/* Bộ chọn thời gian */}
        <div className="bg-surface-dark rounded-[2.5rem] p-6 border border-white/5 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => setShowMonthSelector(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-sm font-black text-white"
            >
              {months[selectedMonth]} <span className="material-symbols-outlined text-xs text-primary">expand_more</span>
            </button>
            <button 
              onClick={() => setShowYearSelector(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-sm font-black text-white"
            >
              {selectedYear} <span className="material-symbols-outlined text-xs text-primary">expand_more</span>
            </button>
          </div>

          <div className="grid grid-cols-7 text-center mb-4 border-b border-white/5 pb-2">
            {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d => <span key={d} className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{d}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => {
              const dateStr = day ? `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '';
              const dayActs = day ? activities.filter(a => a.date === dateStr) : [];
              const isSelected = day === selectedDay;
              return (
                <div 
                  key={idx} 
                  onClick={() => day && setSelectedDay(isSelected ? null : day)} 
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all active:scale-95 ${day ? (isSelected ? 'bg-primary text-white shadow-lg shadow-primary/40' : 'bg-white/5 hover:bg-white/10 cursor-pointer') : 'opacity-0'}`}
                >
                  {day && (
                    <>
                      <span className={`text-xs font-black ${isSelected ? 'text-white' : 'text-gray-300'}`}>{day}</span>
                      {dayActs.length > 0 && !isSelected && <div className="absolute bottom-1.5 size-1 rounded-full bg-primary"></div>}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Danh sách hoạt động */}
        <div className="space-y-4 pb-32">
          {filteredActivities.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center gap-3 opacity-30">
               <span className="material-symbols-outlined text-5xl">event_busy</span>
               <p className="text-[10px] font-black uppercase tracking-widest italic">Không có hoạt động trong ngày này</p>
            </div>
          ) : (
            filteredActivities.map(act => {
              const isRegistered = act.participants.some(p => p.memberId === currentUser.id);
              const status = getDetailedStatus(act);
              const locked = isLocked(act);
              
              return (
                <div key={act.id} className={`bg-surface-dark rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col shadow-xl transition-all ${status.finished ? 'grayscale-[0.5]' : 'hover:border-primary/20'}`}>
                  <div className="p-6 flex gap-5">
                    <div className="w-16 h-16 bg-white/5 rounded-3xl flex flex-col items-center justify-center border border-white/10 shrink-0">
                      <span className="text-[10px] font-black text-gray-500 uppercase">{new Date(act.date).toLocaleDateString('vi-VN', { month: 'short' })}</span>
                      <span className="text-2xl font-black text-white leading-none">{new Date(act.date).getDate()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <h4 className="text-sm font-black text-white leading-tight truncate">{act.name}</h4>
                        <div className={`shrink-0 flex items-center gap-1.5 px-2 py-0.5 rounded-lg ${status.bg} ${status.color}`}>
                           {status.pulse && <div className="size-1.5 rounded-full bg-primary animate-ping"></div>}
                           <span className="text-[8px] font-black uppercase">{status.label}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[9px] text-gray-400 font-bold uppercase flex items-center gap-1">
                           <span className="material-symbols-outlined text-[12px]">person</span> {act.leader}
                         </p>
                         <p className="text-[9px] text-primary font-black uppercase flex items-center gap-1">
                           <span className="material-symbols-outlined text-[12px]">corporate_fare</span> {act.branch === 'Đoàn cơ sở' ? 'Đoàn cơ sở' : `Chi đoàn ${act.branch}`}
                         </p>
                         <div className="flex items-center gap-4 mt-2">
                            <span className="text-[9px] font-black text-gray-400 flex items-center gap-1"><span className="material-symbols-outlined text-xs text-primary">groups</span> {act.participants.length}</span>
                            {act.attendees.length > 0 && <span className="text-[9px] font-black text-emerald-500 flex items-center gap-1"><span className="material-symbols-outlined text-xs">how_to_reg</span> {act.attendees.length} có mặt</span>}
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6 flex gap-3">
                    {status.finished ? (
                      <button 
                        onClick={() => {setSelectedActivityForAttendance(act); setIsAttendanceModalOpen(true);}}
                        className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        Kết quả điểm danh
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleToggleRegistration(act.id)} 
                        disabled={locked} 
                        className={`flex-1 py-4 rounded-2xl text-[11px] font-black uppercase transition-all flex items-center justify-center gap-2 ${locked ? 'bg-gray-800 text-gray-600 border border-white/5' : isRegistered ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-primary text-white shadow-lg shadow-primary/30'}`}
                      >
                         <span className="material-symbols-outlined text-lg">{isRegistered ? 'cancel' : 'app_registration'}</span>
                         {locked ? 'Đã chốt danh sách' : isRegistered ? 'Huỷ đăng ký' : 'Đăng ký tham gia'}
                      </button>
                    )}
                    
                    <button 
                      onClick={() => { setSelectedActivityForList(act); setIsListModalOpen(true); }} 
                      className="px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-gray-300 hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined">list_alt</span>
                    </button>

                    {isAdmin && (
                      <>
                        <button 
                          onClick={() => handleOpenQR(act)} 
                          className="px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-yellow-500 hover:bg-yellow-500/10 transition-colors"
                        >
                          <span className="material-symbols-outlined">qr_code_2</span>
                        </button>
                        {!status.finished && (
                          <button 
                            onClick={() => handleOpenForm(act)} 
                            className="px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-gray-300 hover:text-blue-400 transition-colors"
                          >
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Modal QR CODE */}
      {isQRModalOpen && selectedActivityForQR && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md p-6 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-sm rounded-[3.5rem] p-10 flex flex-col items-center gap-8 shadow-2xl animate-in zoom-in-95 duration-500">
              <div className="flex flex-col items-center text-center gap-3">
                 <div className="h-12 w-24 border-2 border-primary rounded-2xl flex items-center justify-center">
                    <span className="text-primary font-black text-sm tracking-tighter">IVAC</span>
                 </div>
                 <h2 className="text-background-dark font-black text-xl leading-tight uppercase tracking-tight">QR ĐIỂM DANH SỐ</h2>
                 <p className="text-gray-500 text-[11px] font-bold uppercase tracking-[0.2em]">{selectedActivityForQR.name}</p>
                 <span className="text-[9px] font-black text-primary bg-primary/5 px-3 py-1 rounded-full">{new Date(selectedActivityForQR.date).toLocaleDateString('vi-VN')}</span>
              </div>

              <div className="p-6 bg-gray-50 rounded-[3rem] border-4 border-gray-100 shadow-inner">
                 <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=IVAC_ACT_${selectedActivityForQR.id}&color=0f231a`} 
                    alt="Activity QR"
                    className="size-56"
                 />
              </div>

              <div className="flex flex-col items-center gap-3 w-full">
                 <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] text-center">Đoàn viên sử dụng tính năng "Quét mã" trên ứng dụng để điểm danh</p>
                 <button 
                   onClick={() => setIsQRModalOpen(false)}
                   className="w-full py-5 bg-primary text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/30 active:scale-95 transition-all mt-4"
                 >
                   Đóng mã QR
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Modal FORM */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="bg-surface-dark w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[90vh]">
            <div className="p-8 bg-primary text-white flex justify-between items-center shrink-0">
               <h2 className="text-xl font-black uppercase tracking-tight">{editingId ? 'Sửa hoạt động' : 'Tạo hoạt động mới'}</h2>
               <button onClick={() => setIsFormOpen(false)} className="size-10 bg-white/20 rounded-full flex items-center justify-center"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="p-8 space-y-5 overflow-y-auto no-scrollbar flex-1">
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Tên hoạt động *</label>
                  <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:border-primary outline-none text-sm font-bold" placeholder="Nhập tên..." />
               </div>
               
               <div className="space-y-1 relative">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Người phụ trách * (Chỉ Admin/Editor)</label>
                  <input 
                    value={leaderSearch} 
                    onChange={e => {setLeaderSearch(e.target.value); setShowLeaderSuggestions(true);}} 
                    onFocus={() => setShowLeaderSuggestions(true)}
                    className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:border-primary outline-none text-sm font-bold" 
                    placeholder="Tìm tên hoặc mã..." 
                  />
                  {showLeaderSuggestions && leaderSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-background-dark border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                      {leaderSuggestions.map(m => (
                        <button key={m.id} onClick={() => {setLeaderSearch(m.name); setShowLeaderSuggestions(false);}} className="w-full p-4 flex items-center gap-3 hover:bg-white/5 text-left border-b border-white/5 last:border-0">
                          <img src={m.avatar} className="size-8 rounded-lg object-cover" />
                          <div>
                            <p className="text-xs font-black text-white">{m.name}</p>
                            <p className="text-[9px] text-gray-500 font-bold">{m.code} • {m.branch} ({m.role.toUpperCase()})</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
               </div>

               <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Đơn vị *</label>
                  <select 
                    value={formData.branch} 
                    onChange={e => setFormData({...formData, branch: e.target.value as any})}
                    className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:border-primary outline-none text-sm font-bold appearance-none"
                  >
                    <option value="Đoàn cơ sở">Đoàn cơ sở</option>
                    <option value="Hậu Cần">Chi Đoàn Hậu Cần</option>
                    <option value="Sản Xuất">Chi Đoàn Sản Xuất</option>
                    <option value="Chất Lượng">Chi đoàn Chất Lượng</option>
                    <option value="Suối Dầu">Chi Đoàn Suối Dầu</option>
                  </select>
               </div>

               <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Địa điểm</label>
                  <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:border-primary outline-none text-sm font-bold" placeholder="Nơi diễn ra..." />
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Ngày tổ chức *</label>
                    <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:border-primary outline-none text-sm font-bold color-scheme-dark" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Điểm RL</label>
                    <input type="number" value={formData.points} onChange={e => setFormData({...formData, points: parseInt(e.target.value)})} className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:border-primary outline-none text-sm font-bold" />
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Bắt đầu</label>
                    <input type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:border-primary outline-none text-sm font-bold color-scheme-dark" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Kết thúc</label>
                    <input type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:border-primary outline-none text-sm font-bold color-scheme-dark" />
                 </div>
               </div>
            </div>
            <div className="p-8 bg-background-dark/50 border-t border-white/5 flex gap-4 shrink-0">
               <button onClick={() => setIsFormOpen(false)} className="flex-1 py-4 text-gray-500 font-black uppercase text-xs">Hủy</button>
               <button onClick={handleSaveActivity} className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black uppercase text-xs shadow-xl shadow-primary/30 active:scale-95 transition-all">Lưu hoạt động</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Danh sách ĐĂNG KÝ */}
      {isListModalOpen && selectedActivityForList && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/90 backdrop-blur-md p-0">
          <div className="bg-surface-dark w-full max-w-md rounded-t-[3.5rem] overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-500 max-h-[85vh]">
            <div className="p-8 bg-background-dark border-b border-white/5 flex justify-between items-center">
               <div className="flex flex-col">
                  <h2 className="text-lg font-black text-white">Danh sách đăng ký</h2>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{selectedActivityForList.participants.length} đồng chí đã ghi danh</p>
               </div>
               <button onClick={() => setIsListModalOpen(false)} className="size-10 bg-white/5 rounded-full flex items-center justify-center text-white"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto no-scrollbar space-y-3">
              {selectedActivityForList.participants.map((p, idx) => {
                const m = members.find(mem => mem.id === p.memberId);
                return (
                  <div key={idx} className="bg-white/5 p-4 rounded-3xl border border-white/5 flex items-center gap-4">
                    <div className="size-10 rounded-xl overflow-hidden border border-white/10 shrink-0">
                      <img src={m?.avatar} className="size-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-black text-white">{m?.name}</h5>
                      <p className="text-[9px] text-gray-500 font-bold uppercase">{m?.code} • Chi đoàn {m?.branch}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-8 bg-background-dark/50 border-t border-white/5">
              <button onClick={() => setIsListModalOpen(false)} className="w-full py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase shadow-xl">Đóng danh sách</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Kết quả ĐIỂM DANH */}
      {isAttendanceModalOpen && selectedActivityForAttendance && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/90 backdrop-blur-md p-0">
          <div className="bg-surface-dark w-full max-w-md rounded-t-[3.5rem] overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-500 max-h-[85vh]">
            <div className="p-8 bg-background-dark border-b border-white/5 flex justify-between items-center">
               <div className="flex flex-col">
                  <h2 className="text-lg font-black text-white">Kết quả tham gia</h2>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">{selectedActivityForAttendance.attendees.length} / {selectedActivityForAttendance.participants.length} đồng chí có mặt</p>
               </div>
               <button onClick={() => setIsAttendanceModalOpen(false)} className="size-10 bg-white/5 rounded-full flex items-center justify-center text-white"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto no-scrollbar space-y-3">
              {selectedActivityForAttendance.attendees.map((p, idx) => {
                const m = members.find(mem => mem.id === p.memberId);
                return (
                  <div key={idx} className="bg-emerald-500/10 p-4 rounded-3xl border border-emerald-500/20 flex items-center gap-4">
                    <div className="size-10 rounded-xl overflow-hidden border border-emerald-500/20 shrink-0">
                      <img src={m?.avatar} className="size-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-black text-white">{m?.name}</h5>
                      <p className="text-[9px] text-gray-500 font-bold uppercase">{m?.code} • +{selectedActivityForAttendance.points} điểm RL</p>
                    </div>
                    <div className="text-right">
                       <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/20 px-2 py-1 rounded-lg uppercase">Đã cộng</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-8 bg-background-dark/50 border-t border-white/5">
              <button onClick={() => setIsAttendanceModalOpen(false)} className="w-full py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase shadow-xl">Quay lại</button>
            </div>
          </div>
        </div>
      )}

      {/* Selectors */}
      {showMonthSelector && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
           <div className="bg-surface-dark w-full max-w-xs rounded-[3rem] p-6 grid grid-cols-2 gap-2 border border-white/10 shadow-2xl">
              {months.map((m, i) => (
                <button key={m} onClick={()=>{setSelectedMonth(i); setShowMonthSelector(false); setSelectedDay(null);}} className={`py-4 rounded-2xl text-[10px] font-black uppercase transition-all ${selectedMonth === i ? 'bg-primary text-white' : 'bg-white/5 text-gray-400'}`}>{m}</button>
              ))}
           </div>
        </div>
      )}

      {showYearSelector && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
           <div className="bg-surface-dark w-full max-w-xs rounded-[3rem] p-6 grid grid-cols-3 gap-2 border border-white/10 shadow-2xl max-h-[70vh] overflow-y-auto no-scrollbar">
              {years.map(y => (
                <button key={y} onClick={()=>{setSelectedYear(y); setShowYearSelector(false); setSelectedDay(null);}} className={`py-4 rounded-2xl text-[10px] font-black uppercase transition-all ${selectedYear === y ? 'bg-primary text-white' : 'bg-white/5 text-gray-400'}`}>{y}</button>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default ActivityRegistrationScreen;
