import currentProfile from '@/lib/current-profile';
import { db } from '@/lib/db';
import { createServerSchema } from '@/shared/schema-and-types';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params: { serverId } }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const result = createServerSchema.safeParse(body);

    if (!result.success) {
      return new NextResponse('Server name or image is required', {
        status: 400,
      });
    }

    const { name, imageUrl } = result.data;

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: ['ADMIN'],
            },
          },
        },
      },
      data: {
        name,
        imageUrl,
      },
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.log('[SERVERS_ID_PATCH]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
