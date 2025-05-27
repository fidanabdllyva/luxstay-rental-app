import type { Booking } from "@/types/bookings";
import { endpoints } from "../constants";
import instance from "../axios-instance";

export async function getBookings(){
      const response = await instance.get<{ message: string; data: Booking[] }>(endpoints.bookings);
  return response.data.data;
}

export async function getHostBookings(entrepreneurId: string | undefined): Promise<Booking[]> {
  const response = await instance.get<{ message: string; data: Booking[] }>(
    `${endpoints.bookings}?entrepreneurId=${entrepreneurId}`
  );
  return response.data.data;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export async function updateBookingStatus(
  id: string,
  updatedFields: Partial<Pick<Booking, "status">>
): Promise<Booking> {
  const response = await instance.patch<{ data: Booking }>(
    `${endpoints.bookings}/${id}`,
    updatedFields
  );
  return response.data.data;
}
