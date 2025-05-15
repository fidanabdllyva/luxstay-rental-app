import { useEffect, useState } from 'react';
import Slider from '@/components/client/Slider';
import type { Slide } from '@/types/slider';
import { getSlider } from '@/api/requests/slider';


export default function Home() {
  const [slides, setSlides] = useState<Slide[]>([]);

  useEffect(() => {
    getSlider().then((slides) => {
      if (slides) {
        setSlides(slides)
      }
      ;
    });

  }, []);

  return (
    <div>
      <Slider slides={slides} />
    </div>
  );
}
