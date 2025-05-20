import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import dayjs from 'dayjs';

import type { Apartment } from "@/types/apartments"
import { formatEnumLabel } from "@/utils/helper";
import { Check, Star } from "lucide-react";

type DetailsTabsProps = {
    apartment: Apartment
}

const DetailsTabs = ({ apartment }: DetailsTabsProps) => {
    const houseRules = apartment.rules
    const amenities = apartment.features
    const apartmentReview = apartment.reviews

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

                            <span>Host since {apartment.entrepreneur?.createdAt && dayjs(apartment.entrepreneur.createdAt).format('MMMM YYYY')}</span>
                            <span>98% response rate • Responds within an hour</span>
                        </div>


                    </div>

                    <h3 className="text-xl font-semibold mt-3">House Rules</h3>
                    {houseRules.map((rule, idx) => (
                        <div className="flex gap-1">
                            <Check className="text-green-500" />
                            <span className={"flex flex-col mb-3"} key={idx}>
                                {formatEnumLabel(rule)}
                            </span>
                        </div>
                    ))}

                </TabsContent>
                {/* Amenities */}
                <TabsContent value="amenities">
                    <h3 className="text-xl font-semibold mt-3 mb-4">Amenities</h3>
                    {amenities.map((amenity, idx) => (
                        <div className="flex gap-1">
                            <Check className="text-green-500" />
                            <span className={"flex flex-col mb-3"} key={idx}>
                                {formatEnumLabel(amenity)}
                            </span>
                        </div>
                    ))}
                </TabsContent>


                <TabsContent value="reviews">
                    <div className="flex items-center">
                        <div className="flex border-r-2 gap-2 pr-3 items-center">
                            <Star className="text-yellow-500" />
                            <span className="text-2xl font-bold">{apartment.avgRating}</span>
                        </div>

                        <span className="text-lg pl-3">{apartment.reviews?.length || 0} {apartment.reviews?.length === 1 ? "review" : "reviews"}</span>
                    </div>
                    <div>
                        {apartmentReview?.map((review)=>(
                            <>
                            <h3>{review.user.username}</h3>
                            <div>{review.comment}</div>
                            
                            </>
                        ))}

                    </div>
                </TabsContent>
                <TabsContent value="location">Change your password here.</TabsContent>
            </Tabs>

        </>
    )
}

export default DetailsTabs