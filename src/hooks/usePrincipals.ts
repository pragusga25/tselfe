import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import {
  createPrincipal,
  deletePrincipal,
  listPrincipals,
  listPrincipalsNotInDb,
  updatePrincipal,
} from '@/api';
import {
  CreatePrincipalPayload,
  DeletePrincipalPayload,
  Role,
  UpdatePrincipalPayload,
} from '@/types';
import toast from 'react-hot-toast';

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

export const useListPrincipalsNotInDb = () => {
  const {
    auth: { accessToken, user },
  } = useAuth();

  const query = useQuery({
    queryKey: ['principals.list-not-in-db'],
    queryFn: () => listPrincipalsNotInDb(accessToken),
    enabled: user?.role === Role.ADMIN,
  });

  return query;
};

export const useCreatePrincipal = () => {
  const queryClient = useQueryClient();
  const {
    auth: { accessToken },
  } = useAuth();

  const mutation = useMutation({
    mutationFn: (payload: CreatePrincipalPayload) =>
      toast.promise(createPrincipal(payload, accessToken), {
        loading: 'Creating principal...',
        success: 'Principal created successfully',
        error: 'Error creating principal',
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['principals.list'],
      });
    },
  });

  return mutation;
};

export const useUpdatePrincipal = () => {
  const queryClient = useQueryClient();
  const {
    auth: { accessToken },
  } = useAuth();

  const mutation = useMutation({
    mutationFn: (payload: UpdatePrincipalPayload) =>
      toast.promise(updatePrincipal(payload, accessToken), {
        loading: 'Updating principal...',
        success: 'Principal updated successfully',
        error: 'Error updating principal',
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['principals.list'],
      });
    },
  });

  return mutation;
};

export const useDeletePrincipal = () => {
  const queryClient = useQueryClient();
  const {
    auth: { accessToken },
  } = useAuth();

  const mutation = useMutation({
    mutationFn: (payload: DeletePrincipalPayload) =>
      toast.promise(deletePrincipal(payload, accessToken), {
        loading: 'Deleting principal...',
        success: 'Principal deleted successfully',
        error: 'Error deleting principal',
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['principals.list'],
      });
    },
  });

  return mutation;
};
