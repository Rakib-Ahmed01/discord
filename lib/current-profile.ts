import { auth } from '@clerk/nextjs/server';
import { cache } from 'react';
import { db } from './db';

const currentProfile = cache(async () => {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  return await db.profile.findUnique({
    where: {
      userId,
    },
  });
});

export default currentProfile;
