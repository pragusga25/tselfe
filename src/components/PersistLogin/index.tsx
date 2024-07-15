import { useAuth } from '@/hooks';
import { FC, ReactNode, useEffect } from 'react';
import { PersistLoginLoader } from './Loader';

type PersistLoginProps = {
  children: ReactNode;
};

export const PersistLogin: FC<PersistLoginProps> = ({ children }) => {
  const { isLoading, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn && !isLoading) {
      const { pathname, search } = window.location;
      window.location.replace(
        `/login?redirect=${encodeURIComponent(`${pathname}${search}`)}`
      );
    }
  }, [isLoggedIn, isLoading]);

  if (isLoading) return <PersistLoginLoader />;
  if (!isLoggedIn) return null;

  return children;
};
