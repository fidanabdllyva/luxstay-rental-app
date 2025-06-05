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
        <HeroHome apartments={apartments} />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <h3 className="text-3xl font-bold text-center mb-3">Featured Apartments</h3>
        <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-8">
          Discover our handpicked selection of premium apartments, offering exceptional comfort and style
          for your next stay.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ApartmentCard apartments={apartments.slice(0, 4)} isLoading={loading} />
        </div>
        <div className="flex justify-center mt-10 mb-16">
          <Button variant="outline" className="px-6 py-3 text-base sm:text-lg">
            <Link to="/apartments">View All Apartments</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
