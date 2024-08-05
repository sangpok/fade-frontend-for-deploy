import { Image } from '@Components/ui/image';
import { cn } from '@Utils/index';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const onboardingImage1 = '/assets/onboarding_image1.png';
const onboardingImage2 = '/assets/onboarding_image2.png';
const onboardingImage3 = '/assets/onboarding_image3.png';

const onboardingImages = [onboardingImage1, onboardingImage2, onboardingImage3];

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

  useEffect(() => {
    return () => clearInterval(timerId);
  }, []);

  const handleNavItemClick = (index: number) => {
    setCurrentImageId(index);
    restartInterval();
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <div className="relative aspect-[3/4] h-full overflow-hidden rounded-lg shadow-bento">
        <DissolveImages currentImageId={currentImageId} />
      </div>

      <NavButtons currentImageId={currentImageId} onNavClicked={handleNavItemClick} />
    </div>
  );
}

function DissolveImages({ currentImageId }: { currentImageId: number }) {
  return onboardingImages.map((image, index) => (
    <motion.div key={image} initial={{ opacity: 0 }} animate={{ opacity: index === currentImageId ? 1 : 0 }} className={`absolute inset-0`}>
      <Image src={image} local />
    </motion.div>
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
