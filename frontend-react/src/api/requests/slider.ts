import type { Slide } from "@/types/slider";
import instance from "../axios-instance";
import { endpoints } from "../constants";


export async function getSliders():Promise<Slide[]> {
  const response = await instance.get<{ message: string; data: Slide[] }>(endpoints.slider)
  return response.data.data
}


export async function getSlider(page: string = 'home'): Promise<Slide[]> {
  try {
    const response = await instance.get<{ message: string; data: Slide[] }>(endpoints.slider, {
      params: { page },
    });
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch sliders:', error);
    return [];
  }
}
