'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import useOrigin from '@/hooks/use-origin';
import axios from 'axios';
import { Copy, CopyCheck, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useModal } from '../../hooks/use-modal-store';
import ActionTooltip from '../action-tooltip';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export default function InviteMemberModal() {
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onClose, modalTypeAndData, onOpen } = useModal();
  const origin = useOrigin();

  console.log(origin);

  const isModalOpen = isOpen && modalTypeAndData.type === 'inviteMember';
  let inviteCode = '';
  let serverId = '';

  if (modalTypeAndData.type === 'inviteMember') {
    inviteCode = `${origin}/invite/${modalTypeAndData.data.server.inviteCode}`;
    serverId = modalTypeAndData.data.server.id;
  }

  const onCopy = () => {
    navigator.clipboard.writeText(inviteCode);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const onGenerateNewLink = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/servers/${serverId}/invite-code`
      );

      console.log(response.data);

      onOpen({
        type: 'inviteMember',
        data: {
          server: {
            id: serverId,
            inviteCode: response.data,
          },
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white text-black p-5">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center font-bold text-balance">
            Invite Members
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 flex flex-col space-y-[10px] items-start">
          <Label className="uppercase text-xs font-semibold text-zinc-500 dark:text-secondary/70">
            Server invite link
          </Label>
          <div className="flex items-center gap-2 w-full">
            <Input
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-900 flex-grow"
              defaultValue={inviteCode}
              disabled={isLoading}
              key={inviteCode}
            />
            <ActionTooltip
              label={isCopied ? 'Copied' : 'Copy invite code'}
              align="end"
              side="bottom"
            >
              <Button size={'icon'} onClick={onCopy} disabled={isLoading}>
                {isCopied ? (
                  <CopyCheck className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </ActionTooltip>
          </div>
          <Button
            disabled={isLoading}
            variant={'link'}
            size={'sm'}
            className="text-zs text-zinc-500"
            onClick={onGenerateNewLink}
          >
            Generate a new link
            <RefreshCw className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
