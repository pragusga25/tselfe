import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LoginPayload } from '@/types';
import { login } from '@/api';
import { useAuth } from '@/hooks';
import toast from 'react-hot-toast';

export const useLogin = () => {
  const { setAuth, setIsLoading } = useAuth();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: LoginPayload) => {
      setIsLoading(true);
      return login(payload);
    },
    onMutate: () => {
      toast.loading('Logging in...');
    },
    onSuccess: (data) => {
      setAuth(data);
      localStorage.setItem('accessToken', data.accessToken);
      queryClient.clear();
      window.location.replace('/');
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  return mutation;
};
