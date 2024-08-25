import { Hash, User } from 'lucide-react';
import NavigationSidebar from '../navigation/navigation-sidebar';
import ServerSidebar from '../server/server-sidebar';
import MobileMenu from './mobile-menu';

type Props = {
  serverId: string;
  name: string;
  type: 'channel' | 'conversation';
  imageUrl?: string;
};

const iconMap: Record<Props['type'], any> = {
  channel: Hash,
  conversation: User,
};

export default function ChatHeader({ name, serverId, type, imageUrl }: Props) {
  const Icon = iconMap[type];

  return (
    <div className="text-md font-semibold p-3 flex items-center gap-2 border-zinc-200 dark:border-zinc-800 border-b-[1px] hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition ">
      <MobileMenu
        navigationSidebar={<NavigationSidebar />}
        serverSiderbar={<ServerSidebar serverId={serverId} />}
      />

      <span className="inline-flex items-center gap-[1px]">
        <Icon className="size-4 text-zinc-500 dark:text-zinc-400" />
        {name}
      </span>
    </div>
  );
}