import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

export type AuthValue = {
  isError: string | null;
  setIsError: Dispatch<SetStateAction<string | null>>;
  isSuccess: string | null;
  setIsSuccess: Dispatch<SetStateAction<string | null>>;
};

export const AuthContext = createContext<AuthValue>({
  isError: null,
  setIsError: () => null,
  isSuccess: null,
  setIsSuccess: () => null,
});

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [isError, setIsError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<string | null>(null);

  return (
    <AuthContext.Provider
      value={{
        isError,
        setIsError,
        isSuccess,
        setIsSuccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
