import { useEffect, useState } from 'react';
import Slider from '@/components/client/Slider';
import type { Slide } from '@/types/slider';
import { getSlider } from '@/api/requests/slider';
import HeroHome from '@/components/client/HeroHome';
import ApartmentCard from '@/components/client/ApartmentCard';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { getApartments } from '@/api/requests/apartments';
import type { Apartment } from '@/types/apartments';
import { SkeletonCard } from '@/components/client/SkeletonCard';


export default function Home() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSlider('home').then((_slides) => {
      if (_slides) {
        setSlides(_slides);
      }
    });
    getApartments().then((_apartments) => {
      if (_apartments) {
        setApartments(_apartments);
      }
      setLoading(false);
    });
  }, []);




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
        <div className="grid px-7 grid-cols-1 md:grid-cols-4 gap-6 mt-4">
          <ApartmentCard apartments={apartments.slice(0, 4)}
            isLoading={loading} />
        </div>
        <div className='flex justify-center mt-6 mb-10'>
          <Button className=' px-6 py-5' variant={"outline"}>
            <Link to={"/apartments"}> View All Apartments</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
