import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import type { Apartment } from '@/types/apartments';
import { ArrowLeft, Heart, Share } from 'lucide-react';
import { useNavigate } from 'react-router';

type ApartmentSliderProps = {
  apartment: Apartment;
};

export default function ApartmentSlider({ apartment }: ApartmentSliderProps) {
  const images = apartment.images;
  let navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  return (
    <div className="relative">
      <div className='absolute top-4 left-4 z-10'>

        <button className=" bg-white/80 cursor-pointer hover:bg-white  text-black p-2 rounded-full shadow transition" onClick={() => {
          navigate(-1);
        }}>

          <ArrowLeft />
        </button>
      </div>
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => setLiked(!liked)}
          className="bg-white/80 cursor-pointer hover:bg-white text-black p-2 rounded-full shadow transition"
        >
          <Heart

            className={liked ? 'fill-red-500 text-red-500' : 'text-black'}
          />
        </button>
        <button
          onClick={() => navigator.share?.({ title: apartment.title, url: window.location.href })}
          className="bg-white/80 cursor-pointer hover:bg-white text-black p-2 rounded-full shadow transition"
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
        pagination={{
          clickable: true,

        }}
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
