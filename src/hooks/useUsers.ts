import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import {
  createUser,
  deleteUsers,
  getMe,
  listUsers,
  updateUserPassword,
} from '@/api';
import {
  CreateUserPayload,
  DeleteUsersPayload,
  UpdateUserPasswordPayload,
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

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const {
    auth: { accessToken },
  } = useAuth();

  const mutation = useMutation({
    mutationKey: ['users.create'],
    mutationFn: (payload: CreateUserPayload) =>
      createUser(payload, accessToken),
    onSuccess: async () => {
      toast.success('User created successfully');
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
    mutationKey: ['users.delete'],
    mutationFn: (payload: DeleteUsersPayload) =>
      deleteUsers(payload, accessToken),
    onSuccess: async () => {
      toast.success('User deleted successfully');
      await queryClient.invalidateQueries({
        queryKey: ['users.list'],
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
      updateUserPassword(payload, accessToken),
    onSuccess: async () => {
      toast.success('Password updated successfully');
    },
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
