import currentProfile from '@/lib/current-profile';
import { db } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';

type Props = {
  params: { serverId: string };
};

export default async function ServerPage({ params }: Props) {
  const profile = await currentProfile();

  if (!profile) {
    return redirect('/');
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: {
            mode: 'insensitive',
            equals: 'general',
          },
        },
      },
    },
  });

  const generalChannel = server?.channels[0];

  if (!generalChannel) {
    return notFound();
  }

  return redirect(`/servers/${params.serverId}/channels/${generalChannel.id}`);
}
