import type { Slide } from "@/types/slider";
import instance from "../axios-instance";
import { endpoints } from "../constants";

export async function getSlider(page?: string): Promise<Slide[]> {
  const response = await instance.get<{ message: string; data: Slide[] }>(endpoints.slider, {
    params: page ? { page } : undefined,
  });
  return response.data.data;
}

export async function getSliderById(id: string): Promise<Slide | null> {
  try {
    const response = await instance.get<{ message: string; data: Slide }>(`${endpoints.slider}/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch slider by ID:", error);
    return null;
  }
}

export async function createSlider(slider: Omit<Slide, 'id'>): Promise<Slide | null> {
  try {
    const response = await instance.post<{ message: string; data: Slide }>(endpoints.slider, slider);
    return response.data.data;
  } catch (error) {
    console.error("Failed to create slider:", error);
    return null;
  }
}

export async function updateSlider(id: string, slider: Partial<Omit<Slide, 'id'>>): Promise<Slide | null> {
  try {
    const response = await instance.patch<{ message: string; data: Slide }>(`${endpoints.slider}/${id}`, slider);
    return response.data.data;
  } catch (error) {
    console.error("Failed to update slider:", error);
    return null;
  }
}

export async function deleteSlider(id: string): Promise<boolean> {
  try {
    await instance.delete(`${endpoints.slider}/${id}`);
    return true;
  } catch (error) {
    console.error("Failed to delete slider:", error);
    return false;
  }
}
