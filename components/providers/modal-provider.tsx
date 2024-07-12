'use client';

import { useEffect, useState } from 'react';
import CreateServerModal from '../modals/create-server-modal';
import { useModal } from '../modals/use-modal-store';

export default function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);
  const { type } = useModal();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  switch (type) {
    case 'createServer':
      return <CreateServerModal />;
    default:
      return null;
  }
}
