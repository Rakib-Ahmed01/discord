import { create } from 'zustand';

export type ModalType = 'createServer' | 'inviteMember' | null;

// export type ModalData = { type: 'createServer' } | { type: 'inviteMember', data: { server: Server } }

export type ModalData = {
  server?: {
    id: string;
    inviteCode: string;
  };
};

type ModalState = {
  type: ModalType;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data: ModalData) => void;
  onClose: () => void;
};

export const useModal = create<ModalState>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type, data) => set({ type, isOpen: true, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
