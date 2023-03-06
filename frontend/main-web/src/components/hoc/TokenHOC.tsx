import { NextComponentType } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

import { setHeaders } from "@/api";
import { UserContext } from "@/context/UserContext";
import { LocalStorageKeys } from "@/types/config";

interface IHOCProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const TokenHOC = (WrappedComponent: NextComponentType) => {
  const WithHOC = (props: IHOCProps) => {
    const router = useRouter();

    const { setUser } = useContext(UserContext);

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      const pathname = router.pathname;
      const token = localStorage.getItem(LocalStorageKeys.ACCESS_TOKEN);

      if (["/login", "/register"].includes(pathname)) {
        if (token) {
          router.push("/");
        }

        setIsMounted(true);
        return;
      }

      if (!token) {
        router.push("/login");

        setIsMounted(true);
        return;
      }

      const userId = localStorage.getItem(LocalStorageKeys.USER_ID);

      setUser((prev) => ({ ...prev, id: userId }));
      setHeaders();
      setIsMounted(true);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      const pathname = router.pathname;

      if (["/login", "/register"].includes(pathname)) {
        return;
      }
    }, [router.pathname]);

    if (!isMounted) return null;

    return <WrappedComponent {...props} />;
  };

  return WithHOC;
};

export default TokenHOC;
