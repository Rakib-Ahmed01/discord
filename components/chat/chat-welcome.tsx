import { Hash } from 'lucide-react';

type Props = {
  type: 'channel' | 'conversation';
  name: string;
};

export default function ChatWelcome({ name, type }: Props) {
  return (
    <div className="space-y-1 px-4 my-4">
      {type === 'channel' && (
        <div className="bg-zinc-600 dark:bg-zinc-700 size-[75px] flex justify-center items-center rounded-full">
          <Hash className="size-12 text-white" />
        </div>
      )}
      <p className="text-xl md:text-3xl font-bold ">
        Welcome to {type === 'channel' ? `#${name}` : name}
      </p>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {type === 'channel'
          ? `This is the start of the #${name} channel.`
          : `This is the start of your conversation with ${name}.`}
      </p>
    </div>
  );
}
