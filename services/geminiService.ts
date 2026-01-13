
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  async sendMessage(message: string, history: { role: string; parts: { text: string }[] }[] = [], dataContext: string = "") {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...history,
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: `Bạn là Trợ lý AI của Đoàn TN IVAC. 
          
          ĐÂY LÀ DỮ LIỆU THỰC TẾ TỪ HỆ THỐNG:
          ${dataContext}
          
          NHIỆM VỤ:
          1. Nếu đồng chí (người dùng) hỏi về số liệu (ví dụ: bao nhiêu người sinh năm xxxx, chi đoàn nào đông nhất, hoạt động nào vừa diễn ra), hãy dựa TUYỆT ĐỐI vào dữ liệu thực tế ở trên để tính toán và trả lời.
          2. Nếu câu hỏi không liên quan đến dữ liệu hệ thống, hãy trả lời dựa trên kiến thức chuyên môn về công tác Đoàn.
          3. Luôn xưng hô là "Trợ lý AI" và gọi người dùng là "Đồng chí".
          4. Trả lời ngắn gọn, chuyên nghiệp, chính xác.`,
          temperature: 0.2, // Giảm temperature để AI trả lời chính xác số liệu hơn
        },
      });

      return response.text || "Xin lỗi, tôi gặp sự cố khi xử lý yêu cầu.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Đã có lỗi xảy ra khi kết nối với máy chủ AI. Vui lòng kiểm tra lại cấu hình.";
    }
  }
}

export const geminiService = new GeminiService();
