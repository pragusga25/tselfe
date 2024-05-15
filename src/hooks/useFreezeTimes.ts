import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { createFreezeTime, deleteFreezeTimes, listFreezeTimes } from '@/api';
import { CreateFreezeTimePayload, DeleteFreezeTimesPayload } from '@/types';
import toast from 'react-hot-toast';

export const useListFreezeTimes = () => {
  const {
    auth: { accessToken },
  } = useAuth();
  const query = useQuery({
    queryKey: ['freeze-times.list'],
    queryFn: () => listFreezeTimes(accessToken),
  });

  return query;
};

export const useCreateFreezeTime = () => {
  const queryClient = useQueryClient();
  const {
    auth: { accessToken },
  } = useAuth();
  const mutation = useMutation({
    mutationFn: (data: CreateFreezeTimePayload) =>
      toast.promise(createFreezeTime(data, accessToken), {
        loading: 'Creating freeze time...',
        success: 'Freeze time created successfully',
        error: 'Error creating freeze time',
      }),
    mutationKey: ['freeze-times.create'],
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['freeze-times.list'],
      });
    },
  });

  return mutation;
};

export const useDeleteFreezeTimes = () => {
  const queryClient = useQueryClient();
  const {
    auth: { accessToken },
  } = useAuth();
  const mutation = useMutation({
    mutationFn: (data: DeleteFreezeTimesPayload) =>
      toast.promise(deleteFreezeTimes(data, accessToken), {
        loading: 'Deleting freeze time...',
        success: 'Freeze time deleted successfully',
        error: 'Error deleting freeze time',
      }),
    mutationKey: ['freeze-times.create'],
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['freeze-times.list'],
      });
    },
  });

  return mutation;
};
