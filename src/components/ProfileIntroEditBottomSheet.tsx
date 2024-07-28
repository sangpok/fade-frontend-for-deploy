import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { DefaultModalProps } from '@Stores/modal';
import { forwardRef, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

type ProfileIntroEditBottomSheetProps = { defaultProfileIntro: string };

export const ProfileIntroEditBottomSheet = forwardRef<HTMLDivElement, DefaultModalProps<void, ProfileIntroEditBottomSheetProps>>(
  ({ defaultProfileIntro, onClose }: DefaultModalProps<void, ProfileIntroEditBottomSheetProps>, ref) => {
    const [profileIntro, setProfileIntro] = useState(defaultProfileIntro);

    return (
      <FlexibleLayout.Root ref={ref} className="h-fit">
        <FlexibleLayout.Header>
          <header className="relative flex flex-row items-center justify-between px-5 pt-4">
            <p className="text-xl font-semibold">프로필 소개 편집</p>
            <Button variants="ghost" size="icon" onClick={() => onClose()}>
              <MdClose className="size-6 text-gray-600" />
            </Button>
          </header>
        </FlexibleLayout.Header>

        <FlexibleLayout.Content className="p-5">
          <Textarea placeholder="멋지게 나를 소개해 보아요!" className="h-[10.25rem]" value={profileIntro} onChange={(value) => setProfileIntro(value)} maxLength={150} />
        </FlexibleLayout.Content>

        <FlexibleLayout.Footer>
          <div className="flex p-4">
            <Button className="w-full text-xl" onClick={() => onClose()}>
              완료
            </Button>
          </div>
        </FlexibleLayout.Footer>
      </FlexibleLayout.Root>
    );
  }
);
