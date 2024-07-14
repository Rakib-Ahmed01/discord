import currentProfile from '@/lib/current-profile';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { serverId: string } }
) {
  try {
    const { serverId } = params;
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!serverId) {
      return new NextResponse('Server id is missing', { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.log('SERVERS_ID_PATCH', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
