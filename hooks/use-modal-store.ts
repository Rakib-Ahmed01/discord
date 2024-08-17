import { ServerWithChannelsAndMembersWithProfiles } from '@/types';
import { Server } from '@prisma/client';
import { create } from 'zustand';

export type ModalTypeAndData =
  | { type: null }
  | { type: 'createServer' }
  | {
      type: 'inviteMember';
      data: {
        server: {
          id: string;
          inviteCode: string;
        };
      };
    }
  | { type: 'editServer'; data: { server: Server } }
  | {
      type: 'manageMembers';
      data: { server: ServerWithChannelsAndMembersWithProfiles };
    }
  | {
      type: 'createChannel';
      data: { server: ServerWithChannelsAndMembersWithProfiles };
    }
  | { type: 'leaveServer'; data: { server: Server } }
  | { type: 'deleteServer'; data: { server: Server } };

type ModalState = {
  modalTypeAndData: ModalTypeAndData;
  isOpen: boolean;
  onOpen: (modalmodalTypeAndData: ModalTypeAndData) => void;
  onClose: () => void;
};

export const useModal = create<ModalState>((set) => ({
  isOpen: false,
  modalTypeAndData: { type: null },
  onOpen: (modalTypeAndData) => set({ isOpen: true, modalTypeAndData }),
  onClose: () => set({ isOpen: false, modalTypeAndData: { type: null } }),
}));
