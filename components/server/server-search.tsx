'use client';

import { cn } from '@/lib/utils';
import { Profile } from '@prisma/client';
import { Search } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { DialogTitle } from '../ui/dialog';

type Props = {
  data: {
    label: string;
    type: 'channel' | 'member';
    data?: {
      icon: React.ReactNode;
      name: string;
      id: string;
      profileId?: string;
    }[];
  }[];
  profile: Profile;
};

export default function ServerSearch({ data, profile }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { serverId } = useParams() as { serverId: string };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleClick = ({
    id,
    type,
  }: {
    id: string;
    type: 'channel' | 'member';
  }) => {
    console.log('fn');
    setOpen(false);

    if (type === 'member') {
      return router.push(`/servers/${serverId}/conversations/${id}`);
    }

    if (type === 'channel') {
      return router.push(`/servers/${serverId}/channels/${id}`);
    }
  };

  return (
    <>
      <button
        className="group w-full p-2 rounded-[5px] flex items-center gap-2 bg-zinc-500/10 hover:bg-zinc-500/15 dark:hover:bg-zinc-700/50 transition"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4 text-zinc-500 dark:text-zinc-400" />
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 tracking-tight transition">
          Search
        </p>
        <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 ml-auto">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="sr-only">
          Search channels and members
        </DialogTitle>
        <CommandInput placeholder="Search channels and members..." />
        <CommandList>
          <CommandEmpty>No Results Found</CommandEmpty>
          {data.map(({ label, type, data }) => {
            if (!data?.length) return null;

            return (
              <CommandGroup key={label} heading={label}>
                {data.map(({ id, icon, name, profileId }) => {
                  return (
                    <CommandItem key={id}>
                      <div
                        className="flex items-center gap-1 cursor-pointer pointer-events-auto"
                        onClick={() => {
                          handleClick({ type, id });
                        }}
                      >
                        {icon}
                        <span
                          className={cn(type === 'member' && 'order-first')}
                        >
                          {name}
                          <span>
                            {profileId && profile.id === profileId && ' (you)'}
                          </span>
                        </span>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}
