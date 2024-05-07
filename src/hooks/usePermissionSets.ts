import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { listMyPermissionSets, listPermissionSets } from '@/api';

export const useListPermissionSets = () => {
  const {
    auth: { accessToken },
  } = useAuth();

  const query = useQuery({
    queryKey: ['permission-sets.list'],
    queryFn: () => listPermissionSets(accessToken),
  });

  return query;
};

export const useMyListPermissionSets = () => {
  const {
    auth: { accessToken },
  } = useAuth();

  const query = useQuery({
    queryKey: ['permission-sets.my-list'],
    queryFn: () => listMyPermissionSets(accessToken),
  });

  return query;
};
