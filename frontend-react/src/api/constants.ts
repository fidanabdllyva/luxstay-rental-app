 export const API_URL = import.meta.env.VITE_API_URL;
type endpoints={
  slider:string,
  apartments:string
  users:string
  contacts:string
  bookings:string
  upload:string
}

export const endpoints: endpoints = {
  slider: "/api/slider",
  apartments: "/api/apartments",
  users:"/api/users",
  contacts:"/api/contacts",
  bookings:"/api/bookings",
  upload:"/api/upload"
};
