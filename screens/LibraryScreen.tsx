
import React, { useState, useMemo, useRef } from 'react';
import { Document, Member } from '../types';

interface LibraryScreenProps {
  currentUser: Member | null;
  docs: Document[];
  setDocs: React.Dispatch<React.SetStateAction<Document[]>>;
  onBack: () => void;
}

const LibraryScreen: React.FC<LibraryScreenProps> = ({ currentUser, docs, setDocs, onBack }) => {
  const isAdmin = currentUser?.position === 'Bí thư đoàn cơ sở';
  const categories = ["Công văn", "Văn bản", "Tài liệu"];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [viewingUrl, setViewingUrl] = useState<string | null>(null);
  const [editingDoc, setEditingDoc] = useState<Partial<Document>>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const getExpiryStatus = (expiryDateStr: string) => {
    const today = new Date();
    const expiryDate = new Date(expiryDateStr);
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(today.getMonth() + 6);

    if (expiryDate < today) {
      return { status: 'expired', label: 'Hết hạn', color: 'text-red-500', bg: 'bg-red-500/10', icon: 'error' };
    } else if (expiryDate <= sixMonthsFromNow) {
      return { status: 'warning', label: 'Sắp hết hạn', color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: 'warning' };
    }
    return { status: 'valid', label: 'Còn hạn', color: 'text-primary', bg: 'bg-primary/10', icon: 'check_circle' };
  };

  const stats = useMemo(() => {
    const initialStats = { valid: 0, warning: 0, expired: 0 };
    return docs.reduce((acc, doc) => {
      const status = getExpiryStatus(doc.expiryDate).status;
      if (status === 'valid') acc.valid++;
      else if (status === 'warning') acc.warning++;
      else if (status === 'expired') acc.expired++;
      return acc;
    }, initialStats);
  }, [docs]);

  const handleOpenForm = (doc?: Document) => {
    if (!isAdmin) return;
    if (doc) {
      setEditingDoc(doc);
    } else {
      setEditingDoc({
        type: 'Công văn',
        name: '',
        code: '',
        date: new Date().toISOString().split('T')[0],
        expiryDate: '',
        url: '',
        dept: 'Văn phòng Đoàn'
      });
    }
    setIsFormOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingDoc(prev => ({ ...prev, url: reader.result as string }));
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!editingDoc.name || !editingDoc.code || !editingDoc.expiryDate || !editingDoc.url) {
      alert("Đồng chí vui lòng điền đầy đủ thông tin và tải lên tệp đính kèm.");
      return;
    }

    if (editingDoc.id) {
      setDocs(docs.map(d => d.id === editingDoc.id ? (editingDoc as Document) : d));
      alert("Cập nhật văn bản thành công!");
    } else {
      const newDoc: Document = {
        ...editingDoc as Document,
        id: Date.now().toString(),
      };
      setDocs([newDoc, ...docs]);
      alert("Tải lên văn bản thành công!");
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!isAdmin) return;
    if (window.confirm("Xác nhận XOÁ vĩnh viễn văn bản này khỏi hệ thống?")) {
      setDocs(docs.filter(d => d.id !== id));
      setSelectedDoc(null);
      alert("Đã xoá văn bản thành công!");
    }
  };

  const isPDF = (url: string) => url.toLowerCase().includes('pdf') || url.startsWith('data:application/pdf');

  return (
    <div className="flex flex-col pb-24 min-h-screen bg-background-dark">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-background-dark/95 backdrop-blur-md px-4 py-4 border-b border-white/5">
        <button onClick={onBack} className="flex size-10 items-center justify-center rounded-full hover:bg-white/10 text-white">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-black uppercase tracking-tighter text-white">Thư viện số IVAC</h2>
        {isAdmin ? (
          <button onClick={() => handleOpenForm()} className="size-10 flex items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined">add</span>
          </button>
        ) : <div className="size-10"></div>}
      </header>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Còn hạn', val: stats.valid, color: 'text-primary' },
            { label: 'Sắp hạn', val: stats.warning, color: 'text-yellow-500' },
            { label: 'Hết hạn', val: stats.expired, color: 'text-red-500' }
          ].map((s, i) => (
            <div key={i} className="bg-surface-dark p-3 rounded-2xl border border-white/5 text-center">
              <p className={`text-xl font-black ${s.color}`}>{s.val}</p>
              <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {["Tất cả", ...categories].map((cat) => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-6 py-2 rounded-xl text-xs font-bold transition-all ${selectedCategory === cat ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-surface-dark text-gray-400 border border-white/5'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {docs
            .filter(doc => selectedCategory === "Tất cả" || doc.type === selectedCategory)
            .map((doc) => {
              const expiry = getExpiryStatus(doc.expiryDate);
              return (
                <div key={doc.id} onClick={() => setSelectedDoc(doc)} className="bg-surface-dark p-4 rounded-3xl border border-white/5 flex items-center gap-4 hover:border-primary/30 transition-all group cursor-pointer shadow-xl">
                  <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${expiry.status === 'expired' ? 'bg-red-500/10 text-red-500' : expiry.status === 'warning' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-400'}`}>
                    <span className="material-symbols-outlined text-2xl">
                      {isPDF(doc.url) ? 'picture_as_pdf' : 'image'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">{doc.name}</h4>
                    <p className="text-[10px] text-gray-500 font-bold mt-1">Số: {doc.code} • {doc.type}</p>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span className={`material-symbols-outlined text-lg ${expiry.color}`}>{expiry.icon}</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {selectedDoc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-surface-dark w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-white/10">
            <div className="p-8 bg-primary text-white flex justify-between items-center shrink-0">
              <h2 className="text-xl font-black truncate max-w-[200px]">Chi tiết văn bản</h2>
              <div className="flex gap-2">
                {isAdmin && (
                  <button onClick={() => { handleOpenForm(selectedDoc); setSelectedDoc(null); }} className="size-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30"><span className="material-symbols-outlined">edit</span></button>
                )}
                <button onClick={() => setSelectedDoc(null)} className="size-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all active:scale-90"><span className="material-symbols-outlined">close</span></button>
              </div>
            </div>

            <div className="p-8 space-y-6 overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-1 gap-5">
                {[
                  { label: '1. Loại tài liệu', val: selectedDoc.type },
                  { label: '2. Tên văn bản', val: selectedDoc.name },
                  { label: '3. Số hiệu / Ký hiệu', val: selectedDoc.code },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{item.label}</p>
                    <div className="bg-background-dark/50 p-4 rounded-2xl border border-white/5"><span className="text-sm font-bold text-white">{item.val}</span></div>
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">4a. Ngày hiệu lực</p>
                    <div className="bg-background-dark/50 p-4 rounded-2xl border border-white/5 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-primary">event_available</span>
                      <span className="text-sm font-bold text-white">{new Date(selectedDoc.date).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">4b. Ngày hết hạn</p>
                    <div className="bg-background-dark/50 p-4 rounded-2xl border border-white/5 flex items-center gap-2">
                      <span className={`material-symbols-outlined text-sm ${getExpiryStatus(selectedDoc.expiryDate).color}`}>event_busy</span>
                      <span className={`text-sm font-bold ${getExpiryStatus(selectedDoc.expiryDate).color}`}>{new Date(selectedDoc.expiryDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">5. Tệp đính kèm</p>
                  <button 
                    onClick={() => setViewingUrl(selectedDoc.url)}
                    className="w-full bg-primary/10 p-4 rounded-2xl border border-primary/20 flex items-center justify-between group hover:bg-primary transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary group-hover:text-white">{isPDF(selectedDoc.url) ? 'picture_as_pdf' : 'image'}</span>
                      <p className="text-xs text-primary font-black uppercase tracking-widest group-hover:text-white">Xem trực tiếp tài liệu</p>
                    </div>
                    <span className="material-symbols-outlined text-primary group-hover:text-white">visibility</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-8 bg-background-dark/50 border-t border-white/5 flex gap-4 shrink-0">
              {isAdmin && (
                <button onClick={() => handleDelete(selectedDoc.id)} className="px-6 py-4 bg-red-500/10 text-red-500 rounded-2xl text-xs font-black uppercase border border-red-500/20">Xoá</button>
              )}
              <a 
                href={selectedDoc.url} 
                download={selectedDoc.name}
                className="flex-1 py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase shadow-xl shadow-primary/30 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">download</span> Tải tệp tin
              </a>
            </div>
          </div>
        </div>
      )}

      {viewingUrl && (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col animate-in fade-in duration-300">
          <header className="p-4 flex items-center justify-between bg-background-dark border-b border-white/5">
             <button onClick={() => setViewingUrl(null)} className="size-10 flex items-center justify-center rounded-full bg-white/5 text-white"><span className="material-symbols-outlined">arrow_back</span></button>
             <h3 className="text-sm font-bold truncate px-4">Đang xem tài liệu</h3>
             <a href={viewingUrl} download className="size-10 flex items-center justify-center rounded-full bg-primary text-white"><span className="material-symbols-outlined">download</span></a>
          </header>
          <div className="flex-1 overflow-auto bg-gray-900 flex items-center justify-center">
             {isPDF(viewingUrl) ? (
               <iframe src={viewingUrl} className="w-full h-full border-none" title="PDF Viewer"></iframe>
             ) : (
               <img src={viewingUrl} className="max-w-full max-h-full object-contain" alt="Document Viewer" />
             )}
          </div>
        </div>
      )}

      {isAdmin && isFormOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="bg-surface-dark w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-8 bg-primary text-white flex justify-between items-center shrink-0">
              <h2 className="text-xl font-black uppercase tracking-tight">{editingDoc.id ? 'Sửa văn bản' : 'Thêm văn bản mới'}</h2>
              <button onClick={() => setIsFormOpen(false)} className="size-10 bg-white/20 rounded-full flex items-center justify-center"><span className="material-symbols-outlined">close</span></button>
            </div>
            
            <div className="p-8 space-y-5 overflow-y-auto flex-1 no-scrollbar">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-black text-gray-500 ml-1 tracking-widest">Loại tài liệu</label>
                <select className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-3 text-sm text-white focus:border-primary outline-none transition-all" value={editingDoc.type} onChange={(e) => setEditingDoc({...editingDoc, type: e.target.value})}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-black text-gray-500 ml-1 tracking-widest">Tên văn bản *</label>
                <input className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-3 text-sm text-white focus:border-primary outline-none" value={editingDoc.name} onChange={(e) => setEditingDoc({...editingDoc, name: e.target.value})} placeholder="VD: Công văn số 01..." />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-black text-gray-500 ml-1 tracking-widest">Số hiệu / Ký hiệu *</label>
                <input className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-3 text-sm text-white focus:border-primary outline-none" value={editingDoc.code} onChange={(e) => setEditingDoc({...editingDoc, code: e.target.value})} placeholder="Số hiệu..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-gray-500 ml-1 tracking-widest">Ngày hiệu lực</label>
                  <input type="date" className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-3 text-sm text-white focus:border-primary color-scheme-dark outline-none" value={editingDoc.date} onChange={(e) => setEditingDoc({...editingDoc, date: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-gray-500 ml-1 tracking-widest">Ngày hết hạn *</label>
                  <input type="date" className="w-full bg-background-dark border border-white/10 rounded-2xl px-5 py-3 text-sm text-white focus:border-primary color-scheme-dark outline-none" value={editingDoc.expiryDate} onChange={(e) => setEditingDoc({...editingDoc, expiryDate: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-black text-gray-500 ml-1 tracking-widest">Đính kèm tệp tin *</label>
                <div className="flex flex-col gap-3">
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*,application/pdf" onChange={handleFileChange} />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full p-6 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center gap-2 transition-all ${editingDoc.url ? 'border-primary/50 bg-primary/5' : 'border-white/10 bg-background-dark hover:border-primary/30'}`}
                  >
                    {isUploading ? (
                      <div className="size-6 border-2 border-primary border-t-transparent animate-spin rounded-full"></div>
                    ) : (
                      <>
                        <span className={`material-symbols-outlined text-3xl ${editingDoc.url ? 'text-primary' : 'text-gray-600'}`}>
                          {editingDoc.url ? 'task' : 'upload_file'}
                        </span>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                          {editingDoc.url ? 'Đã chọn tệp (Nhấn để thay đổi)' : 'Chọn PDF hoặc Hình ảnh'}
                        </p>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-8 bg-background-dark/50 border-t border-white/5 flex gap-4 shrink-0">
              <button onClick={() => setIsFormOpen(false)} className="flex-1 py-4 text-gray-500 font-black text-xs uppercase tracking-widest">Hủy bỏ</button>
              <button onClick={handleSave} disabled={isUploading} className="flex-[2] py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase shadow-xl shadow-primary/30 disabled:opacity-50">Lưu văn bản</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryScreen;
