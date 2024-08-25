import currentProfile from '@/lib/current-profile';
import { getServerWithChannelsAndMembersWithProfile } from '@/lib/utils';
import { auth } from '@clerk/nextjs/server';
import { ChannelType, MemberRole } from '@prisma/client';
import _ from 'lodash';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import ServerChannels from './server-channels';
import ServerHeader from './server-header';
import ServerMembers from './server-members';
import ServerSearch from './server-search';
import ServerSection from './server-section';

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
        <Separator className="bg-zinc-200 dark:bg-zinc-700 my-2" />
        {!!textChannels.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              server={server}
              label="Text Channels"
              channelType="TEXT"
              role={currentUserRole}
            />
            {textChannels.map((channel) => (
              <ServerChannels
                key={channel.id}
                role={currentUserRole}
                channel={channel}
                server={server}
              />
            ))}
          </div>
        )}
        {!!audioChannels.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              server={server}
              label="Audio Channels"
              channelType="AUDIO"
              role={currentUserRole}
            />
            {audioChannels.map((channel) => (
              <ServerChannels
                role={currentUserRole}
                key={channel.id}
                channel={channel}
                server={server}
              />
            ))}
          </div>
        )}
        {!!videoChannels.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              server={server}
              label="Video Channels"
              channelType="VIDEO"
              role={currentUserRole}
            />

            {videoChannels.map((channel) => (
              <ServerChannels
                role={currentUserRole}
                key={channel.id}
                channel={channel}
                server={server}
              />
            ))}
          </div>
        )}
        {!!members.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              server={server}
              label={
                currentUserRole !== 'GUEST'
                  ? 'Manage Members'
                  : 'Server Members'
              }
              role={currentUserRole}
            />
            {members.map((member) => (
              <ServerMembers
                key={member.id}
                member={member}
                role={currentUserRole}
                server={server}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
