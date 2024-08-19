'use client';

import { useModal } from '@/hooks/use-modal-store';
import { cn } from '@/lib/utils';
import { ServerWithChannelsAndMembersWithProfiles } from '@/types';
import { Member, MemberRole, Profile } from '@prisma/client';
import { ShieldAlert, ShieldCheck, User } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

type Props = {
  member: Member & { profile: Profile };
  role: MemberRole;
  server: ServerWithChannelsAndMembersWithProfiles;
};

const roleIconMap = {
  [MemberRole.GUEST]: <User className="size-4 text-indigo-500 flex-shrink-0" />,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="size-4 text-indigo-500 flex-shrink-0" />
  ),
  [MemberRole.ADMIN]: (
    <ShieldAlert className="size-4 text-rose-500 flex-shrink-0" />
  ),
};

export default function ServerMembers({ member, role, server }: Props) {
  const {
    id: memberId,
    role: memberRole,
    serverId,
    profile: { id: profileId, name, email, imageUrl, userId },
  } = member || { profile: {} };
  const router = useRouter();
  const params = useParams();
  const { onOpen } = useModal();

  const icon = roleIconMap[memberRole];

  const onEditMember = () => {
    onOpen({
      type: 'manageMembers',
      data: { server },
    });
  };

  return (
    <button
      className={cn(
        'flex items-center gap-2 group p-2 text-sm hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 w-full my-[6px] transition',
        params?.memberId === memberId &&
          'text-primary bg-zinc-700/20 dark:bg-zinc-700/400'
      )}
    >
      <span>{icon}</span>
      <p
        className={cn(
          'line-clamp-1 text-zinc-500 dark:text-zinc-400 hover:group-hover:text-zinc-600 dark:group-hover:text-zinc-300 text-sm transition',
          params?.memberId === memberId &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white'
        )}
      >
        {name}
      </p>
    </button>
  );
}
