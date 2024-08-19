import currentProfile from '@/lib/current-profile';
import { db } from '@/lib/db';
import { createChannelSchema } from '@/shared/schema-and-types';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const serverId = searchParams.get('serverId');
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!serverId) {
      return new NextResponse('Server id is missing', { status: 400 });
    }

    const body = await request.json();
    const result = createChannelSchema.safeParse(body);

    if (!result.success) {
      return new NextResponse('Channel name and type is required', {
        status: 400,
      });
    }

    const { name, type } = result.data;

    const channel = await db.channel.findFirst({
      where: {
        serverId,
        name: {
          equals: name,
          mode: 'insensitive',
        },
        type,
      },
    });

    if (channel) {
      return new NextResponse('Channel already exists', { status: 409 });
    }

    await db.server.update({
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
        channels: {
          create: {
            name,
            type,
            profileId: profile.id,
          },
        },
      },
    });

    return new NextResponse('Channel created', { status: 201 });
  } catch (error) {
    console.log('CHANNELS_POST', error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const serverId = searchParams.get('serverId');
    const channelId = searchParams.get('channelId');

    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!serverId) {
      return new NextResponse('Server id is missing', { status: 400 });
    }

    if (!channelId) {
      return new NextResponse('Channel id is missing', { status: 400 });
    }

    const body = await request.json();
    const result = createChannelSchema.safeParse(body);

    if (!result.success) {
      return new NextResponse('Channel name and type is required', {
        status: 400,
      });
    }

    const { name, type } = result.data;

    const channel = await db.channel.findFirst({
      where: {
        serverId,
        name: {
          equals: name,
          mode: 'insensitive',
        },
        type,
      },
    });

    if (channel) {
      return new NextResponse('Channel already exists', { status: 409 });
    }

    await db.server.update({
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
        channels: {
          update: {
            where: {
              id: channelId,
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });

    return new NextResponse('Channel updated', { status: 200 });
  } catch (error) {
    console.log('CHANNELS_POST', error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const serverId = searchParams.get('serverId');
    const channelId = searchParams.get('channelId');

    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!serverId) {
      return new NextResponse('Server id is missing', { status: 400 });
    }

    if (!channelId) {
      return new NextResponse('Channel id is missing', { status: 400 });
    }

    await db.server.update({
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
        channels: {
          delete: {
            id: channelId,
          },
        },
      },
    });

    return new NextResponse('Channel updated', { status: 200 });
  } catch (error) {
    console.log('CHANNELS_POST', error);
  }
}
