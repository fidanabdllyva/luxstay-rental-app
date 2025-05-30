import { useSelector } from 'react-redux';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import type { Apartment } from '@/types/apartments';
import { ArrowLeft, Heart, Share } from 'lucide-react';
import { useNavigate } from 'react-router';
import type { RootState } from '@/redux/store';
import { useWishlist } from '@/hooks/useWishlist';

type ApartmentSliderProps = {
  apartment: Apartment;
};

export default function ApartmentSlider({ apartment }: ApartmentSliderProps) {
  const images = apartment.images ?? [];
  const navigate = useNavigate();

  // Get userId from Redux store
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  // Use the wishlist hook with userId only
  const { isInWishlist, toggleApartment, loading } = useWishlist(userId);

  // Check if current apartment is wishlisted
  const isWishlisted = isInWishlist(apartment.id);

  // Handler for wishlist toggle button
  const handleToggleWishlist = () => {
    if (!userId) return;
    toggleApartment(apartment.id);
  };

  return (
    <div className="relative">
      <div className="absolute top-4 left-4 z-10">
        <button
          className="bg-white/80 cursor-pointer hover:bg-white text-black p-2 rounded-full shadow transition"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ArrowLeft />
        </button>
      </div>

      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={handleToggleWishlist}
          disabled={!userId || loading} // disable if no userId or loading toggle
          className="bg-white/80 cursor-pointer hover:bg-white text-black p-2 rounded-full shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-black'} />
        </button>

        <button
          onClick={() => navigator.share?.({ title: apartment.title, url: window.location.href })}
          className="bg-white/80 cursor-pointer hover:bg-white text-black p-2 rounded-full shadow transition"
          aria-label="Share apartment"
        >
          <Share />
        </button>
      </div>

      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        loop={true}
        pagination={{ clickable: true }}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image}
              alt={apartment.title}
              className="w-full h-[75vh] object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
