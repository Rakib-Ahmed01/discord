'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import useMediaQuery from '@/hooks/use-media-query';
import { Menu } from 'lucide-react';
import { ReactNode } from 'react';

type Props = {
  navigationSidebar: ReactNode;
  serverSiderbar: ReactNode;
};

export default function MobileMenu({
  navigationSidebar,
  serverSiderbar,
}: Props) {
  const isSmallDevice = useMediaQuery('only screen and (max-width : 768px)');

  if (!isSmallDevice) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side={'left'} className="pl-0 w-[350px]">
        <div className="flex">
          <div className="fixed inset-y-0 z-10">{navigationSidebar}</div>
          <div className="pl-20 fixed inset-y-0 w-[310px]">
            {serverSiderbar}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
