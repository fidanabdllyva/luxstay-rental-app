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
import { uploadFile } from "@/api/requests/cloudinaryUpload";

export const apartmentTypes: ApartmentType[] = [
  "ISLAND", "APARTMENT", "VINTAGE", "VILLA", "PENTHOUSE", "GARDEN", "POOL",
];

export const featureList: Feature[] = [
  "WIFI", "AC", "HEATING", "KITCHEN", "PARKING", "POOL", "PET_FRIENDLY", "WASHER", "DRYER",
  "GYM", "ELEVATOR", "BALCONY", "HOT_TUB", "BREAKFAST_INCLUDED", "TV",
  "SMOKE_DETECTOR", "FIRE_EXTINGUISHER", "FURNISHED", "WHEELCHAIR_ACCESSIBLE", "BABY_COT",
];

export const ruleList: Rule[] = [
  "NO_SMOKING", "NO_PETS", "NO_PARTIES", "QUIET_HOURS", "CHECK_IN_AFTER_3PM",
  "CHECK_OUT_BEFORE_11AM", "NO_UNREGISTERED_GUESTS", "CLEAN_UP_AFTER_YOURSELF",
  "NO_ILLEGAL_ACTIVITIES", "RESPECT_NEIGHBORS",
];

const validationSchema = Yup.object({
  title: Yup.string().min(3).required("Title is required"),
  type: Yup.mixed<ApartmentType>().oneOf(apartmentTypes).required("Type is required"),
  location: Yup.string().min(2).required("Location is required"),
  pricePerNight: Yup.number().typeError("Must be a number").positive("Must be greater than 0").required("Price is required"),
  description: Yup.string().min(10).required("Description is required"),
  features: Yup.array().of(Yup.mixed<Feature>().oneOf(featureList)),
  rules: Yup.array().of(Yup.mixed<Rule>().oneOf(ruleList)),
});

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
}

const AddApartmentForm = ({ onCancel, onSuccess }: Props) => {
  const entrepreneurId = useSelector((state: RootState) => state.auth.user?.id);

  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [galleryImageUrls, setGalleryImageUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const { url } = await uploadFile(formData);
    return url;
  };

  const handleCoverImageUpload = async (file: File | null) => {
    if (!file) return;
    try {
      const url = await uploadImage(file);
      setCoverImageUrl(url);
    } catch {
      setError("Failed to upload cover image.");
    }
  };

  const handleGalleryImageUpload = async (files: FileList | null) => {
    if (!files) return;
    const urls: string[] = [];

    for (const file of Array.from(files)) {
      try {
        const url = await uploadImage(file);
        urls.push(url);
      } catch {
        setError("Failed to upload one or more gallery images.");
        break;
      }
    }

    setGalleryImageUrls((prev) => [...prev, ...urls]);
  };

  const handleSubmit = async (
    values: Partial<Omit<Apartment, "id" | "entrepreneurId" | "coverImage" | "images">>,
    { setSubmitting, resetForm }: any
  ) => {
    setError(null);

    if (!entrepreneurId) {
      setError("Not authenticated");
      setSubmitting(false);
      return;
    }

    if (!coverImageUrl) {
      setError("Please upload a cover image.");
      setSubmitting(false);
      return;
    }

    if (galleryImageUrls.length === 0) {
      setError("Please upload at least one gallery image.");
      setSubmitting(false);
      return;
    }

    try {
      const apartmentData: Partial<Apartment> = {
        ...values,
        entrepreneurId,
        pricePerNight: Number(values.pricePerNight),
        coverImage: toAbsoluteURL(coverImageUrl),
        images: galleryImageUrls.map(toAbsoluteURL),
      };

      await addApartment(apartmentData);
      onSuccess();
      resetForm();
      setCoverImageUrl(null);
      setGalleryImageUrls([]);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Formik
        initialValues={{
          title: "",
          type: "ISLAND" as ApartmentType,
          location: "",
          pricePerNight: 1,
          description: "",
          features: [] as Feature[],
          rules: [] as Rule[],
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values }) => (
          <Form className="space-y-4">
            <Field name="title" placeholder="Title" className="w-full p-2 border rounded" />
            <ErrorMessage name="title" component="div" className="text-red-600" />

            <Field as="select" name="type" className="w-full p-2 border rounded">
              {apartmentTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Field>
            <ErrorMessage name="type" component="div" className="text-red-600" />

            <Field name="location" placeholder="Location" className="w-full p-2 border rounded" />
            <ErrorMessage name="location" component="div" className="text-red-600" />

            <Field name="pricePerNight" type="number" placeholder="Price per night" className="w-full p-2 border rounded" />
            <ErrorMessage name="pricePerNight" component="div" className="text-red-600" />

            <Field as="textarea" name="description" placeholder="Description" className="w-full p-2 border rounded" />
            <ErrorMessage name="description" component="div" className="text-red-600" />

            {/* Features */}
            <div>
              <p className="font-semibold">Features</p>
              <FieldArray name="features">
                {({ push, remove }) => (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {featureList.map((f) => {
                      const checked = values.features.includes(f);
                      return (
                        <label key={f} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              checked ? remove(values.features.indexOf(f)) : push(f)
                            }
                          />
                          {f}
                        </label>
                      );
                    })}
                  </div>
                )}
              </FieldArray>
            </div>

            {/* Rules */}
            <div>
              <p className="font-semibold">Rules</p>
              <FieldArray name="rules">
                {({ push, remove }) => (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
              </FieldArray>
            </div>

            {/* Cover Image */}
            <div>
              <p className="font-semibold">Cover Image</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleCoverImageUpload(e.target.files?.[0] || null)}
              />
              {coverImageUrl && (
                <img
                  src={toAbsoluteURL(coverImageUrl)}
                  alt="Cover"
                  className="w-24 h-24 object-cover mt-2 rounded"
                />
              )}
            </div>

            {/* Gallery Images */}
            <div>
              <p className="font-semibold">Gallery Images</p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleGalleryImageUpload(e.target.files)}
              />
              {galleryImageUrls.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {galleryImageUrls.map((url) => (
                    <img
                      key={url}
                      src={toAbsoluteURL(url)}
                      alt="Gallery"
                      className="w-20 h-20 object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 rounded text-white ${isSubmitting ? "bg-gray-400" : "bg-black"}`}
              >
                {isSubmitting ? "Adding..." : "Add Apartment"}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>
            </div>

            {error && <div className="text-red-600 mt-2">{error}</div>}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddApartmentForm;
