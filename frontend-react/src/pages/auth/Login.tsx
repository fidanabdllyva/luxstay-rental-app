import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { loginUser } from "@/redux/features/auth/authAPI";
import type { AppDispatch, RootState } from "@/redux/store";
import { loginSchema } from "@/utils/validation";
import { toast } from "sonner";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-neutral-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold">Welcome Back</h2>
            <p className="mt-2 text-sm dark:text-white text-gray-600">
              Please sign in to your account
            </p>
          </div>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginSchema}
            onSubmit={async (values) => {
              try {
                const res = await dispatch(loginUser(values));
                console.log("Login response:", res);

                if (res.meta.requestStatus === 'fulfilled') {
                  toast.success('Successfully logged in!');
                  navigate('/');
                  return;
                } else {
                  const payload = res.payload as { error: string; banDate?: string } | undefined;
                  toast.error(payload?.error || 'Failed to log in.');

                }
              }
              catch {
                toast.error('Unexpected error. Please try again later.');
              }
            }}

          >
            {() => (
              <Form className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium dark:text-white text-gray-700"
                  >
                    Email Address
                  </label>
                  <Field
                    name="email"
                    type="email"
                    className="mt-1 block w-full px-3 py-2 border rounded-lg"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm dark:text-white font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <Field
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="block w-full px-3 py-2 border rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? "🙈" : "🙉"}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 rounded-lg dark:bg-white dark:text-black text-white bg-black hover:bg-gray-800"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </Form>
            )}
          </Formik>

          <p className="mt-6 text-center text-sm dark:text-white text-gray-700">
            Don’t have an account?{" "}
            <Link to="/register" className="font-medium hover:underline">
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div >
  );
};

export default Login;
