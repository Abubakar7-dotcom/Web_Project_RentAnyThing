import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import * as messageController from '../controllers/messageController';

const router = Router();

router.use(authenticate);

// GET /api/messages - Get all conversations for the authenticated user
router.get('/', messageController.getConversations);

// GET /api/messages/:listingId/:userId - Get conversation history
router.get('/:listingId/:userId', messageController.getMessages);

// POST /api/messages/:listingId/:userId - Send a message (REST fallback)
router.post('/:listingId/:userId', messageController.sendMessage);

export default router;
