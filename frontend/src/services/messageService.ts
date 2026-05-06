import api from './api';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  listingId: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
  };
}

export interface Conversation {
  id: string;
  senderId: string;
  receiverId: string;
  listingId: string;
  content: string;
  createdAt: string;
  sender: { id: string; name: string };
  receiver: { id: string; name: string };
  listing: { id: string; title: string; media: Array<{ id: string; url: string; type: string }> };
}

/**
 * Get all conversations for the authenticated user
 */
export async function getConversations(): Promise<Conversation[]> {
  const response = await api.get('/messages');
  return response.data;
}

/**
 * Get message history between current user and another user for a listing
 */
export async function getMessages(listingId: string, userId: string): Promise<Message[]> {
  const response = await api.get(`/messages/${listingId}/${userId}`);
  return response.data;
}

/**
 * Send a message (REST fallback)
 */
export async function sendMessage(
  listingId: string,
  userId: string,
  content: string
): Promise<Message> {
  const response = await api.post(`/messages/${listingId}/${userId}`, { content });
  return response.data;
}
