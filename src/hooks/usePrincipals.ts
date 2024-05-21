import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import {
  createPrincipal,
  createPrincipalGroup,
  createPrincipalUser,
  deletePrincipal,
  listAwsAccounts,
  listPrincipalGroups,
  listPrincipalUsers,
  listPrincipals,
  listPrincipalsNotInDb,
  updatePrincipal,
  updatePrincipalGroup,
  updatePrincipalUser,
} from '@/api';
import {
  CreatePrincipalGroupPayload,
  CreatePrincipalPayload,
  CreatePrincipalUserPayload,
  DeletePrincipalPayload,
  Role,
  UpdatePrincipalGroupPayload,
  UpdatePrincipalPayload,
  UpdatePrincipalUserPayload,
} from '@/types';
import toast from 'react-hot-toast';
import { ChangeEvent, useMemo, useState } from 'react';

// const invalidatePrincipals = async() => {
//   const queryClient = useQueryClient();
//   await queryClient.invalidateQueries({
//     queryKey: ['principals.list'],
//   });
//   await queryClient.invalidateQueries({
//     queryKey: ['principals.groups.list'],
//   });
//   await queryClient.invalidateQueries({
//     queryKey: ['principals.users.list'],
//   });
// }

export const useListPrincipals = () => {
  const {
    auth: { accessToken, user },
  } = useAuth();

  const query = useQuery({
    queryKey: ['principals.list'],
    queryFn: () => listPrincipals(accessToken),
    enabled: user?.role === Role.ADMIN,
  });

  return query;
};

export const useListAwsAccounts = () => {
  const {
    auth: { accessToken, user },
  } = useAuth();

  const query = useQuery({
    queryKey: ['aws-accounts.list'],
    queryFn: () => listAwsAccounts(accessToken),
    enabled: user?.role === Role.ADMIN,
  });

  return query;
};

export const useListPrincipalGroups = () => {
  const {
    auth: { accessToken },
  } = useAuth();

  const query = useQuery({
    queryKey: ['principals.groups.list'],
    queryFn: () => listPrincipalGroups(accessToken),
  });

  const [search, setSearch] = useState('');

  const searchResult = useMemo(() => {
    return query.data?.filter(({ displayName, description }) => {
      const displayNameLower = displayName.toLowerCase();
      const searchLower = search.toLowerCase();
      const descriptionLower = description?.toLowerCase();

      return (
        displayNameLower.includes(searchLower) ||
        descriptionLower?.includes(searchLower)
      );
    });
  }, [query.data, search]);

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return { ...query, searchResult, onSearch, search };
};

export const useListPrincipalUsers = () => {
  const {
    auth: { accessToken },
  } = useAuth();

  const query = useQuery({
    queryKey: ['principals.users.list'],
    queryFn: () => listPrincipalUsers(accessToken),
  });

  const [search, setSearch] = useState('');

  const searchResult = useMemo(() => {
    return query.data?.filter(
      ({ displayName, name: { familyName, givenName }, username }) => {
        const displayNameLower = displayName.toLowerCase();
        const familyNameLower = familyName.toLowerCase();
        const givenNameLower = givenName.toLowerCase();
        const usernameLower = username.toLowerCase();
        const searchLower = search.toLowerCase();

        return (
          displayNameLower.includes(searchLower) ||
          familyNameLower.includes(searchLower) ||
          givenNameLower.includes(searchLower) ||
          usernameLower.includes(searchLower)
        );
      }
    );
  }, [query.data, search]);

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return { ...query, searchResult, onSearch, search };
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
      await queryClient.invalidateQueries({
        queryKey: ['principals.groups.list'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['principals.users.list'],
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
      await queryClient.invalidateQueries({
        queryKey: ['principals.groups.list'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['principals.users.list'],
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
      await queryClient.invalidateQueries({
        queryKey: ['principals.groups.list'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['principals.users.list'],
      });
    },
  });

  return mutation;
};

export const useUpdatePrincipalGroup = () => {
  const queryClient = useQueryClient();
  const {
    auth: { accessToken },
  } = useAuth();

  const mutation = useMutation({
    mutationFn: (payload: UpdatePrincipalGroupPayload) =>
      toast.promise(updatePrincipalGroup(payload, accessToken), {
        loading: 'Updating principal...',
        success: 'Principal updated successfully',
        error: 'Error updating principal',
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['principals.groups.list'],
      });
    },
  });

  return mutation;
};

export const useUpdatePrincipalUser = () => {
  const queryClient = useQueryClient();
  const {
    auth: { accessToken },
  } = useAuth();

  const mutation = useMutation({
    mutationFn: (payload: UpdatePrincipalUserPayload) =>
      toast.promise(updatePrincipalUser(payload, accessToken), {
        loading: 'Updating principal...',
        success: 'Principal updated successfully',
        error: 'Error updating principal',
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['principals.users.list'],
      });
    },
  });

  return mutation;
};

export const useCreatePrincipalGroup = () => {
  const queryClient = useQueryClient();
  const {
    auth: { accessToken },
  } = useAuth();

  const mutation = useMutation({
    mutationFn: (payload: CreatePrincipalGroupPayload) =>
      toast.promise(createPrincipalGroup(payload, accessToken), {
        loading: 'Updating group...',
        success: 'Group created successfully',
        error: 'Error updating grouping',
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['principals.groups.list'],
      });
    },
  });

  return mutation;
};

export const useCreatePrincipalUser = () => {
  const queryClient = useQueryClient();
  const {
    auth: { accessToken },
  } = useAuth();

  const mutation = useMutation({
    mutationFn: (payload: CreatePrincipalUserPayload) =>
      toast.promise(createPrincipalUser(payload, accessToken), {
        loading: 'Updating user...',
        success: 'User created successfully',
        error: 'Error updating user',
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['principals.users.list'],
      });
    },
  });

  return mutation;
};
