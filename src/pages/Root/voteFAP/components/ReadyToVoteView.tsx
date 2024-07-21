import voteStartImage from '@Assets/vote_starting_image.jpg';
import { useModalActions } from '@Hooks/modal';
import { HowToVoteModal } from './HowToVoteModal';

export function ReadyToVoteView({ onStartClick }: { onStartClick: () => void }) {
  return (
    <div className="flex h-full flex-col justify-between gap-5">
      <ReadyToVoteCover />
      <ReadyToVoteTools onStartClick={onStartClick} />
    </div>
  );
}

function ReadyToVoteCover() {
  return (
    <div
      className="flex-1 rounded-lg bg-gray-200 shadow-bento"
      style={{
        backgroundImage: `url('${voteStartImage}')`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}></div>
  );
}

function HowToVoteButton() {
  const { showModal } = useModalActions();

  const showHowToVoteModal = async () => {
    return await showModal({ type: 'component', Component: HowToVoteModal });
  };

  return (
    <button className="group rounded-lg border-gray-200 bg-white p-2 text-xl shadow-bento" onClick={showHowToVoteModal}>
      <span className="inline-block transition-transform pointerdevice:group-hover:scale-105 pointerdevice:group-active:scale-95">투표 방법</span>
    </button>
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
    <button className="group rounded-lg bg-purple-700 p-3 text-xl font-semibold text-white shadow-bento" onClick={onClick}>
      <span className="inline-block transition-transform pointerdevice:group-hover:scale-105 pointerdevice:group-active:scale-95">투표 시작하기</span>
    </button>
  );
}
