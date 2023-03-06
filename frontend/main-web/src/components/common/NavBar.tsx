import { useRouter } from "next/router";
import { FC, useContext, useEffect } from "react";
import { ReactNode } from "react";
import useSWR from "swr";

import { removeHeaders } from "@/api";
import { mainApiFetcher } from "@/api/fetcher";
import { UserContext } from "@/context/UserContext";
import { IWallet } from "@/types/wallet";

type NavBarProps = {
  children: ReactNode;
};

const NavBar: FC<NavBarProps> = ({ children }) => {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);

  const { data: wallet } = useSWR<IWallet>(
    user ? `/wallet` : null,
    mainApiFetcher
  );

  const handleLogout = () => {
    setUser({ id: null, walletId: null });
    localStorage.clear();
    removeHeaders();
    router.push("/login");
  };

  useEffect(() => {
    if (!wallet) return;

    setUser((prev) => ({ ...prev, walletId: wallet._id }));
  }, [setUser, wallet]);

  return (
    <>
      <div className="navbar bg-base-100 shadow-xl">
        <div className="navbar-start"></div>
        <div className="navbar-center">
          <a href="/">Auction</a>
        </div>
        <div className="navbar-end">
          <span>Balance: ${wallet?.balance || 0}</span>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a href="/deposit">Deposit</a>
              </li>
              <li>
                <a href="/item/create">Create Item</a>
              </li>
              <li onClick={() => handleLogout()}>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="m-10 mt-20">{children}</div>
    </>
  );
};

export default NavBar;
