
import React, { useState } from 'react';
import { Member } from '../types';

interface LoginScreenProps {
  onLogin: (user: Member) => void;
  members: Member[];
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, members }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const foundUser = members.find(m => m.email.toLowerCase() === email.toLowerCase());
      
      if (foundUser) {
        if (password.length >= 6) {
          onLogin(foundUser);
          alert("Đăng nhập thành công! Chào mừng đồng chí trở lại.");
        } else {
          setError('Mật khẩu phải có ít nhất 6 ký tự.');
          setLoading(false);
        }
      } else {
        setError('Địa chỉ Gmail này chưa được đăng ký trong hệ thống.');
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="relative flex flex-col h-screen w-full bg-background-dark font-display overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-[20%] -right-[10%] w-[80%] h-[50%] rounded-full bg-primary/40 blur-[80px]"></div>
        <div className="absolute top-[30%] -left-[10%] w-[60%] h-[40%] rounded-full bg-blue-500/20 blur-[60px]"></div>
      </div>

      <div className="relative z-10 flex flex-col flex-grow px-8 pt-20">
        <div className="flex flex-col items-center mb-12">
          {/* Logo stylized fallback to avoid "image not found" */}
          <div className="w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center p-2 mb-6 border-4 border-primary/20 transform hover:scale-105 transition-transform">
             <div className="flex flex-col items-center justify-center border-4 border-primary rounded-full w-full h-full">
                <span className="text-primary font-black text-2xl leading-none">IVAC</span>
             </div>
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight text-center">CÔNG NGHỆ SỐ IVAC</h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Đoàn Thanh Niên</p>
        </div>

        <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-xl font-bold text-white">Đăng nhập</h2>
            <p className="text-gray-400 text-sm mt-1">Sử dụng tài khoản Google của bạn</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Gmail cá nhân</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500 text-xl">mail</span>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background-dark/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:border-primary outline-none transition-all"
                  placeholder="vidu@gmail.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Mật khẩu</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500 text-xl">lock</span>
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background-dark/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:border-primary outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-3">
                <span className="material-symbols-outlined text-red-500 text-sm">warning</span>
                <p className="text-[11px] text-red-400 font-bold">{error}</p>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 scale-95' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
            >
              {loading ? (
                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Tiếp theo <span className="material-symbols-outlined">arrow_forward</span></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-4">
            <button className="text-xs font-bold text-gray-500 hover:text-primary transition-colors">Quên mật khẩu?</button>
            <div className="flex items-center justify-center gap-2">
              <p className="text-xs text-gray-500 font-medium">Bạn chưa có tài khoản?</p>
              <button className="text-xs font-bold text-primary">Đăng ký ngay</button>
            </div>
          </div>
        </div>

        <div className="mt-auto pb-8 flex flex-col items-center gap-2">
          <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Hệ thống số hóa IVAC</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
