import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { DefaultModalProps } from '@Stores/modal';
import { forwardRef, useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { requestUpdateUserDetails } from '@Services/member';
import { useConfirm } from '@Hooks/modal';
import { VscLoading } from 'react-icons/vsc';
import { useToastActions } from '@Hooks/toast';
import { queryClient } from '@Libs/queryclient';
import { useAuthStore } from '@Stores/auth';

type IntroduceContentEditBottomSheetProps = { defaultIntroduceContent: string };

export const IntroduceContentEditBottomSheet = forwardRef<HTMLDivElement, DefaultModalProps<void, IntroduceContentEditBottomSheetProps>>(
  ({ defaultIntroduceContent, setCloseHandler, onClose }: DefaultModalProps<void, IntroduceContentEditBottomSheetProps>, ref) => {
    const myId = useAuthStore((state) => state.user.id);
    const [introduceContent, setIntroduceContent] = useState(defaultIntroduceContent);
    const { showToast } = useToastActions();
    const confirm = useConfirm();
    const isDirty = defaultIntroduceContent !== introduceContent;

    useEffect(() => {
      setCloseHandler(() => confirmUnsavedChanges);
    }, [setCloseHandler]);

    const confirmUnsavedChanges = async () => {
      if (isDirty) {
        const wouldExit = await confirm({ title: '자기소개를 저장하지 않고 나가시겠어요?', description: '변경된 내용은 저장되지 않아요.' });
        return wouldExit || false;
      }

      return true;
    };

    const { mutate: updateUserDetails, isPending } = useMutation({
      mutationKey: ['updateUserDetails'],
      mutationFn: requestUpdateUserDetails,
    });

    const handleClick = () => {
      updateUserDetails(
        { introduceContent },
        {
          onSuccess() {
            onClose();
            showToast({ type: 'success', title: '자기소개를 수정했어요.' });
            queryClient.invalidateQueries({ queryKey: ['user', myId, 'detail'], refetchType: 'all' });
          },
          onError() {
            showToast({ type: 'error', title: '자기소개를 수정하다가 오류가 났어요.' });
          },
        }
      );
    };

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
          <Textarea
            placeholder="멋지게 나를 소개해 보아요!"
            className="h-[10.25rem]"
            value={introduceContent}
            onChange={(value) => setIntroduceContent(value)}
            maxLength={150}
          />
        </FlexibleLayout.Content>

        <FlexibleLayout.Footer>
          <div className="flex p-4">
            <Button className="w-full text-xl" onClick={handleClick} disabled={isPending}>
              {isPending && <VscLoading className="mr-1 animate-spin" />}
              {isPending ? '수정 중...' : '완료'}
            </Button>
          </div>
        </FlexibleLayout.Footer>
      </FlexibleLayout.Root>
    );
  }
);
