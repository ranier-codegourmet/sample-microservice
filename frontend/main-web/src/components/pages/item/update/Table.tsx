import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import useSWR from "swr";

import { bidApiFetcher } from "@/api/fetcher";
import { SocketContext } from "@/context/SocketContext";
import { UserContext } from "@/context/UserContext";

type IBidListResponse = {
  name: string;
  price: number;
  user_id: string;
  sold: boolean;
};

const Table = () => {
  const router = useRouter();
  const { item_id } = router.query;

  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserContext);

  const [list, setList] = useState<IBidListResponse[]>([]);

  const { data = [] } = useSWR<IBidListResponse[]>(
    `/bid/item/${item_id}`,
    bidApiFetcher,
    {
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    if (!socket) return;

    socket.on("bidList", (data: IBidListResponse[]) => {
      setList(data);
    });

    return () => {
      socket.off("bidList");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setList(data);
  }, [data]);

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Bid</th>
          </tr>
        </thead>
        <tbody>
          {list?.map((item, index) => {
            return (
              <tr key={index} className={`${item.sold ? `active` : ""}`}>
                <td>
                  {item.name}
                  {user?.id === item.user_id && " (you)"}
                </td>
                <td>{item.price}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
