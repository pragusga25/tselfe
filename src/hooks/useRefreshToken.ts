import { apiPrivate } from '@/api';
import { AxiosError } from 'axios';
import { useLogout, useAuth } from '@/hooks';

export const useRefreshToken = () => {
  const { setAuth, setIsLoading } = useAuth();
  const logout = useLogout();

  const refresh = async () => {
    try {
      setIsLoading(true);
      const response = await apiPrivate.get('/auth.refresh');
      setAuth((prev) => {
        return {
          ...prev,
          accessToken: response.data.result.accessToken,
          user: response.data.result.user,
        };
      });
      setIsLoading(false);
      return response.data.result.accessToken;
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        if (
          error.response?.status === 401 &&
          error.response.data?.error?.code === 'auth/refresh-token-expired'
        ) {
          // await logout();
          console.log('error.response: ', error.response);
        }
      }
      setIsLoading(false);
    }
  };
  return refresh;
};
