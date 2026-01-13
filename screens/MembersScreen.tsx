
import React, { useState, useMemo, useEffect } from 'react';
import { Member, YouthPosition, BranchName, MemberRole } from '../types';

interface MembersScreenProps {
  currentUser: Member | null;
  members: Member[];
  onAddMember: (member: Member) => void;
  onUpdateMember: (member: Member) => void;
  onDeleteMember: (id: string) => void;
  onBack: () => void;
}

const MembersScreen: React.FC<MembersScreenProps> = ({ currentUser, members, onAddMember, onUpdateMember, onDeleteMember, onBack }) => {
  const isMasterAdmin = currentUser?.position === 'Bí thư đoàn cơ sở' || currentUser?.role === 'admin';
  const isEditor = currentUser?.role === 'editor';
  
  const canAdd = isMasterAdmin;
  const canEdit = isMasterAdmin || isEditor;
  const canDelete = isMasterAdmin;
  const canSeeFullEmail = isMasterAdmin || isEditor;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('Tất cả');

  const [formData, setFormData] = useState<Partial<Member>>({
    code: '',
    name: '',
    gender: 'Nam',
    dob: '',
    joinDate: '',
    position: 'Đoàn viên',
    branch: '',
    phone: '',
    email: '',
    notes: '',
    role: 'user'
  });

  const [tempBranches, setTempBranches] = useState<string[]>([]);
  const branches: BranchName[] = ["Đoàn cơ sở", "Hậu Cần", "Sản Xuất", "Chất Lượng", "Suối Dầu"];
  const positions: YouthPosition[] = ['Bí thư đoàn cơ sở', 'Phó bí thư đoàn cơ sở', 'Bí thư chi đoàn', 'Phó bí thư chi đoàn', 'Uỷ viên', 'Đoàn viên'];

  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBranch = selectedBranchFilter === 'Tất cả' || m.branch.includes(selectedBranchFilter);
      return matchesSearch && matchesBranch;
    });
  }, [members, searchQuery, selectedBranchFilter]);

  const handleOpenModal = (member?: Member) => {
    if (member) {
      if (!canEdit) return;
      setEditingMember(member);
      setFormData(member);
      setTempBranches(member.branch.split(', ').filter(b => b !== ''));
    } else {
      if (!canAdd) return;
      setEditingMember(null);
      setFormData({
        code: '',
        name: '',
        gender: 'Nam',
        dob: '',
        joinDate: new Date().toISOString().split('T')[0],
        position: 'Đoàn viên',
        branch: '',
        phone: '',
        email: '',
        notes: '',
        role: 'user'
      });
      setTempBranches([]);
    }
    setIsModalOpen(true);
  };

  const toggleBranchSelection = (branch: string) => {
    const isUser = formData.role === 'user';
    if (isUser) {
      setTempBranches([branch]);
    } else {
      if (branch === 'Đoàn cơ sở') {
        if (tempBranches.includes('Đoàn cơ sở')) {
          setTempBranches(prev => prev.filter(b => b !== 'Đoàn cơ sở'));
        } else {
          setTempBranches(prev => [...prev, 'Đoàn cơ sở'].slice(-2));
        }
      } else {
        const otherBranches = tempBranches.filter(b => b === 'Đoàn cơ sở');
        if (tempBranches.includes(branch)) {
          setTempBranches(prev => prev.filter(b => b !== branch));
        } else {
          setTempBranches([...otherBranches, branch]);
        }
      }
    }
  };

  useEffect(() => {
    setFormData(prev => ({ ...prev, branch: tempBranches.join(', ') }));
  }, [tempBranches]);

  const handleSave = () => {
    if (!formData.code || !formData.name || !formData.email || tempBranches.length === 0 || !formData.dob) {
      alert("Đồng chí vui lòng nhập đầy đủ Mã, Họ tên, Ngày sinh, Gmail và chọn Đơn vị.");
      return;
    }

    if (editingMember) {
      onUpdateMember({ ...editingMember, ...formData } as Member);
      alert("Cập nhật thông tin đoàn viên thành công!");
    } else {
      const newMember: Member = {
        ...formData,
        id: Date.now().toString(),
        status: 'active',
        avatar: `https://picsum.photos/200/200?random=${Math.floor(Math.random() * 1000)}`
      } as Member;
      onAddMember(newMember);
      alert("Thêm mới đoàn viên thành công!");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (e: React.MouseEvent, member: Member) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài

    if (member.id === currentUser?.id) {
      alert("Đồng chí không thể tự xoá chính mình khỏi hệ thống khi đang đăng nhập.");
      return;
    }

    if (window.confirm(`Xác nhận XOÁ đoàn viên ${member.name} (${member.code})? Hành động này không thể hoàn tác.`)) {
      onDeleteMember(member.id);
      alert("Đã xoá đoàn viên thành công!");
    }
  };

  return (
    <div className="flex flex-col pb-24 min-h-screen bg-background-dark">
      <header className="sticky top-0 z-50 bg-primary px-6 py-5 shadow-xl flex items-center justify-between">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-all">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <div className="flex flex-col items-center flex-1">
           <h1 className="font-black text-white leading-none uppercase tracking-tighter">CÔNG NGHỆ SỐ IVAC</h1>
           <p className="text-[10px] text-white/80 font-bold uppercase mt-1 tracking-widest">Danh sách Đoàn viên</p>
        </div>
        {canAdd ? (
          <button onClick={() => handleOpenModal()} className="size-10 flex items-center justify-center rounded-full text-white bg-white/10 hover:bg-white/20 active:scale-90 transition-all">
            <span className="material-symbols-outlined">person_add</span>
          </button>
        ) : <div className="size-10"></div>}
      </header>

      <div className="sticky top-[68px] z-40 bg-background-dark/95 backdrop-blur-md p-6 space-y-4 shadow-lg border-b border-white/5">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary material-symbols-outlined">search</span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-dark/50 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm focus:ring-primary text-white outline-none shadow-inner"
            placeholder="Tìm theo tên hoặc mã IVAC..."
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {['Tất cả', ...branches].map((chip) => (
            <button 
              key={chip}
              onClick={() => setSelectedBranchFilter(chip)}
              className={`shrink-0 px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-wider border transition-all ${selectedBranchFilter === chip ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30' : 'bg-surface-dark border-white/5 text-gray-500'}`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-4">
        {filteredMembers.map((m) => (
          <div key={m.id} className="bg-surface-dark rounded-[2.5rem] border border-white/5 shadow-2xl p-6 flex flex-col gap-5 group transition-all hover:border-primary/20">
            <div className="flex items-start gap-5">
              <div className="relative shrink-0 mt-1">
                <div className="size-20 rounded-3xl border-4 border-primary/10 overflow-hidden bg-background-dark shadow-inner">
                  {m.avatar ? <img src={m.avatar} alt={m.name} className="size-full object-cover" /> : <div className="size-full flex items-center justify-center bg-white/5"><span className="material-symbols-outlined text-gray-700">person</span></div>}
                </div>
                <span className={`absolute -bottom-1 -right-1 size-5 rounded-full ring-4 ring-surface-dark bg-green-500 border-2 border-white/20`}></span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-black text-base text-white leading-tight break-words">{m.name}</h3>
                  <div className="flex gap-2 shrink-0">
                    {canEdit && (
                      <button onClick={() => handleOpenModal(m)} className="size-9 flex items-center justify-center text-primary bg-primary/10 rounded-xl transition-all hover:scale-110 active:scale-90 border border-primary/10">
                        <span className="material-symbols-outlined text-base">edit</span>
                      </button>
                    )}
                    {canDelete && (
                      <button onClick={(e) => handleDelete(e, m)} className="size-9 flex items-center justify-center text-red-500 bg-red-500/10 rounded-xl transition-all hover:scale-110 active:scale-90 border border-red-500/10">
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 mt-1.5 font-bold uppercase tracking-wider">Mã ĐV: {m.code} • {m.branch}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${m.role === 'admin' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/10' : 'bg-white/5 text-gray-400 border-white/5'}`}>
                    {m.role === 'admin' ? 'ADMIN' : m.role === 'editor' ? 'EDITOR' : 'USER'}
                  </span>
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{m.position}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-5">
               <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wide">
                    <span className="material-symbols-outlined text-sm text-primary">cake</span>
                    {m.dob ? new Date(m.dob).toLocaleDateString('vi-VN') : 'N/A'}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wide">
                    <span className="material-symbols-outlined text-sm text-primary">group_add</span>
                    {new Date(m.joinDate).toLocaleDateString('vi-VN')}
                  </div>
               </div>
               <div className="flex flex-col gap-2 text-right">
                  <div className="flex items-center justify-end gap-2 text-[10px] text-gray-400 font-bold tracking-wide">
                    <span className="truncate max-w-[120px]">{canSeeFullEmail ? m.email : '********'}</span>
                    <span className="material-symbols-outlined text-sm text-primary">mail</span>
                  </div>
                  <div className="flex items-center justify-end gap-2 text-[10px] text-gray-400 font-bold tracking-wide">
                    {m.phone || 'N/A'}
                    <span className="material-symbols-outlined text-sm text-primary">call</span>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="bg-surface-dark w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-white/10">
            <div className="p-8 bg-primary text-white flex justify-between items-center shrink-0">
              <h2 className="text-xl font-black uppercase tracking-tight">{editingMember ? 'Sửa thông tin' : 'Thêm mới đoàn viên'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="size-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 active:scale-90 transition-all">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-8 space-y-5 overflow-y-auto flex-1 no-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-gray-500 ml-1 tracking-widest">Mã đoàn viên *</label>
                  <input className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white focus:border-primary outline-none transition-all shadow-inner" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-gray-500 ml-1 tracking-widest">Họ và tên *</label>
                  <input className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white focus:border-primary outline-none transition-all shadow-inner" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-gray-500 ml-1 tracking-widest">Giới tính *</label>
                  <select className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white focus:border-primary outline-none transition-all shadow-inner" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value as any})}>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-gray-500 ml-1 tracking-widest">Ngày sinh *</label>
                  <input type="date" className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white focus:border-primary outline-none transition-all shadow-inner color-scheme-dark" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-gray-500 ml-1 tracking-widest">Gmail đăng nhập *</label>
                  <input className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white focus:border-primary outline-none transition-all shadow-inner" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] uppercase font-black text-gray-500 ml-1 tracking-widest">Đơn vị *</label>
                  <div className="bg-background-dark/50 p-4 rounded-2xl border border-white/10 grid grid-cols-2 gap-2">
                    {branches.map(br => {
                      const isSelected = tempBranches.includes(br);
                      return (
                        <button key={br} type="button" onClick={() => toggleBranchSelection(br)} className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-left ${isSelected ? 'bg-primary border-primary text-white shadow-lg' : 'bg-surface-dark border-white/5 text-gray-500'}`}>
                          <span className="material-symbols-outlined text-sm">{isSelected ? 'check_circle' : 'circle'}</span>
                          <span className="text-[10px] font-black uppercase truncate">{br}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-gray-500 ml-1 tracking-widest">Chức vụ</label>
                  <select className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white focus:border-primary outline-none transition-all shadow-inner" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value as YouthPosition})}>
                    {positions.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-gray-500 ml-1 tracking-widest">Vai trò hệ thống</label>
                  <select className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white focus:border-primary outline-none transition-all shadow-inner" value={formData.role} onChange={(e) => { setFormData({...formData, role: e.target.value as MemberRole}); setTempBranches([]); }}>
                    <option value="user">User (Đoàn viên)</option>
                    <option value="editor">Editor (Cán bộ Chi đoàn)</option>
                    <option value="admin">Admin (Cán bộ Đoàn cơ sở)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-8 bg-background-dark/50 border-t border-white/5 flex gap-4 shrink-0">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-gray-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all">Hủy bỏ</button>
              <button onClick={handleSave} className="flex-[2] py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/30 active:scale-95 transition-all">Lưu dữ liệu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersScreen;
