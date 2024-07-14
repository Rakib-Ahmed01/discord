'use client';

import { useEffect, useState } from 'react';
import { useModal } from '../../hooks/use-modal-store';
import CreateServerModal from '../modals/create-server-modal';
import EditServerModal from '../modals/edit-server-modal';
import InviteMemberModal from '../modals/invite-member-modal';
import ManageMembersModal from '../modals/manage-members-modal';

export default function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);
  const { modalTypeAndData } = useModal();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  switch (modalTypeAndData.type) {
    case 'createServer':
      return <CreateServerModal />;
    case 'inviteMember':
      return <InviteMemberModal />;
    case 'editServer':
      return <EditServerModal />;
    case 'manageMembers':
      return <ManageMembersModal />;
    default:
      return null;
  }
}
