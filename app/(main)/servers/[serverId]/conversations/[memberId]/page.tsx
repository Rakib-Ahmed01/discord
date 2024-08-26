import ChatHeader from '@/components/chat/chat-header';
import currentProfile from '@/lib/current-profile';
import { getOrCreateConversation } from '@/lib/get-or-create-conversation';
import { getMemberByProfileAndServerId } from '@/lib/utils';
import { redirect } from 'next/navigation';

type Props = {
  params: { memberId: string; serverId: string };
};

export default async function ServerMemberIdPage({ params }: Props) {
  const { serverId, memberId } = params || {};
  const profile = await currentProfile();

  if (!profile) {
    return redirect('/');
  }

  const currentMember = await getMemberByProfileAndServerId(
    serverId,
    profile.id
  );

  if (!currentMember) {
    return redirect('/');
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    memberId,
    serverId
  );

  if (!conversation) {
    redirect(`/servers/${serverId}`);
  }

  const { memberOne, memberTwo } = conversation;

  const participant =
    memberOne.profile.id === profile.id ? memberTwo : memberOne;

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        serverId={serverId}
        name={participant.profile.name}
        type="conversation"
        imageUrl={participant.profile.imageUrl}
      />
    </div>
  );
}
