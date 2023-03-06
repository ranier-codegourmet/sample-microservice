import { Form, Formik } from "formik";
import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";

import { mainApi } from "@/api";
import { TextInput } from "@/components/common/input";
import { UserContext } from "@/context/UserContext";

type IBalanceResponse = {
  balance: number;
};

const DepositForm = () => {
  const { user } = useContext(UserContext);

  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => setIsSuccess(false), 2000);
    }
  }, [isSuccess]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-5 text-neutral-700">Deposit</h1>
      <Formik
        initialValues={{ balance: "" }}
        validationSchema={Yup.object({
          balance: Yup.number().min(1).required("Required"),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            setIsSuccess(false);
            await mainApi.put<IBalanceResponse>(
              `/wallet/${user?.walletId}/balance`,
              values
            );
            setIsSuccess(true);
          } catch (error) {
            console.error(error);
          }

          setSubmitting(false);
        }}
      >
        <Form role="form" className="flex flex-col">
          {isSuccess && (
            <div className="alert alert-success shadow-lg">
              <div>
                <span>Deposit was successful</span>
              </div>
            </div>
          )}
          <TextInput label="Balance" name="balance" type="number" />
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default DepositForm;
