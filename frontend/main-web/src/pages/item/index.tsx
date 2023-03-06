import { useRouter } from "next/router";
import { useEffect } from "react";

const Item = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/item/create");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};

export default Item;
