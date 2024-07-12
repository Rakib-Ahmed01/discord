import currentProfile from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

import { UserButton } from '@clerk/nextjs';
import { ToggleTheme } from '../toggle-theme';
import { Separator } from '../ui/separator';
import AddServerButton from './add-server-button';
import SidebarServerList from './sidebar-server-list';

export default async function NavigationSidebar() {
  const profile = await currentProfile();

  if (!profile) {
    redirect('/');
  }

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return (
    <div
      id="sidebar"
      className=" dark:bg-darkish h-full w-full flex flex-col items-center space-y-4 text-primary py-3"
    >
      <AddServerButton />
      <Separator className="h-[2px] w-10 rounded-full bg-zinc-300 dark:bg-zinc-700 mx-auto" />
      <SidebarServerList servers={servers} />
      <div
        className="flex flex-col gap-4 items-center"
        style={{ marginTop: 'auto' }}
      >
        <ToggleTheme />
        <UserButton
          appearance={{
            elements: {
              avatarBox: 'h-12 w-12',
            },
          }}
        />
      </div>
    </div>
  );
}
