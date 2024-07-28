import { DefaultModalProps } from '@Stores/modal';
import { useEffect, useRef, useState } from 'react';
import { UploadImageForm } from './components/UploadImageForm';
import { PolicyView } from './components/UploadPolicyView';
import { useConfirm } from '@Hooks/modal';
import { AnimatePresence, motion } from 'framer-motion';

export function UploadViewDialog({ setCloseHandler, onClose, onSubmitSuccess }: DefaultModalProps) {
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
          <UploadImageForm onClose={onClose} onValueChanged={(value) => (dirtyRef.current = value)} onSubmitSuccess={onSubmitSuccess} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
