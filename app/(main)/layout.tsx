import NavigationSidebar from '@/components/navigation/navigation-sidebar';
import React from 'react';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <div className="hidden sm:flex flex-col w-20 fixed inset-y-0">
        <NavigationSidebar />
      </div>
      <main className="sm:pl-20 h-full">{children}</main>
    </div>
  );
}
