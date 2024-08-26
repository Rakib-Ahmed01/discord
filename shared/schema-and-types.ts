import { z } from 'zod';

export const createServerSchema = z.object({
  name: z.string().min(1, {
    message: 'Server name is required',
  }),
  imageUrl: z.string().min(1, {
    message: 'Server image is required',
  }),
});

export type CreateServerType = z.infer<typeof createServerSchema>;

export const channelType = ['TEXT', 'AUDIO', 'VIDEO'] as const;

export const createChannelSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Channel name is required',
    })
    .refine((name) => name.toLowerCase() !== 'general', {
      message: `General channel already exists`,
    }),
  type: z
    .enum(channelType, {
      invalid_type_error: `Channel type must be ${channelType.join(', ')}`,
    })
    .default('TEXT'),
});

export type CreateChannelType = z.infer<typeof createChannelSchema>;

export const MessageSchema = z.object({
  content: z.string().min(1),
});

export type MessageSchemaType = z.infer<typeof MessageSchema>;
