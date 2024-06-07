import { useInfiniteQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { listLogs } from '@/api';
import { ListLogsData, Role } from '@/types';

export const useListLogs = () => {
  const {
    auth: { accessToken, user },
  } = useAuth();

  const infiniteQuery = useInfiniteQuery({
    queryKey: ['logs.list'],
    queryFn: ({ pageParam = 0 }: { pageParam: number }) =>
      listLogs({ pageParam }, accessToken),
    getNextPageParam: (lastPage: ListLogsData, _pages) => lastPage.nextCursor,
    initialPageParam: 0,
    enabled: user?.role === Role.ADMIN,
  });

  return infiniteQuery;
};
