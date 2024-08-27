'use client';

import { cn } from '@/lib/utils';
import { MessageWithSenderWithProfile } from '@/types';
import { Member, MemberRole } from '@prisma/client';
import { format } from 'date-fns';
import {
  Edit,
  FileIcon,
  ShieldAlert,
  ShieldCheck,
  Trash,
  User,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ActionTooltip from '../action-tooltip';
import UserAvatar from '../user-avatar';

type Props = {
  message: MessageWithSenderWithProfile;
  currentMember: Member;
  socketUrl: string;
  socketQuery: Record<string, string>;
  serverId: string;
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

const roleLabelMap = {
  [MemberRole.GUEST]: 'Guest',
  [MemberRole.ADMIN]: 'Admin',
  [MemberRole.MODERATOR]: 'Moderator',
};

export default function ChatMessage({
  message,
  currentMember,
  socketQuery,
  socketUrl,
  serverId,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const { content, createdAt, updatedAt, deleted, fileUrl, sender, id } =
    message;
  const timestamp = format(new Date(createdAt), 'd MMM yyyy HH:mm');
  const isUpdated = createdAt !== updatedAt;
  const isAdmin = currentMember.role === 'ADMIN';
  const isModerator = currentMember.role === 'MODERATOR';
  const isOwner = currentMember.id === sender.id;
  const canDelete = !deleted && (isAdmin || isModerator || isOwner);
  const canEdit = !deleted && isOwner && content;
  const fileType = fileUrl?.split('.').pop();
  const isPdf = fileType?.search(/pdf/gi) === 0;
  const isImage = !isPdf;

  const onAvatarClick = () => {
    if (message.sender.id === currentMember.id) return;

    router.push(`/servers/${serverId}/conversations/${message.sender.id}`);
  };

  return (
    <div className="relative group flex items-center hover:bg-black/5 px-4 py-5 transition w-full">
      <div className="group flex items-start gap-x-2 w-full">
        <div
          className="cursor-pointer hover:drop-shadow-md transition"
          onClick={onAvatarClick}
        >
          <UserAvatar src={sender.profile.imageUrl} />
        </div>
        <div>
          <div className="flex gap-1 items-center">
            <p className="text-sm font-medium hover:underline cursor-pointer">
              {sender.profile.name}
            </p>
            <ActionTooltip
              align="center"
              side="top"
              label={roleLabelMap[sender.role]}
            >
              <p className="cursor-pointer"> {roleIconMap[sender.role]}</p>
            </ActionTooltip>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </p>
          </div>
          <div className="mt-[6px] space-y-1">
            {isImage && fileUrl && (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-square size-48 rounded-sm overflow-hidden flex items-center bg-secondary"
              >
                <Image
                  src={fileUrl}
                  alt={content || ''}
                  fill
                  className="object-cover"
                />
              </a>
            )}
            {fileUrl && isPdf && (
              <div className="relative flex items-center p-2 mt-2 rounded-sm bg-background/10">
                <FileIcon className="size-10 fill-indigo-200 stroke-indigo-400" />
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                >
                  PDF File
                </a>
              </div>
            )}
            <p
              className={cn(
                'text-sm text-zinc-600 dark:text-zinc-300 -mt-[2px]',
                deleted &&
                  'italic text-zinc-500 dark:text-zinc-300 text-xs mt-1'
              )}
            >
              {!deleted && content}
              {deleted && content && (
                <span>(This message has been deleted)</span>
              )}
              {!deleted && isUpdated && (
                <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-1 ">
                  (edited)
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
      {!deleted && (
        <div className="absolute hidden group-hover:flex items-center gap-2 top-2 right-4 bg-white dark:bg-zinc-800 px-2 py-[6px] border rounded-sm">
          {canEdit && (
            <ActionTooltip label="Edit">
              <Edit className="size-4 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition cursor-pointer" />
            </ActionTooltip>
          )}

          {canDelete && (
            <ActionTooltip label="Delete">
              <Trash className="size-4 text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 transition cursor-pointer" />
            </ActionTooltip>
          )}
        </div>
      )}
    </div>
  );
}
