import { Button } from '@Components/ui/button';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { DefaultModalProps } from '@Stores/modal';
import { forwardRef } from 'react';

export const VotePolicyBottomSheet = forwardRef<HTMLDivElement, DefaultModalProps>(({ onClose }: DefaultModalProps, ref) => {
  return (
    <FlexibleLayout.Root ref={ref} className="h-fit">
      <FlexibleLayout.Header>
        <header className="relative px-5 py-4">
          <p className="text-center text-2xl font-semibold">투표 정책</p>
        </header>
      </FlexibleLayout.Header>

      <FlexibleLayout.Content className="p-5">
        <ul className="list-disc space-y-3">
          <li className="ml-5 whitespace-pre-line">{`1사이클은 10회의 FADE IN/OUT 투표로 이루어집니다.`}</li>
          <li className="ml-5 whitespace-pre-line">{`하루에 가능한 투표 횟수의 제한은 없습니다.`}</li>
          <li className="ml-5 whitespace-pre-line">{`완료된 투표는 그날의 FA:P 선정에 반영됩니다.`}</li>
          <li className="ml-5 whitespace-pre-line">{`투표 사진은 FADE의 알고리즘을 통해 무작위 노출됩니다.`}</li>
          <li className="ml-5 whitespace-pre-line">{`일자별 투표 결과는 FA:P 아카이빙 캘린더에서, 투표 내역은 마이페이지-내 투표 관리에서 확인할 수 있습니다.`}</li>
        </ul>
      </FlexibleLayout.Content>

      <FlexibleLayout.Footer>
        <div className="flex p-4">
          <Button variants="secondary" className="w-full text-xl" onClick={onClose}>
            확인
          </Button>
        </div>
      </FlexibleLayout.Footer>
    </FlexibleLayout.Root>
  );
});
