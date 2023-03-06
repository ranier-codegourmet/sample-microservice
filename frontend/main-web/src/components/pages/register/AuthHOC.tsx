import { NextComponentType } from "next";

import AuthProvider from "@/context/AuthContext";

interface IHOCProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const AuthHOC = (WrappedComponent: NextComponentType) => {
  const withHOC = (props: IHOCProps) => {
    return (
      <AuthProvider>
        <WrappedComponent {...props} />
      </AuthProvider>
    );
  };

  return withHOC;
};

export default AuthHOC;
