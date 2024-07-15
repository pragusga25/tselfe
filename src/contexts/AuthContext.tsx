import { getMe } from '@/api';
import { User } from '@/types';
// import { AxiosError } from 'axios';
// import toast from 'react-hot-toast';
import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from 'react';

export type Auth = {
  accessToken?: string;
  user?: User;
};

type AuthContextType = {
  auth: Auth;
  setAuth: Dispatch<SetStateAction<Auth>>;
  isLoggedIn: boolean;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export const AuthContext = createContext<AuthContextType>({
  auth: {},
  setAuth: () => {},
  isLoggedIn: false,
  isLoading: false,
  setIsLoading: () => {},
});

export const AuthProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [auth, setAuth] = useState<Auth>({});
  const [isLoading, setIsLoading] = useState(true);
  const isLoggedIn = !!auth.user;

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setIsLoading(false);
      setAuth({});
      return;
    }

    getMe(accessToken)
      .then((user) => {
        setAuth({ accessToken, user });
      })
      .catch((_err) => {
        setAuth({});
        localStorage.removeItem('accessToken');
        window.location.replace('/login');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        isLoggedIn,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
