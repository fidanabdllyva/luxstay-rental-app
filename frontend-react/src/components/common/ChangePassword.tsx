import { useState } from "react";
import { useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import type { RootState } from "@/redux/store";
import { updateUser } from "@/api/requests/users";

const validationSchema = Yup.object({
  currentPassword: Yup.string()
    .required("Current password is required"),
  password: Yup.string()
    .min(6, "New password must be at least 6 characters")
    .required("New password is required")
    .notOneOf(
      [Yup.ref("currentPassword")],
      "New password cannot be the same as current password"
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

const ChangePasswordDialog = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  return (
    <Dialog>
      <DialogTrigger className="w-full border rounded py-1.5 font-semibold text-sm">
        Change Password
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <p className="text-muted-foreground text-sm font-light mt-1">
            Enter your current password and a new password
          </p>
        </DialogHeader>

        <Formik
          initialValues={{
            currentPassword: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setSuccessMsg("");
            setErrorMsg("");

            if (!user?.id || !user.username || !user.email) {
              setErrorMsg("User not logged in or incomplete user data");
              setSubmitting(false);
              return;
            }

            try {
              await updateUser(user.id, {
                username: user.username,
                email: user.email,
                currentPassword: values.currentPassword,
                password: values.password,
              });
              setSuccessMsg("Password changed successfully!");
              resetForm();
            } catch (error: any) {
              setErrorMsg(
                error?.response?.data?.error || "Failed to change password"
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Current Password</label>
                <Field
                  name="currentPassword"
                  type="password"
                  className="w-full p-2 border rounded"
                  autoComplete="current-password"
                />
                <ErrorMessage
                  name="currentPassword"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">New Password</label>
                <Field
                  name="password"
                  type="password"
                  className="w-full p-2 border rounded"
                  autoComplete="new-password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Confirm New Password</label>
                <Field
                  name="confirmPassword"
                  type="password"
                  className="w-full p-2 border rounded"
                  autoComplete="new-password"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 px-4 rounded bg-black text-white hover:bg-gray-800"
              >
                {isSubmitting ? "Saving..." : "Save New Password"}
              </button>

              {successMsg && (
                <div className="text-green-600 text-sm text-center">{successMsg}</div>
              )}
              {errorMsg && (
                <div className="text-red-600 text-sm text-center">{errorMsg}</div>
              )}
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
