import currentProfile from '@/lib/current-profile';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { memberId: string } }
) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const serverId = searchParams.get('serverId')!;
    const { memberId } = params;
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!memberId) {
      return new NextResponse('Member id is missing', { status: 400 });
    }

    if (!serverId) {
      return new NextResponse('Server id is missing', { status: 400 });
    }

    const body = await req.json();
    const { role } = z
      .object({ role: z.enum(['GUEST', 'MODERATOR']) })
      .parse(body);

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              profileId: {
                not: profile.id,
              },
              role: {
                in: ['MODERATOR', 'GUEST'],
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.log('MEMBERS_ID_PATCH', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { memberId: string } }
) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const serverId = searchParams.get('serverId')!;
    const { memberId } = params;
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!memberId) {
      return new NextResponse('Member id is missing', { status: 400 });
    }

    if (!serverId) {
      return new NextResponse('Server id is missing', { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          delete: {
            id: memberId,
            serverId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.log('MEMBERS_ID_DELETE', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
