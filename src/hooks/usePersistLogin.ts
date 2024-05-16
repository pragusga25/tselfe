import { useEffect, useState } from 'react';
import { useAuth, useRefreshToken } from '@/hooks';
import { useLocation } from 'react-router-dom';

export const usePersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { pathname } = useLocation();
  const { auth } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const isLogout = pathname.includes('logout');

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    // Avoids unwanted call to verifyRefreshToken
    !auth?.accessToken && !isLogout
      ? verifyRefreshToken()
      : setIsLoading(false);

    return () => {
      isMounted = false;
    };
  }, []);

  return { isLoading };
};
