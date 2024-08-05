import { useConfirm, useModalActions } from '@Hooks/modal';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { DefaultModalProps } from '@Stores/modal';
import { TMyFeed } from '@Types/model';
import { useEffect, useRef } from 'react';
import { MdClose, MdInfoOutline } from 'react-icons/md';
import { UploadGuideBottomSheet } from './UploadGuideBottomSheet';
import { EditFeedForm } from './forms/feed/EditFeedForm';
import { Button } from './ui/button';

interface TEditFeedDialog {
  defaultFeedDetails: TMyFeed;
}

type EditFeedDialogProps = DefaultModalProps<boolean, TEditFeedDialog>;

export function EditFeedDialog({ defaultFeedDetails, setCloseHandler, onClose, onSubmitSuccess }: EditFeedDialogProps) {
  const dirtyRef = useRef(false);

  const confirm = useConfirm();

  useEffect(() => {
    setCloseHandler(() => confirmUnsavedChanges);
  }, [setCloseHandler]);

  const confirmUnsavedChanges = async () => {
    if (dirtyRef.current) {
      const wouldExit = await confirm({ title: '변경되지 않은 머시깽이가 있어요.', description: '그래도 나감? 리얼로?' });
      return wouldExit || false;
    }

    return true;
  };

  return (
    <FlexibleLayout.Root>
      <FlexibleLayout.Header>
        <Header onClose={onClose} />
      </FlexibleLayout.Header>

      <FlexibleLayout.Content className="space-y-8 p-5">
        <EditFeedForm defaultFeedDetails={defaultFeedDetails} onValueChanged={(value) => (dirtyRef.current = value)} onSubmitSuccess={() => onSubmitSuccess(true)} />
      </FlexibleLayout.Content>
    </FlexibleLayout.Root>
  );
}

function Header({ onClose }: { onClose: () => void }) {
  const { showModal } = useModalActions();

  const handleInfoClick = async () => {
    showUploadGuide();
  };

  const showUploadGuide = async () => {
    return showModal({ type: 'bottomSheet', Component: UploadGuideBottomSheet });
  };

  return (
    <header className="relative py-2">
      <Button variants="ghost" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2" onClick={onClose}>
        <MdClose className="size-6" />
      </Button>

      <p className="text-center text-2xl font-semibold">사진 수정</p>

      <Button variants="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={handleInfoClick}>
        <MdInfoOutline className="size-6" />
      </Button>
    </header>
  );
}
