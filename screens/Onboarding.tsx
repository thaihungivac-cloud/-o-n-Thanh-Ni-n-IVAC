
import React from 'react';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  return (
    <div className="relative flex h-screen w-full flex-col justify-between p-6">
      <div className="flex justify-end pt-8">
        <button onClick={onComplete} className="text-sm font-semibold text-primary">Bỏ qua</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="relative w-full aspect-square mb-10 rounded-3xl overflow-hidden shadow-2xl">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDH88Nt0hrHN6Tnf0uHpafOSOglEXH_HMRk-wDlbyFd1pq9WOoKt6rx9FmYquUPWXqwN80-JNyQ0mdCgyxVAWV3uFdk-fgahDRT2I_KGCKcl13gBDwTUk83l-hKCFFL8sTay9cWaCLWYEJ2W_3YjJJF233UIl2sy8UcqhQUNzIKywniq7Z-E5WQA7Er-GB1FLKZ4jTJaePF6Eom7oHgqDvMq6PRMcGrV6wBQhpk077FGxAxMWWm_NMxOhWD6x3u-RFdXXKdUeu-y0m_" 
            alt="Collaborative work"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl">
            <span className="material-symbols-outlined text-white text-3xl">groups</span>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">
          Đoàn TN IVAC <br/>
          <span className="text-primary">Kết nối & Quản lý</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Nền tảng di động giúp quản lý công tác Đoàn hiệu quả, nhanh chóng và minh bạch.
        </p>
      </div>

      <div className="flex flex-col items-center pb-8 gap-8">
        <div className="flex gap-2">
          <div className="h-2 w-8 rounded-full bg-primary"></div>
          <div className="h-2 w-2 rounded-full bg-slate-200 dark:bg-white/10"></div>
          <div className="h-2 w-2 rounded-full bg-slate-200 dark:bg-white/10"></div>
        </div>
        <button 
          onClick={onComplete}
          className="w-full h-14 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/30"
        >
          Bắt đầu <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
