import { Button } from '@Components/ui/button';
import { Image } from '@Components/ui/image';
import { useNavigate } from 'react-router-dom';

export function RestartVotingView({ onVoteRestart }: { onVoteRestart: () => void }) {
  return (
    <div className="flex h-full flex-col justify-between gap-5">
      <RestartVotingCover />
      <RestartVotingTools onVoteRestart={onVoteRestart} />
    </div>
  );
}

function RestartVotingCover() {
  return (
    <div className="flex-1 overflow-hidden rounded-lg bg-gray-200 shadow-bento">
      <Image src="/assets/vote_ending_image.webp" size="contain" local />
    </div>
  );
}

function RestartVotingTools({ onVoteRestart }: { onVoteRestart: () => void }) {
  const navigate = useNavigate();

  return (
    <div className="flex w-full flex-col gap-3">
      <Button className="text-xl" onClick={onVoteRestart}>
        투표 다시하기
      </Button>

      <div className="flex flex-row gap-3">
        <Button variants="white" className="flex-1 text-lg font-normal shadow-bento" onClick={() => navigate('/mypage/vote-history')}>
          투표 내역 확인
        </Button>

        <Button variants="white" className="flex-1 text-lg font-normal shadow-bento" onClick={() => navigate('/mypage/bookmark')}>
          북마크 확인
        </Button>
      </div>
    </div>
  );
}
