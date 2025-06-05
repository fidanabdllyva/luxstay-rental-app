import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import dayjs from "dayjs";
import type { Apartment } from "@/types/apartments";
import { formatEnumLabel } from "@/utils/helper";
import { Check, Star } from "lucide-react";
import React, { useEffect } from "react";
import { createReview, deleteReviewById, getReviews } from "@/api/requests/reviews";
import type { User } from "@/types/users";
import ReviewDialog from "./ReviewComponent";
import { toast } from "sonner";

type DetailsTabsProps = {
    apartment: Apartment;
    user?: User;
};

const DetailsTabs = ({ apartment, user }: DetailsTabsProps) => {
    const [reviews, setReviews] = React.useState(apartment.reviews || []);

    useEffect(() => {
        async function fetchReviews() {
            const data = await getReviews({ apartmentId: apartment.id });
            setReviews(data);
        }
        fetchReviews();
    }, [apartment.id]);

    const avgRating =
        reviews.length === 0
            ? 0
            : reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    const handleReviewSubmit = async (data: { rating: number; comment: string }) => {
        if (!user || !apartment) {
            toast.error("User or apartment information is missing.");
            return;
        }
        try {
            await createReview({
                userId: user.id,
                apartmentId: apartment.id,
                rating: data.rating,
                comment: data.comment,
            });
            const updatedReviews = await getReviews({ apartmentId: apartment.id });
            setReviews(updatedReviews);
            toast.success("Review submitted successfully!");
        } catch (error) {
            console.error("Failed to submit review", error);
            toast.error("Failed to submit review.");
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        if (!window.confirm("Are you sure you want to delete your review?")) return;

        try {
            await deleteReviewById(reviewId);
            setReviews((prev) => prev.filter((r) => r.id !== reviewId));
            toast.success("Review deleted successfully.");
        } catch (error) {
            console.error("Failed to delete review", error);
            toast.error("Failed to delete review.");
        }
    };

    const houseRules = apartment.rules;
    const amenities = apartment.features;

    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs
                defaultValue="details"
                className="w-full"
            >
                <TabsList
                  className="overflow-x-auto no-scrollbar flex gap-1 sm:gap-3"
                  style={{ WebkitOverflowScrolling: 'touch' }}
                >
                    <TabsTrigger className="whitespace-nowrap" value="details">Details</TabsTrigger>
                    <TabsTrigger className="whitespace-nowrap" value="amenities">Amenities</TabsTrigger>
                    <TabsTrigger className="whitespace-nowrap" value="reviews">Reviews</TabsTrigger>
                    <TabsTrigger className="whitespace-nowrap" value="location">Location</TabsTrigger>
                </TabsList>

                {/* Details */}
                <TabsContent value="details" className="space-y-4">
                    <h3 className="text-xl font-semibold mt-3">Description</h3>
                    <p>{apartment.description}</p>

                    <h3 className="text-xl font-semibold mt-3 mb-2">Host</h3>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <Avatar className="w-16 h-16 flex-shrink-0">
                            <AvatarImage src={apartment.entrepreneur?.profileImage} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                            <h4 className="text-lg font-semibold">@{apartment.entrepreneur?.username}</h4>
                            <span className="block text-sm">
                                Host since{" "}
                                {apartment.entrepreneur?.createdAt &&
                                    dayjs(apartment.entrepreneur.createdAt).format("MMMM YYYY")}
                            </span>
                            <span className="block text-sm">98% response rate • Responds within an hour</span>
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold mt-3">House Rules</h3>
                    <div className="flex flex-wrap gap-3">
                        {houseRules.map((rule, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-1 bg-green-100 text-green-700 rounded px-3 py-1"
                            >
                                <Check className="text-green-500" />
                                <span>{formatEnumLabel(rule)}</span>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                {/* Amenities */}
                <TabsContent value="amenities" className="space-y-4">
                    <h3 className="text-xl font-semibold mt-3 mb-4">Amenities</h3>
                    <div className="flex flex-wrap gap-3">
                        {amenities.map((amenity, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-1 bg-green-100 text-green-700 rounded px-3 py-1"
                            >
                                <Check className="text-green-500" />
                                <span>{formatEnumLabel(amenity)}</span>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                {/* Reviews */}
                <TabsContent value="reviews" className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
                        <div className="flex border-r-2 pr-3 items-center gap-2">
                            <Star className="text-yellow-500" />
                            <span className="text-2xl font-bold">{avgRating.toFixed(1)}</span>
                        </div>
                        <span className="text-lg pl-3">{reviews.length} {reviews.length === 1 ? "review" : "reviews"}</span>
                        <ReviewDialog onSubmit={handleReviewSubmit} user={user} />
                    </div>

                    <div className="space-y-4 max-h-[300px] overflow-y-auto">
                        {reviews.length === 0 && <p>No reviews yet.</p>}

                        {reviews.map((review) => (
                            <div key={review.id} className="border rounded p-3">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                                    {review.user?.profileImage && (
                                        <img
                                            src={review.user.profileImage}
                                            alt={`${review.user.username}'s profile`}
                                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                        />
                                    )}
                                    <strong>{review.user?.username}</strong>
                                    <div className="flex text-yellow-400">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={star <= review.rating ? "fill-current" : "text-gray-300"}
                                                size={16}
                                            />
                                        ))}
                                    </div>

                                    {user?.id === review.user?.id && (
                                        <button
                                            onClick={() => handleDeleteReview(review.id)}
                                            className="ml-auto text-red-600 hover:underline text-sm"
                                            aria-label="Delete your review"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                                <p>{review.comment}</p>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                {/* Location */}
                <TabsContent value="location" className="space-y-4">
                    <h3 className="text-xl font-bold mt-3 mb-2">Location</h3>
                    <p className="text-md font-semibold mb-4">{apartment.location}</p>
                    <iframe
                        className="w-full h-72 sm:h-[300px] rounded-xl border"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps?q=${encodeURIComponent(apartment.location)}&output=embed`}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default DetailsTabs;
