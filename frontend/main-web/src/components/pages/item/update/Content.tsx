import { DateTime } from "luxon";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import Countdown from "react-countdown";
import useSWR from "swr";

import { mainApiFetcher } from "@/api/fetcher";
import { SocketContext } from "@/context/SocketContext";
import { ICurrentBidItem } from "@/types/item";

import BidForm from "./BidForm";
import Table from "./Table";

const Content = () => {
  const router = useRouter();
  const { item_id } = router.query;

  const { handleJoinBid, handleLeaveBid } = useContext(SocketContext);

  const { data, mutate } = useSWR<ICurrentBidItem>(
    item_id ? `/item/${item_id}` : null,
    mainApiFetcher
  );

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
    if (!item_id) return;

    handleJoinBid(item_id as string);

    return () => {
      handleLeaveBid(item_id as string);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!data) return null;

  return (
    <div className="flex flex-row">
      <div className="bg-white shadow-xl p-4">
        <h1 className="text-2xl font-bold">Bid Item</h1>
        <h3 className="text-xl mt-3">Item: {data?.name}</h3>
        <span className="text-lg mt-3">
          Current Bid: ${data?.current_bid_amount || data?.price}
        </span>
        <div className="mt-3">
          <span className="text-lg">Bid Time: </span>
          <Countdown
            date={DateTime.fromISO(data?.time_window).toMillis()}
            renderer={handleCountdownRenderer}
          />
        </div>
        {data.status !== "completed" && <BidForm mutate={mutate} />}
      </div>
      <div className="grow ml-4 bg-white shadow-xl p-4">
        <Table />
      </div>
    </div>
  );
};

export default Content;
