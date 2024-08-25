import ChatHeader from '@/components/chat/chat-header';
import currentProfile from '@/lib/current-profile';
import { getChannel, getMemberByProfileAndServerId } from '@/lib/utils';
import { redirect } from 'next/navigation';

type Props = {
  params: { channelId: string; serverId: string };
};

export default async function ServerChannelIdPage({ params }: Props) {
  const { channelId, serverId } = params || {};
  const profile = await currentProfile();

  if (!profile) {
    return redirect('/');
  }

  const channel = await getChannel(channelId);
  const member = await getMemberByProfileAndServerId(serverId, profile.id);

  if (!channel || !member) {
    return redirect('/');
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader serverId={serverId} name={channel.name} type="channel" />
    </div>
  );
}
