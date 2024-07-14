'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ServerWithChannelsAndMembersWithProfiles } from '@/types';
import { MemberRole } from '@prisma/client';
import axios from 'axios';
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import qs from 'query-string';
import { useState } from 'react';
import { useModal } from '../../hooks/use-modal-store';
import { ScrollArea } from '../ui/scroll-area';
import UserAvatar from '../user-avatar';

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="w-4 h-4 text-indigo-500" />,
  ADMIN: <ShieldAlert className="w-4 h-4 text-rose-500" />,
};

export default function InviteMemberModal() {
  const { isOpen, onClose, modalTypeAndData, onOpen } = useModal();
  const [loadingId, setLoadingId] = useState('');
  const router = useRouter();

  const isModalOpen = isOpen && modalTypeAndData.type === 'manageMembers';
  let server = {} as ServerWithChannelsAndMembersWithProfiles;
  let membersCount = 0;

  if (modalTypeAndData.type === 'manageMembers') {
    server = modalTypeAndData.data.server;
    membersCount = modalTypeAndData.data.server?.members?.length;
  }

  const onRoleChange = async (
    member: ServerWithChannelsAndMembersWithProfiles['members'][number],
    role: MemberRole
  ) => {
    if (role === member.role) {
      return;
    }

    setLoadingId(member.id);
    try {
      const url = qs.stringifyUrl({
        url: `/api/members/${member.id}`,
        query: {
          serverId: server.id,
        },
      });
      const res = (await axios.patch(url, { role })) as {
        data: ServerWithChannelsAndMembersWithProfiles;
      };
      router.refresh();
      onOpen({
        type: 'manageMembers',
        data: {
          server: res.data,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId('');
    }
  };

  const onKick = async (memberId: string, serverId: string) => {
    setLoadingId(memberId);
    try {
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId,
        },
      });
      const res = (await axios.delete(url)) as {
        data: ServerWithChannelsAndMembersWithProfiles;
      };
      router.refresh();
      onOpen({
        type: 'manageMembers',
        data: {
          server: res.data,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId('');
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white text-black p-5">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center font-bold text-balance">
            Manage Members
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          <div className="text-zinc-500 mb-2">
            {membersCount} {membersCount > 1 ? 'members' : 'member'}
          </div>
          {server.members.map((member) => (
            <div key={member.id} className="flex items-center gap-2 mb-6">
              <UserAvatar src={member.profile.imageUrl} className="w-10 h-10" />
              <div>
                <div className="text-sm font-semibold flex items-center gap-2">
                  {member.profile.name}
                  {roleIconMap[member.role]}
                </div>
                <p className="text-xs text-zinc-500">{member.profile.email}</p>
              </div>
              {server.profileId !== member.profileId &&
                loadingId !== member.id && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="w-4 h-4 text-zinc-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="cursor-pointer">
                            <ShieldQuestion className="w-4 h-4 mr-2" />
                            Role
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem
                              onClick={() => onRoleChange(member, 'GUEST')}
                              className="cursor-pointer"
                            >
                              <Shield className="w-4 h-4 mr-2" />
                              Guest
                              {member.role === 'GUEST' && (
                                <Check className="w-4 h-4 ml-auto" />
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onRoleChange(member, 'MODERATOR')}
                              className="cursor-pointer"
                            >
                              <ShieldCheck className="w-4 h-4 mr-2" />
                              Moderator
                              {member.role === 'MODERATOR' && (
                                <Check className="w-4 h-4 ml-auto" />
                              )}
                            </DropdownMenuItem>{' '}
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onKick(member.id, server.id)}
                          className="cursor-pointer"
                        >
                          <Gavel className="w-4 h-4 mr-2" />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {loadingId === member.id && (
                <Loader2 className="h-4 w-4 text-zinc-500 animate-spin ml-auto" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
