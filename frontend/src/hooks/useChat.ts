import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import * as messageService from '../services/messageService';
import api from '../services/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Fetch socket token from backend (reads HTTP-only cookie server-side)
 */
async function fetchSocketToken(): Promise<string | null> {
  try {
    const response = await api.get('/auth/socket-token');
    return response.data.token;
  } catch {
    return null;
  }
}

export function useChat(listingId: string, otherUserId: string) {
  const [messages, setMessages] = useState<messageService.Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!listingId || !otherUserId) {
      setIsLoading(false);
      return;
    }

    let socket: Socket;
    let cancelled = false;

    const init = async () => {
      // Fetch message history
      try {
        const history = await messageService.getMessages(listingId, otherUserId);
        if (!cancelled) setMessages(history);
      } catch (err) {
        console.error('Error fetching message history:', err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }

      // Get socket token from backend (bypasses HTTP-only cookie restriction)
      const token = await fetchSocketToken();
      if (!token || cancelled) return;

      // Connect Socket.io with the token
      socket = io(API_URL, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 3,
        timeout: 10000,
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        if (!cancelled) setIsConnected(true);
        socket.emit('join_room', { listingId, otherUserId });
      });

      socket.on('disconnect', () => {
        if (!cancelled) setIsConnected(false);
      });

      socket.on('connect_error', (err) => {
        console.error('Socket connection error:', err.message);
        if (!cancelled) setIsConnected(false);
      });

      socket.on('receive_message', (message: messageService.Message) => {
        if (!cancelled) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === message.id)) return prev;
            return [...prev, message];
          });
        }
      });

      socket.on('message_error', (err: { error: string }) => {
        console.error('Socket message error:', err.error);
      });
    };

    init();

    return () => {
      cancelled = true;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [listingId, otherUserId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || !socketRef.current?.connected) return;
      socketRef.current.emit('send_message', {
        listingId,
        receiverId: otherUserId,
        content,
      });
    },
    [listingId, otherUserId]
  );

  return { messages, isLoading, isConnected, sendMessage };
}
