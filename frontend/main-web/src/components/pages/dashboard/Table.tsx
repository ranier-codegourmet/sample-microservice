import { DateTime } from "luxon";
import { useRouter } from "next/router";
import { FC, useEffect, useRef, useState } from "react";
import Countdown from "react-countdown";
import useSWR from "swr";

import { mainApi } from "@/api";
import { mainApiFetcher } from "@/api/fetcher";
import { IItemList } from "@/types/item";

import { EBUTTON_ACTIVE } from "./Content";

type ITableProps = {
  type: EBUTTON_ACTIVE;
};

const Table: FC<ITableProps> = ({ type }) => {
  const router = useRouter();

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const alertReset = useRef<NodeJS.Timeout | null>(null);

  const { data = [], mutate } = useSWR<IItemList>(
    type === EBUTTON_ACTIVE.OWNED ? "/item" : `/item/${type}`,
    mainApiFetcher,
    {
      refreshInterval: 10000,
    }
  );

  const handlePublish = async (id: string) => {
    try {
      await mainApi.put(`/item/${id}`, { status: "published" });
      setAlertMessage("Item got publish successfully.");
      mutate();
    } catch (error) {
      console.error("An unexpected error happened");
    }
  };

  const handleBid = async (id: string) => {
    router.push(`/item/${id}`);
  };

  const handleCountdownRenderer = ({
    hours,
    minutes,
    seconds,
    completed,
  }: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    completed: boolean;
  }) => {
    if (completed) {
      return <span>Completed</span>;
    }

    return (
      <span className={`countdown font-mono ${minutes < 10 && "text-red-600"}`}>
        {/*
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore */}
        <span style={{ "--value": hours }}></span>h
        {/*
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore */}
        <span style={{ "--value": minutes }}></span>m
        {/*
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore */}
        <span style={{ "--value": seconds }}></span>s
      </span>
    );
  };

  useEffect(() => {
    if (!alertMessage) return;

    if (alertReset.current) clearTimeout(alertReset.current);

    alertReset.current = setTimeout(() => {
      setAlertMessage(null);
      alertReset.current = null;
    }, 2000);
  }, [alertMessage]);

  return (
    <div className="overflow-x-auto">
      {alertMessage && (
        <div className="toast toast-top toast-end">
          <div className="alert alert-success">
            <div>
              <span>Item got publish successfully.</span>
            </div>
          </div>
        </div>
      )}
      <table className="table w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            {type === EBUTTON_ACTIVE.ONGOING && (
              <>
                <th>Time Left</th>
              </>
            )}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item) => {
            const date = DateTime.fromISO(item.time_window); //.toLocaleString(DateTime.TIME_24_WITH_SECONDS)
            console.log(date);
            console.log(date.hour, date.minute, date.second);

            return (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.price}</td>
                {type === EBUTTON_ACTIVE.ONGOING && (
                  <td>
                    <Countdown
                      date={date.toMillis()}
                      renderer={handleCountdownRenderer}
                    />
                  </td>
                )}
                <td>
                  {type === EBUTTON_ACTIVE.OWNED && (
                    <button
                      className="btn btn-primary"
                      onClick={() => handlePublish(item._id)}
                    >
                      Publish
                    </button>
                  )}
                  {type !== EBUTTON_ACTIVE.OWNED && (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleBid(item._id)}
                    >
                      {type === EBUTTON_ACTIVE.ONGOING ? "Bid" : "Bid History"}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
