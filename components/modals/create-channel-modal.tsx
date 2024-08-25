'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  createChannelSchema,
  CreateChannelType,
} from '@/shared/schema-and-types';
import { ServerWithChannelsAndMembersWithProfiles } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChannelType } from '@prisma/client';
import { DialogDescription } from '@radix-ui/react-dialog';
import axios from 'axios';
import _ from 'lodash';
import { useRouter } from 'next/navigation';
import queryString from 'query-string';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useModal } from '../../hooks/use-modal-store';
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

type Props = {
  type?: 'initial';
};

export default function CreateChannelModal({ type }: Props) {
  const { isOpen, onClose, modalTypeAndData } = useModal();
  const router = useRouter();
  const form = useForm<{
    name: string;
    type: ChannelType;
  }>({
    defaultValues: {
      name: '',
      type: 'TEXT',
    },
    resolver: zodResolver(createChannelSchema),
  });

  useEffect(() => {
    if (modalTypeAndData.type === 'createChannel') {
      form.setValue('type', modalTypeAndData.data.type);
    }
  }, [form, modalTypeAndData]);

  const isLoading = form.formState.isSubmitting;
  const isModalOpen = isOpen && modalTypeAndData.type === 'createChannel';
  let server = {} as ServerWithChannelsAndMembersWithProfiles;

  if (modalTypeAndData.type === 'createChannel') {
    server = modalTypeAndData.data.server;
  }

  const onSubmit = async (values: CreateChannelType) => {
    const channelExists = _.find(
      server.channels,
      (ch) =>
        ch.name.toLowerCase() === values.name.toLowerCase() &&
        ch.type === values.type
    );

    if (channelExists) {
      return toast.error('Channel already exists');
    }

    try {
      const url = queryString.stringifyUrl({
        url: `/api/channels`,
        query: {
          serverId: server.id,
        },
      });
      await axios.post(url, values);
      toast.success('Channel created');
    } catch (error) {
      console.log(error);
    } finally {
      handleClose();
      router.refresh();
    }
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
            Create Channel
          </DialogTitle>
          <DialogDescription className="text-zinc-500 text-center">
            Create channel for your server
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-semibold text-zinc-500 dark:text-secondary/70">
                      Channel Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="bg-zinc-300/50 border-0
                        focus-visible:outline-none
                        focus-visible:border-0
                        focus-visible:ring-0
                        ring-offset-white"
                        disabled={isLoading}
                        placeholder="Enter channel name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-semibold text-zinc-500 dark:text-secondary/70">
                      Channel Type
                    </FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger
                          className="bg-zinc-300/50 border-0 outline-none
                        focus-visible:outline-none
                        focus-visible:border-0
                        focus-visible:ring-0
                        ring-offset-0
                        focus:ring-offset-0
                        focus:ring-transparent"
                        >
                          <SelectValue placeholder={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="TEXT">TEXT</SelectItem>
                        <SelectItem value="AUDIO">AUDIO</SelectItem>
                        <SelectItem value="VIDEO">VIDEO</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" variant="primary" disabled={isLoading}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
