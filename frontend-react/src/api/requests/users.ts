import type { User } from "@/types/users";
import instance from "../axios-instance";
import { endpoints } from "../constants";

export async function getUsers(): Promise<User[]> {
  const response = await instance.get<{ message: string; data: User[] }>(endpoints.users);
  return response.data.data;
}

export async function getUser(id: string): Promise<User> {
  const response = await instance.get<{ message: string; data: User }>(
    `${endpoints.users}/${id}`
  );
  return response.data.data;
}

export async function updateUser(id: string | undefined, updates: Partial<User>): Promise<User> {
  const response = await instance.patch<{ message: string; data: User }>(
    `${endpoints.users}/${id}`,
    updates
  );
  return response.data.data;
}

export async function deleteUser(id: string): Promise<{ message: string }> {
  const response = await instance.delete<{ message: string }>(`${endpoints.users}/${id}`);
  return response.data;
}