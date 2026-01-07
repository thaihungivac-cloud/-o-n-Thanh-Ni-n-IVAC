
import React from 'react';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="relative flex flex-col h-screen w-full bg-background-dark font-display overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-[20%] -right-[10%] w-[80%] h-[50%] rounded-full bg-primary/40 blur-[80px]"></div>
        <div className="absolute top-[30%] -left-[10%] w-[60%] h-[40%] rounded-full bg-blue-500/20 blur-[60px]"></div>
      </div>

      <div className="relative z-10 flex flex-col flex-grow px-6 pb-8 pt-24">
        <div className="flex flex-col items-center justify-center flex-grow-[2] gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white rounded-xl shadow-lg flex items-center justify-center p-2">
              <span className="text-primary font-black text-2xl italic">IVAC</span>
            </div>
            <div className="h-10 w-[1px] bg-white/20"></div>
            <div className="w-20 h-20 bg-white rounded-xl shadow-lg flex items-center justify-center p-2 overflow-hidden">
               <img src="https://upload.wikimedia.org/wikipedia/vi/1/1a/Huy_hi%E1%BB%87u_%C4%90o%C3%A0n_TNCS_H%E1%BB%93_Ch%C3%AD_Minh.svg" className="w-full" alt="Youth Union" />
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">Đoàn TN IVAC</h1>
            <p className="text-gray-400 text-base max-w-[280px] mx-auto leading-relaxed">
              Hệ thống quản lý đoàn viên<br/>hiệu quả, chuyên nghiệp.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center w-full gap-4 mb-12">
          <div className="text-center mb-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Sẵn sàng đăng nhập
            </span>
          </div>
          
          <button 
            onClick={onLogin}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-6 py-4 text-slate-700 shadow-md hover:bg-slate-50 transition-all active:scale-[0.98]"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            <span className="text-base font-semibold">Đăng nhập bằng Google</span>
          </button>
          
          <button className="text-sm font-medium text-gray-500 hover:text-white transition-colors">
            Cần trợ giúp?
          </button>
        </div>

        <div className="mt-auto flex flex-col items-center gap-2 pb-6">
          <div className="h-px w-12 bg-white/10 mb-2"></div>
          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">IVAC YOUTH UNION APP</p>
          <p className="text-xs text-gray-600">Phiên bản 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
