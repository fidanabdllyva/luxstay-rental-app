import { useEffect, useState } from 'react';
import Slider from '@/components/client/Slider';
import type { Slide } from '@/types/slider';
import { getSlider } from '@/api/requests/slider';
import { getApartments } from '@/api/requests/apartments'; 
import HeroHome from '@/components/client/HeroHome';
import type { Apartment } from '@/types/apartments';


export default function Home() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);

  useEffect(() => {
    getSlider().then((_slides) => {
      if (_slides) {
        setSlides(_slides);
      }
    });

    getApartments().then((_apartments) => {
      if (_apartments) {
        setApartments(_apartments);
      }
    });
  }, []);

  console.log(slides)
  return (
    <>
      <section className="relative h-[85vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10" />

        <Slider slides={slides} />
        <HeroHome />
      </section>

      <section>
        <h3 className='text-3xl text-center mt-10 font-bold'>Featured Apartments</h3>
        <p className='text-muted-foreground text-center mt-3 w-2xl mx-auto'>
          Discover our handpicked selection of premium apartments, offering exceptional comfort and style
          for your next stay.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {apartments.map((apt) => (
            <div key={apt.id} className="border rounded shadow p-4">
              <img
                src={apt.coverImage}
                alt={apt.title}
                className="w-full h-48 object-cover rounded"
              />
              <h4 className="mt-2 font-semibold">{apt.title}</h4>
              <p className="text-sm text-gray-600">{apt.description}</p>
              <p className="mt-1 font-bold">${apt.pricePerNight} / night</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
