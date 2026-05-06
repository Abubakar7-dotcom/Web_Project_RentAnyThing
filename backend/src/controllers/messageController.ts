import { Request, Response } from 'express';
import * as chatService from '../services/chatService';

/**
 * Get conversation history between authenticated user and another user for a listing
 */
export async function getMessages(req: Request, res: Response): Promise<void> {
  try {
    const listingId = req.params.listingId as string;
    const otherUserId = req.params.userId as string;
    const currentUserId = req.user!.id;

    const messages = await chatService.getMessages(listingId, currentUserId, otherUserId);

    res.status(200).json(messages);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Send a message (REST fallback — real-time uses Socket.io)
 */
export async function sendMessage(req: Request, res: Response): Promise<void> {
  try {
    const listingId = req.params.listingId as string;
    const receiverId = req.params.userId as string;
    const { content } = req.body;
    const senderId = req.user!.id;

    const message = await chatService.saveMessage(senderId, receiverId, listingId, content);

    res.status(201).json(message);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Get all conversations for the authenticated user
 */
export async function getConversations(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const conversations = await chatService.getConversations(userId);
    res.status(200).json(conversations);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || 'Internal server error' });
  }
}
