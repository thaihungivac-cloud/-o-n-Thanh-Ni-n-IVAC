
import React, { useState, useRef, useEffect } from 'react';
import { Screen } from '../types';
import { geminiService } from '../services/geminiService';

interface ChatProps {
  onNavigate: (screen: Screen) => void;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

const Chat: React.FC<ChatProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'model', 
      text: 'Xin chào, tôi là trợ lý ảo IVAC. Tôi có thể giúp gì cho công tác Đoàn của bạn hôm nay?', 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Convert history for Gemini
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await geminiService.sendMessage(inputText, history);

    const modelMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, modelMessage]);
    setIsLoading(false);
  };

  const quickPrompts = [
    "Soạn thảo kế hoạch",
    "Thống kê đoàn phí",
    "Lịch họp tháng này",
    "Quy định mới"
  ];

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 pb-2 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
        <button onClick={() => onNavigate(Screen.HOME)} className="size-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-10">Trợ lý AI</h2>
      </header>

      {/* Messages area */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex items-end gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse ml-auto' : ''}`}
          >
            {msg.role === 'model' && (
              <div className="relative shrink-0">
                <div className="size-10 rounded-full border border-gray-200 dark:border-white/10 overflow-hidden bg-white">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6ssFcUV-cjrGwuyM9nQHsxYZi2VTuC3igavTFmFDLlgpLSl54l34PIWoQCZbxlQ8y8U3JKklVsH2flaLe2QIGfHvRwE_8mvhPPpOE05PITLr_zSxIpDc1fKErSv0dtX9Gzrq6D4a_xE9_Ob-P0aPjWuIG4a43qzJD_pa6YCKhmoG2dpDSilgHkXTH8VMmbRfQThq5W0TjHy3YkBEc5qYdSGXM4r5q57J2XB9PHlpmhPfkm1B2s5GbszTQc9bdKooUUaBkWs74rGmb" className="w-full h-full object-cover" alt="AI" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 bg-primary size-3 rounded-full border-2 border-background-light dark:border-background-dark"></div>
              </div>
            )}
            
            <div className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mb-1">
                {msg.role === 'model' ? 'IVAC AI' : 'Bạn'}
              </span>
              <div 
                className={`p-3 text-sm sm:text-base leading-relaxed shadow-sm border border-gray-100 dark:border-white/5 ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-2xl rounded-br-none' 
                    : 'bg-white dark:bg-surface-dark rounded-2xl rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-400 mt-1">{msg.timestamp}</span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-end gap-3">
             <div className="size-10 rounded-full border border-gray-200 dark:border-white/10 overflow-hidden bg-white">
               <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6ssFcUV-cjrGwuyM9nQHsxYZi2VTuC3igavTFmFDLlgpLSl54l34PIWoQCZbxlQ8y8U3JKklVsH2flaLe2QIGfHvRwE_8mvhPPpOE05PITLr_zSxIpDc1fKErSv0dtX9Gzrq6D4a_xE9_Ob-P0aPjWuIG4a43qzJD_pa6YCKhmoG2dpDSilgHkXTH8VMmbRfQThq5W0TjHy3YkBEc5qYdSGXM4r5q57J2XB9PHlpmhPfkm1B2s5GbszTQc9bdKooUUaBkWs74rGmb" className="w-full h-full object-cover" alt="AI" />
             </div>
             <div className="flex gap-1 p-3 bg-white dark:bg-surface-dark rounded-2xl rounded-bl-none shadow-sm items-center h-10 border border-gray-100 dark:border-white/5">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-300"></div>
             </div>
          </div>
        )}
      </main>

      {/* Input area */}
      <footer className="shrink-0 bg-white/90 dark:bg-background-dark/95 backdrop-blur-lg border-t border-gray-200 dark:border-white/5 pb-8 pt-2">
        <div className="flex justify-center -mt-8 mb-4">
           <button className="flex items-center gap-2 h-10 px-6 bg-primary text-white text-sm font-bold rounded-full shadow-lg hover:shadow-primary/40 active:scale-95 transition-all">
             <span className="material-symbols-outlined text-yellow-300">spark</span>
             AI phân tích theo ngữ cảnh
           </button>
        </div>

        <div className="flex gap-2 px-4 pb-4 overflow-x-auto no-scrollbar">
          {quickPrompts.map((prompt) => (
            <button 
              key={prompt}
              onClick={() => setInputText(prompt)}
              className="shrink-0 h-9 px-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-xs font-semibold hover:border-primary transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="px-4">
          <div className="flex items-end gap-2 bg-slate-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 p-2 focus-within:border-primary transition-all">
            <textarea 
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
              placeholder="Nhập yêu cầu của bạn..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 px-2 min-h-[44px] max-h-32 resize-none"
            />
            <div className="flex items-center gap-1 pb-1.5 pr-1.5">
              <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">mic</span>
              </button>
              <button 
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                className={`size-10 rounded-xl flex items-center justify-center transition-all ${
                  inputText.trim() && !isLoading ? 'bg-primary text-white shadow-md' : 'bg-slate-200 dark:bg-white/10 text-slate-400'
                }`}
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Chat;
