'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  createServerSchema,
  CreateServerType,
} from '@/shared/schema-and-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Server } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useModal } from '../../hooks/use-modal-store';
import FileUpload from '../file-upload';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

export default function EditServerModal() {
  const { isOpen, onClose, modalTypeAndData } = useModal();
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      name: '',
      imageUrl: '',
    },
    resolver: zodResolver(createServerSchema),
  });

  const isLoading = form.formState.isSubmitting;
  const isModalOpen = isOpen && modalTypeAndData.type === 'editServer';
  let server = {} as Server;

  if (modalTypeAndData.type === 'editServer') {
    server = modalTypeAndData.data.server;
  }

  useEffect(() => {
    form.setValue('name', server.name);
    form.setValue('imageUrl', server.imageUrl);
  }, [form, server.name, server.imageUrl]);

  const onSubmit = async (values: CreateServerType) => {
    await axios.patch(`/api/servers/${server.id}`, values);
    handleClose();
    router.push(`/servers/${server.id}`);
    router.refresh();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden bg-white text-black p-5">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center font-bold">
            Edit Server
          </DialogTitle>
          <DialogDescription className="text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi
            doloremque doloribus dolor delectus nemo, earum officia repellendus
            tempora corrupti rerum.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="serverImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase text-secondary/90 font-bold">
                      Server Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="bg-zinc-300/50 border-0
                        focus-visible:outline-none
                        focus-visible:border-0
                        focus-visible:ring-0
                        ring-offset-white"
                        disabled={isLoading}
                        placeholder="Enter server name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" variant="primary" disabled={isLoading}>
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
