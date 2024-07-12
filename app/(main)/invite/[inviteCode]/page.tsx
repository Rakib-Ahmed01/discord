import currentProfile from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

type Props = {
  params: { inviteCode: string };
};

export default async function InviteCode({ params: { inviteCode } }: Props) {
  const profile = await currentProfile();

  console.log(profile);

  if (!profile) {
    return redirect('/');
  }

  const userAlreadyInServer = await db.server.findFirst({
    where: {
      inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (userAlreadyInServer) {
    return redirect(`/servers/${userAlreadyInServer.id}`);
  }

  const server = await db.server.update({
    where: {
      inviteCode: inviteCode,
    },
    data: {
      members: {
        create: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }
}