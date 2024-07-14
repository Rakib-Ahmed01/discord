'use client';

import { ServerWithChannelsAndMembersWithProfiles } from '@/types';
import { MemberRole } from '@prisma/client';
import {
  ChevronDownIcon,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from 'lucide-react';
import { useModal } from '../../hooks/use-modal-store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

type Props = {
  server: ServerWithChannelsAndMembersWithProfiles;
  userRole: MemberRole;
};

export default function ServerHeader({ server, userRole }: Props) {
  const { onOpen } = useModal();

  const isAdmin = userRole === 'ADMIN';
  const isModerator = isAdmin || userRole === 'MODERATOR';

  const onInvite = () =>
    onOpen({
      type: 'inviteMember',
      data: {
        server: {
          id: server.id,
          inviteCode: server.inviteCode,
        },
      },
    });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center h-12 w-full px-3 text-primary font-semibold border-neutral-200  dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
          {server.name}
          <ChevronDownIcon className="h-5 w-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 font-medium text-xs text-neutral-700 dark:text-neutral-400 space-y-[2px]">
        {isModerator && (
          <DropdownMenuItem
            className="text-indigo-600 dark:text-indigo-500 px-3 py-2 cursor-pointer text-sm"
            onClick={onInvite}
          >
            Invite Member
            <UserPlus className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            className="px-3 py-2 cursor-pointer"
            onClick={() => {
              onOpen({ type: 'editServer', data: { server } });
            }}
          >
            Server Settings
            <Settings className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen({ type: 'manageMembers', data: { server } })}
            className="px-3 py-2 cursor-pointer"
          >
            Manage Members
            <Users className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem className="px-3 py-2 cursor-pointer">
            Create Channel
            <PlusCircle className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {!isAdmin && (
          <DropdownMenuItem className="text-rose-500 px-3 py-2 cursor-pointer">
            Leave Server
            <LogOut className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem className="text-rose-600 dark:text-rose-500 px-3 py-2 cursor-pointer">
            Delete Server
            <Trash className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
