import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useContext } from "react";
import * as Yup from "yup";

import { authApi } from "@/api";
import { TextInput } from "@/components/common/input";
import { AuthContext } from "@/context/AuthContext";

type IRegisterResponse = {
  message: string;
};

const RegisterForm = () => {
  const router = useRouter();

  const { setIsError, setIsSuccess } = useContext(AuthContext);

  return (
    <Formik
      initialValues={{ email: "", password: "", name: "" }}
      validationSchema={Yup.object({
        email: Yup.string().email("Invalid email address").required("Required"),
        password: Yup.string()
          .min(8, "Must be 8 characters or more")
          .required("Required"),
        name: Yup.string().required("Required"),
      })}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const {
            data: { message },
          } = await authApi.post<IRegisterResponse>("/auth/register", values);
          setIsSuccess(message);

          setTimeout(() => router.push("/login"), 1000);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          setIsError(error.response.data.message);
        }
        setSubmitting(false);
      }}
    >
      <Form role="form" className="flex flex-col">
        <TextInput label="Name" name="name" type="text" />
        <TextInput label="Email" name="email" type="email" />
        <TextInput label="Password" name="password" type="password" />
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </Form>
    </Formik>
  );
};

export default RegisterForm;
