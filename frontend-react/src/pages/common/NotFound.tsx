import animationData from "@/lotties/404-not-found.json";
import Lottie from 'react-lottie';
import { Link } from "react-router";


const NotFound = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return (
    <section className="mt-20">
      <div>
        <Lottie
          options={defaultOptions}
          height={400}
          width={400}
        />
      </div>
      <div className="px-5 py-16 md:px-10 md:py-20">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
          <p className="mx-auto mb-5 max-w-lg text-sm text-gray-500 sm:text-base md:mb-6 lg:mb-8">
            We can't seem to find the page you're looking for.
          </p>
          <Link to={"/"} className="inline-block items-center rounded-md bg-black px-8 py-4 text-center font-semibold text-white">
            Back Home
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFound