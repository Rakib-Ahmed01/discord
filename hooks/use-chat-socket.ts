import { useSocket } from '@/components/providers/socket-provider';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

type Props = {
  key: string;
  queryKey: string;
};

export default function useChatSocket({ key, queryKey }: Props) {
  const { socket } = useSocket();
  const client = useQueryClient();

  useEffect(() => {
    socket?.on(key, (value: any) => {
      client.invalidateQueries({ queryKey: [queryKey] });
    });

    return () => {
      socket?.off(key);
    };
  }, [socket, key, queryKey, client]);
}
