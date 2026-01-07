
import React from 'react';

interface NewsScreenProps {
  onBack: () => void;
}

const NewsScreen: React.FC<NewsScreenProps> = ({ onBack }) => {
  const newsList = [
    { title: 'Kế hoạch Mùa hè xanh 2024 - Khởi động chiến dịch', category: 'Phong trào', date: '10/03', desc: 'Chi tiết kế hoạch chiến dịch tình nguyện Mùa hè xanh tại địa bàn trọng điểm.', img: '5' },
    { title: 'Họp ban chấp hành Đoàn trường mở rộng quý I/2024', category: 'Thông báo', date: '08/03', desc: 'Triệu tập các đồng chí Bí thư chi đoàn tham dự cuộc họp quan trọng.', img: '6' },
    { title: 'Hướng dẫn thu nộp đoàn phí năm 2024', category: 'Đoàn vụ', date: '05/03', desc: 'Cập nhật mức đóng đoàn phí mới và quy trình nộp trực tuyến.', img: '7' },
  ];

  return (
    <div className="flex flex-col pb-24">
      <header className="sticky top-0 z-40 bg-background-dark/95 backdrop-blur-md border-b border-white/5 px-4 py-4 flex items-center justify-between">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full hover:bg-white/10">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold">Tin tức / Báo tường</h1>
        <button className="size-10 flex items-center justify-center rounded-full hover:bg-white/10">
          <span className="material-symbols-outlined">calendar_month</span>
        </button>
      </header>

      <div className="p-4 space-y-4">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary material-symbols-outlined">search</span>
          <input 
            type="text" 
            className="w-full bg-surface-dark border-none rounded-xl pl-10 py-3 text-sm focus:ring-primary"
            placeholder="Tìm kiếm tin tức..."
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {['Tất cả', 'Hoạt động', 'Thông báo', 'Đoàn vụ', 'Phong trào'].map((chip, idx) => (
            <button 
              key={idx}
              className={`shrink-0 px-5 py-2 rounded-full text-xs font-medium transition-colors ${idx === 0 ? 'bg-primary text-white' : 'bg-surface-dark border border-white/5 text-gray-400'}`}
            >
              {chip}
            </button>
          ))}
        </div>

        <section className="mt-6">
          <h2 className="text-base font-bold mb-3">Nổi bật</h2>
          <div className="bg-surface-dark rounded-2xl overflow-hidden shadow-lg border border-white/5">
            <div className="relative h-48">
              <img src="https://picsum.photos/800/400?random=10" className="w-full h-full object-cover" alt="Featured" />
              <div className="absolute top-3 right-3">
                <button className="size-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white"><span className="material-symbols-outlined text-[18px]">more_horiz</span></button>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className="px-2 py-1 bg-primary text-[10px] font-bold rounded">Hoạt động</span>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-[10px] text-gray-500">
                <span className="material-symbols-outlined text-sm text-primary">calendar_today</span>
                12/03/2024
              </div>
              <h3 className="font-bold text-lg leading-tight line-clamp-2">Hoạt động Chào mừng ngày thành lập Đoàn 26/3</h3>
              <p className="text-sm text-gray-400 line-clamp-2">Đoàn thanh niên tổ chức chuỗi hoạt động chào mừng, bao gồm hội trại và các trò chơi vận động...</p>
            </div>
          </div>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="text-base font-bold">Mới nhất</h2>
          <div className="flex flex-col gap-4">
            {newsList.map((news, idx) => (
              <div key={idx} className="flex gap-4 p-3 bg-surface-dark rounded-2xl border border-white/5">
                <div className="size-20 shrink-0 rounded-xl overflow-hidden bg-background-dark">
                  <img src={`https://picsum.photos/200/200?random=${news.img}`} className="w-full h-full object-cover" alt="Thumb" />
                </div>
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase">
                    {news.category} • {news.date}
                  </div>
                  <h4 className="text-sm font-bold line-clamp-2 mt-1">{news.title}</h4>
                  <p className="text-[10px] text-gray-500 line-clamp-1 mt-1">{news.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default NewsScreen;
