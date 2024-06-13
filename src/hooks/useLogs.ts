import { useInfiniteQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { listLogs } from '@/api';
import { ListLogsData, Role } from '@/types';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useListLogs = () => {
  const {
    auth: { accessToken, user },
  } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();

  const [time, setTime] = useState<{ from?: string; to?: string }>({
    from: '',
    to: '',
  });

  const onChangeTime = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setTime((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (value) {
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        [name]: new Date(value).getTime().toString(),
      });
    }
  };

  const infiniteQuery = useInfiniteQuery({
    queryKey: ['logs.list', time.from, time.to],
    queryFn: ({ pageParam = 0 }: { pageParam: number }) =>
      listLogs(
        {
          pageParam,
          from: time.from ? new Date(time.from).getTime() : undefined,
          to: time.to ? new Date(time.to).getTime() : undefined,
        },
        accessToken
      ),
    getNextPageParam: (lastPage: ListLogsData, _pages) => lastPage.nextCursor,
    initialPageParam: 0,
    enabled: user?.role === Role.ADMIN,
  });

  const onFilterTime = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { refetch } = infiniteQuery;
    await refetch();
  };

  const resetFilterTime = () => {
    setTime({ from: '', to: '' });
  };

  return {
    ...infiniteQuery,
    onChangeTime,
    onFilterTime,
    time,
    resetFilterTime,
  };
};
