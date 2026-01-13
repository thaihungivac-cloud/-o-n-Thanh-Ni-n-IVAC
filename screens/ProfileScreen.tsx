
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Member, YouthPosition, BranchName, ActivityPlan } from '../types';

interface ProfileScreenProps {
  currentUser: Member | null;
  members: Member[];
  activities: ActivityPlan[];
  onUpdate: (updatedMember: Member) => void;
  onLogout: () => void;
  onBack: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ currentUser, members, activities, onUpdate, onLogout, onBack }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedActivityDetails, setSelectedActivityDetails] = useState<ActivityPlan | null>(null);
  const [editData, setEditData] = useState<Partial<Member>>({});
  const [selectedStatsYear, setSelectedStatsYear] = useState(new Date().getFullYear());
  const [showYearPicker, setShowYearPicker] = useState(false);
  
  // States cho tính năng căn chỉnh ảnh
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  if (!currentUser) return null;

  const isAdmin = currentUser.position === 'Bí thư đoàn cơ sở';

  const statsInYear = useMemo(() => {
    let totalPoints = 0;
    let activityCount = 0;
    const joinedActivities: ActivityPlan[] = [];

    activities.forEach(act => {
      const actYear = new Date(act.date).getFullYear();
      if (actYear === selectedStatsYear) {
        const attended = act.attendees.some(att => att.memberId === currentUser.id);
        if (attended) {
          totalPoints += act.points;
          activityCount++;
          joinedActivities.push(act);
        }
      }
    });

    return { totalPoints, activityCount, joinedActivities };
  }, [activities, currentUser.id, selectedStatsYear]);

  const years = Array.from({ length: 11 }, (_, i) => 2020 + i);

  const handleOpenEdit = () => {
    setEditData({ ...currentUser });
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    onUpdate({ ...currentUser, ...editData } as Member);
    setIsEditModalOpen(false);
    alert("Cập nhật thông tin cá nhân thành công!");
  };

  // 1. Khi chọn file từ điện thoại/máy tính
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result as string);
        setIsAdjusting(true); // Mở trình căn chỉnh
        setScale(1);
        setPosition({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    }
    // Reset input để có thể chọn lại cùng 1 file nếu cần
    e.target.value = '';
  };

  // 2. Logic Kéo thả ảnh để căn chỉnh
  const handleStartDrag = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - position.x, y: clientY - position.y });
  };

  const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setPosition({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    });
  };

  const handleStopDrag = () => setIsDragging(false);

  // 3. Xuất ảnh đã căn chỉnh ra Canvas để lưu
  const handleFinalizeAvatar = () => {
    if (!imageRef.current) return;

    const canvas = document.createElement('canvas');
    const size = 400; // Kích thước avatar chuẩn 1:1
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const img = imageRef.current;
      const displayWidth = img.clientWidth;
      const displayHeight = img.clientHeight;
      
      // Tính toán tỷ lệ thực tế giữa ảnh hiển thị và ảnh gốc
      const ratio = img.naturalWidth / displayWidth;
      
      // Vẽ ảnh lên canvas dựa trên vị trí và scale người dùng đã chỉnh
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, size, size); // Nền trắng nếu ảnh không phủ hết
      
      // logic vẽ: 
      // Vị trí trung tâm canvas là size/2
      // Áp dụng scale và position
      const renderWidth = displayWidth * scale;
      const renderHeight = displayHeight * scale;
      
      // Tính toán offset để ảnh nằm đúng vị trí người dùng kéo
      // Vị trí người dùng kéo (position.x, position.y) là tương đối với tâm khung hình
      const drawX = (size / 2) - (renderWidth / 2) + position.x;
      const drawY = (size / 2) - (renderHeight / 2) + position.y;

      ctx.drawImage(img, drawX, drawY, renderWidth, renderHeight);
      
      const finalDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      onUpdate({ ...currentUser, avatar: finalDataUrl });
      setIsAdjusting(false);
      setTempImage(null);
      alert("Đã cập nhật ảnh đại diện mới thành công!");
    }
  };

  const InfoRow = ({ icon, label, value, locked = true }: { icon: string, label: string, value: string, locked?: boolean }) => (
    <div className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0 group">
      <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-primary transition-colors">
        <span className="material-symbols-outlined text-xl">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-bold text-white mt-0.5 truncate">{value || 'Chưa cập nhật'}</p>
      </div>
      {locked && <span className="material-symbols-outlined text-gray-700 text-sm">lock</span>}
    </div>
  );

  return (
    <div className="flex flex-col pb-32 bg-background-dark min-h-screen font-display">
      <header className="sticky top-0 z-40 bg-background-dark/95 backdrop-blur-md px-6 py-5 border-b border-white/5 flex items-center justify-between">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-all text-white">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="text-lg font-black uppercase tracking-tighter text-white">Hồ sơ cá nhân</h2>
        <button onClick={() => setIsQRModalOpen(true)} className="size-10 bg-primary/20 text-primary rounded-full flex items-center justify-center"><span className="material-symbols-outlined text-xl">qr_code_2</span></button>
      </header>

      <div className="px-6 py-8 flex flex-col items-center">
        <div className="relative group mb-6 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <div className="absolute -inset-2 bg-gradient-to-br from-primary to-emerald-400 rounded-full blur opacity-40"></div>
          <div className="relative size-32 rounded-full border-[6px] border-background-dark overflow-hidden shadow-2xl bg-surface-dark flex items-center justify-center">
            {currentUser.avatar ? <img src={currentUser.avatar} className="size-full object-cover" alt="Profile" /> : <span className="material-symbols-outlined text-5xl text-gray-600">person</span>}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-primary text-white text-[9px] font-black px-3 py-1.5 rounded-2xl border-4 border-background-dark flex items-center gap-1 shadow-lg">
             <span className="material-symbols-outlined text-[14px]">photo_camera</span> THAY ẢNH
          </div>
        </div>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        
        <div className="text-center">
          <h1 className="text-2xl font-black text-white">{currentUser.name}</h1>
          <p className="text-sm text-primary font-bold uppercase tracking-widest mt-1">{currentUser.position}</p>
        </div>

        <div className="mt-8 w-full flex items-center justify-between bg-white/5 p-4 rounded-3xl border border-white/10 relative">
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Thống kê năm</span>
              <button onClick={() => setShowYearPicker(!showYearPicker)} className="text-lg font-black text-white flex items-center gap-2 mt-1">
                {selectedStatsYear} <span className="material-symbols-outlined text-primary">expand_more</span>
              </button>
           </div>
           <div className="flex items-center gap-6">
              <div className="text-right">
                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Điểm RL</p>
                 <p className="text-2xl font-black text-primary">{statsInYear.totalPoints}</p>
              </div>
              <div className="text-right border-l border-white/10 pl-6">
                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Hoạt động</p>
                 <p className="text-2xl font-black text-white">{statsInYear.activityCount}</p>
              </div>
           </div>

           {showYearPicker && (
             <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-surface-dark border border-white/10 rounded-[2rem] p-4 shadow-2xl grid grid-cols-3 gap-2 animate-in fade-in zoom-in-95 duration-200">
                {years.map(y => (
                  <button key={y} onClick={() => {setSelectedStatsYear(y); setShowYearPicker(false);}} className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all ${selectedStatsYear === y ? 'bg-primary text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                    {y}
                  </button>
                ))}
             </div>
           )}
        </div>
      </div>

      <div className="px-6 space-y-8">
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Lịch sử tham gia thực tế {selectedStatsYear}</h3>
            <span className="text-[8px] font-bold text-primary/50 uppercase tracking-widest italic">* Chỉ tính các HĐ đã quét QR</span>
          </div>
          <div className="space-y-3">
             {statsInYear.joinedActivities.length > 0 ? (
               statsInYear.joinedActivities.map(act => (
                 <div key={act.id} className="bg-surface-dark/50 border border-white/5 p-4 rounded-3xl flex items-center gap-4 transition-all hover:bg-white/5">
                   <div className="size-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-xl">verified</span>
                   </div>
                   <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black text-white truncate">{act.name}</h4>
                      <p className="text-[9px] text-gray-500 font-bold uppercase mt-1">Ngày {new Date(act.date).toLocaleDateString('vi-VN')} • {act.startTime} - {act.endTime}</p>
                   </div>
                   <button 
                    onClick={() => setSelectedActivityDetails(act)}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary/20 active:scale-95 transition-all"
                   >
                     Chi tiết
                   </button>
                 </div>
               ))
             ) : (
               <div className="py-10 text-center border border-dashed border-white/10 rounded-3xl">
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic">Chưa ghi nhận tham gia hoạt động trong năm {selectedStatsYear}</p>
               </div>
             )}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Thông tin chi tiết</h3>
            <span className="text-[9px] font-bold text-primary/50 uppercase tracking-tighter italic">* Liên hệ Bí thư để thay đổi thông tin khóa</span>
          </div>
          <div className="bg-surface-dark/30 border border-white/5 rounded-[2.5rem] p-6 space-y-1">
            <InfoRow icon="id_card" label="Mã đoàn viên" value={currentUser.code} />
            <InfoRow icon="wc" label="Giới tính" value={currentUser.gender} />
            <InfoRow icon="calendar_today" label="Ngày sinh" value={currentUser.dob ? new Date(currentUser.dob).toLocaleDateString('vi-VN') : 'N/A'} locked={false} />
            <InfoRow icon="group_add" label="Ngày vào đoàn" value={new Date(currentUser.joinDate).toLocaleDateString('vi-VN')} locked={false} />
            <InfoRow icon="business_center" label="Đơn vị (Chi đoàn)" value={currentUser.branch} />
            <InfoRow icon="verified_user" label="Chức vụ" value={currentUser.position} />
            <InfoRow icon="call" label="Số điện thoại" value={currentUser.phone} locked={false} />
            <InfoRow icon="alternate_email" label="Gmail cá nhân" value={currentUser.email} locked={false} />
          </div>
        </section>

        <button onClick={handleOpenEdit} className="w-full py-5 bg-white/5 border border-white/10 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl">
          <span className="material-symbols-outlined text-lg">edit_square</span> Chỉnh sửa thông tin
        </button>
      </div>

      {/* MODAL TRÌNH CĂN CHỈNH ẢNH ĐẠI DIỆN */}
      {isAdjusting && tempImage && (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col animate-in fade-in duration-300">
           <header className="p-6 flex items-center justify-between bg-black/40 backdrop-blur-md z-10 shrink-0">
              <button onClick={() => { setIsAdjusting(false); setTempImage(null); }} className="size-10 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-md"><span className="material-symbols-outlined">close</span></button>
              <h3 className="text-xs font-black uppercase tracking-widest text-white">Căn chỉnh ảnh đại diện</h3>
              <div className="size-10"></div>
           </header>

           <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-[#000]">
              {/* Vùng xem trước hình tròn */}
              <div className="relative size-[280px] sm:size-[320px] rounded-full overflow-hidden border-2 border-primary shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] z-20 pointer-events-none"></div>
              
              {/* Ảnh thực tế để kéo và zoom */}
              <img 
                ref={imageRef}
                src={tempImage} 
                className="absolute max-w-none cursor-move select-none transition-transform duration-75"
                style={{ 
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  userSelect: 'none'
                }}
                onMouseDown={handleStartDrag}
                onMouseMove={handleDrag}
                onMouseUp={handleStopDrag}
                onMouseLeave={handleStopDrag}
                onTouchStart={handleStartDrag}
                onTouchMove={handleDrag}
                onTouchEnd={handleStopDrag}
                alt="Adjusting"
              />
           </div>

           <footer className="p-8 bg-background-dark border-t border-white/5 space-y-8 shrink-0">
              <div className="space-y-4">
                 <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Phóng to / Thu nhỏ</span>
                    <span className="text-[10px] font-black text-primary uppercase">{Math.round(scale * 100)}%</span>
                 </div>
                 <input 
                   type="range" 
                   min="0.5" 
                   max="3" 
                   step="0.01" 
                   value={scale} 
                   onChange={(e) => setScale(parseFloat(e.target.value))}
                   className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                 />
              </div>

              <div className="flex gap-4">
                 <button 
                  onClick={() => { setIsAdjusting(false); setTempImage(null); }}
                  className="flex-1 py-4 bg-white/5 text-gray-400 font-black uppercase text-xs rounded-2xl"
                 >
                   Hủy
                 </button>
                 <button 
                  onClick={handleFinalizeAvatar}
                  className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black uppercase text-xs shadow-xl shadow-primary/30"
                 >
                   Xác nhận & Lưu
                 </button>
              </div>
           </footer>
        </div>
      )}

      {/* MODAL: CHI TIẾT DANH SÁCH CHỐT CỦA HOẠT ĐỘNG */}
      {selectedActivityDetails && (
        <div className="fixed inset-0 z-[160] flex items-end justify-center bg-black/90 backdrop-blur-md p-0 animate-in fade-in duration-300">
           <div className="bg-surface-dark w-full max-w-md rounded-t-[3.5rem] flex flex-col max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom duration-500">
              <div className="p-8 bg-background-dark border-b border-white/5 flex justify-between items-center">
                 <div className="flex flex-col">
                    <h2 className="text-lg font-black text-white uppercase">Danh sách chốt</h2>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
                       {selectedActivityDetails.attendees.length} đồng chí đã có mặt thực tế
                    </p>
                 </div>
                 <button onClick={() => setSelectedActivityDetails(null)} className="size-10 bg-white/5 rounded-full flex items-center justify-center text-white">
                    <span className="material-symbols-outlined">close</span>
                 </button>
              </div>
              <div className="p-6 overflow-y-auto no-scrollbar space-y-3 flex-1">
                 <div className="bg-white/5 p-4 rounded-2xl mb-4 border border-white/5">
                    <h3 className="text-sm font-black text-primary uppercase mb-1">{selectedActivityDetails.name}</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">{new Date(selectedActivityDetails.date).toLocaleDateString('vi-VN')} • +{selectedActivityDetails.points} điểm RL</p>
                 </div>
                 
                 {selectedActivityDetails.attendees.map((att, i) => {
                    const m = members.find(mem => mem.id === att.memberId);
                    return (
                       <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                          <img src={m?.avatar} className="size-10 rounded-xl object-cover border border-white/10" alt="Avatar" />
                          <div className="flex-1">
                             <p className="text-xs font-black text-white">{m?.name}</p>
                             <p className="text-[9px] text-gray-500 uppercase">{m?.code} • {m?.branch}</p>
                          </div>
                          <div className="text-right">
                             <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg uppercase">CÓ MẶT</span>
                          </div>
                       </div>
                    );
                 })}
                 {selectedActivityDetails.attendees.length === 0 && (
                   <p className="text-center text-gray-500 text-xs py-10 font-black uppercase">Chưa có ai điểm danh cho hoạt động này</p>
                 )}
              </div>
              <div className="p-8 bg-background-dark/50 border-t border-white/5">
                 <button onClick={() => setSelectedActivityDetails(null)} className="w-full py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Đóng</button>
              </div>
           </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="bg-surface-dark w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[90vh]">
            <div className="p-8 bg-primary text-white flex justify-between items-center shrink-0">
               <h2 className="text-xl font-black uppercase tracking-tight">Cập nhật thông tin</h2>
               <button onClick={() => setIsEditModalOpen(false)} className="size-10 bg-white/20 rounded-full flex items-center justify-center"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="p-8 space-y-6 overflow-y-auto no-scrollbar flex-1">
               <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl mb-2">
                 <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2"><span className="material-symbols-outlined text-xs">info</span> Quy tắc hệ thống</p>
                 <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">Đồng chí được phép tự chỉnh sửa **Họ tên**, **Ngày sinh**, **Ngày vào đoàn**, **Số điện thoại** và **Gmail**. Các thông tin khác bao gồm **Giới tính** do Bí thư quản lý để đảm bảo tính xác thực.</p>
               </div>

               <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Họ và tên *</label>
                  <input value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-3 text-white focus:border-primary outline-none text-sm font-bold" />
               </div>
               
               <div className="space-y-1 opacity-60">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-1">Giới tính (Khóa) <span className="material-symbols-outlined text-[10px]">lock</span></label>
                  <select disabled value={editData.gender} className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3 text-gray-400 outline-none text-sm font-bold appearance-none cursor-not-allowed">
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
               </div>

               <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Ngày sinh *</label>
                  <input type="date" value={editData.dob} onChange={e => setEditData({...editData, dob: e.target.value})} className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-3 text-white focus:border-primary outline-none text-sm font-bold color-scheme-dark" />
               </div>

               <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Ngày vào đoàn *</label>
                  <input type="date" value={editData.joinDate} onChange={e => setEditData({...editData, joinDate: e.target.value})} className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-3 text-white focus:border-primary outline-none text-sm font-bold color-scheme-dark" />
               </div>

               <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Số điện thoại *</label>
                  <input type="tel" value={editData.phone} onChange={e => setEditData({...editData, phone: e.target.value})} className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-3 text-white focus:border-primary outline-none text-sm font-bold" placeholder="Nhập số điện thoại..." />
               </div>

               <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Gmail cá nhân *</label>
                  <input type="email" value={editData.email} onChange={e => setEditData({...editData, email: e.target.value})} className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-3 text-white focus:border-primary outline-none text-sm font-bold" placeholder="Nhập Gmail..." />
               </div>

               <div className="space-y-4 pt-4 border-t border-white/5 opacity-50">
                  <div className="space-y-1 relative">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-1">Mã đoàn viên <span className="material-symbols-outlined text-[10px]">lock</span></label>
                    <input disabled value={currentUser.code} className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3 text-gray-500 text-sm cursor-not-allowed" />
                  </div>
                  <div className="space-y-1 relative">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-1">Chi đoàn <span className="material-symbols-outlined text-[10px]">lock</span></label>
                    <input disabled value={currentUser.branch} className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3 text-gray-500 text-sm cursor-not-allowed" />
                  </div>
               </div>
            </div>
            <div className="p-8 bg-background-dark/50 border-t border-white/5 flex gap-4">
               <button onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 text-gray-500 font-black uppercase text-xs">Hủy</button>
               <button onClick={handleSave} className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black uppercase text-xs shadow-xl shadow-primary/30">Cập nhật hồ sơ</button>
            </div>
          </div>
        </div>
      )}

      {isQRModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 backdrop-blur-md p-6">
           <div className="bg-white w-full max-w-xs rounded-[3rem] p-8 flex flex-col items-center gap-6 shadow-2xl">
              <div className="h-10 w-20 border-2 border-primary rounded-xl flex items-center justify-center"><span className="text-primary font-black text-xs">IVAC</span></div>
              <h2 className="text-background-dark font-black text-sm uppercase text-center tracking-tight">CÔNG NGHỆ SỐ IVAC<br/>{currentUser.name}</h2>
              <div className="p-4 bg-gray-50 rounded-[2rem] border-2 border-gray-100">
                 <img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${currentUser.code}&color=0f231a`} className="size-48" alt="QR" />
              </div>
              <button onClick={() => setIsQRModalOpen(false)} className="w-full py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase">Đóng</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;
