import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import type { Slide } from '@/types/slider'; 

interface SliderProps {
  slides: Slide[];
}

export default function Slider({ slides }: SliderProps) {
  return (
    <>
    <div className="w-full mx-auto ">
      <Swiper
        spaceBetween={30}
        loop={true}
        autoplay={{ delay: 5000 }}
        modules={[Autoplay]}
        className=" overflow-hidden shadow-lg"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative">
              <img
                src={slide.imageURL}
                alt={slide.title}
                className="w-full h-[85vh] object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
    </>
  );
}
