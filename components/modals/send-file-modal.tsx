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
  MessageWithFileSchema,
  MessageWithFileSchemaType,
} from '@/shared/schema-and-types';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import queryString from 'query-string';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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

export default function SendFileModal() {
  const { isOpen, onClose, modalTypeAndData } = useModal();
  const router = useRouter();
  const form = useForm<MessageWithFileSchemaType>({
    defaultValues: {
      fileUrl: '',
      content: '',
    },
    resolver: zodResolver(MessageWithFileSchema),
  });

  const isLoading = form.formState.isSubmitting;
  const isModalOpen = isOpen && modalTypeAndData.type === 'sendFile';
  let modalData = {} as Record<string, any>;

  if (modalTypeAndData.type === 'sendFile') {
    modalData = modalTypeAndData.data;
  }

  const { type, name, apiUrl, query } = modalData || {};

  const onSubmit = async (values: MessageWithFileSchemaType) => {
    const { content, fileUrl } = values;
    if (!fileUrl && !content) {
      form.setError('content', {
        message: 'File or Message is required',
      });
      form.setError('fileUrl', {
        message: 'File or Message is required',
      });
      return;
    }
    try {
      const url = queryString.stringifyUrl({
        url: apiUrl,
        query,
      });
      await axios.post(url, {
        content: values.content,
        fileUrl: values.fileUrl,
      });
      toast.success('Message sent successfully', { position: 'top-right' });
      form.reset();
    } catch (error) {
      console.log(error);
      toast.error((error as any).response?.data?.error, {
        position: 'top-right',
      });
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
          <DialogTitle className="text-center text-2xl font-bold">
            Add an attachment
          </DialogTitle>
          <DialogDescription className="text-center">
            Send a file as a message
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
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload endpoint="messageFile" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase text-secondary/90 font-bold">
                      Message
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="bg-zinc-300/50 border-0
                        focus-visible:outline-none
                        focus-visible:border-0
                        focus-visible:ring-0
                        ring-offset-white"
                        disabled={isLoading}
                        placeholder={
                          type === 'channel'
                            ? `Message #${name}`
                            : `Message ${name}`
                        }
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
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
