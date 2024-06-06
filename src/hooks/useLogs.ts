import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { listLogs } from '@/api';
import { Role } from '@/types';

export const useListLogs = () => {
  const {
    auth: { accessToken, user },
  } = useAuth();

  const query = useQuery({
    queryKey: ['logs.list'],
    queryFn: () => listLogs(accessToken),
    enabled: user?.role === Role.ADMIN,
  });

  return query;
};
