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
import { toast } from 'sonner';
import { useModal } from '../../hooks/use-modal-store';
import { Button } from '../ui/button';

export default function DeleteServerModal() {
  const { isOpen, onClose, modalTypeAndData } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isModalOpen = isOpen && modalTypeAndData.type === 'deleteServer';
  let server = {} as Server;

  if (modalTypeAndData.type === 'deleteServer') {
    server = modalTypeAndData.data.server;
  }

  const onDeleteConfirm = async () => {
    const url = queryString.stringifyUrl({
      url: `/api/servers/${server.id}`,
    });

    setIsLoading(true);

    try {
      await axios.delete(url);
      toast.success('Server deleted successfully');
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
            Delete Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            <p>
              {' '}
              Are you sure you want to delete{' '}
              <span className="font-semibold text-indigo-500">
                {server.name}
              </span>
              ?
            </p>
            <p>
              <span className="font-semibold text-indigo-500">
                {server.name}
              </span>{' '}
              will be deleted permanently.
            </p>
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
              onClick={onDeleteConfirm}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}