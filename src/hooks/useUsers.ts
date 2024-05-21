import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import {
  createAccountAdmin,
  createAccountUser,
  createUser,
  deleteUsers,
  getMe,
  listAccountAdmins,
  listAccountUsers,
  listUsers,
  updateAccountUser,
  updateUserPassword,
  updateUserPrincipal,
} from '@/api';
import {
  CreateAccountAdminPayload,
  CreateAccountUserPayload,
  CreateUserPayload,
  DeleteUsersPayload,
  PrincipalType,
  Role,
  UpdateAccountUserPayload,
  UpdateUserPasswordPayload,
  UpdateUserPrincipalPayload,
} from '@/types';
import toast from 'react-hot-toast';
import { ChangeEvent, FormEvent, useState } from 'react';

export const useListUsers = () => {
  const {
    auth: { accessToken },
  } = useAuth();

  const query = useQuery({
    queryKey: ['users.list'],
    queryFn: () => listUsers(accessToken),
  });

  return query;
};

export const useListAccountUsers = () => {
  const {
    auth: { accessToken, user },
  } = useAuth();

  const query = useQuery({
    queryKey: ['users.list'],
    queryFn: () => listAccountUsers(accessToken),
    enabled: user?.role === Role.ADMIN,
  });

  return query;
};

export const useListAccountAdmins = () => {
  const {
    auth: { accessToken, user },
  } = useAuth();

  const query = useQuery({
    queryKey: ['admins.list'],
    queryFn: () => listAccountAdmins(accessToken),
    enabled: user?.role === Role.ADMIN,
  });

  return query;
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const {
    auth: { accessToken },
  } = useAuth();

  const mutation = useMutation({
    mutationKey: ['users.create'],
    mutationFn: (payload: CreateUserPayload) =>
      toast.promise(createUser(payload, accessToken), {
        loading: 'Creating user...',
        success: 'User created successfully',
        error: 'Error creating user',
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['users.list'],
      });
    },
  });

  return mutation;
};

export const useUpdateAccountUser = () => {
  const queryClient = useQueryClient();
  const {
    auth: { accessToken },
  } = useAuth();

  const mutation = useMutation({
    mutationKey: ['users.Update'],
    mutationFn: (payload: UpdateAccountUserPayload) =>
      toast.promise(updateAccountUser(payload, accessToken), {
        loading: 'Updating user...',
        success: 'User updated successfully',
        error: 'Error updating user',
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['users.list'],
      });
    },
  });

  return mutation;
};

export const useDeleteUsers = () => {
  const queryClient = useQueryClient();
  const {
    auth: { accessToken },
  } = useAuth();

  const mutation = useMutation({
    mutationKey: ['accounts.delete'],
    mutationFn: (payload: DeleteUsersPayload) =>
      toast.promise(deleteUsers(payload, accessToken), {
        loading: 'Deleting user...',
        success: 'User deleted successfully',
        error: 'Error deleting user',
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['users.list'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['admins.list'],
      });
    },
  });

  return mutation;
};

export const useMe = () => {
  const {
    auth: { accessToken },
  } = useAuth();

  const query = useQuery({
    queryKey: ['users.me'],
    queryFn: () => getMe(accessToken),
    enabled: !!accessToken,
  });

  return query;
};

export const useUpdateUserPassword = () => {
  const {
    auth: { accessToken },
  } = useAuth();

  const mutation = useMutation({
    mutationKey: ['users.password.update'],
    mutationFn: (payload: UpdateUserPasswordPayload) =>
      toast.promise(updateUserPassword(payload, accessToken), {
        loading: 'Updating password...',
        success: 'Password updated successfully',
        error: 'Error updating password',
      }),
  });

  const {
    isPending: isUpdatingPassword,
    isSuccess: isPasswordUpdated,
    mutate,
  } = mutation;

  const [passwordPayload, setPassworldPayload] = useState({
    oldPassword: '',
    newPassword: '',
  });

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassworldPayload({
      ...passwordPayload,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmitPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(passwordPayload);

    if (isPasswordUpdated) {
      setPassworldPayload({
        oldPassword: '',
        newPassword: '',
      });
    }
  };

  return {
    mutation,
    passwordPayload,
    onChangePassword,
    onSubmitPassword,
    isUpdatingPassword,
    isPasswordUpdated,
  };
};

export const useUpdateUserPrincipal = () => {
  const queryClient = useQueryClient();
  const {
    auth: { accessToken },
  } = useAuth();

  const mutation = useMutation({
    mutationKey: ['users.principal.update'],
    mutationFn: (payload: UpdateUserPrincipalPayload) =>
      toast.promise(updateUserPrincipal(payload, accessToken), {
        loading: 'Updating principal...',
        success: 'Principal updated successfully',
        error: 'Error updating principal',
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['users.list'],
      });
    },
  });

  const {
    isPending: isUpdatingPrincipal,
    isSuccess: isPrincipalUpdated,
    mutate,
  } = mutation;

  const [principalPayload, setPrincipalPayloadPayload] =
    useState<UpdateUserPrincipalPayload>({
      userId: '',
      principalId: '',
      principalType: PrincipalType.GROUP,
    });

  return {
    mutation,
    principalPayload,
    setPrincipalPayloadPayload,
    isUpdatingPrincipal,
    isPrincipalUpdated,
    mutate,
  };
};

export const useCreateAccountUser = () => {
  const queryClient = useQueryClient();
  const {
    auth: { accessToken },
  } = useAuth();

  const mutation = useMutation({
    mutationKey: ['users.create'],
    mutationFn: (payload: CreateAccountUserPayload) =>
      toast.promise(createAccountUser(payload, accessToken), {
        loading: 'Creating user...',
        success: 'User created successfully',
        error: 'Error creating user',
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['users.list'],
      });
    },
  });

  return mutation;
};

export const useCreateAccountAdmin = () => {
  const queryClient = useQueryClient();
  const {
    auth: { accessToken },
  } = useAuth();

  const mutation = useMutation({
    mutationKey: ['admins.create'],
    mutationFn: (payload: CreateAccountAdminPayload) =>
      toast.promise(createAccountAdmin(payload, accessToken), {
        loading: 'Creating admin...',
        success: 'Admin created successfully',
        error: 'Error creating admin',
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['admins.list'],
      });
    },
  });

  return mutation;
};
