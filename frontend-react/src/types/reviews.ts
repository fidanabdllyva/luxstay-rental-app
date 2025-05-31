export interface Review {
  id: string;
  userId: string;
  user?: {
    id:string
    username: string;
    profileImage?: string;
  };
  apartmentId: string;
  rating: number;
  comment: string;
  createdAt: string;
}


