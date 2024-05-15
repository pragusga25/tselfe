import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { listMyPermissionSets, listPermissionSets } from '@/api';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { useMemo } from 'react';
import { Role } from '@/types';

export const useListPermissionSets = () => {
  const {
    auth: { accessToken, user },
  } = useAuth();

  const query = useQuery({
    queryKey: ['permission-sets.list'],
    queryFn: () => listPermissionSets(accessToken),
    enabled: !!accessToken,
  });

  const errorMemo = useMemo(() => query.error, [query.error]);

  if (errorMemo instanceof AxiosError) {
    const errorCode = errorMemo.response?.data.error?.code;
    if (
      errorCode === 'aws-identity/identity-instance-not-found' &&
      user?.role === Role.ADMIN
    ) {
      toast.error('Please enter identity instance ID in settings', {
        duration: 3000,
      });

      setTimeout(() => {
        window.location.replace('/settings');
      }, 3000);
    }
  }

  return query;
};

export const useMyListPermissionSets = () => {
  const {
    auth: { accessToken },
  } = useAuth();

  const query = useQuery({
    queryKey: ['permission-sets.my-list'],
    queryFn: () => listMyPermissionSets(accessToken),
    enabled: !!accessToken,
  });

  const errorMemo = useMemo(() => query.error, [query.error]);

  if (errorMemo instanceof AxiosError) {
    const errorCode = errorMemo.response?.data.error?.code;
    if (errorCode === 'aws-identity/identity-instance-not-found') {
      toast.error(
        'Identity instance are not set yet. Please tell your admin to set it up',
        {
          duration: 5000,
        }
      );
    }
  }

  return query;
};
