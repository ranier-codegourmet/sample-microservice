import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { FC, useContext, useEffect, useRef, useState } from "react";
import * as Yup from "yup";

import { bidApi } from "@/api";
import { TextInput } from "@/components/common/input";
import { SocketContext } from "@/context/SocketContext";
import { ISocketBidStatus } from "@/types/bid";

type IBidResponse = {
  message: string;
};

type BidFormProps = {
  mutate: () => void;
};

const BidForm: FC<BidFormProps> = ({ mutate }) => {
  const router = useRouter();
  const { item_id } = router.query;
  const noticeReset = useRef<NodeJS.Timeout | null>(null);

  const { socket } = useContext(SocketContext);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!errorMessage && !successMessage) return;

    if (noticeReset.current) {
      clearTimeout(noticeReset.current);
    }

    noticeReset.current = setTimeout(() => {
      setErrorMessage(null);
      setSuccessMessage(null);
      noticeReset.current = null;
    }, 2000);
  }, [errorMessage, successMessage]);

  useEffect(() => {
    socket?.on("bidStatus", (data: ISocketBidStatus) => {
      if (data.status === 200) {
        setSuccessMessage(`Bid Success!`);
        mutate();
      }
    });

    return () => {
      socket?.off("bidStatus");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Formik
      initialValues={{ bid: "" }}
      validationSchema={Yup.object({
        bid: Yup.number().min(1).required("Required"),
      })}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const { data } = await bidApi.post<IBidResponse>(`/bid`, {
            item_id,
            price: values.bid,
          });
          setSuccessMessage(data.message);
          mutate();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          setErrorMessage(error.response.data.message);
        }

        setSubmitting(false);
      }}
    >
      <Form role="form" className="flex flex-col">
        {errorMessage && (
          <div className="alert alert-error shadow-lg">
            <div>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}
        {successMessage && (
          <div className="alert alert-success shadow-lg">
            <div>
              <span>{successMessage}</span>
            </div>
          </div>
        )}
        <TextInput label="Bid" name="bid" type="number" />
        <button className="btn btn-primary" type="submit">
          Bid
        </button>
      </Form>
    </Formik>
  );
};

export default BidForm;
