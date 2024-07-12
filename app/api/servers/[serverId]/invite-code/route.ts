import currentProfile from '@/lib/current-profile';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params: { serverId } }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!serverId) {
      return new NextResponse('Server id missing', { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: ['ADMIN', 'MODERATOR'],
            },
          },
        },
      },
      data: {
        inviteCode: crypto.randomUUID(),
      },
    });

    return new NextResponse(server.inviteCode, { status: 200 });
  } catch (error) {
    console.log('[INVITE_CODE_PATCH]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
