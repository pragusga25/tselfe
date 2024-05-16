import { User } from '@/types';
import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
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
  // isLoading: boolean;
  // setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export const AuthContext = createContext<AuthContextType>({
  auth: {},
  setAuth: () => {},
  isLoggedIn: false,
  // isLoading: false,
  // setIsLoading: () => {},
});

export const AuthProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [auth, setAuth] = useState<Auth>({});
  // const [isLoading, setIsLoading] = useState(true);
  const isLoggedIn = !!auth.accessToken;

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        isLoggedIn,

        // isLoading, setIsLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
