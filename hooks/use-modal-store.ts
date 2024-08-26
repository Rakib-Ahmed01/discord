import { ServerWithChannelsAndMembersWithProfiles } from '@/types';
import { Channel, ChannelType, Server } from '@prisma/client';
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
      data: {
        server: ServerWithChannelsAndMembersWithProfiles;
        type: ChannelType;
      };
    }
  | { type: 'leaveServer'; data: { server: Server } }
  | { type: 'deleteServer'; data: { server: Server } }
  | {
      type: 'editChannel';
      data: {
        server: ServerWithChannelsAndMembersWithProfiles;
        channel: Channel;
      };
    }
  | {
      type: 'deleteChannel';
      data: { channel: Channel; server: Server };
    }
  | {
      type: 'sendFile';
      data: {
        type: 'channel' | 'conversation';
        name: string;
        apiUrl: string;
        query: Record<string, any>;
      };
    };

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
