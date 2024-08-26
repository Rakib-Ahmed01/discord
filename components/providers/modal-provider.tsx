'use client';

import { useEffect, useState } from 'react';
import { useModal } from '../../hooks/use-modal-store';
import CreateChannelModal from '../modals/create-channel-modal';
import CreateServerModal from '../modals/create-server-modal';
import DeleteChannelModal from '../modals/delete-channel-modal';
import DeleteServerModal from '../modals/delete-server-modal';
import EditChannelModal from '../modals/edit-channel-modal';
import EditServerModal from '../modals/edit-server-modal';
import InviteMemberModal from '../modals/invite-member-modal';
import LeaveServerModal from '../modals/leave-server-modal';
import ManageMembersModal from '../modals/manage-members-modal';
import SendFileModal from '../modals/send-file-modal';

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
    case 'createChannel':
      return <CreateChannelModal />;
    case 'leaveServer':
      return <LeaveServerModal />;
    case 'deleteServer':
      return <DeleteServerModal />;
    case 'editChannel':
      return <EditChannelModal />;
    case 'deleteChannel':
      return <DeleteChannelModal />;
    case 'sendFile':
      return <SendFileModal />;
    default:
      return null;
  }
}
