import { Button } from '@Components/ui/button';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { DefaultModalProps } from '@Stores/modal';
import { forwardRef } from 'react';

export const UploadGuideBottomSheet = forwardRef<HTMLDivElement, DefaultModalProps>(({ onClose }: DefaultModalProps, ref) => {
  return (
    <FlexibleLayout.Root ref={ref} className="h-fit">
      <FlexibleLayout.Header>
        <header className="relative px-5 py-4">
          <p className="text-center text-lg font-semibold">사진 업로드 가이드</p>
        </header>
      </FlexibleLayout.Header>

      <FlexibleLayout.Content className="p-5">
        <ul className="list-disc space-y-5">
          <li className="ml-5 whitespace-pre-line">{`FADE는 스타일에만 집중하고자 합니다.\n최대한 얼굴이 보이지 않는 사진으로 올려주세요!\nFADE만의 문화를 함께 만들어가요! :)`}</li>
          <li className="ml-5 whitespace-pre-line">{`회원님의 스타일이 잘 보이는 사진이 좋습니다.\n얼굴 제외 전신을 볼 수 있는 사진으로 올려주세요!`}</li>
          <li className="ml-5 whitespace-pre-line">{`FADE는 공정한 FA:P 투표를 위해 노력하고 있습니다.\n공정성을 위해 이미 올린 사진은 다시 올릴 수 없어요!`}</li>
        </ul>
      </FlexibleLayout.Content>

      <FlexibleLayout.Footer>
        <div className="flex p-4">
          <Button variants="secondary" className="w-full text-lg" onClick={() => onClose()}>
            확인
          </Button>
        </div>
      </FlexibleLayout.Footer>
    </FlexibleLayout.Root>
  );
});
