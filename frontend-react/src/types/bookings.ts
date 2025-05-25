import type { Apartment } from "./apartments";
import type { User } from "./users";

export interface Booking {
  id: string;
  userId: string;
  apartmentId: string;
  startDate: Date | string; 
  endDate: Date | string;   
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  totalPrice: number;
  createdAt: Date | string; 
  apartment:Apartment
  user:User
  
}