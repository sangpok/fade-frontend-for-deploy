import { UploadBoNForm } from '@Components/forms/bon/UploadBoNForm';
import { BackButton } from '@Components/ui/button';
import { useConfirm } from '@Hooks/modal';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { DefaultModalProps } from '@Stores/modal';
import { useEffect, useRef } from 'react';

export function UploadBoNModal({ setCloseHandler, onClose, onSubmitSuccess }: DefaultModalProps) {
  const dirtyRef = useRef(false);
  const confirm = useConfirm();

  useEffect(() => {
    setCloseHandler(() => confirmUnsavedChanges);
  }, [setCloseHandler]);

  const confirmUnsavedChanges = async () => {
    if (dirtyRef.current) {
      const wouldExit = await confirm({ title: '저장되지 않은 변경 사항이 있습니다.', description: '저장하지 않고 나가시겠습니까?' });
      return wouldExit || false;
    }

    return true;
  };

  return (
    <FlexibleLayout.Root>
      <FlexibleLayout.Header>
        <header className="relative flex items-center justify-center border-b border-b-gray-200 py-2">
          <BackButton onClick={() => onClose()} />
          <span className="mx-auto text-h5 font-semibold">투표 업로드</span>
        </header>
      </FlexibleLayout.Header>

      <FlexibleLayout.Content className="space-y-2 bg-white p-4">
        <UploadBoNForm onValueChanged={(value) => (dirtyRef.current = value)} onSubmitSuccess={(bonId) => onSubmitSuccess(bonId)} />
      </FlexibleLayout.Content>
    </FlexibleLayout.Root>
  );
}
