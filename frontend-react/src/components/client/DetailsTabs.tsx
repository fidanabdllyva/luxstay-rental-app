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
            alert("User or apartment information is missing.");
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
        } catch (error) {
            console.error("Failed to submit review", error);
            alert("Failed to submit review");
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        if (!window.confirm("Are you sure you want to delete your review?")) return;

        try {
            await deleteReviewById(reviewId);
            setReviews((prev) => prev.filter((r) => r.id !== reviewId));
        } catch (error) {
            console.error("Failed to delete review", error);
            alert("Failed to delete review");
        }
    };


    const houseRules = apartment.rules;
    const amenities = apartment.features;

    return (
        <>
            <Tabs defaultValue="details" className="w-[400px]">
                <TabsList>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="amenities">Amenities</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    <TabsTrigger value="location">Location</TabsTrigger>
                </TabsList>

                {/* Details */}
                <TabsContent value="details">
                    <h3 className="text-xl font-semibold mt-3">Description</h3>
                    <p>{apartment.description}</p>

                    <h3 className="text-xl font-semibold mt-3 mb-3">Host</h3>
                    <div className="flex items-center gap-3">
                        <Avatar className="w-15 h-15">
                            <AvatarImage src={apartment.entrepreneur?.profileImage} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <h4 className="text-lg font-semibold">@{apartment.entrepreneur?.username}</h4>

                            <span>
                                Host since{" "}
                                {apartment.entrepreneur?.createdAt &&
                                    dayjs(apartment.entrepreneur.createdAt).format("MMMM YYYY")}
                            </span>
                            <span>98% response rate • Responds within an hour</span>
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold mt-3">House Rules</h3>
                    {houseRules.map((rule, idx) => (
                        <div key={idx} className="flex gap-1">
                            <Check className="text-green-500" />
                            <span className="flex flex-col mb-3">{formatEnumLabel(rule)}</span>
                        </div>
                    ))}
                </TabsContent>

                {/* Amenities */}
                <TabsContent value="amenities">
                    <h3 className="text-xl font-semibold mt-3 mb-4">Amenities</h3>
                    {amenities.map((amenity, idx) => (
                        <div key={idx} className="flex gap-1">
                            <Check className="text-green-500" />
                            <span className="flex flex-col mb-3">{formatEnumLabel(amenity)}</span>
                        </div>
                    ))}
                </TabsContent>

                {/* Reviews */}
                <TabsContent value="reviews">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex border-r-2 gap-2 pr-3 items-center">
                            <Star className="text-yellow-500" />
                            <span className="text-2xl font-bold">{avgRating.toFixed(1)}</span>
                        </div>
                        <span className="text-lg pl-3">
                            {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                        </span>

                        {/* Pass user here */}
                        <ReviewDialog onSubmit={handleReviewSubmit} user={user} />
                    </div>

                    <div className="space-y-4 max-h-[300px] overflow-y-auto">
                        {reviews.length === 0 && <p>No reviews yet.</p>}

                        {reviews.map((review) => (
                            <div key={review.id} className="border rounded p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    {review.user?.profileImage && (
                                        <img
                                            src={review.user.profileImage}
                                            alt={`${review.user.username}'s profile`}
                                            className="w-8 h-8 rounded-full object-cover"
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
                <TabsContent value="location">
                    <h3 className="text-xl font-bold mt-3 mb-2">Location</h3>
                    <p className="text-md font-semibold mb-4">{apartment.location}</p>
                    <iframe
                        className="w-full h-[300px] rounded-xl border"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps?q=${encodeURIComponent(apartment.location)}&output=embed`}
                    />
                </TabsContent>
            </Tabs>
        </>
    );
};

export default DetailsTabs;
