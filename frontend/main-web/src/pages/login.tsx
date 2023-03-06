import { useRouter } from "next/router";
import { useCallback } from "react";
import { useContext } from "react";

import { Form } from "@/components/pages/login";
import AuthHOC from "@/components/pages/register/AuthHOC";
import { AuthContext } from "@/context/AuthContext";

const Login = () => {
  const router = useRouter();

  const { isError, isSuccess } = useContext(AuthContext);

  const handleRegister = useCallback(() => {
    router.push("/register");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white rounded-lg shadow-lg p-10 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-5 text-neutral-700">Login</h1>
        {isError && (
          <div className="alert alert-error shadow-lg">
            <div>
              <span>{isError}</span>
            </div>
          </div>
        )}
        {isSuccess && (
          <div className="alert alert-success shadow-lg">
            <div>
              <span>{isSuccess}</span>
            </div>
          </div>
        )}
        <Form />
        <button
          className="btn btn-outline w-full mt-5"
          onClick={handleRegister}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default AuthHOC(Login);
