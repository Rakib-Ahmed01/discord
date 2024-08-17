'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  createServerSchema,
  CreateServerType,
} from '@/shared/schema-and-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogDescription } from '@radix-ui/react-dialog';
import axios from 'axios';
import { useRouter } from 'next/navigation';
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

type Props = {
  type?: 'initial';
};

export default function CreateServerModal({ type }: Props) {
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
  const isModalOpen =
    type === 'initial' || (isOpen && modalTypeAndData.type === 'createServer');

  const onSubmit = async (values: CreateServerType) => {
    try {
      await axios.post('/api/servers', values);
    } catch (error) {
      console.log(error);
    } finally {
      onClose();
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
            Create Server
          </DialogTitle>
          <DialogDescription className="text-zinc-500 text-center">
            Create your server with name and image. You can always change it
            later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full"
          >
            <div className="space-y-4 w-full">
              <div className="flex justify-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload endpoint="serverImage" {...field} />
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
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
