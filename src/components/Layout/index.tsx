import { Navbar } from './Navbar';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl px-6 pt-4 flex flex-col w-full h-full mx-auto flex-1">
        <Outlet />
      </main>
    </>
  );
};
