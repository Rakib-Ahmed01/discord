import { getAuth } from '@clerk/nextjs/server';
import { NextApiRequest } from 'next';
import { db } from './db';

const currentProfilePages = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return null;
  }

  return await db.profile.findUnique({
    where: {
      userId,
    },
  });
};

export default currentProfilePages;
