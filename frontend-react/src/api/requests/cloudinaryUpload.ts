import { endpoints } from "../constants";
import instance from "../axios-instance";

export const uploadFile = async (formData: FormData) => {
  try {
    const res = await instance.post(endpoints.upload, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Upload failed", error);
    throw error;
  }
};
