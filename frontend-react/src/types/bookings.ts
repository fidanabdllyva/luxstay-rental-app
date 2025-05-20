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