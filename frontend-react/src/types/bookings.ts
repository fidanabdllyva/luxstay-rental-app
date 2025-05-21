export interface Booking {
  id: string;
  userId: string;
  apartmentId: string;
  startDate: Date | string; 
  endDate: Date | string;   
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  totalPrice: number;
  createdAt: string; // ISO date string
}