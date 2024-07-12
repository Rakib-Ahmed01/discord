import { create } from 'zustand';

export type ModalType = 'createServer' | null;

type ModalState = {
  type: ModalType;
  isOpen: boolean;
  onOpen: (type: ModalType) => void;
  onClose: () => void;
};

export const useModal = create<ModalState>((set) => ({
  type: null,
  isOpen: false,
  onOpen: (type) => set({ type, isOpen: true }),
  onClose: () => set({ type: null, isOpen: false }),
}));
