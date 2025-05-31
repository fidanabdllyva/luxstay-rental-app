import instance from "../axios-instance";
import { endpoints } from "../constants";

export async function getReviews(filter?: {
  userId?: string;
  apartmentId?: string;
  rating?: number;
}) {
  let url = endpoints.reviews;

  if (filter) {
    const params = new URLSearchParams();
    if (filter.userId) params.append("userId", filter.userId);
    if (filter.apartmentId) params.append("apartmentId", filter.apartmentId);
    if (typeof filter.rating === "number") {
      params.append("rating", String(filter.rating));
    }

    url += `?${params.toString()}`;
  }

  const response = await instance.get(url);
  return response.data;
}

export async function getReviewById(id: string) {
  if (!id) throw new Error("Review ID is required");

  const response = await instance.get(`${endpoints.reviews}/${id}`);
  return response.data;
}

export async function updateReviewById(
  id: string,
  data: Partial<{
    rating: number;
    comment: string;
  }>
) {
  if (!id) throw new Error("Review ID is required");
  if (!data || Object.keys(data).length === 0)
    throw new Error("Update data is required");

  const response = await instance.patch(`${endpoints.reviews}/${id}`, data);
  return response.data;
}

export async function createReview(data: {
  userId: string;
  apartmentId: string;
  rating: number;
  comment: string;
}) {
  if (!data) throw new Error("Review data is required");

  const response = await instance.post(endpoints.reviews, data);
  return response.data;
}

export async function deleteReviewById(id: string) {
  if (!id) throw new Error("Review ID is required");

  const response = await instance.delete(`${endpoints.reviews}/${id}`);
  return response.data;
}
