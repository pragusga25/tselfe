import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LoginPayload } from '@/types';
import { login } from '@/api';
import { useAuth } from '@/hooks';

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
      queryClient.clear();
      window.location.replace('/');
      setIsLoading(false);
    },
  });

  return mutation;
};
