import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import {
  listMyPermissionSets,
  listPermissionSets,
  updatePermissionSet,
} from '@/api';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { ChangeEvent, useMemo, useState } from 'react';
import { Role, UpdatePermissionSetPayload } from '@/types';

export const useListPermissionSets = () => {
  const {
    auth: { accessToken, user },
  } = useAuth();

  const query = useQuery({
    queryKey: ['permission-sets.list'],
    queryFn: () => listPermissionSets(accessToken),
    enabled: !!accessToken,
  });

  const [search, setSearch] = useState('');

  const searchResult = useMemo(() => {
    return query.data?.filter(({ name }) => {
      const searchLower = search.toLowerCase();

      return name?.toLocaleLowerCase().includes(searchLower);
    });
  }, [query.data, search]);

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

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

  return { ...query, searchResult, onSearch, search };
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

export const useUpdatePermissionSet = () => {
  const queryClient = useQueryClient();
  const {
    auth: { accessToken },
  } = useAuth();
  const mutation = useMutation({
    mutationFn: (data: UpdatePermissionSetPayload) =>
      toast.promise(updatePermissionSet(data, accessToken), {
        loading: 'Updating permission set...',
        success: 'Permission set updated successfully',
        error: 'Error updating permission set',
      }),
    mutationKey: ['permission-sets.update'],
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['permission-sets.list'],
      });
    },
  });

  return mutation;
};
