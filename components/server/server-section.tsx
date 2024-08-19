'use client';

import { useModal } from '@/hooks/use-modal-store';
import { ServerWithChannelsAndMembersWithProfiles } from '@/types';
import { ChannelType, MemberRole } from '@prisma/client';
import { Plus, Settings } from 'lucide-react';
import ActionTooltip from '../action-tooltip';

type Props = {
  label: string;
  sectionType: 'channels' | 'members';
  role?: MemberRole;
  channelType?: ChannelType;
  server: ServerWithChannelsAndMembersWithProfiles;
};

export default function ServerSection({
  label,
  role,
  sectionType,
  channelType,
  server,
}: Props) {
  const { onOpen } = useModal();

  const handleCreateChannel = () => {
    onOpen({
      type: 'createChannel',
      data: {
        server,
        type: sectionType === 'channels' && channelType ? channelType : 'TEXT',
      },
    });
  };

  const handleManageMembers = () => {
    onOpen({ type: 'manageMembers', data: { server } });
  };

  return (
    <div className="flex items-center justify-between">
      <p className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== 'GUEST' && sectionType === 'channels' && (
        <ActionTooltip side="top" align="center" label="Create Channel">
          <button
            onClick={handleCreateChannel}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
          >
            <Plus className="size-4" />
          </button>
        </ActionTooltip>
      )}
      {role === 'ADMIN' && sectionType === 'members' && (
        <ActionTooltip side="top" align="center" label="Manage Members">
          <button
            onClick={handleManageMembers}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
          >
            <Settings className="size-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
}
