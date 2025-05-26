import { useState } from "react";
import { useSelector } from "react-redux";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";

import type { RootState } from "@/redux/store";
import type {
  Apartment,
  ApartmentType,
  Feature,
  Rule,
} from "@/types/apartments";

import { addApartment } from "@/api/requests/apartments";
import { toAbsoluteURL } from "@/utils/url";

// -----------------------------------------------------------------------------
// CONSTANTS -------------------------------------------------------------------
export const apartmentTypes: ApartmentType[] = [
  "ISLAND",
  "APARTMENT",
  "VINTAGE",
  "VILLA",
  "PENTHOUSE",
  "GARDEN",
  "POOL",
];

export const featureList: Feature[] = [
  "WIFI",
  "AC",
  "HEATING",
  "KITCHEN",
  "PARKING",
  "POOL",
  "PET_FRIENDLY",
  "WASHER",
  "DRYER",
  "GYM",
  "ELEVATOR",
  "BALCONY",
  "HOT_TUB",
  "BREAKFAST_INCLUDED",
  "TV",
  "SMOKE_DETECTOR",
  "FIRE_EXTINGUISHER",
  "FURNISHED",
  "WHEELCHAIR_ACCESSIBLE",
  "BABY_COT",
];

export const ruleList: Rule[] = [
  "NO_SMOKING",
  "NO_PETS",
  "NO_PARTIES",
  "QUIET_HOURS",
  "CHECK_IN_AFTER_3PM",
  "CHECK_OUT_BEFORE_11AM",
  "NO_UNREGISTERED_GUESTS",
  "CLEAN_UP_AFTER_YOURSELF",
  "NO_ILLEGAL_ACTIVITIES",
  "RESPECT_NEIGHBORS",
];

// -----------------------------------------------------------------------------
// VALIDATION ------------------------------------------------------------------
const validationSchema = Yup.object({
  title: Yup.string().min(3).required("Title is required"),
  type: Yup.mixed<ApartmentType>()
    .oneOf(apartmentTypes)
    .required("Type is required"),
  location: Yup.string().min(2).required("Location is required"),
  pricePerNight: Yup.number()
    .typeError("Must be a number")
    .positive("Must be greater than 0")
    .required("Price per night is required"),
  description: Yup.string().min(10).required("Description is required"),
  features: Yup.array().of(Yup.mixed<Feature>().oneOf(featureList)),
  rules: Yup.array().of(Yup.mixed<Rule>().oneOf(ruleList)),
});

// -----------------------------------------------------------------------------
// COMPONENT -------------------------------------------------------------------
interface Props {
  onCancel: () => void;
  onSuccess: () => void;
}

const AddApartmentForm = ({ onCancel, onSuccess }: Props) => {
  const entrepreneurId = useSelector(
    (state: RootState) => state.auth.user?.id
  );

  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // ------------------ IMAGE UPLOAD ------------------------------------------
  const handleImageUpload = async (files: FileList | null) => {
    if (!files) return;

    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("http://localhost:3000/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Upload failed");
        newUrls.push(data.url);
      } catch {
        setError("Failed to upload one or more images.");
        break;
      }
    }

    setUploadedUrls((prev) => [...prev, ...newUrls]);
  };

  // ------------------ SUBMIT -------------------------------------------------
  const handleSubmit = async (
    values: Omit<
      Apartment,
      | "id"
      | "images"
      | "coverImage"
      | "createdAt"
      | "updatedAt"
      | "entrepreneurId"
    >,
    { setSubmitting, resetForm }: any
  ) => {
    setError(null);

    if (!entrepreneurId) {
      setError("Not authenticated");
      setSubmitting(false);
      return;
    }
    if (uploadedUrls.length === 0) {
      setError("Please upload at least one image.");
      setSubmitting(false);
      return;
    }

    try {
      const images = uploadedUrls.map(toAbsoluteURL);

      const apartmentData: Apartment = {
        ...values,
        pricePerNight: Number(values.pricePerNight),
        entrepreneurId,
        coverImage: images[0],
        images,
      };

      await addApartment(apartmentData);

      onSuccess();
      resetForm();
      setUploadedUrls([]);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // ------------------ RENDER -------------------------------------------------
  return (
    <div className="max-w-xl mx-auto">
      <Formik
        initialValues={{
          title: "",
          type: "ISLAND" as ApartmentType,
          location: "",
          pricePerNight: 1, // <- number, satisfies Yup & Zod defaults
          description: "",
          features: [] as Feature[],
          rules: [] as Rule[],
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values }) => (
          <Form className="space-y-4">
            {/* TITLE ------------------------------------------------------- */}
            <Field
              name="title"
              placeholder="Title"
              className="w-full p-2 border rounded"
            />
            <ErrorMessage name="title" component="div" className="text-red-600" />

            {/* TYPE -------------------------------------------------------- */}
            <Field as="select" name="type" className="w-full p-2 border rounded">
              {apartmentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Field>
            <ErrorMessage name="type" component="div" className="text-red-600" />

            {/* LOCATION ---------------------------------------------------- */}
            <Field
              name="location"
              placeholder="Location"
              className="w-full p-2 border rounded"
            />
            <ErrorMessage name="location" component="div" className="text-red-600" />

            {/* PRICE ------------------------------------------------------- */}
            <Field
              name="pricePerNight"
              type="number"
              placeholder="Price per night"
              className="w-full p-2 border rounded"
            />
            <ErrorMessage
              name="pricePerNight"
              component="div"
              className="text-red-600"
            />

            {/* DESCRIPTION ------------------------------------------------- */}
            <Field
              as="textarea"
              name="description"
              placeholder="Description"
              className="w-full p-2 border rounded"
            />
            <ErrorMessage
              name="description"
              component="div"
              className="text-red-600"
            />

            {/* FEATURES ---------------------------------------------------- */}
            <div className="space-y-2">
              <p className="font-semibold">Features</p>
              <FieldArray
                name="features"
                render={({ push, remove }) => (
                  <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
                    {featureList.map((f) => {
                      const checked = values.features.includes(f);
                      return (
                        <label key={f} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              checked
                                ? remove(values.features.indexOf(f))
                                : push(f)
                            }
                          />
                          {f}
                        </label>
                      );
                    })}
                  </div>
                )}
              />
            </div>

            {/* RULES ------------------------------------------------------- */}
            <div className="space-y-2">
              <p className="font-semibold">Rules</p>
              <FieldArray
                name="rules"
                render={({ push, remove }) => (
                  <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
                    {ruleList.map((r) => {
                      const checked = values.rules.includes(r);
                      return (
                        <label key={r} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              checked ? remove(values.rules.indexOf(r)) : push(r)
                            }
                          />
                          {r}
                        </label>
                      );
                    })}
                  </div>
                )}
              />
            </div>

            {/* IMAGE UPLOAD ------------------------------------------------ */}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files)}
              className="block"
            />
            {uploadedUrls.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-2">
                {uploadedUrls.map((url) => (
                  <img
                    key={url}
                    src={toAbsoluteURL(url)}
                    alt="Uploaded"
                    className="w-20 h-20 object-cover rounded"
                  />
                ))}
              </div>
            )}

            {/* ACTIONS ----------------------------------------------------- */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 rounded text-white ${
                  isSubmitting ? "bg-gray-400" : "bg-green-600"
                }`}
              >
                {isSubmitting ? "Adding..." : "Add Apartment"}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="bg-gray-400 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>

            {error && <p className="text-red-600">{error}</p>}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddApartmentForm;
