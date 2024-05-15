import { useAuth } from '@/hooks';
import { Navbar } from './Navbar';
import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';

export const Layout = () => {
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoggedIn && !isLoading) {
      window.location.replace('/login');
    }
  }, [isLoggedIn]);

  if (isLoading || !isLoggedIn) return null;

  return (
    <>
      <Navbar />
      <main className="max-w-7xl px-6 pt-4 flex flex-col w-full h-full mx-auto  flex-1">
        <Outlet />
      </main>
    </>
  );
};
