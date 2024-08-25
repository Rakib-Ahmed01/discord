import ChatHeader from '@/components/chat/chat-header';
import currentProfile from '@/lib/current-profile';
import { getMemberByProfileAndServerId } from '@/lib/utils';
import { redirect } from 'next/navigation';

type Props = {
  params: { memberId: string; serverId: string };
};

export default async function ServerMemberIdPage({ params }: Props) {
  const { serverId } = params || {};
  const profile = await currentProfile();

  if (!profile) {
    return redirect('/');
  }

  const member = await getMemberByProfileAndServerId(serverId, profile.id);

  if (!member) {
    return redirect('/');
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        serverId={serverId}
        name={member.profile.name}
        type="conversation"
      />
    </div>
  );
}
