import { useConfirm, useModalActions } from '@Hooks/modal';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { DefaultModalProps } from '@Stores/modal';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { MdClose, MdInfoOutline } from 'react-icons/md';
import { UploadGuideBottomSheet } from './UploadGuideBottomSheet';
import { PolicyView } from './UploadPolicyView';
import { UploadFeedForm } from './forms/feed/UploadFeedForm';
import { Button } from './ui/button';
import { useAuthStore } from '@Stores/auth';
import { queryClient } from '@Libs/queryclient';

export function UploadFeedDialog({ setCloseHandler, onClose, onSubmitSuccess }: DefaultModalProps) {
  const dirtyRef = useRef(false);

  /** TODO: User 정보로 불러와야 함 */
  const [hasAgreementOfPolicy, setHasAgreementOfPolicy] = useState(false);
  const shouldShowPolicyView = !hasAgreementOfPolicy;

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
    <AnimatePresence mode="wait">
      {shouldShowPolicyView && (
        <motion.div key="view-1" initial={{ opacity: 0, y: '12px' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '12px' }} className="h-full">
          <PolicyView onAgreePolicy={() => setHasAgreementOfPolicy(true)} onDegreePolicy={onClose} />
        </motion.div>
      )}

      {!shouldShowPolicyView && (
        <motion.div key="view-2" initial={{ opacity: 0, y: '12px' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '12px' }} className="h-full">
          <UploadFeedView onClose={onClose} onValueChanged={(value) => (dirtyRef.current = value)} onSubmitSuccess={onSubmitSuccess} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface TUploadFeedView {
  onClose: () => void;
  onValueChanged: (isChanged: boolean) => void;
  onSubmitSuccess: () => void;
}

type UploadFeedView = TUploadFeedView;

function UploadFeedView({ onClose, onSubmitSuccess, onValueChanged }: UploadFeedView) {
  const myId = useAuthStore((state) => state.user.id);

  const handleSubmitSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['archiving', 'all'] });
    queryClient.invalidateQueries({ queryKey: ['user', myId, 'detail'] });

    onSubmitSuccess();
  };

  return (
    <FlexibleLayout.Root>
      <FlexibleLayout.Header>
        <Header onClose={onClose} />
      </FlexibleLayout.Header>

      <FlexibleLayout.Content className="space-y-8 p-5">
        <UploadFeedForm onValueChanged={onValueChanged} onSubmitSuccess={handleSubmitSuccess} />
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

      <p className="text-center text-2xl font-semibold">사진 업로드</p>

      <Button variants="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={handleInfoClick}>
        <MdInfoOutline className="size-6" />
      </Button>
    </header>
  );
}
