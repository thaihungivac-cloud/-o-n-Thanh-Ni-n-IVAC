
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ChatMessage } from '../types';

interface AIScreenProps {
  onBack: () => void;
}

const AIScreen: React.FC<AIScreenProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'assistant', content: 'Xin chào, tôi là trợ lý ảo IVAC. Tôi có thể giúp gì cho công tác Đoàn của bạn hôm nay?', timestamp: '10:40 AM' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

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
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: input,
        config: {
          systemInstruction: 'Bạn là một trợ lý ảo chuyên về công tác Đoàn của IVAC (Công ty Vacxin và Sinh phẩm Y tế). Hãy trả lời chuyên nghiệp, thân thiện, và tập trung vào hỗ trợ các hoạt động Đoàn như báo cáo, kế hoạch, thống kê.',
        }
      });

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text || 'Xin lỗi, tôi gặp sự cố khi xử lý yêu cầu.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Tôi không thể kết nối ngay bây giờ. Hãy thử lại sau.',
        timestamp: ''
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background-dark">
      <header className="shrink-0 flex items-center justify-between px-4 py-4 bg-background-dark border-b border-white/5 sticky top-0 z-10">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="text-lg font-bold">Trợ lý AI</h2>
        <div className="size-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end gap-3 ${msg.role === 'user' ? 'flex-row-reverse ml-auto max-w-[85%]' : 'max-w-[85%]'}`}>
            {msg.role === 'assistant' && (
              <div className="relative shrink-0">
                <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                  <span className="material-symbols-outlined text-primary text-xl">smart_toy</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 size-3 rounded-full border-2 border-background-dark"></div>
              </div>
            )}
            <div className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              {msg.role === 'assistant' && <span className="text-[10px] font-bold text-gray-500 uppercase ml-1">IVAC AI</span>}
              <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-md ${
                msg.role === 'user' 
                  ? 'bg-primary text-white rounded-br-none' 
                  : 'bg-surface-dark text-gray-200 border border-white/5 rounded-bl-none'
              }`}>
                {msg.content}
              </div>
              <span className="text-[10px] text-gray-600 mt-1">{msg.timestamp}</span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-end gap-3 max-w-[85%]">
            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0">
               <span className="material-symbols-outlined text-primary text-xl">smart_toy</span>
            </div>
            <div className="p-4 bg-surface-dark rounded-2xl rounded-bl-none border border-white/5 flex gap-1">
              <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce delay-100"></div>
              <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </main>

      <footer className="shrink-0 p-4 border-t border-white/5 bg-background-dark/80 backdrop-blur-md pb-safe">
        <div className="flex items-end gap-2 bg-surface-dark rounded-2xl border border-white/5 p-2 focus-within:border-primary transition-all">
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            className="flex-1 bg-transparent border-none text-white text-sm focus:ring-0 resize-none py-2 px-3 max-h-32"
            placeholder="Nhập yêu cầu của bạn..."
            rows={1}
          />
          <div className="flex items-center gap-1 mb-1 pr-1">
            <button className="p-2 text-gray-500 hover:text-primary"><span className="material-symbols-outlined">mic</span></button>
            <button 
              onClick={handleSend}
              className="size-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg hover:bg-primary-hover active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AIScreen;
