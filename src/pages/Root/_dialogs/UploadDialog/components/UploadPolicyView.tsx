import { Button } from '@Components/ui/button';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { MdClose } from 'react-icons/md';

export function PolicyView({ onDegreePolicy, onAgreePolicy }: { onDegreePolicy: () => void; onAgreePolicy: () => void }) {
  return (
    <FlexibleLayout.Root>
      <FlexibleLayout.Header>
        <header className="relative py-2">
          <CloseButton onClick={() => onDegreePolicy()} />
          <p className="text-center text-2xl font-semibold">사진 업로드 정책</p>
        </header>
      </FlexibleLayout.Header>

      <FlexibleLayout.Content className="p-5">
        <ul className="ml-5 list-decimal space-y-5 text-lg">
          <li>{`FADE는 본인 사진 업로드를 원칙으로 합니다.`}</li>
          <li>{`업로드한 사진은 업로드 날짜와 무관하게 모두 FA:P(일 별로 가장 많은 표를 받은 사진) 선정의 후보가 되며, 다른 유저의 투표에 포함될 수 있습니다.`}</li>
          <li>{`업로드한 사진이 FA:P로 선정되면 FA:P 캘린더에 노출 됩니다.`}</li>
          <li>{`업로드한 사진은 자유롭게 삭제가 가능합니다.\n그러나 FA:P로 선정된 사진을 3회 삭제 시 별도 고지 없이 계정이 정지되며 이용이 제한 됩니다.`}</li>
          <li>{`성적 수치심을 불러일으키는 사진, 도용이나 AI를 이용한 사진, 비하 혹은 혐오의 상징이 포함된 사진은 임의로 삭제 될 수 있습니다.`}</li>
          <li>{`업로드한 사진이 다른 유저에 의해 5회 이상 신고되면 별도 고지 없이 삭제 됩니다.`}</li>
        </ul>
      </FlexibleLayout.Content>

      <FlexibleLayout.Footer>
        <AgreeButton onClick={() => onAgreePolicy()} />
      </FlexibleLayout.Footer>
    </FlexibleLayout.Root>
  );
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variants="ghost" className="absolute left-4 top-1/2 -translate-y-1/2" onClick={onClick}>
      <MdClose className="size-6" />
    </Button>
  );
}

function AgreeButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex p-4">
      <Button variants="secondary" className="w-full text-xl" onClick={onClick}>
        동의하고 계속하기
      </Button>
    </div>
  );
}
