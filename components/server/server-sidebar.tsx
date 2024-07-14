import currentProfile from '@/lib/current-profile';
import { getServerWithChannelsAndMembersWithProfile } from '@/lib/utils';
import { auth } from '@clerk/nextjs/server';
import _ from 'lodash';
import { redirect } from 'next/navigation';
import ServerHeader from './server-header';

type Props = {
  serverId: string;
};

export default async function ServerSidebar({ serverId }: Props) {
  const profile = await currentProfile();

  if (!profile) {
    return auth().redirectToSignIn();
  }

  const server = await getServerWithChannelsAndMembersWithProfile(
    serverId,
    profile.id
  );

  if (!server) {
    return redirect('/');
  }

  const textChannels = _.filter(server.channels, (ch) => ch.type === 'TEXT');
  const audioChannels = _.filter(server.channels, (ch) => ch.type === 'AUDIO');
  const videoChannels = _.filter(server.channels, (ch) => ch.type === 'VIDEO');
  const members = _.filter(
    server.members,
    (member) => member.profileId !== profile.id
  );
  const currentUserRole = _.find(
    server.members,
    (member) => member.profileId === profile.id
  )?.role!;

  return (
    <div className="flex flex-col h-full w-full text-primary bg-[#F2F3F5] dark:bg-[#2b2D31] isolate">
      <ServerHeader server={server} userRole={currentUserRole} />
    </div>
  );
}
