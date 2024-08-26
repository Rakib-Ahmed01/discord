import currentProfilePages from '@/lib/current-profile-pages';
import { db } from '@/lib/db';
import { NextApiResponseServerIO } from '@/types';
import { NextApiRequest } from 'next';
import { z } from 'zod';

const bodyAndQuerySchema = z.object({
  body: z.object({
    content: z.string().min(1),
  }),
  query: z.object({
    channelId: z.string().min(1),
    serverId: z.string().min(1),
  }),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const profile = await currentProfilePages(req);

    if (!profile) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = bodyAndQuerySchema.safeParse(req);

    if (!result.success) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    const {
      body: { content },
      query: { serverId, channelId },
    } = result.data;

    const member = await db.member.findFirst({
      where: {
        profileId: profile.id,
        serverId,
      },
    });

    if (!member) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const message = await db.message.create({
      data: {
        content,
        channelId,
        senderId: member.id,
      },
    });

    const channelKey = `chat:${channelId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.log('[MESSAGE_POST]', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
