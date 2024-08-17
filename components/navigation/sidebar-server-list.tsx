'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Server } from '@prisma/client';
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
    <ScrollArea className="w-full pb-2">
      <div className="flex flex-col space-y-4">
        {servers.map((server) => {
          const { name, id, imageUrl } = server;
          return (
            <div key={id} className="z-50">
              <ActionTooltip label={name} align="center" side="right">
                <button
                  className="relative group flex items-center justify-center transition-all w-full"
                  onClick={() => router.push(`/servers/${id}`)}
                >
                  <div
                    className={cn(
                      'w-1 absolute left-0 bg-primary rounded-r-full transition-all',
                      params?.serverId === id ? 'h-8' : 'h-2',
                      params?.serverId !== id && 'group-hover:h-5'
                    )}
                  />
                  <div
                    className={cn(
                      'size-12 relative overflow-hidden rounded-[30px] group-hover:rounded-[16px] mx-3 transition-all duration-300',
                      params?.serverId === id && 'rounded-[16px]'
                    )}
                  >
                    <Image fill alt={name} src={imageUrl} />
                  </div>
                </button>
              </ActionTooltip>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
