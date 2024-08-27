'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

import { Smile } from 'lucide-react';
import { useTheme } from 'next-themes';

type Props = {
  onChange: (emoji: any) => void;
};

export default function EmojiPopover({ onChange }: Props) {
  const theme = useTheme();
  return (
    <Popover>
      <PopoverTrigger className="absolute top-7 right-6">
        <Smile className="size-5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600  dark:hover:text-zinc-300 transition" />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={40}
        className="bg-transparent border-none drop-shadow-none shadow-none mb-16 mr-3"
      >
        <Picker
          data={data}
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
          theme={theme.theme || 'dark'}
        />
      </PopoverContent>
    </Popover>
  );
}
