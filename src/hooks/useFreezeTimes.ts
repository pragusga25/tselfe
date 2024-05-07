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
      createFreezeTime(data, accessToken),
    mutationKey: ['freeze-times.create'],
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['freeze-times.list'],
      });
      toast.success('Freeze time created successfully');
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
      deleteFreezeTimes(data, accessToken),
    mutationKey: ['freeze-times.create'],
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['freeze-times.list'],
      });
      toast.success('Freeze time deleted successfully');
    },
  });

  return mutation;
};
