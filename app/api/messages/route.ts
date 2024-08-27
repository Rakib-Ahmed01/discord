import currentProfile from '@/lib/current-profile';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

const MESSAGES_BATCH = 10;

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const channelId = searchParams.get('channelId');
    let cursor = searchParams.get('cursor') as any;

    if (cursor) {
      cursor = +cursor;
    }

    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!channelId) {
      return new NextResponse('channelId is missing', {
        status: 400,
      });
    }

    let messages;

    if (cursor) {
      messages = await db.message.findMany({
        where: {
          channelId,
        },
        skip: 1,
        take: MESSAGES_BATCH,
        cursor: {
          id: cursor,
        },
        include: {
          sender: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      messages = await db.message.findMany({
        where: {
          channelId,
        },
        take: MESSAGES_BATCH,
        include: {
          sender: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    let nextCursor = null;

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json(
      {
        data: messages,
        nextCursor,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log('[MESSAGES_GET]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
