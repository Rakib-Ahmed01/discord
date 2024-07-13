import { type ClassValue, clsx } from 'clsx';
import { cache } from 'react';
import { twMerge } from 'tailwind-merge';
import { db } from './db';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getServer = cache(async (id: string) => {
  return await db.server.findUnique({ where: { id } });
});

export const getServerByIdAndProfileId = cache(
  async (id: string, profileId: string) => {
    return await db.server.findUnique({
      where: {
        id,
        members: {
          some: {
            profileId,
          },
        },
      },
    });
  }
);

export const getServerByInviteCodeAndProfileId = cache(
  async (inviteCode: string, profileId: string) => {
    return await db.server.findFirst({
      where: {
        inviteCode,
        members: {
          some: {
            profileId,
          },
        },
      },
    });
  }
);

export const getServerWithChannelsAndMembersWithProfile = cache(
  async (id: string, profileId: string) => {
    return await db.server.findUnique({
      where: {
        id,
        members: {
          some: {
            profileId,
          },
        },
      },
      include: {
        channels: {
          orderBy: {
            createdAt: 'asc',
          },
        },
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
  }
);

export const getServersByProfileId = cache(async (profileId: string) => {
  return await db.server.findMany({
    where: {
      members: {
        some: {
          profileId,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
});
