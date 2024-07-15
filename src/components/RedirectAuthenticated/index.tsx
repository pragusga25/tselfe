import { useAuth } from '@/hooks';
import { useEffect } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';

export const RedirectAuthenticated = () => {
  const [searchParams] = useSearchParams();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) return;

    if (searchParams.has('redirect')) {
      const redirect = searchParams.get('redirect');
      if (redirect) {
        window.location.replace(redirect);
      }
    } else window.location.href = '/';
  }, [isLoggedIn]);

  if (
    // isLoading

    // ||
    isLoggedIn
  )
    return null;

  return <Outlet />;
};
