
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Member, ActivityPlan, NewsItem, Document } from '../types';
import { geminiService } from '../services/geminiService';

interface AIScreenProps {
  onBack: () => void;
  aiEnabled: boolean;
  members: Member[];
  activities: ActivityPlan[];
  news: NewsItem[];
  docs: Document[];
}

const AIScreen: React.FC<AIScreenProps> = ({ onBack, aiEnabled, members, activities, news, docs }) => {
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
          content: 'Trợ lý ảo hiện đang bị vô hiệu hóa trong cài đặt. Đồng chí vui lòng bật lại trong mục "Cá nhân" -> "Quản trị hệ thống".', 
          timestamp: 'Vừa xong' 
        }
      ]);
    } else if (messages.length === 0) {
      setMessages([
        { 
          id: '1', 
          role: 'assistant', 
          content: 'Chào đồng chí! Tôi là trợ lý ảo IVAC. Tôi có thể hỗ trợ đồng chí tra cứu dữ liệu đoàn viên, các hoạt động đang diễn ra hoặc soạn thảo văn bản. Đồng chí cần giúp gì?', 
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

  const prepareDataContext = () => {
    let context = `--- TÓM TẮT HỆ THỐNG ---
    Tổng số đoàn viên: ${members.length}
    Tổng số hoạt động: ${activities.length}
    --- DANH SÁCH ĐOÀN VIÊN (ĐÃ ẨN THÔNG TIN NHẠY CẢM) ---\n`;
    
    members.forEach(m => {
      // Bảo mật: Không gửi Phone, Email, DOB đầy đủ cho AI
      const birthYear = m.dob ? m.dob.split('-')[0] : 'N/A';
      context += `- Tên: ${m.name}, Mã: ${m.code}, Năm sinh: ${birthYear}, Chi đoàn: ${m.branch}, Chức vụ: ${m.position}, Trạng thái: ${m.status}\n`;
    });

    context += "\n--- DANH SÁCH HOẠT ĐỘNG ---\n";
    activities.forEach(a => {
      context += `- Hoạt động: ${a.name}, Ngày: ${a.date}, Điểm RL: ${a.points}, Đăng ký: ${a.participants.length}, Có mặt: ${a.attendees.length}\n`;
    });

    context += "\n--- TIN TỨC MỚI NHẤT ---\n";
    news.slice(0, 5).forEach(n => {
      context += `- Tiêu đề: ${n.title}, Ngày đăng: ${n.date}, Lượt xem: ${n.views}\n`;
    });

    return context;
  };

  const handleSend = async () => {
    const currentInput = input.trim();
    if (!currentInput || isTyping || !aiEnabled) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Tạo lịch sử mới bao gồm cả tin nhắn vừa nhập để AI có ngữ cảnh tức thì
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setIsTyping(true);

    const history = nextMessages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const dataContext = prepareDataContext();
    const responseText = await geminiService.sendMessage(currentInput, history, dataContext);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
      <header className="shrink-0 flex items-center justify-between px-4 py-4 bg-background-light/95 dark:bg-background-dark/95 border-b border-gray-200 dark:border-white/5 sticky top-0 z-50">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-800 dark:text-white">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex items-center gap-2">
           <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <span className="material-symbols-outlined text-primary text-xl">smart_toy</span>
           </div>
           <h2 className="text-base font-bold text-gray-900 dark:text-white">Trợ lý Số IVAC</h2>
        </div>
        <div className="size-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end gap-3 ${msg.role === 'user' ? 'flex-row-reverse ml-auto max-w-[85%]' : 'max-w-[85%]'}`}>
            {msg.role === 'assistant' && (
              <div className="shrink-0 mb-6">
                <div className="size-9 rounded-2xl bg-white dark:bg-surface-dark flex items-center justify-center border border-gray-100 dark:border-white/5 shadow-md">
                  <span className="material-symbols-outlined text-primary text-xl">robot_2</span>
                </div>
              </div>
            )}
            <div className={`flex flex-col gap-1.5 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-primary text-white rounded-br-none font-medium' 
                  : 'bg-white dark:bg-surface-dark text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-white/5 rounded-bl-none'
              }`}>
                {msg.content}
              </div>
              <span className="text-[9px] font-bold text-gray-400 dark:text-gray-600 uppercase">{msg.timestamp}</span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-end gap-3 max-w-[85%]">
            <div className="size-9 rounded-2xl bg-white dark:bg-surface-dark flex items-center justify-center border border-gray-100 dark:border-white/5 shadow-sm shrink-0 mb-2">
               <span className="material-symbols-outlined text-primary text-xl animate-pulse">robot_2</span>
            </div>
            <div className="p-3 bg-white dark:bg-surface-dark rounded-2xl rounded-bl-none border border-gray-100 dark:border-white/5 flex gap-1.5 items-center">
              <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </main>

      <footer className="shrink-0 p-4 border-t border-gray-200 dark:border-white/5 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md pb-safe">
        <div className={`flex items-end gap-2 bg-gray-50 dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-white/5 p-2 focus-within:border-primary transition-all ${!aiEnabled ? 'opacity-50' : ''}`}>
          <textarea 
            value={input}
            disabled={!aiEnabled}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            className="flex-1 bg-transparent border-none text-gray-900 dark:text-white text-sm focus:ring-0 resize-none py-2.5 px-3 max-h-32"
            placeholder={aiEnabled ? "Đồng chí cần trợ giúp gì?" : "Trợ lý ảo đang tắt..."}
            rows={1}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping || !aiEnabled}
            className={`size-11 rounded-xl flex items-center justify-center text-white shadow-lg transition-all ${!input.trim() || isTyping || !aiEnabled ? 'bg-gray-200 text-gray-400' : 'bg-primary hover:bg-primary-hover active:scale-95'}`}
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default AIScreen;
