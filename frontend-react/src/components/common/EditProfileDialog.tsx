import { useState } from "react";
import { useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
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
import { uploadFile } from "@/api/requests/cloudinaryUpload";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/features/auth/authSlice";

const validationSchema = Yup.object({
    username: Yup.string().min(3, "Too short").required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
});

interface FormValues {
    username: string;
    email: string;
}

const EditProfileDialog = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const [imageUrl, setImageUrl] = useState(user?.profileImage || "");
    const [uploadError, setUploadError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleImageUpload = async (file: File | null) => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const data = await uploadFile(formData);
            setImageUrl(data.secure_url || data.url || data.path);
            setUploadError("");
        } catch (error: any) {
            setUploadError(error.response?.data?.message || "Image upload failed");
        }
    };

    const handleSubmit = async (
        values: FormValues,
        { setSubmitting, setErrors }: FormikHelpers<FormValues>
    ) => {
        if (!user?.id) return;

        setSuccessMsg("");
        setErrors({});

        try {
            const updatedUser = await updateUser(user.id, {
                ...values,
                profileImage: imageUrl,
            });
             dispatch(setUser(updatedUser));
            console.log("User updated:", updatedUser);
            setSuccessMsg("Profile updated successfully!");
        } catch (error: any) {
            console.error("Update failed", error);

            if (error.response?.data?.error) {
                const errMsg: string = error.response.data.error.toLowerCase();

                const fieldErrors: Partial<FormValues> = {};
                if (errMsg.includes("email")) {
                    fieldErrors.email = error.response.data.error;
                }
                if (errMsg.includes("username")) {
                    fieldErrors.username = error.response.data.error;
                }
                if (Object.keys(fieldErrors).length > 0) {
                    setErrors(fieldErrors);
                } else {
                    setSuccessMsg("");
                    alert(error.response.data.error);
                }
            } else {
                setSuccessMsg("");
                alert("An unexpected error occurred.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger className="w-full border rounded py-1.5 font-semibold text-sm">
                Edit Profile
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>

                <Formik
                    initialValues={{
                        username: user?.username || "",
                        email: user?.email || "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Username</label>
                                <Field
                                    name="username"
                                    className="w-full p-2 border rounded"
                                    autoComplete="username"
                                />
                                <ErrorMessage
                                    name="username"
                                    component="div"
                                    className="text-red-500 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Email</label>
                                <Field
                                    name="email"
                                    type="email"
                                    className="w-full p-2 border rounded"
                                    autoComplete="email"
                                />
                                <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="text-red-500 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Profile Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        handleImageUpload(e.target.files?.[0] || null)
                                    }
                                />
                                {uploadError && (
                                    <div className="text-red-500 text-sm">{uploadError}</div>
                                )}
                                {imageUrl && (
                                    <img
                                        src={imageUrl}
                                        alt="Profile"
                                        className="mt-2 h-16 w-16 rounded-full object-cover"
                                    />
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-2 px-4 rounded bg-black text-white hover:bg-gray-800"
                            >
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </button>

                            {successMsg && (
                                <div className="text-green-600 text-sm text-center">
                                    {successMsg}
                                </div>
                            )}
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};

export default EditProfileDialog;
