import currentProfile from '@/lib/current-profile';
import { db } from '@/lib/db';
import { createServerSchema } from '@/shared/schema-and-types';
import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { name, imageUrl } = createServerSchema.parse(body);

    const newServer = await db.server.create({
      data: {
        name,
        imageUrl,
        inviteCode: randomUUID(),
        profileId: profile.id,
        memebers: {
          create: {
            role: 'ADMIN',
            profileId: profile.id,
          },
        },
        channels: {
          create: {
            name: 'general',
            profileId: profile.id,
          },
        },
      },
    });

    return new NextResponse('Server created', { status: 201 });
  } catch (error) {
    console.log('[SERVERS_POST]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
