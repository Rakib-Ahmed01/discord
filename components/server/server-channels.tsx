'use client';

import { useModal } from '@/hooks/use-modal-store';
import { cn } from '@/lib/utils';
import { ServerWithChannelsAndMembersWithProfiles } from '@/types';
import { Channel, ChannelType, MemberRole } from '@prisma/client';
import { Edit, Hash, LockIcon, Mic, Trash, Video } from 'lucide-react';
import { useParams } from 'next/navigation';
import ActionTooltip from '../action-tooltip';

type Props = {
  channel: Channel;
  role: MemberRole;
  server: ServerWithChannelsAndMembersWithProfiles;
};

const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

export default function ServerChannels({ channel, role, server }: Props) {
  const { id, type, name } = channel || {};
  const params = useParams();
  const { onOpen } = useModal();

  const Icon = iconMap[type];

  const onEditChannel = () => {
    onOpen({
      type: 'editChannel',
      data: { channel, server },
    });
  };

  const onDeleteChannel = () => {
    onOpen({ type: 'deleteChannel', data: { server, channel } });
  };

  return (
    <button
      onClick={() => {}}
      className={cn(
        'group p-2 flex gap-2 items-center rounded-md w-full my-[6px] hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition',
        params?.channelId === id &&
          'hover:bg-zinc-700/20 dark:hover:bg-zinc-700/40'
      )}
    >
      <Icon className="flex-shrink-0 size-4 text-zinc-500 dark:text-zinc-400" />
      <p
        className={cn(
          'line-clamp-1 text-zinc-500 dark:text-zinc-400 hover:group-hover:text-zinc-600 dark:group-hover:text-zinc-300 text-sm transition',
          params?.channelId === id &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white'
        )}
      >
        {name}
      </p>
      {name !== 'general' && role !== 'GUEST' && (
        <div className="ml-auto flex items-center gap-2">
          <ActionTooltip side="top" align="center" label="Edit Channel">
            <Edit
              className="size-4 hidden group-hover:block text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300"
              onClick={onEditChannel}
            />
          </ActionTooltip>
          <ActionTooltip side="top" align="center" label="Delete Channel">
            <Trash
              className="size-4 hidden group-hover:block text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300"
              onClick={onDeleteChannel}
            />
          </ActionTooltip>
        </div>
      )}

      {name === 'general' && (
        <div className="ml-auto">
          <LockIcon className="size-4 text-zinc-500 dark:text-zinc-400 " />
        </div>
      )}
    </button>
  );
}
