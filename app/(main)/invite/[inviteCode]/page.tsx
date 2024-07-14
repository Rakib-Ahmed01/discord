import currentProfile from '@/lib/current-profile';
import { db } from '@/lib/db';
import { getServerByInviteCodeAndProfileId } from '@/lib/utils';
import { redirect } from 'next/navigation';

type Props = {
  params: { inviteCode: string };
};

export default async function InviteCode({ params: { inviteCode } }: Props) {
  const profile = await currentProfile();

  if (!profile) {
    return redirect('/');
  }

  const userAlreadyInServer = await getServerByInviteCodeAndProfileId(
    inviteCode,
    profile.id
  );

  if (userAlreadyInServer) {
    return redirect(`/servers/${userAlreadyInServer.id}`);
  }

  console.log({ inviteCode });

  const server = await db.server.update({
    where: {
      inviteCode,
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
