import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistLogin } from './components/PersistLogin';
import { AuthProvider } from './contexts';
import { Toaster } from 'react-hot-toast';
import { handleError } from './lib/utils';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
    mutations: {
      onError: handleError,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <PersistLogin>
            <Toaster
              position="top-center"
              reverseOrder={false}
              containerClassName="z-[99999]"
            />
            <App />
          </PersistLogin>
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
