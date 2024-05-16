import { useAuth } from '@/hooks';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

export const RedirectAuthenticated = () => {
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    if (isLoggedIn && !isLoading) {
      window.location.href = '/';
    }
  }, [isLoggedIn]);

  if (isLoading || isLoggedIn) return null;

  return <Outlet />;
};
