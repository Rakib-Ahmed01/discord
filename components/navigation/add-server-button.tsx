'use client';

import { Plus } from 'lucide-react';
import { useModal } from '../../hooks/use-modal-store';
import ActionTooltip from '../action-tooltip';

export default function AddServerButton() {
  const { onOpen } = useModal();

  const handleOpen = () => {
    onOpen({ type: 'createServer' });
  };

  return (
    <ActionTooltip side="right" align="start" label="Add a server">
      <button
        onClick={handleOpen}
        className="group flex justify-center items-center text-emerald-500 bg-grayish rounded-[28px] hover:rounded-[20px] w-14 h-14 hover:bg-emerald-400 transition-all"
      >
        <Plus className="group-hover:text-primary" />
      </button>
    </ActionTooltip>
  );
}
