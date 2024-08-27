'use client';

import useChatQuery from '@/hooks/use-chat-query';
import useChatSocket from '@/hooks/use-chat-socket';
import { MessageWithSenderWithProfile } from '@/types';
import { Member } from '@prisma/client';
import { Loader2, ServerCrash } from 'lucide-react';
import { Fragment } from 'react';
import ChatMessage from './chat-message';
import ChatWelcome from './chat-welcome';

type Props = {
  type: 'channel' | 'conversation';
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
  serverId: string;
};

export default function ChatMessages({
  apiUrl,
  type,
  name,
  member,
  chatId,
  paramKey,
  paramValue,
  socketQuery,
  socketUrl,
  serverId,
}: Props) {
  const queryKey = `chat:${chatId}`;
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useChatQuery({
    apiUrl,
    paramKey,
    paramValue,
    queryKey,
  });

  useChatSocket({
    key: `chat:${chatId}:messages`,
    queryKey,
  });

  if (status === 'pending') {
    return (
      <div className="flex-1 flex justify-center items-center flex-col gap-1">
        <Loader2 className="size-7 text-zinc-500 animate-spin" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex-1 flex justify-center items-center flex-col gap-1">
        <ServerCrash className="size-7 text-zinc-500" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="flex-1" />
      <ChatWelcome type={type} name={name} />
      <div className="flex flex-col-reverse">
        {data?.pages.map((group, i) => (
          <Fragment key={i}>
            {group?.data?.map((message: MessageWithSenderWithProfile) => (
              <ChatMessage
                key={message.id}
                message={message}
                currentMember={member}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
                serverId={serverId}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
