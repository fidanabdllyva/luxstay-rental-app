import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { updateUser } from "@/api/requests/users";
import { setUser } from "@/redux/features/auth/authSlice"; 
import type { RootState } from "@/redux/store";

const expiryDateValidation = Yup.string()
  .required("Expiry date is required")
  .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry date must be in MM/YY format")
  .test("expiryDate", "Expiry date must be in the future", (value) => {
    if (!value) return false;
    const [month, year] = value.split("/").map(Number);
    if (!month || !year) return false;

    const now = new Date();
    const expiry = new Date(2000 + year, month - 1, 1);
    return expiry > now;
  });

const validationSchema = Yup.object({
  amount: Yup.number()
    .typeError("Amount must be a number")
    .positive("Amount must be greater than zero")
    .required("Amount is required"),
  cardNumber: Yup.string()
    .required("Card number is required")
    .matches(/^\d{16}$/, "Card number must be exactly 16 digits"),
  expiryDate: expiryDateValidation,
  cvv: Yup.string()
    .required("CVV is required")
    .matches(/^\d{3}$/, "CVV must be exactly 3 digits"),
});

const AddBalanceDialog = () => {
  const dispatch = useDispatch(); 
  const { user } = useSelector((state: RootState) => state.auth);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  return (
    <Dialog>
      <DialogTrigger className="w-full border rounded py-1.5 font-semibold text-sm">
        Add Balance
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add Balance
            <p className="text-muted-foreground text-sm font-light mt-1">
              Add funds to your account balance
            </p>
          </DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={{
            amount: "",
            cardNumber: "",
            expiryDate: "",
            cvv: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setSuccessMsg("");
            setErrorMsg("");

            if (!user?.id) {
              setErrorMsg("User not logged in");
              setSubmitting(false);
              return;
            }

            try {
              const updatedUser = await updateUser(user.id, {
                balance: (user.balance || 0) + Number(values.amount),
              });

              dispatch(setUser(updatedUser)); 

              setSuccessMsg(`Successfully added $${values.amount} to your balance!`);
              resetForm();
            } catch (error: any) {
              setErrorMsg(
                error?.response?.data?.error || "Failed to add balance"
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Amount ($)</label>
                <Field
                  name="amount"
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Enter amount"
                />
                <ErrorMessage
                  name="amount"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Card Number</label>
                <Field
                  name="cardNumber"
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="**** **** **** ****"
                  autoComplete="off"
                />
                <ErrorMessage
                  name="cardNumber"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Expiry Date</label>
                <Field
                  name="expiryDate"
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="MM/YY"
                  autoComplete="off"
                />
                <ErrorMessage
                  name="expiryDate"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">CVV</label>
                <Field
                  name="cvv"
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="CVV"
                  autoComplete="off"
                />
                <ErrorMessage
                  name="cvv"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 px-4 rounded bg-black text-white hover:bg-gray-800"
              >
                {isSubmitting ? "Processing..." : "Add Funds"}
              </button>

              {successMsg && (
                <div className="text-green-600 text-sm text-center mt-2">{successMsg}</div>
              )}
              {errorMsg && (
                <div className="text-red-600 text-sm text-center mt-2">{errorMsg}</div>
              )}
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddBalanceDialog;
