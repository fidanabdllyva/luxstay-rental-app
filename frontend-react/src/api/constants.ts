 export const API_URL = import.meta.env.VITE_API_URL;
type endpoints={
  slider:string,
  apartments:string
}

export const endpoints: endpoints = {
  slider: "/api/slider",
  apartments: "/api/apartments"
};
