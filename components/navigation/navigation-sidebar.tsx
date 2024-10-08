import currentProfile from '@/lib/current-profile';
import { redirect } from 'next/navigation';

import { getServersByProfileId } from '@/lib/utils';
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

  const servers = await getServersByProfileId(profile.id);

  return (
    <div
      id="sidebar"
      className="bg-[#e3e5e8] dark:bg-darkish h-full w-full flex flex-col items-center space-y-4 text-primary py-3 isolate"
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
              avatarBox: 'size-11',
            },
          }}
        />
      </div>
    </div>
  );
}
