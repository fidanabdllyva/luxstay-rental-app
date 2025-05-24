import type { Contact } from "@/types/contact";
import { endpoints } from "../constants";
import instance from "../axios-instance";

type NewContactPayload = {
  fullName: string;
  email: string;
  subject: string;
  message: string;
};

export async function getContacts(): Promise<Contact[]> {
  const response = await instance.get<{ message: string; data: Contact[] }>(endpoints.contacts);
  return response.data.data;
}

export async function postContact(payload: NewContactPayload): Promise<Contact> {
  const response = await instance.post<{ message?: string; data: Contact }>(endpoints.contacts, payload);
  return response.data.data;
}

export async function deleteContact(id: string): Promise<{ message: string }> {
  const response = await instance.delete<{ message: string }>(`${endpoints.contacts}/${id}`);
  return response.data;
}

export async function updateContact(
  id: string,
  updatedFields: Partial<Pick<Contact, "isRead">>
): Promise<Contact> {
  const response = await instance.patch<{ data: Contact }>(
    `${endpoints.contacts}/${id}`,
    updatedFields
  );
  return response.data.data;
}
