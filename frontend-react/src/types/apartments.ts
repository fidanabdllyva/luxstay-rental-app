import type { Booking } from "./bookings";
import type { Review } from "./reviews";
import type { User } from "./users";

export type ApartmentType =
  | 'ISLAND'
  | 'APARTMENT'
  | 'VINTAGE'
  | 'VILLA'
  | 'PENTHOUSE'
  | 'GARDEN'
  | 'POOL';



export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';


export interface Apartment {
  id: string;
  title: string;
  type: ApartmentType;
  location: string;
  pricePerNight: number;
  coverImage: string;
  images: string[];
  description: string;
  features: string[];
  rules: string[];
  createdAt: string; 
  entrepreneurId: string;
  entrepreneur?: User;
  reviews?: Review[];
  avgRating: number;
  wishlistedBy?: User[];
  bookings?: Booking[];
}