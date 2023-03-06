import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";

import { mainApi } from "@/api";
import { TextInput } from "@/components/common/input";

const CreateForm = () => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => setIsSuccess(false), 2000);
    }
  }, [isSuccess]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-5 text-neutral-700">Create Item</h1>
      <Formik
        initialValues={{
          name: "",
          price: "",
          bid_time: "",
        }}
        validationSchema={Yup.object({
          name: Yup.string().required("Required"),
          price: Yup.number().min(1).required("Required"),
          bid_time: Yup.number().min(1).required("Required"),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            setIsSuccess(false);
            await mainApi.post("/item", { ...values, status: "draft" });
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
                <span>Create Item was successful</span>
              </div>
            </div>
          )}
          <TextInput label="Name" name="name" type="text" />
          <TextInput label="Price" name="price" type="number" />
          <TextInput label="Bid Time" name="bid_time" type="number" />
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default CreateForm;
