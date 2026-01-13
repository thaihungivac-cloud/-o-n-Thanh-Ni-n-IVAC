
import React from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="relative flex flex-col flex-grow w-full px-6 py-12 h-screen overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute -top-[20%] -right-[10%] w-[80%] h-[50%] rounded-full bg-primary/20 blur-[80px]"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-12">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-white rounded-xl shadow-lg flex items-center justify-center p-2">
             <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQCFpRdGGuq8cThO99Q-hW9GQdDlmKv0hCG118GbrY2Wctxvvp7moxk18B18LOAXt-bOye07cgSGBFL4iSRtChLFgEmpndOn7OpCjDNqXWk0Df29brZ2bxb45n-HpxWSBP8Uqo-gA89Uu6UG9EmGZ8E5HB6gZhTnOFkSkgRcZ7W-x2DSkIj4KStg3XRoAHE6dzGqKOTTdxd4CeNcWdxVYadeGSeW3TiYRRmT8FoTcCkP33J9U0o8dI-h6j9HW6EbMBQiuEpugV0BA-" className="w-full h-full object-contain" alt="IVAC Logo" />
          </div>
          <div className="h-10 w-[1px] bg-slate-200 dark:bg-white/20"></div>
          <div className="w-20 h-20 bg-white rounded-xl shadow-lg flex items-center justify-center p-2">
             <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuD22gQijursqWQm_QPaYi-nun0gDTgAB2UXARscrkL0H24B60K4W3yu1kQ2EEOQZloA0RKGmGueBGR1XHtXCxdF0uL5Js8GsyPOXL0crRhD0dehdN-bhsFgK45E7d3L6S2YAuCuRCc9TY4aEQDSPYzsraExATX_pQBOYd_2Gz8n4a4gHqPKV5yicuoeC2Ue7IUW71X45QU1gMHLlkKVbM4aVi9Sqw3Jz5c-45dnvEsRmJX0RlUhjRSy5FHnAwpDaQ-5eD4ck2t6BasU" className="w-full h-full object-contain" alt="Youth Union Logo" />
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Đoàn TN IVAC</h1>
          <p className="text-slate-500 dark:text-slate-400">Hệ thống quản lý đoàn viên<br/>hiệu quả, chuyên nghiệp.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-auto">
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
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-6 py-4 text-slate-700 shadow-md hover:bg-slate-50 active:scale-[0.98] transition-all"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="font-semibold tracking-wide">Đăng nhập bằng Google</span>
        </button>

        <button className="text-sm font-medium text-slate-400 hover:text-primary transition-colors">Cần trợ giúp?</button>
        
        <div className="flex flex-col items-center gap-2 mt-8 opacity-50">
          <p className="text-[10px] uppercase tracking-widest font-semibold">IVAC Youth Union App</p>
          <p className="text-xs">Phiên bản 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
