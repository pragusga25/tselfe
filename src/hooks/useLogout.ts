import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks';

import { apiPrivate } from '@/api';

export const useLogout = () => {
  const {
    setAuth,
    // , setIsLoading
  } = useAuth();
  const queryClient = useQueryClient();

  const logout = async () => {
    try {
      // setIsLoading(true);
      await apiPrivate.get('/auth.logout', {
        withCredentials: true,
      });
    } catch {
      // we don't care about the error
      // we dont't want the user stuck in the app
    } finally {
      setAuth({});
      queryClient.clear();
      // setIsLoading(false);
      window.location.replace('/login');
    }
  };

  return logout;
};
