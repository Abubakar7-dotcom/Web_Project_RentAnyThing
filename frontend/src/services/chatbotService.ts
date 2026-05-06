import api from './api';

export interface ChatbotResponse {
  response: string;
  isComplaintFlow: boolean;
}

/**
 * Send a message to the AI chatbot
 */
export async function sendMessage(message: string): Promise<ChatbotResponse> {
  const response = await api.post('/chatbot/message', { message });
  return response.data;
}
