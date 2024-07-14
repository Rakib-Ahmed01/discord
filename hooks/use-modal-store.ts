import { ServerWithChannelsAndMembersWithProfiles } from '@/types';
import { Server } from '@prisma/client';
import { create } from 'zustand';

export type ModalmodalTypeAndData =
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
    };

type ModalState = {
  modalTypeAndData: ModalmodalTypeAndData;
  isOpen: boolean;
  onOpen: (modalmodalTypeAndData: ModalmodalTypeAndData) => void;
  onClose: () => void;
};

export const useModal = create<ModalState>((set) => ({
  isOpen: false,
  modalTypeAndData: { type: null },
  onOpen: (modalTypeAndData) => set({ isOpen: true, modalTypeAndData }),
  onClose: () => set({ isOpen: false, modalTypeAndData: { type: null } }),
}));
