import CreateServerModal from '@/components/modals/create-server-modal';
import getOrCreateProfile from '@/lib/initial-profile';
import { getServersByProfileId } from '@/lib/utils';
import { redirect } from 'next/navigation';

export default async function SetupPage() {
  const profile = await getOrCreateProfile();

  const servers = await getServersByProfileId(profile.id);

  if (servers && servers.length > 0) {
    redirect(`/servers/${servers[0].id}`);
  }

  return (
    <div>
      <CreateServerModal />
    </div>
  );
}
