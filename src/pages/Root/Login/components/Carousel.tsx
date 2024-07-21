import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useLayoutEffect, useState } from 'react';

import onboardingImage1 from '@Assets/onboarding_image_1.jpg';
import onboardingImage2 from '@Assets/onboarding_image_2.jpg';
import onboardingImage3 from '@Assets/onboarding_image_3.jpg';
import { cn } from '@Utils/index';

const onboardingImages = [onboardingImage1, onboardingImage2, onboardingImage3];

const loadOnboardingImagePreload = async () => {
  onboardingImages.forEach((image) => {
    const img = new Image();
    img.src = image;
  });
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
    loadOnboardingImagePreload();
  }, []);

  useEffect(() => {
    return () => clearInterval(timerId);
  }, []);

  const handleNavItemClick = (index: number) => {
    setCurrentImageId(index);
    restartInterval();
  };

  return (
    <div>
      <div className="relative aspect-[3/4] w-[18.75rem] rounded-lg shadow-bento">
        <DissolveImages currentImageId={currentImageId} />
      </div>

      <NavButtons currentImageId={currentImageId} onNavClicked={handleNavItemClick} />
    </div>
  );
}

function DissolveImages({ currentImageId }: { currentImageId: number }) {
  return (
    <AnimatePresence>
      {onboardingImages.map(
        (image, index) =>
          index === currentImageId && (
            <motion.div
              key={image}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ backgroundImage: `url('${image}')`, backgroundSize: 'contain' }}
              className="absolute left-0 top-0 aspect-[3/4] w-full"
            />
          )
      )}
    </AnimatePresence>
  );
}

function NavButtons({ currentImageId, onNavClicked }: { currentImageId: number; onNavClicked: (index: number) => void }) {
  return (
    <ul className="mt-5 flex flex-row justify-center gap-3">
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
