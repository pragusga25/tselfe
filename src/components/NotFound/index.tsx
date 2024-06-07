import { useEffect } from 'react';

export const NotFound = () => {
  useEffect(() => {
    setTimeout(() => {
      window.location.replace('/');
    }, 2000);
  }, []);
  return (
    <div className="h-screen w-screen flex justify-center items-center px-8">
      <h1>
        You are not supposed to be here. You will be redirected to the home
        page.
      </h1>
    </div>
  );
};
