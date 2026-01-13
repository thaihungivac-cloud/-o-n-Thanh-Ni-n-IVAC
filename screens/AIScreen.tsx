
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ChatMessage } from '../types';

interface AIScreenProps {
  onBack: () => void;
  membersCount?: number;
  aiEnabled: boolean;
}

const AIScreen: React.FC<AIScreenProps> = ({ onBack, membersCount = 0, aiEnabled }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aiEnabled) {
      setMessages([
        { 
          id: '0', 
          role: 'assistant', 
          content: 'Trợ lý ảo hiện đang bị vô hiệu hóa trong cài đặt. Đồng chí vui lòng bật lại trong mục "Cá nhân" -> "Quản trị hệ thống" để bắt đầu trò chuyện.', 
          timestamp: 'Vừa xong' 
        }
      ]);
    } else {
      setMessages([
        { 
          id: '1', 
          role: 'assistant', 
          content: 'Chào đồng chí! Tôi là trợ lý ảo của hệ thống CÔNG NGHỆ SỐ IVAC. Tôi có thể hỗ trợ đồng chí tra cứu điều lệ Đoàn, các văn bản trong Thư viện số hoặc giải đáp thắc mắc về các tính năng số hóa. Đồng chí cần giúp gì?', 
          timestamp: 'Vừa xong' 
        }
      ]);
    }
  }, [aiEnabled]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping || !aiEnabled) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Corrected: Initialization using a named parameter for apiKey as per guidelines.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: input,
        config: {
          systemInstruction: `Bạn là một trợ lý ảo của hệ thống CÔNG NGHỆ SỐ IVAC (Đoàn Thanh niên IVAC). 
          Bối cảnh hiện tại của hệ thống: 
          - Tổng số đoàn viên đang quản lý: ${membersCount}.
          Hãy trả lời chuyên nghiệp, hiện đại, gọi người dùng là "Đồng chí". 
          Luôn khuyến khích đồng chí tham gia các hoạt động số hóa phong trào và tuân thủ Điều lệ Đoàn.`,
        }
      });

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        // Corrected: Access response.text directly (not as a method).
        content: response.text || 'Xin lỗi đồng chí, tôi gặp chút trục trặc khi kết nối hệ thống.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Hiện tại hệ thống AI đang bảo trì, đồng chí vui lòng thử lại sau nhé!',
        timestamp: ''
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
      <header className="shrink-0 flex items-center justify-between px-4 py-4 bg-background-light/95 dark:bg-background-dark/95 border-b border-gray-200 dark:border-white/5 sticky top-0 z-50 transition-colors">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-800 dark:text-white">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex items-center gap-2">
           <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shadow-sm">
              <span className="material-symbols-outlined text-primary text-xl">smart_toy</span>
           </div>
           <h2 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">Trợ lý Số IVAC</h2>
        </div>
        <div className="size-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end gap-3 ${msg.role === 'user' ? 'flex-row-reverse ml-auto max-w-[85%]' : 'max-w-[85%]'}`}>
            {msg.role === 'assistant' && (
              <div className="shrink-0 mb-6">
                <div className="size-9 rounded-2xl bg-white dark:bg-surface-dark flex items-center justify-center border border-gray-100 dark:border-white/5 shadow-md transition-colors">
                  <span className="material-symbols-outlined text-primary text-xl">robot_2</span>
                </div>
              </div>
            )}
            <div className={`flex flex-col gap-1.5 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-sm transition-colors ${
                msg.role === 'user' 
                  ? 'bg-primary text-white rounded-br-none font-medium' 
                  : 'bg-white dark:bg-surface-dark text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-white/5 rounded-bl-none'
              }`}>
                {msg.content}
              </div>
              <span className="text-[9px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">{msg.timestamp}</span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-end gap-3 max-w-[85%]">
            <div className="size-9 rounded-2xl bg-white dark:bg-surface-dark flex items-center justify-center border border-gray-100 dark:border-white/5 shadow-sm shrink-0 mb-2 transition-colors">
               <span className="material-symbols-outlined text-primary text-xl animate-pulse">robot_2</span>
            </div>
            <div className="p-3 bg-white dark:bg-surface-dark rounded-2xl rounded-bl-none border border-gray-100 dark:border-white/5 flex gap-1.5 items-center transition-colors">
              <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </main>

      <footer className="shrink-0 p-4 border-t border-gray-200 dark:border-white/5 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md pb-safe transition-colors">
        <div className={`flex items-end gap-2 bg-gray-50 dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-white/5 p-2 focus-within:border-primary transition-all shadow-inner ${!aiEnabled ? 'opacity-50 grayscale' : ''}`}>
          <textarea 
            value={input}
            disabled={!aiEnabled}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            className="flex-1 bg-transparent border-none text-gray-900 dark:text-white text-sm focus:ring-0 resize-none py-2.5 px-3 max-h-32"
            placeholder={aiEnabled ? "Đồng chí cần trợ giúp gì?" : "Trợ lý ảo đã bị tắt..."}
            rows={1}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping || !aiEnabled}
            className={`size-11 rounded-xl flex items-center justify-center text-white shadow-lg transition-all ${!input.trim() || isTyping || !aiEnabled ? 'bg-gray-200 dark:bg-white/5 text-gray-400 dark:text-gray-500' : 'bg-primary hover:bg-primary-hover active:scale-95'}`}
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
        <p className="text-center text-[8px] text-gray-500 mt-3 font-bold uppercase tracking-widest">Hệ thống Trợ lý Số CÔNG NGHỆ SỐ IVAC</p>
      </footer>
    </div>
  );
};

export default AIScreen;
