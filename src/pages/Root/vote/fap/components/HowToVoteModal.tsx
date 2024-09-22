import { Button } from '@Components/ui/button';
import { Image } from '@Components/ui/image';
import { DefaultModalProps } from '@Stores/modal';
import { cn } from '@Utils/index';
import { motion } from 'framer-motion';
import { forwardRef, useState } from 'react';
import Lottie from 'react-lottie-player';

import howToVoteAsset1 from './_assets/how_to_vote_1.json';
const howToVoteAsset2 = '/assets/how_to_vote_2.png';
const howToVoteAsset3 = '/assets/how_to_vote_3.png';

export const HowToVoteModal = forwardRef<HTMLDivElement, DefaultModalProps>(({ onClose }: DefaultModalProps, ref) => {
  return (
    <div ref={ref}>
      <header className="relative px-5 py-4">
        <p className="text-center text-lg font-semibold">FA:P 투표 방법</p>
      </header>

      <Carousel onLastClick={onClose} />
    </div>
  );
});

type LottieJSON = { [k in string]: unknown };

type CarouselItem = {
  description: string;
  size?: 'contain' | 'fit';
} & (
  | {
      type: 'lottie';
      data: LottieJSON;
    }
  | {
      type: 'image';
      data: string;
      size: 'contain' | 'fit';
    }
);

const carouselList: CarouselItem[] = [
  {
    type: 'lottie',
    data: howToVoteAsset1,
    description: `FA:P 선정에 동의하면 오른쪽으로 스와이프,\n동의하지 않으면 왼쪽으로 스와이프!`,
  },
  {
    type: 'image',
    data: howToVoteAsset2,
    size: 'contain',
    description: `투표는 공정성을 위해 익명으로 진행되며,\n투표 중에는 계정명이 가려져요!`,
  },
  {
    type: 'image',
    data: howToVoteAsset3,
    size: 'fit',
    description: `가장 많은 FADE IN을 받은 사진이\nFA:P로 선정돼요.\n\n마음에 드는 사진은 북마크하고,\n다른 유저를 구독해보세요!`,
  },
];

function Carousel({ onLastClick }: { onLastClick: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);

  const isLastStep = currentStep === carouselList.length - 1;

  const handleNextCarousel = () => {
    if (isLastStep) {
      return onLastClick();
    }

    setCurrentStep(currentStep + 1);
  };

  return (
    <div className="flex flex-1 flex-col space-y-4 p-5">
      <div className="flex flex-1 flex-col gap-5 overflow-hidden">
        <CarouselImageSection currentStep={currentStep} />
        <CarouselNav currentStep={currentStep} />
      </div>

      <NextCarouselButton onClick={handleNextCarousel} isLastStep={isLastStep} />
    </div>
  );
}

function CarouselImageSection({ currentStep }: { currentStep: number }) {
  return (
    <motion.ul animate={{ x: `-${currentStep * 100}%` }} className="flex h-[15.625rem] flex-1 flex-row items-center whitespace-nowrap">
      <li className="flex min-w-full flex-1 flex-col items-center justify-center gap-4">
        <div className="flex aspect-[12/1] w-full flex-1 items-center justify-center">
          <Lottie loop play={currentStep === 0} animationData={carouselList[0].data as LottieJSON} />
        </div>
        <p className="whitespace-pre-line px-4 text-center">{carouselList[0].description}</p>
      </li>

      <li className="flex h-full min-w-full flex-1 flex-col items-center justify-center gap-4">
        <div className="flex w-full flex-1 items-center justify-center pb-4">
          <Image src={carouselList[1].data as string} size="contain" local className="h-[3.625rem] w-[25rem]" />
        </div>
        <p className="whitespace-pre-line px-4 text-center">{carouselList[1].description}</p>
      </li>

      <li className="flex h-full min-w-full flex-1 flex-col items-center justify-center gap-4">
        <div className="flex h-full w-full flex-1 items-center justify-center pb-4">
          <Image src={carouselList[2].data as string} size="fit" local className="h-10 w-[5.625rem]" />
        </div>
        <p className="whitespace-pre-line px-4 text-center">{carouselList[2].description}</p>
      </li>
      {/* {carouselList.map((carouselItem, index) => (
        <CarouselItem key={`carousel-item-${index}`} {...carouselItem} />
      ))} */}
    </motion.ul>
  );
}

function CarouselItem({ data, description, type, size = 'contain' }: CarouselItem) {
  const isLottie = type === 'lottie';
  const isImage = type === 'image';

  return (
    <li className="flex min-w-full flex-1 flex-col items-center justify-center gap-4">
      <div className="flex aspect-[2/1] w-full flex-1 items-center justify-center">
        {isImage && <Image src={data} size={size} local className="max-w-full" />}
        {isLottie && <Lottie loop play animationData={data} />}
      </div>
      <p className="whitespace-pre-line px-4 text-center">{description}</p>
    </li>
  );
}

function CarouselNav({ currentStep }: { currentStep: number }) {
  return (
    <ul className="flex w-full flex-1 flex-row items-center justify-center gap-3">
      {carouselList.map((_, index) => (
        <CarouselNavItem key={`carousel-nav-${index}`} isActive={index === currentStep} />
      ))}
    </ul>
  );
}

function CarouselNavItem({ isActive }: { isActive: boolean }) {
  return <li className={cn('size-2 rounded-full bg-gray-200 transition-colors', { ['bg-purple-700']: isActive })} />;
}

function NextCarouselButton({ onClick, isLastStep }: { onClick: () => void; isLastStep: boolean }) {
  return (
    <Button variants={isLastStep ? 'primary' : 'secondary'} className="w-full" onClick={onClick}>
      {!isLastStep && '다음'}
      {isLastStep && 'FA:P 투표 시작하기'}
    </Button>
  );
}
