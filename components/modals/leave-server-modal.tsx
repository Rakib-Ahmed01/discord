'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Server } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import queryString from 'query-string';
import { useState } from 'react';
import { useModal } from '../../hooks/use-modal-store';
import { Button } from '../ui/button';

export default function LeaveServerModal() {
  const { isOpen, onClose, modalTypeAndData } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isModalOpen = isOpen && modalTypeAndData.type === 'leaveServer';
  let server = {} as Server;

  if (modalTypeAndData.type === 'leaveServer') {
    server = modalTypeAndData.data.server;
  }

  const onLeaveConfirm = async () => {
    const url = queryString.stringifyUrl({
      url: `/api/servers/${server.id}/leave`,
    });

    setIsLoading(true);

    try {
      await axios.patch(url);
      onClose();
      router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white text-black p-0">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold text-balance">
            Leave Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to leave{' '}
            <span className="font-semibold text-indigo-500">{server.name}</span>
            ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex flex-row justify-between px-10 py-6 bg-gray-100 w-full mt-1">
            <Button variant="ghost" disabled={isLoading} onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={isLoading}
              onClick={onLeaveConfirm}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
