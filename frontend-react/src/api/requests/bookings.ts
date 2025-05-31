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

export async function getBookingById(id: string) {
  const response = await instance.get(`${endpoints.bookings}/${id}`);
  return response.data;
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


export async function createBooking(data: Partial<Booking>): Promise<{ message: string }> {
  const response = await instance.post(endpoints.bookings, data);
  return response.data;
}

export async function getBookingsByApartmentId(apartmentId: string): Promise<Booking[]> {
  const response = await instance.get<{ message: string; data: Booking[] }>(
    `${endpoints.bookings}?apartmentId=${apartmentId}`
  );
  return response.data.data;
}