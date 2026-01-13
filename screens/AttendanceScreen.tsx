
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import jsQR from 'jsqr';
import { ActivityPlan, Member, BranchName } from '../types';

interface AttendanceScreenProps {
  currentUser: Member | null;
  members: Member[];
  activities: ActivityPlan[];
  onUpdateActivities: React.Dispatch<React.SetStateAction<ActivityPlan[]>>;
  onBack: () => void;
}

const AttendanceScreen: React.FC<AttendanceScreenProps> = ({ currentUser, members, activities, onUpdateActivities, onBack }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; subMessage?: string } | null>(null);
  const [selectedActivityId, setSelectedActivityId] = useState<string>('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const requestRef = useRef<number>(null);

  const isStaff = currentUser?.role === 'admin' || currentUser?.role === 'editor';

  const stopScanner = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    setIsScanning(false);
  }, []);

  // Đảm bảo dọn dẹp camera khi rời màn hình
  useEffect(() => {
    return () => stopScanner();
  }, [stopScanner]);

  const activeActivities = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentTime = now.getTime();
    
    return activities.filter(a => {
      if (a.date !== todayStr) return false;
      const startDateTime = new Date(`${a.date}T${a.startTime}`).getTime();
      const endDateTime = new Date(`${a.date}T${a.endTime}`).getTime();
      return currentTime >= startDateTime && currentTime <= endDateTime;
    });
  }, [activities]);

  useEffect(() => {
    if (activeActivities.length === 1 && !selectedActivityId) {
      setSelectedActivityId(activeActivities[0].id);
    }
  }, [activeActivities, selectedActivityId]);

  const handleAttendanceLogic = useCallback((activityId: string, memberCodeOrId: string, verifiedBy: string = "QR_CODE") => {
    const activity = activities.find(a => a.id === activityId);
    if (!activity) return { success: false, message: "Không tìm thấy hoạt động." };

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentTime = now.getTime();
    const startDateTime = new Date(`${activity.date}T${activity.startTime}`).getTime();
    const endDateTime = new Date(`${activity.date}T${activity.endTime}`).getTime();

    if (activity.date !== todayStr || currentTime < startDateTime) {
      return { success: false, message: "Chưa đến giờ điểm danh", subMessage: "Vui lòng quay lại khi hoạt động bắt đầu." };
    }
    
    if (currentTime > endDateTime) {
      return { success: false, message: "Đã hết giờ điểm danh", subMessage: "Hệ thống đã chốt danh sách tham gia." };
    }

    const targetMember = members.find(m => m.code === memberCodeOrId || m.id === memberCodeOrId);
    if (!targetMember) {
      return { success: false, message: "Mã không hợp lệ." };
    }

    const isRegistered = activity.participants.some(p => p.memberId === targetMember.id);
    if (!isRegistered) {
      return { 
        success: false, 
        message: "Đồng chí chưa đăng ký",
        subMessage: `Đ/c ${targetMember.name} vui lòng đăng ký trước khi điểm danh.`
      };
    }

    const isAlreadyAttended = activity.attendees.some(p => p.memberId === targetMember.id);
    if (isAlreadyAttended) {
      return { 
        success: true, 
        message: "Đã điểm danh trước đó",
        subMessage: `Đồng chí ${targetMember.name} đã được ghi nhận.`
      };
    }

    onUpdateActivities(prev => prev.map(a => {
      if (a.id === activityId) {
        return {
          ...a,
          attendees: [...a.attendees, { 
            memberId: targetMember.id, 
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            verifiedBy: verifiedBy
          }]
        };
      }
      return a;
    }));

    return { 
      success: true, 
      message: "Điểm danh thành công",
      subMessage: `Đã ghi nhận sự có mặt của đ/c ${targetMember.name}.`
    };
  }, [activities, members, onUpdateActivities]);

  const scanFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return;
    const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
    if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && ctx) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      
      if (code) {
        const decodedData = code.data;
        if (!currentUser) return;

        if (decodedData.startsWith('IVAC_ACT_')) {
          const activityId = decodedData.replace('IVAC_ACT_', '');
          setScanResult(handleAttendanceLogic(activityId, currentUser.id, "Tự quét mã"));
          stopScanner();
        } else {
          const actId = selectedActivityId || (activeActivities.length > 0 ? activeActivities[0].id : '');
          if (actId) {
            setScanResult(handleAttendanceLogic(actId, decodedData, currentUser.name));
          } else {
            setScanResult({ success: false, message: "Không có hoạt động phù hợp", subMessage: "Hiện không có hoạt động nào đang trong khung giờ điểm danh." });
          }
          stopScanner();
        }
        return;
      }
    }
    requestRef.current = requestAnimationFrame(scanFrame);
  }, [isScanning, currentUser, activeActivities, selectedActivityId, handleAttendanceLogic, stopScanner]);

  const startScanner = async () => {
    if (isScanning) return;
    setScanResult(null);
    setIsScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        requestRef.current = requestAnimationFrame(scanFrame);
      }
    } catch (err) {
      alert("Không thể truy cập Camera.");
      setIsScanning(false);
    }
  };

  const branchProgress = useMemo(() => {
    const selectedAct = activities.find(a => a.id === selectedActivityId);
    if (!selectedAct) return [];

    const branches: BranchName[] = ['Sản Xuất', 'Hậu Cần', 'Chất Lượng', 'Suối Dầu'];
    return branches.map(b => {
      const registeredCount = selectedAct.participants.filter(p => {
        const m = members.find(mem => mem.id === p.memberId);
        return m?.branch === b;
      }).length;
      
      const attendedCount = selectedAct.attendees.filter(p => {
        const m = members.find(mem => mem.id === p.memberId);
        return m?.branch === b;
      }).length;

      return {
        name: b,
        registered: registeredCount,
        attended: attendedCount,
        percent: registeredCount > 0 ? Math.round((attendedCount / registeredCount) * 100) : 0
      };
    }).filter(b => b.registered > 0);
  }, [selectedActivityId, activities, members]);

  const attendanceHistory = useMemo(() => {
    const history: any[] = [];
    activeActivities.forEach(act => {
      act.attendees.forEach(att => {
        const member = members.find(m => m.id === att.memberId);
        if (member) {
          history.push({ 
            id: `${act.id}-${member.id}`, 
            memberName: member.name, 
            branch: member.branch, 
            activityName: act.name, 
            time: att.timestamp,
            verifiedBy: att.verifiedBy || 'Hệ thống'
          });
        }
      });
    });
    return history.sort((a, b) => b.time.localeCompare(a.time)).slice(0, 15);
  }, [activeActivities, members]);

  const manualList = useMemo(() => {
    const selectedAct = activities.find(a => a.id === selectedActivityId);
    if (!selectedAct) return [];
    return selectedAct.participants.filter(p => 
      !selectedAct.attendees.some(att => att.memberId === p.memberId)
    ).map(p => {
      const m = members.find(mem => mem.id === p.memberId);
      return m;
    }).filter(m => m !== undefined) as Member[];
  }, [selectedActivityId, activities, members]);

  const handleManualConfirm = (member: Member) => {
    const result = handleAttendanceLogic(selectedActivityId, member.id, currentUser?.name || 'Cán bộ');
    if (result.success) {
      alert(`Đã ghi nhận điểm danh thành công cho đồng chí ${member.name}`);
    } else {
      alert(`Thất bại: ${result.message}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-32 transition-colors">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-6 py-5 border-b border-gray-200 dark:border-white/5 shadow-sm">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none">Điểm danh Số</h2>
          <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em] mt-1">IVAC DIGITAL ATTENDANCE</span>
        </div>
        <button onClick={startScanner} className="size-10 flex items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined">qr_code_scanner</span>
        </button>
      </header>

      <main className="p-6 space-y-8 overflow-y-auto no-scrollbar">
        <div className="bg-surface-dark rounded-[2.5rem] p-6 border border-white/5 shadow-2xl space-y-6">
           <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                 <div className={`size-3 rounded-full ${activeActivities.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-gray-600'}`}></div>
                 <p className="text-[10px] font-black text-white uppercase tracking-widest">Hoạt động đang diễn ra</p>
              </div>
              <span className="text-[10px] font-bold text-gray-500">{activeActivities.length} hoạt động</span>
           </div>

           {activeActivities.length > 0 ? (
             <div className="space-y-4">
                <div className="space-y-2">
                   {activeActivities.map(act => (
                     <button 
                       key={act.id} 
                       onClick={() => setSelectedActivityId(act.id)}
                       className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all border ${selectedActivityId === act.id ? 'bg-primary border-primary text-white shadow-lg' : 'bg-background-dark/50 border-white/5 text-gray-400'}`}
                     >
                        <div className="text-left min-w-0">
                           <p className="text-xs font-black truncate">{act.name}</p>
                           <p className="text-[9px] font-bold opacity-60">Kết thúc lúc {act.endTime}</p>
                        </div>
                        {selectedActivityId === act.id && <span className="material-symbols-outlined text-base">check_circle</span>}
                     </button>
                   ))}
                </div>

                {isStaff && selectedActivityId && (
                  <button 
                    onClick={() => setIsManualModalOpen(true)}
                    className="w-full py-4 bg-white/5 border border-primary/30 rounded-2xl text-primary text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/10 transition-all"
                  >
                     <span className="material-symbols-outlined text-lg">fact_check</span>
                     Xác nhận thủ công theo danh sách
                  </button>
                )}
             </div>
           ) : (
             <p className="text-center text-gray-500 text-[10px] font-black uppercase tracking-widest py-4">Hiện không có hoạt động nào trong khung giờ điểm danh</p>
           )}
        </div>

        {selectedActivityId && branchProgress.length > 0 && (
          <section className="bg-surface-dark/30 rounded-[2.5rem] p-6 border border-white/5 shadow-xl space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-white uppercase tracking-widest">Tiến độ theo Chi đoàn</h3>
                <span className="text-[9px] font-black text-primary bg-primary/10 px-2 py-1 rounded-lg">LIVE DATA</span>
             </div>
             <div className="space-y-4">
                {branchProgress.map(bp => (
                  <div key={bp.name} className="space-y-1.5">
                    <div className="flex justify-between items-end px-1">
                       <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{bp.name}</span>
                       <span className="text-[10px] font-black text-white">{bp.attended}/{bp.registered} <span className="text-primary ml-1">{bp.percent}%</span></span>
                    </div>
                    <div className="h-2.5 bg-background-dark rounded-full overflow-hidden border border-white/5">
                       <div 
                         className="h-full bg-gradient-to-r from-emerald-600 to-primary rounded-full transition-all duration-1000" 
                         style={{ width: `${bp.percent}%` }}
                       />
                    </div>
                  </div>
                ))}
             </div>
          </section>
        )}

        <section className="space-y-4">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Vừa ghi nhận</h3>
              <span className="text-[9px] font-bold text-primary uppercase">Cập nhật liên tục</span>
           </div>
           <div className="space-y-3">
              {attendanceHistory.length > 0 ? (
                attendanceHistory.map((item) => (
                  <div key={item.id} className="bg-white dark:bg-surface-dark/60 border border-gray-100 dark:border-white/5 rounded-[1.8rem] p-5 flex items-center gap-4 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="size-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/10">
                       <span className="material-symbols-outlined text-xl">person_check</span>
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-start">
                          <h4 className="text-xs font-black text-gray-900 dark:text-white truncate">{item.memberName}</h4>
                          <span className="text-[9px] font-black text-emerald-500">{item.time}</span>
                       </div>
                       <div className="flex items-center gap-2 mt-1">
                          <p className="text-[9px] text-gray-500 font-bold uppercase truncate flex-1">{item.activityName}</p>
                          <span className="text-[8px] font-black text-gray-400 uppercase italic">Bởi: {item.verifiedBy}</span>
                       </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[3rem] opacity-30 flex flex-col items-center gap-2">
                   <span className="material-symbols-outlined text-4xl">hourglass_empty</span>
                   <p className="text-[9px] font-black uppercase tracking-widest">Chưa có tín hiệu quét</p>
                </div>
              )}
           </div>
        </section>
      </main>

      {isManualModalOpen && (
        <div className="fixed inset-0 z-[160] bg-black/95 backdrop-blur-md flex flex-col animate-in fade-in duration-300">
           <header className="p-6 border-b border-white/5 flex items-center justify-between">
              <button onClick={() => setIsManualModalOpen(false)} className="size-10 flex items-center justify-center rounded-full bg-white/5 text-white"><span className="material-symbols-outlined">close</span></button>
              <div className="text-center">
                 <h2 className="text-sm font-black text-white uppercase">Xác nhận thủ công</h2>
                 <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Danh sách chờ điểm danh ({manualList.length})</p>
              </div>
              <div className="size-10"></div>
           </header>
           
           <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-3">
              {manualList.map(m => (
                <div key={m.id} className="bg-surface-dark p-4 rounded-2xl flex items-center justify-between border border-white/5 group transition-all">
                   <div className="flex items-center gap-4">
                      <img src={m.avatar} className="size-10 rounded-xl object-cover grayscale-[0.3]" />
                      <div>
                         <p className="text-xs font-black text-white">{m.name}</p>
                         <p className="text-[9px] text-gray-500 font-bold uppercase">{m.code} • {m.branch}</p>
                      </div>
                   </div>
                   <button 
                     onClick={() => handleManualConfirm(m)}
                     className="px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                   >
                      Xác nhận
                   </button>
                </div>
              ))}
           </div>
        </div>
      )}

      {isScanning && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300">
           <header className="p-6 flex items-center justify-between bg-black/40 backdrop-blur-md z-10">
              <button onClick={stopScanner} className="size-12 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-md"><span className="material-symbols-outlined">close</span></button>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Quét mã Điểm danh</h3>
              <div className="size-12"></div>
           </header>
           <div className="flex-1 relative flex items-center justify-center">
              <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
              <div className="relative z-10 w-72 h-72 border-2 border-primary/50 rounded-[3.5rem] overflow-hidden">
                 <div className="absolute inset-0 border-[45px] border-black/40"></div>
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_#009454] animate-[scan_2s_linear_infinite]"></div>
              </div>
              <canvas ref={canvasRef} className="hidden" />
           </div>
        </div>
      )}

      {scanResult && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-white dark:bg-surface-dark border border-white/10 rounded-[3.5rem] p-10 max-w-sm w-full flex flex-col items-center text-center gap-6 shadow-2xl">
              <div className={`size-24 rounded-full flex items-center justify-center shadow-xl ${scanResult.success ? 'bg-primary/10 text-primary' : 'bg-red-500/10 text-red-500'}`}>
                 <span className="material-symbols-outlined text-5xl material-symbols-fill">{scanResult.success ? 'verified' : 'warning'}</span>
              </div>
              <div className="space-y-2">
                 <h2 className={`text-2xl font-black uppercase tracking-tight ${scanResult.success ? 'text-primary' : 'text-red-500'}`}>{scanResult.message}</h2>
                 {scanResult.subMessage && <p className="text-xs font-bold text-gray-500 dark:text-gray-400">{scanResult.subMessage}</p>}
              </div>
              <button onClick={() => setScanResult(null)} className={`w-full py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl transition-all ${scanResult.success ? 'bg-primary text-white' : 'bg-red-500 text-white'}`}>Xác nhận</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceScreen;
