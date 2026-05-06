import { Server as SocketIOServer, Socket } from 'socket.io';
import { verifyToken } from '../utils/tokenUtils';
import * as chatService from '../services/chatService';

/**
 * Initialize Socket.io event handlers for real-time chat
 */
export function initSocket(io: SocketIOServer): void {
  // Authenticate every socket connection via JWT
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }
      const payload = verifyToken(token);
      (socket as any).user = payload;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user;
    console.log(`Socket connected: ${socket.id} (user: ${user?.id})`);

    // Join a private room for a listing conversation
    socket.on('join_room', ({ listingId, otherUserId }: { listingId: string; otherUserId: string }) => {
      const roomId = `${listingId}_${[user.id, otherUserId].sort().join('_')}`;
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room: ${roomId}`);
    });

    // Handle sending a message
    socket.on('send_message', async (data: {
      listingId: string;
      receiverId: string;
      content: string;
    }) => {
      try {
        const { listingId, receiverId, content } = data;

        // Save message to database
        const message = await chatService.saveMessage(
          user.id,
          receiverId,
          listingId,
          content
        );

        // Emit to the room
        const roomId = `${listingId}_${[user.id, receiverId].sort().join('_')}`;
        io.to(roomId).emit('receive_message', message);
      } catch (err) {
        console.error('Error saving message:', err);
        socket.emit('message_error', { error: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
}
