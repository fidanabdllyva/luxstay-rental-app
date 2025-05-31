import { useState } from "react";
import { useSelector } from "react-redux";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";

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
  pricePerNight: Yup.number().typeError("Must be a number").positive("Must be greater than 0").required("Price per night is required"),
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

    try {
      const { url } = await uploadFile(formData);
      return url;
    } catch (err: any) {
      throw new Error(err?.message || "Upload failed");
    }
  };

  const handleCoverImageUpload = async (file: File | null) => {
    if (!file) return;
    try {
      const url = await uploadImage(file);
      setCoverImageUrl(url);
      toast.success("Cover image uploaded!");
    } catch {
      const msg = "Failed to upload cover image.";
      setError(msg);
      toast.error(msg);
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
        const msg = "Failed to upload one or more gallery images.";
        setError(msg);
        toast.error(msg);
        break;
      }
    }

    setGalleryImageUrls((prev) => [...prev, ...urls]);
    if (urls.length > 0) toast.success("Gallery images uploaded!");
  };

  const handleSubmit = async (
    values: Partial<Omit<Apartment, "id" | "entrepreneurId" | "coverImage" | "images">>,
    { setSubmitting, resetForm }: any
  ) => {
    setError(null);

    if (!entrepreneurId) {
      const msg = "Not authenticated";
      setError(msg);
      toast.error(msg);
      setSubmitting(false);
      return;
    }

    if (!coverImageUrl) {
      const msg = "Please upload a cover image.";
      setError(msg);
      toast.error(msg);
      setSubmitting(false);
      return;
    }

    if (galleryImageUrls.length === 0) {
      const msg = "Please upload at least one gallery image.";
      setError(msg);
      toast.error(msg);
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
      toast.success("Apartment added successfully!");
      onSuccess();
      resetForm();
      setCoverImageUrl(null);
      setGalleryImageUrls([]);
    } catch (err: any) {
      const msg = err.message || "Something went wrong";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
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

            <div className="space-y-2">
              <p className="font-semibold">Features</p>
              <FieldArray name="features" render={({ push, remove }) => (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
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
              )} />
            </div>

            <div className="space-y-2">
              <p className="font-semibold">Rules</p>
              <FieldArray name="rules" render={({ push, remove }) => (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
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
              )} />
            </div>

            {/* Cover Image Upload */}
            <div className="space-y-1">
              <p className="font-semibold">Cover Image (1 image)</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleCoverImageUpload(e.target.files?.[0] || null)}
                className="block"
              />
              {coverImageUrl && (
                <img
                  src={toAbsoluteURL(coverImageUrl)}
                  alt="Cover"
                  className="w-24 h-24 object-cover mt-2 rounded"
                />
              )}
            </div>

            {/* Gallery Images Upload */}
            <div className="space-y-1">
              <p className="font-semibold">Gallery Images (Multiple)</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleGalleryImageUpload(e.target.files)}
                className="block"
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
                className="bg-white border text-black px-4 py-2 rounded"
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
