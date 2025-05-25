import type { User } from "@/types/users";
import instance from "../axios-instance";
import { endpoints } from "../constants";

export async function getUsers(): Promise<User[]> {
  const response = await instance.get<{ message: string; data: User[] }>(endpoints.users);
  return response.data.data;
}