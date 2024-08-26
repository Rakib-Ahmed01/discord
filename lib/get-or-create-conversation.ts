import { cache } from 'react';
import currentProfile from './current-profile';
import { db } from './db';
import {
  getConversation,
  getMemberByProfileAndServerId,
  getMemberByServerId,
} from './utils';

export const getOrCreateConversation = cache(async function (
  currentMemberId: string,
  participantMemberId: string,
  serverId: string
) {
  const profile = await currentProfile();

  if (!profile) {
    return null;
  }

  const currentMember = await getMemberByProfileAndServerId(
    serverId,
    profile.id
  );

  const participantMember = await getMemberByServerId(
    serverId,
    participantMemberId
  );

  if (!currentMember || !participantMember) {
    return null;
  }

  const conversation = await getConversation(
    currentMemberId,
    participantMemberId
  );

  if (conversation) {
    return conversation;
  }

  return await db.coversation.create({
    data: {
      memberOneId: currentMemberId,
      memberTwoId: participantMemberId,
    },
    include: {
      memberOne: {
        include: {
          profile: true,
        },
      },
      memberTwo: {
        include: {
          profile: true,
        },
      },
    },
  });
});
