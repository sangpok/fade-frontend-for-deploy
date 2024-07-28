import voteStartImage from '@Assets/vote_starting_image.jpg';
import { useModalActions } from '@Hooks/modal';
import { HowToVoteModal } from './HowToVoteModal';
import { Image } from '@Components/ui/image';
import { Button } from '@Components/ui/button';

export function ReadyToVoteView({ onStartClick }: { onStartClick: () => void }) {
  return (
    <div className="flex h-full flex-col justify-between gap-5">
      <ReadyToVoteCover />
      <ReadyToVoteTools onStartClick={onStartClick} />
    </div>
  );
}

function ReadyToVoteCover() {
  return <Image src={voteStartImage} className="flex-1 rounded-lg bg-gray-200 shadow-bento" size="contain" />;
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

function ReadyToVoteTools({ onStartClick }: { onStartClick: () => void }) {
  return (
    <div className="flex w-full flex-col gap-3">
      <StartVoteButton onClick={onStartClick} />
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
