import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LoginPayload } from '@/types';
import { login } from '@/api';
import { useAuth } from '@/hooks';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

export const useLogin = () => {
  const { setAuth, setIsLoading } = useAuth();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: LoginPayload) => {
      setIsLoading(true);
      return login(payload);
    },

    onSuccess: (data) => {
      setAuth(data);
      localStorage.setItem('accessToken', data.accessToken);
      queryClient.clear();
      window.location.replace('/');
      setIsLoading(false);
      toast.success('Login successful');
    },
    onError: (err) => {
      setIsLoading(false);
      if (err instanceof AxiosError) {
        const errorDetails = err.response?.data?.error?.details?.[0];

        if (errorDetails) {
          toast.error(errorDetails);
          return;
        }
      }

      toast.error('An error occurred. Please try again.');
    },
  });

  return mutation;
};
