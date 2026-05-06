import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Save a message to the database
 */
export async function saveMessage(
  senderId: string,
  receiverId: string,
  listingId: string,
  content: string
) {
  if (!content || content.trim().length === 0) {
    const error = new Error('Message content cannot be empty') as any;
    error.statusCode = 400;
    throw error;
  }

  const message = await prisma.message.create({
    data: {
      senderId,
      receiverId,
      listingId,
      content: content.trim(),
    },
    include: {
      sender: {
        select: { id: true, name: true },
      },
    },
  });

  return message;
}

/**
 * Get conversation history between two users for a listing
 */
export async function getMessages(
  listingId: string,
  userId1: string,
  userId2: string
) {
  const messages = await prisma.message.findMany({
    where: {
      listingId,
      OR: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
    },
    include: {
      sender: {
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  return messages;
}

/**
 * Get all conversations for a user (unique listing+user pairs)
 */
export async function getConversations(userId: string) {
  const messages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    include: {
      sender: { select: { id: true, name: true } },
      receiver: { select: { id: true, name: true } },
      listing: { select: { id: true, title: true, media: { take: 1 } } },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Deduplicate by listing + other user
  const seen = new Set<string>();
  const conversations: typeof messages = [];

  for (const msg of messages) {
    const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
    const key = `${msg.listingId}_${otherUserId}`;
    if (!seen.has(key)) {
      seen.add(key);
      conversations.push(msg);
    }
  }

  return conversations;
}
