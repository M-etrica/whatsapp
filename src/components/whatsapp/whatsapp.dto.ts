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
  components: z.array(z.object({})),
});

export const sendMeetingHRSchema = z.object({
  to: z.string().min(1).max(16),
  firstName: z.string().min(1).max(128),
  lastName: z.string().min(1).max(128),
});

export const sendCredentialsSchema = z.object({
  to: z.string().min(1).max(16),
  firstName: z.string().min(1).max(128),
  lastName: z.string().min(1).max(128),
  email: z.string().email().nonempty(),
  password: z.string().min(1).max(128),
});

export const sendDocumentsSchema = z.object({
  to: z.string().min(1).max(16),
  firstName: z.string().min(1).max(128),
  lastName: z.string().min(1).max(128),
  link: z.string().url().min(1).max(128),
});

export const sendFinalSchema = z.object({
  to: z.string().min(1).max(16),
  firstName: z.string().min(1).max(128),
  link: z.string().url().min(1).max(128),
  lastName: z.string().min(1).max(128),
});

export const sendTemplateMessageSchema = z.discriminatedUnion('template', [
  z.object({
    template: z.literal('meeting_hr'),
    ...sendMeetingHRSchema.shape,
  }),
  z.object({
    template: z.literal('documents'),
    ...sendDocumentsSchema.shape,
  }),
  z.object({
    template: z.literal('credentials'),
    ...sendCredentialsSchema.shape,
  }),
  z.object({
    template: z.literal('final'),
    ...sendFinalSchema.shape,
  }),
]);

export type SendTemplateMessageInput = z.infer<
  typeof sendTemplateMessageInputSchema
>;

export type SendMessageInput = z.infer<typeof sendMessageInputSchema>;

export type SendMeetingHRInput = z.infer<typeof sendMeetingHRSchema>;

export type SendCredentialsInput = z.infer<typeof sendCredentialsSchema>;

export type SendDocumentsInput = z.infer<typeof sendDocumentsSchema>;

export type SendFinalInput = z.infer<typeof sendFinalSchema>;

export type sendTemplateMessageSchema = z.infer<
  typeof sendTemplateMessageSchema
>;
