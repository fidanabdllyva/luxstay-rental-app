export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
type endpoints = {
  slider: string,
  apartments: string
  users: string
  contacts: string
  bookings: string
  upload: string
  reviews: string
}

export const endpoints: endpoints = {
  slider: "/api/slider",
  apartments: "/api/apartments",
  users: "/api/users",
  contacts: "/api/contacts",
  bookings: "/api/bookings",
  upload: "/api/upload",
  reviews: "/api/reviews"
};
