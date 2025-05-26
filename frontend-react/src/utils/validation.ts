import * as Yup from "yup";

export const loginSchema = Yup.object({
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

export const registerSchema = Yup.object({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be under 20 characters")
     .matches(/^[a-z0-9_]+$/, 'Only lowercase letters, numbers, and underscores (_) are allowed')
    .required("Username is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/\d/, "Must contain at least one number")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});


export const contactSchema = Yup.object({
  fullName: Yup.string()
    .required("Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be at most 50 characters")
    .matches(
      /^[A-Z][a-z]+(?:\s[A-Z][a-z]+)+$/,
      "Full name must contain first and last name, starting with capital letters (e.g., Fidan Abdullayeva)"
    ),

  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),

  subject: Yup.string()
    .required("Subject is required")
    .max(50, "Subject must be at most 50 characters"),

  message: Yup.string()
    .required("Message is required")
    .min(2, "Message must be at least 2 characters")
    .max(1000, "Message must be at most 1000 characters"),
})