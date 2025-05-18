declare module 'react-lottie' {
  import { ComponentType } from 'react';

  interface LottieOptions {
    loop?: boolean;
    autoplay?: boolean;
    animationData: object;
    rendererSettings?: object;
  }

  interface LottieProps {
    options: LottieOptions;
    height?: number | string;
    width?: number | string;
    isStopped?: boolean;
    isPaused?: boolean;
    eventListeners?: Array<{
      eventName: string;
      callback: () => void;
    }>;
  }

  const Lottie: ComponentType<LottieProps>;
  export default Lottie;
}
