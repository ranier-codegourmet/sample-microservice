import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

export type IUser = {
  id: string | null;
  walletId: string | null;
};

export type UserValue = {
  user: IUser | null;
  setUser: Dispatch<SetStateAction<IUser>>;
};

export const UserContext = createContext<UserValue>({
  user: null,
  setUser: () => ({ id: null, walletId: null }),
});

type AuthProviderProps = {
  children: ReactNode;
};

const UserProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser>({ id: null, walletId: null });

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
