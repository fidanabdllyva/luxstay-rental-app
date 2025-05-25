import type { Apartment } from "./apartments";
import type { Booking } from "./bookings";
import type { Review } from "./reviews";

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'CLIENT' | 'HOST';
  profileImage: string;
  balance: number;
  hostRequest: boolean;
  isBanned: boolean;
  banDate?: Date | string ; 
  createdAt:Date | string;
  lastLogin?: Date | string;
  apartments?: Apartment[];
  wishlist?: Apartment[];
  bookings?: Booking[];     
  reviews?: Review[];       
}