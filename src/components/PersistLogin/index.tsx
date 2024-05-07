import { usePersistLogin } from '@/hooks';
import { FC, ReactNode } from 'react';
import { PersistLoginLoader } from './Loader';

type PersistLoginProps = {
  children: ReactNode;
};

export const PersistLogin: FC<PersistLoginProps> = ({ children }) => {
  const { isLoading } = usePersistLogin();

  if (isLoading) return <PersistLoginLoader />;

  return children;
};
