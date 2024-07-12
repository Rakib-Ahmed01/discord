import { create } from 'zustand';

// export type ModalType = 'createServer' | 'inviteMember' | 'editServer' | null;

export type ModalmodalTypeAndData =
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
  | { type: null };

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
