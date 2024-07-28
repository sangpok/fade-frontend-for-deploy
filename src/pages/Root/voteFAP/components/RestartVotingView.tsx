import voteFinishImage from '@Assets/vote_ending_image.jpg';
import { Button } from '@Components/ui/button';
import { useNavigate } from 'react-router-dom';

export function RestartVotingView({ onRestartVote }: { onRestartVote: () => void }) {
  return (
    <div className="flex h-full flex-col justify-between gap-5">
      <RestartVotingCover />
      <RestartVotingTools onRestartVote={onRestartVote} />
    </div>
  );
}

function RestartVotingCover() {
  return (
    <div
      style={{ backgroundImage: `url('${voteFinishImage}')` }}
      className="flex max-h-full w-full flex-1 items-center justify-center rounded-lg bg-gray-200 bg-contain bg-center bg-no-repeat shadow-bento"
    />
  );
}

function RestartVotingTools({ onRestartVote }: { onRestartVote: () => void }) {
  const navigate = useNavigate();

  return (
    <div className="flex w-full flex-col gap-3">
      <Button className="text-xl" onClick={onRestartVote}>
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
