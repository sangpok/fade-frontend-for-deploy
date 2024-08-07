import { Button } from '@Components/ui/button';
import { Image } from '@Components/ui/image';
import { useModalActions } from '@Hooks/modal';
import { HowToVoteModal } from './HowToVoteModal';

export function ReadyToVoteView({ onVoteStart }: { onVoteStart: () => void }) {
  return (
    <div className="flex h-full flex-col justify-between gap-5">
      <ReadyToVoteCover />
      <ReadyToVoteTools onVoteStart={onVoteStart} />
    </div>
  );
}

function ReadyToVoteCover() {
  return (
    <div className="flex-1 overflow-hidden rounded-lg bg-gray-200 shadow-bento">
      <Image src="/assets/vote_starting_image.png" size="contain" local />
    </div>
  );
}

function HowToVoteButton() {
  const { showModal } = useModalActions();

  const showHowToVoteModal = async () => {
    return await showModal({ type: 'component', Component: HowToVoteModal });
  };

  return (
    <Button variants="white" className="py-2 text-xl font-normal shadow-bento" onClick={showHowToVoteModal}>
      투표 방법
    </Button>
  );
}

function ReadyToVoteTools({ onVoteStart }: { onVoteStart: () => void }) {
  return (
    <div className="flex w-full flex-col gap-3">
      <StartVoteButton onClick={onVoteStart} />
      <HowToVoteButton />
    </div>
  );
}

function StartVoteButton({ onClick }: { onClick: () => void }) {
  return (
    <Button className="text-xl shadow-bento" onClick={onClick}>
      투표 시작하기
    </Button>
  );
}
