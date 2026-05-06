import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import * as chatbotService from '../services/chatbotService';

export const chatbotMessageValidator = [
  body('message').trim().notEmpty().withMessage('Message is required'),
];

/**
 * Process a chatbot message
 */
export async function processMessage(req: Request, res: Response): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }

    const { message } = req.body;
    const result = await chatbotService.processMessage(message);

    res.status(200).json(result);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || 'Internal server error' });
  }
}
