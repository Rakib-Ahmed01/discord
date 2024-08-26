'use client';

import { useSocket } from './providers/socket-provider';
import { Badge } from './ui/badge';

export default function SocketIndicator() {
  const { connected } = useSocket();

  if (!connected) {
    return (
      <Badge
        variant={'outline'}
        className="border-none bg-yellow-600 text-white"
      >
        Fallback: Polling every 1s
      </Badge>
    );
  }

  return (
    <Badge variant={'outline'} className="bg-emerald-600 border-none">
      Live: Real-time updates
    </Badge>
  );
}
