import type { Booking } from "@/types/bookings";
import { endpoints } from "../constants";
import instance from "../axios-instance";

export async function getBookings(){
      const response = await instance.get<{ message: string; data: Booking[] }>(endpoints.bookings);
  return response.data.data;
}
