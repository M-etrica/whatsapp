import { Router } from 'express';
import {
  sendMessage,
  sendMessageTemplate,
  webhook,
  webhookGet,
} from './whatsapp.controller';
import {
  sendMessageInputSchema,
  sendTemplateMessageSchema,
} from './whatsapp.dto';
import { validate } from '../../middleware/validation';

const router = Router();

// send media
// POST: /api/wa/message
router.post('/wa/message/text', validate(sendMessageInputSchema), sendMessage);
router.post(
  '/wa/message/template',
  validate(sendTemplateMessageSchema),
  sendMessageTemplate
);

// Webhook related
router.get('/wa/webhook', webhookGet);
router.post('/wa/webhook', webhook);

export default router;
