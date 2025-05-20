import type { Apartment } from "./apartments";
import type { User } from "./users";

export interface Review {
  id: string;
  user:User;
  userId: string;
  apartment:Apartment
  apartmentId: string;
  rating: number;
  comment: string;
  createdAt: string; }

