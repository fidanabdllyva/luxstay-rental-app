import type { Slide } from "@/types/slider";
import instance from "../axios-instance";
import { endpoints } from "../constants";

export async function getSlider(): Promise<Slide[] | null> {
  const response = await instance.get<{ message: string; data: Slide[] }>(endpoints.slider);
  return response.data.data;
}