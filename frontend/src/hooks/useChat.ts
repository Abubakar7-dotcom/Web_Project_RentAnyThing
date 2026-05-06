import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import * as messageService from '../services/messageService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Get JWT token from cookies
 */
function getJwtToken(): string | null {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'jwt') return value;
  }
  return null;
}

export function useChat(listingId: string, otherUserId: string) {
  const [messages, setMessages] = useState<messageService.Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!listingId || !otherUserId) return;

    // Fetch message history
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const history = await messageService.getMessages(listingId, otherUserId);
        setMessages(history);
      } catch (err) {
        console.error('Error fetching message history:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();

    // Connect Socket.io
    const token = getJwtToken();
    const socket = io(API_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join_room', { listingId, otherUserId });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('receive_message', (message: messageService.Message) => {
      setMessages((prev) => {
        // Avoid duplicates (optimistic update may already have it)
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
    });

    socket.on('message_error', (err: { error: string }) => {
      console.error('Socket message error:', err.error);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [listingId, otherUserId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || !socketRef.current) return;

      // Emit via socket
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
