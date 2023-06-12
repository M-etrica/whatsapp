import { z } from 'zod';

export const sendMessageInputSchema = z.object({
  to: z
    .object({
      phone: z.string().min(1).max(16),
      name: z.string().min(1).max(128),
    })
    .required(),
  message: z.string().min(1).max(4096),
});

export const sendTemplateMessageInputSchema = z.object({
  to: z.string().min(1).max(16),
  template: z.string().min(1).max(128),
  components: z.array(z.string().min(1).max(128)),
});

export type SendTemplateMessageInput = z.infer<
  typeof sendTemplateMessageInputSchema
>;

export type SendMessageInput = z.infer<typeof sendMessageInputSchema>;
