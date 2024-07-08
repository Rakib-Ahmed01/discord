import { Button } from '@/components/ui/button';
import { SignOutButton, UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default function Home() {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="p-4 flex flex-col">
      <UserButton afterSwitchSessionUrl="/" />
      <SignOutButton>
        <Button>Sign Out</Button>
      </SignOutButton>
      <p>This is a protected route</p>
      <Button variant={'destructive'}>Get out of here</Button>
    </div>
  );
}
