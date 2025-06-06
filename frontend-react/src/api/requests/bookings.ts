import type { Booking } from "@/types/bookings";
import { endpoints } from "../constants";
import instance from "../axios-instance";

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export async function getBookings(): Promise<Booking[]> {
  const response = await instance.get<{ message: string; data: Booking[] }>(
    endpoints.bookings
  );
  return response.data.data;
}

export async function getHostBookings(
  entrepreneurId?: string
): Promise<Booking[]> {
  const url = entrepreneurId
    ? `${endpoints.bookings}?entrepreneurId=${entrepreneurId}`
    : endpoints.bookings;

  const response = await instance.get<{ message: string; data: Booking[] }>(url);
  return response.data.data;
}

export async function getBookingsByApartmentId(apartmentId: string): Promise<Booking[]> {
  const url = `${endpoints.bookings}?apartmentId=${apartmentId}`;
  const response = await instance.get<{ message: string; data: Booking[] }>(url);
  return response.data.data;
}

export async function getBookingById(id: string): Promise<Booking> {
  const response = await instance.get<{ data: Booking }>(`${endpoints.bookings}/${id}`);
  return response.data.data;
}

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

export async function createBooking(
  data: Partial<Booking>
): Promise<{ message: string }> {
  const response = await instance.post<{ message: string }>(endpoints.bookings, data);
  return response.data;
}
