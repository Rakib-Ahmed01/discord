'use client';

import { useEffect, useState } from 'react';
import { useModal } from '../../hooks/use-modal-store';
import CreateServerModal from '../modals/create-server-modal';
import InviteMemberModal from '../modals/invite-member-modal';

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
    case 'inviteMember':
      return <InviteMemberModal />;
    default:
      return null;
  }
}
