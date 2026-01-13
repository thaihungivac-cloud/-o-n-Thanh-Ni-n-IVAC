
import React from 'react';

interface OnboardingScreenProps {
  onNext: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onNext }) => {
  return (
    <div className="relative flex h-screen w-full flex-col justify-between bg-background-dark font-display overflow-hidden">
      <div className="flex w-full items-center justify-end px-6 pt-12">
        <button onClick={onNext} className="text-sm font-semibold text-primary/80">Bỏ qua</button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="relative w-full max-w-sm aspect-square mb-8 rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-background-dark to-primary/20 mix-blend-overlay z-10"></div>
          <img 
            src="https://picsum.photos/800/800?random=1" 
            alt="Collaboration" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-6 left-6 z-20 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl">
            <span className="material-symbols-outlined text-white text-3xl">terminal</span>
          </div>
        </div>
        
        <div className="text-center max-w-xs space-y-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
            CÔNG NGHỆ SỐ <br/>
            <span className="text-primary text-4xl">IVAC</span>
          </h1>
          <p className="text-base text-gray-400 leading-relaxed">
            Nâng tầm công tác Đoàn bằng ứng dụng số hóa hiện đại, chuyên nghiệp và hiệu quả.
          </p>
        </div>
      </div>

      <div className="w-full flex flex-col items-center pb-12 px-6">
        <div className="flex gap-2 mb-8">
          <div className="h-2 w-8 rounded-full bg-primary"></div>
          <div className="h-2 w-2 rounded-full bg-white/20"></div>
          <div className="h-2 w-2 rounded-full bg-white/20"></div>
        </div>
        
        <button 
          onClick={onNext}
          className="w-full h-14 flex items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-hover active:scale-95 transition-all font-bold text-lg gap-2"
        >
          Trải nghiệm ngay
          <span className="material-symbols-outlined">rocket_launch</span>
        </button>
      </div>
    </div>
  );
};

export default OnboardingScreen;
