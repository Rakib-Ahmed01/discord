import ServerSidebar from '@/components/server/server-sidebar';
import currentProfile from '@/lib/current-profile';
import { getServerByIdAndProfileId } from '@/lib/utils';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function ServerPageLayout({
  children,
  params: { serverId },
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) {
  const profile = await currentProfile();

  if (!profile) {
    return auth().redirectToSignIn();
  }

  const server = await getServerByIdAndProfileId(serverId, profile.id);

  if (!server) {
    return redirect('/');
  }

  return (
    <div className="h-full">
      <div className="hidden md:flex flex-col h-full w-60 fixed inset-y-0">
        <ServerSidebar serverId={server.id} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
}
