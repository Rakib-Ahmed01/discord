'use client';

import { cn } from '@/lib/utils';
import { Server } from '@prisma/client';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import ActionTooltip from '../action-tooltip';

type Props = {
  servers: Server[];
};

export default function SidebarServerList({ servers }: Props) {
  const params = useParams() as { serverId: string };
  const router = useRouter();

  return (
    <ScrollArea className="w-full flex flex-col space-y-4">
      {servers.map((server) => {
        const { name, id, imageUrl } = server;
        return (
          <ActionTooltip label={name} align="center" side="right" key={id}>
            <button
              className="group relative flex items-center"
              onClick={() => router.push(`/servers/${id}`)}
            >
              <div
                className={cn(
                  'absolute left-0 bg-primary rounded-r-full transition-all w-1',
                  params?.serverId !== id && 'group-hover:h-5',
                  params?.serverId === id ? 'h-9' : 'h-2'
                )}
              />
              <div
                className={cn(
                  'relative w-12 h-12 rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden mx-3',
                  params?.serverId === id && 'rounded-[16px]'
                )}
              >
                <Image fill alt={name} src={imageUrl} />
              </div>
            </button>
          </ActionTooltip>
        );
      })}
    </ScrollArea>
  );
}
