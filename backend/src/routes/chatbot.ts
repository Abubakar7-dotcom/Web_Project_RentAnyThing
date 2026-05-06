import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { chatbotMessageValidator, processMessage } from '../controllers/chatbotController';

const router = Router();

router.use(authenticate);

// POST /api/chatbot/message - Process a chatbot message
router.post('/message', chatbotMessageValidator, processMessage);

export default router;
