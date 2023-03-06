import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useContext } from "react";
import * as Yup from "yup";

import { authApi } from "@/api";
import { TextInput } from "@/components/common/input";
import { AuthContext } from "@/context/AuthContext";
import { LocalStorageKeys } from "@/types/config";

type ILoginResponse = {
  access_token: string;
  user_id: string;
};

const LoginForm = () => {
  const router = useRouter();

  const { setIsError } = useContext(AuthContext);

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={Yup.object({
        email: Yup.string().email("Invalid email address").required("Required"),
        password: Yup.string().required("Required"),
      })}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const {
            data: { access_token, user_id },
          } = await authApi.post<ILoginResponse>("/auth/login", values);

          localStorage.setItem(LocalStorageKeys.ACCESS_TOKEN, access_token);
          localStorage.setItem(LocalStorageKeys.USER_ID, user_id);

          setTimeout(() => router.push("/"), 1000);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          setIsError(error.response.data.message);
        }
        setSubmitting(false);
      }}
    >
      <Form role="form" className="flex flex-col">
        <TextInput label="Email" name="email" type="email" />
        <TextInput label="Password" name="password" type="password" />
        <button className="btn btn-primary" type="submit">
          Login
        </button>
      </Form>
    </Formik>
  );
};

export default LoginForm;
