import { useSocket } from '@/components/providers/socket-provider';
import { useInfiniteQuery } from '@tanstack/react-query';
import queryString from 'query-string';
import { useMemo } from 'react';

type Props = {
  apiUrl: string;
  queryKey: string;
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
};

export default function useChatQuery({
  apiUrl,
  queryKey,
  paramKey,
  paramValue,
}: Props) {
  const { connected } = useSocket();

  const fetchMessages = async ({ pageParam = 0 }) => {
    const url = queryString.stringifyUrl({
      url: apiUrl,
      query: {
        cursor: pageParam,
        [paramKey]: paramValue,
      },
    });

    const res = await fetch(url);
    return res.json();
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: fetchMessages,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    refetchInterval: connected ? false : 1000,
  });

  const value = useMemo(
    () => ({
      data,
      error,
      fetchNextPage,
      hasNextPage,
      isFetching,
      isFetchingNextPage,
      status,
    }),
    [
      data,
      error,
      fetchNextPage,
      hasNextPage,
      isFetching,
      isFetchingNextPage,
      status,
    ]
  );

  return value;
}
