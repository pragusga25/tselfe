import { useAuth } from '@/hooks';

export const useLogout = () => {
  const { setAuth } = useAuth();

  const logout = async () => {
    localStorage.removeItem('accessToken');
    window.location.replace('/login');
    setAuth({});
  };

  return logout;
};
