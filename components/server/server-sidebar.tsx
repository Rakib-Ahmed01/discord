import currentProfile from '@/lib/current-profile';
import { getServerWithChannelsAndMembersWithProfile } from '@/lib/utils';
import { auth } from '@clerk/nextjs/server';
import { ChannelType, MemberRole } from '@prisma/client';
import _ from 'lodash';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import ServerHeader from './server-header';
import ServerSearch from './server-search';

type Props = {
  serverId: string;
};

const channelIconMap: Record<ChannelType, React.ReactNode> = {
  TEXT: <Hash className="size-4" />,
  AUDIO: <Mic className="size-4" />,
  VIDEO: <Video className="size-4" />,
};

const roleIconMap: Record<MemberRole, React.ReactNode | null> = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="size-4 text-indigo-500" />,
  ADMIN: <ShieldAlert className="size-4 text-rose-500" />,
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

  const members = _.filter(
    server.members,
    (member) => member.profileId !== profile.id
  );
  const currentUserRole = _.find(
    server.members,
    (member) => member.profileId === profile.id
  )?.role!;
  const textChannels = _.filter(server.channels, (ch) => ch.type === 'TEXT');
  const audioChannels = _.filter(server.channels, (ch) => ch.type === 'AUDIO');
  const videoChannels = _.filter(server.channels, (ch) => ch.type === 'VIDEO');

  return (
    <div className="flex flex-col h-full w-full text-primary bg-[#F2F3F5] dark:bg-[#2b2D31] isolate">
      <ServerHeader server={server} userRole={currentUserRole} />
      <ScrollArea className="px-2">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: 'Text Channels',
                type: 'channel',
                data: textChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIconMap[channel.type],
                })),
              },
              {
                label: 'Voice Channels',
                type: 'channel',
                data: audioChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIconMap[channel.type],
                })),
              },
              {
                label: 'Video Channels',
                type: 'channel',
                data: videoChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIconMap[channel.type],
                })),
              },
              {
                label: 'Members',
                type: 'member',
                data: server.members.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                  profileId: member.profileId,
                })),
              },
            ]}
            profile={profile}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
