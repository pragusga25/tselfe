import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { listPrincipals } from '@/api';

export const useListPrincipals = () => {
  const {
    auth: { accessToken },
  } = useAuth();

  const query = useQuery({
    queryKey: ['principals.list'],
    queryFn: () => listPrincipals(accessToken),
  });

  return query;
};
