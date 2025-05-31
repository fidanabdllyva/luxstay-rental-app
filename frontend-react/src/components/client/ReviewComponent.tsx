import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Input } from "../ui/input";
import type { User } from "@/types/users";
import { toast } from "sonner";

type ReviewDialogProps = {
  onSubmit: (data: { rating: number; comment: string }) => Promise<void> | void;
  user?: User;
};

const ReviewDialog: React.FC<ReviewDialogProps> = ({ onSubmit, user }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [open, setOpen] = useState(false);

  const handleStarClick = (starValue: number) => setRating(starValue);

  const handleSubmit = async () => {
    if (!comment.trim() || rating === 0) {
      toast.error("Please write a review and select a star rating.");
      return;
    }

    try {
      await onSubmit({ rating, comment });
      toast.success("Review submitted successfully!");
      setRating(0);
      setHover(0);
      setComment("");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to submit review");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Write a review</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg sm:p-8">
        <DialogHeader>
          <DialogTitle>Write a review</DialogTitle>
          <DialogDescription>
            <label className="block mb-1 font-medium">Your rating</label>
            <div className="flex items-center mb-4 gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-8 h-8 cursor-pointer ${
                    (hover || rating) >= star
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-400"
                  }`}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  aria-label={`${star} star`}
                />
              ))}
            </div>

            <label htmlFor="text" className="block mb-1 font-medium">
              Your username
            </label>
            <Input
              id="text"
              type="text"
              value={user?.username || ""}
              readOnly
              className="w-full mb-4 px-3 py-2 border rounded bg-gray-100 cursor-not-allowed"
            />

            <label htmlFor="comment" className="block mb-1 font-medium">
              Your review
            </label>
            <textarea
              id="comment"
              placeholder="Write your review here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border rounded resize-none"
            />
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit Review</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
