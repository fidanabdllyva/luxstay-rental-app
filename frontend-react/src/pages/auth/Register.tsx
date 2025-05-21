import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import type { AppDispatch, RootState } from "@/redux/store";
import { registerSchema } from "@/utils/validation";
import { registerUser } from "@/redux/features/auth/authAPI";



const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen flex flex-col justify-center py-10 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-black">Create an Account</h2>
            <p className="mt-2 text-sm text-gray-600">Sign up to get started</p>
          </div>

          <Formik
            initialValues={{
              username: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={registerSchema}
            onSubmit={async (values) => {
              const { confirmPassword, ...rest } = values;
              const res = await dispatch(registerUser(rest));
              if (res.meta.requestStatus === "fulfilled") {
                navigate("/"); // Redirect after successful registration
              }
            }}
          >
            {() => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                  <Field
                    name="username"
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border rounded-lg"
                  />
                  <ErrorMessage name="username" component="div" className="text-sm text-red-500 mt-1" />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <Field
                    name="email"
                    type="email"
                    className="mt-1 block w-full px-3 py-2 border rounded-lg"
                  />
                  <ErrorMessage name="email" component="div" className="text-sm text-red-500 mt-1" />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="mt-1 relative">
                    <Field
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="block w-full px-3 py-2 border rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? "🙈" : "🙉"}
                    </button>
                  </div>
                  <ErrorMessage name="password" component="div" className="text-sm text-red-500 mt-1" />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <div className="mt-1 relative">
                    <Field
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className="block w-full px-3 py-2 border rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? "🙈" : "🙉"}
                    </button>
                  </div>
                  <ErrorMessage name="confirmPassword" component="div" className="text-sm text-red-500 mt-1" />
                </div>

                {error && <div className="text-red-600 text-sm">{error}</div>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 rounded-lg text-white bg-black hover:bg-gray-800"
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              </Form>
            )}
          </Formik>

          <p className="mt-6 text-center text-sm text-black">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
