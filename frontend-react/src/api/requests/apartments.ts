import type { Apartment } from "@/types/apartments";
import instance from "../axios-instance";
import { endpoints } from "../constants";

export async function getApartments(): Promise<Apartment[]> {
  const response = await instance.get<{ message: string; data: Apartment[] }>(endpoints.apartments);
  return response.data.data;
}

export async function getApartmentById(id: string): Promise<Apartment | null> {
    const response = await instance.get(`${endpoints.apartments}/${id}`);
  return response.data;

}
