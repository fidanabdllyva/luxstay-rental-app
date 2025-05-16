import { getSlider } from "@/api/requests/slider";
import Slider from "@/components/client/Slider";
import type { Slide } from "@/types/slider";
import { useEffect, useState } from "react";

const About = () => {
  const [slides, setSlides] = useState<Slide[]>([]);

  useEffect(() => {
    getSlider("about").then((_slides) => {
      if (_slides) {
        setSlides(_slides);
      }
    });
  }, []);

  return (
    <section className="relative h-[75vh] w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10" />

      <Slider slides={slides} />

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          About Our Team
        </h1>
        <p className="text-lg md:text-xl">
          Redefining the apartment rental experience since 2018
        </p>
      </div>
    </section>
  );
};

export default About;
