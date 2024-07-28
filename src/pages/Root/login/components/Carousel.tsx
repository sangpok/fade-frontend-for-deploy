import { cn, prefetchImages } from '@Utils/index';
import { motion } from 'framer-motion';
import { useEffect, useLayoutEffect, useState } from 'react';

import onboardingImage1 from '@Assets/onboarding_image_1.jpg';
import onboardingImage2 from '@Assets/onboarding_image_2.jpg';
import onboardingImage3 from '@Assets/onboarding_image_3.jpg';

const onboardingImages = [onboardingImage1, onboardingImage2, onboardingImage3];

const prefetchOnboardingImages = async () => {
  prefetchImages(onboardingImages);
};

export function Carousel() {
  const [currentImageId, setCurrentImageId] = useState(0);

  const createTimer = () =>
    setInterval(() => {
      setCurrentImageId((prevId) => (prevId === onboardingImages.length - 1 ? 0 : prevId + 1));
    }, 3000);

  const [timerId, setTimerId] = useState<NodeJS.Timeout>(() => createTimer());

  const restartInterval = () => {
    clearInterval(timerId);
    setTimerId(createTimer());
  };

  useLayoutEffect(() => {
    prefetchOnboardingImages();
  }, []);

  useEffect(() => {
    return () => clearInterval(timerId);
  }, []);

  const handleNavItemClick = (index: number) => {
    setCurrentImageId(index);
    restartInterval();
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <div className="relative aspect-[3/4] h-full rounded-lg shadow-bento">
        <DissolveImages currentImageId={currentImageId} />
      </div>

      <NavButtons currentImageId={currentImageId} onNavClicked={handleNavItemClick} />
    </div>
  );
}

function DissolveImages({ currentImageId }: { currentImageId: number }) {
  return onboardingImages.map((image, index) => (
    <motion.div
      key={image}
      initial={{ opacity: 0 }}
      animate={{ opacity: index === currentImageId ? 1 : 0 }}
      style={{ backgroundImage: `url('${image}')` }}
      className={`absolute inset-0 bg-contain bg-center bg-no-repeat`}
    />
  ));
}

function NavButtons({ currentImageId, onNavClicked }: { currentImageId: number; onNavClicked: (index: number) => void }) {
  return (
    <ul className="flex flex-row justify-center gap-3">
      {onboardingImages.map((_, index) => (
        <li key={`nav-${index}`}>
          <button
            className={cn('size-2 rounded-full bg-gray-200 transition-colors', { ['bg-purple-500']: index === currentImageId })}
            onClick={() => onNavClicked(index)}
          />
        </li>
      ))}
    </ul>
  );
}
