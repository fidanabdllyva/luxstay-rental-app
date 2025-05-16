export type ApartmentType =
  | 'ISLAND'
  | 'APARTMENT'
  | 'VINTAGE'
  | 'VILLA'
  | 'PENTHOUSE'
  | 'GARDEN'
  | 'POOL';

export type Feature =
  | 'WIFI'
  | 'AC'
  | 'HEATING'
  | 'KITCHEN'
  | 'PARKING'
  | 'POOL'
  | 'PET_FRIENDLY'
  | 'WASHER'
  | 'DRYER'
  | 'GYM'
  | 'ELEVATOR'
  | 'BALCONY'
  | 'HOT_TUB'
  | 'BREAKFAST_INCLUDED'
  | 'TV'
  | 'SMOKE_DETECTOR'
  | 'FIRE_EXTINGUISHER'
  | 'FURNISHED'
  | 'WHEELCHAIR_ACCESSIBLE'
  | 'BABY_COT';

export type Rule =
  | 'NO_SMOKING'
  | 'NO_PETS'
  | 'NO_PARTIES'
  | 'QUIET_HOURS'
  | 'CHECK_IN_AFTER_3PM'
  | 'CHECK_OUT_BEFORE_11AM'
  | 'NO_UNREGISTERED_GUESTS'
  | 'CLEAN_UP_AFTER_YOURSELF'
  | 'NO_ILLEGAL_ACTIVITIES'
  | 'RESPECT_NEIGHBORS';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface User {
  id: string;
  username?: string;
  email?: string;
  role: 'Client' | 'Entrepreneur' | 'Admin';
}

export interface Review {
  id: string;
  userId: string;
  apartmentId: string;
  rating: number;
  comment: string;
  createdAt: string; // ISO date string
}

export interface Booking {
  id: string;
  userId: string;
  apartmentId: string;
  startDate: string; // ISO date string
  endDate: string;   // ISO date string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  totalPrice: number;
  createdAt: string; // ISO date string
}

export interface Apartment {
  id: string;
  title: string;
  type: ApartmentType;
  location: string;
  pricePerNight: number;
  coverImage: string;
  images: string[];
  description: string;
  features: Feature[];
  rules: Rule[];
  createdAt: string; // ISO date string
  entrepreneurId: string;
  entrepreneur?: User;
  reviews?: Review[];
  avgRating: number;
  wishlistedBy?: User[];
  bookings?: Booking[];
}