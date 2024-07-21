import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { DefaultModalProps } from '@Stores/modal';
import { cn } from '@Utils/index';
import { motion } from 'framer-motion';
import { forwardRef, useState } from 'react';
import Lottie from 'react-lottie-player';

import howToVoteAsset1 from '@Assets/how_to_vote_1.json';
import howToVoteAsset2 from '@Assets/how_to_vote_2.png';
import howToVoteAsset3 from '@Assets/how_to_vote_3.png';

export const HowToVoteModal = forwardRef<HTMLDivElement, DefaultModalProps>(({ onClose }: DefaultModalProps, ref) => {
  return (
    <FlexibleLayout.Root ref={ref} className="h-fit">
      <FlexibleLayout.Header>
        <header className="relative px-5 py-4">
          <p className="text-center text-2xl font-semibold">FA:P 투표 방법</p>
        </header>
      </FlexibleLayout.Header>

      <Carousel onLastClick={onClose} />
    </FlexibleLayout.Root>
  );
});

type LottieJSON = { [k in string]: unknown };

type CarouselItem = {
  description: string;
} & (
  | {
      type: 'lottie';
      data: LottieJSON;
    }
  | {
      type: 'image';
      data: string;
    }
);

const carouselList: CarouselItem[] = [
  {
    type: 'lottie',
    data: howToVoteAsset1,
    description: `FA:P 선정에 동의한다면 오른쪽으로 스와이프해 FADE IN,\n동의하지 않는다면 왼쪽으로 스와이프해 FADE OUT!`,
  },
  {
    type: 'image',
    data: howToVoteAsset2,
    description: `공정한 투표를 위해 투표가 진행되는 동안은\n계정명이 가려지며 익명으로 진행돼요!`,
  },
  {
    type: 'image',
    data: howToVoteAsset3,
    description: `가장 많은 FADE IN을 받은 사진은\n그날의 FA:P로 선정돼요.\n마음에 드는 사진은 북마크하고,\n다른 유저를 구독해 다양한 패션을 확인해보세요!`,
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
    <>
      <FlexibleLayout.Content className="flex h-full w-full">
        <div className="relative flex flex-1 flex-col gap-5 overflow-hidden">
          <CarouselImageSection currentStep={currentStep} />
          <CarouselNav currentStep={currentStep} />
        </div>
      </FlexibleLayout.Content>

      <FlexibleLayout.Footer>
        <div className="flex p-4">
          <NextCarouselButton onClick={handleNextCarousel} isLastStep={isLastStep} />
        </div>
      </FlexibleLayout.Footer>
    </>
  );
}

function CarouselImageSection({ currentStep }: { currentStep: number }) {
  return (
    <motion.ul animate={{ x: `-${currentStep * 100}%` }} className="flex h-full flex-row whitespace-nowrap">
      {carouselList.map((carouselItem, index) => (
        <CarouselItem key={`carousel-item-${index}`} {...carouselItem} />
      ))}
    </motion.ul>
  );
}

function CarouselItem({ data, description, type }: CarouselItem) {
  const isLottie = type === 'lottie';
  const isImage = type === 'image';

  return (
    <li className="flex h-full min-w-full flex-col items-center justify-center">
      <div className="flex flex-1 items-center justify-center">
        {isImage && <img src={data} className="max-h-[13.125rem] w-full object-contain" />}
        {isLottie && <Lottie loop play animationData={data} className="max-h-full w-full" />}
      </div>
      <p className="whitespace-pre-line text-center">{description}</p>
    </li>
  );
}

function CarouselNav({ currentStep }: { currentStep: number }) {
  return (
    <ul className="flex h-fit w-full flex-1 flex-row items-center justify-center gap-3">
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
    <button
      type="button"
      className={cn('flex-1 rounded-lg bg-gray-200 py-2 text-xl text-black transition-colors', { ['bg-purple-700 text-white']: isLastStep })}
      onClick={onClick}>
      {!isLastStep && '다음'}
      {isLastStep && 'FA:P 투표 시작하기'}
    </button>
  );
}
