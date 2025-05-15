import type { Slide } from "@/types/slider";
import instance from "../axios-instance";
import { endpoints } from "../constants";

export async function getSlider(): Promise<Slide[] | null> {
  const { data: slider } = await instance.get(endpoints.slider);
  return slider;
}