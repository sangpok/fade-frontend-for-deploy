import voteFinishImage from '@Assets/vote_ending_image.jpg';

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
      className="flex max-h-full w-full flex-1 items-center justify-center rounded-lg bg-gray-200 shadow-bento"
      style={{
        backgroundImage: `url('${voteFinishImage}')`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    />
  );
}

function RestartVotingTools({ onRestartVote }: { onRestartVote: () => void }) {
  return (
    <div className="flex w-full flex-col gap-3">
      <button className="group rounded-lg bg-purple-700 p-3 text-xl font-semibold text-white shadow-bento" onClick={onRestartVote}>
        <span className="inline-block transition-transform pointerdevice:group-hover:scale-105 pointerdevice:group-active:scale-95">투표 다시하기</span>
      </button>

      <div className="flex flex-row gap-3">
        <button className="flex-1 rounded-lg bg-white py-2 text-lg shadow-bento">투표 내역 확인</button>
        <button className="flex-1 rounded-lg bg-white py-2 text-lg shadow-bento">북마크 확인</button>
      </div>
    </div>
  );
}
