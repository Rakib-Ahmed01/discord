'use client';

import { useModal } from '@/hooks/use-modal-store';
import { MessageSchema, MessageSchemaType } from '@/shared/schema-and-types';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Plus, Smile } from 'lucide-react';
import queryString from 'query-string';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Form, FormField, FormItem } from '../ui/form';
import { Input } from '../ui/input';

type Props = {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: 'conversation' | 'channel';
};

export default function ChatInput({ apiUrl, name, type, query }: Props) {
  const form = useForm<MessageSchemaType>({
    defaultValues: {
      content: '',
    },
    resolver: zodResolver(MessageSchema),
  });
  const { onOpen } = useModal();

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: MessageSchemaType) => {
    console.log(values);
    try {
      const url = queryString.stringifyUrl({
        url: apiUrl,
        query,
      });
      await axios.post(url, { content: values.content });
      toast.success('Message sent successfully', { position: 'top-right' });
      form.reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <div className="relative p-3 pb-5">
                <button
                  type="button"
                  className="absolute top-7 left-6 bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-[1px] flex justify-center items-center"
                  onClick={() => {
                    onOpen({
                      type: 'sendFile',
                      data: { type, name, apiUrl, query },
                    });
                  }}
                >
                  <Plus className="size-4 text-white dark:text-darkish" />
                </button>
                <Input
                  disabled={isLoading}
                  placeholder={
                    type === 'channel' ? `Message #${name}` : `Message ${name}`
                  }
                  {...field}
                  className="px-12 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                />
                <button type="button" className="absolute top-7 right-6">
                  <Smile className="size-5 text-zinc-300/80 hover:text-zinc-200" />
                </button>
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
