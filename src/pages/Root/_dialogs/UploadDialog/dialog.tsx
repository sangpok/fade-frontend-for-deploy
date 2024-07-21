import { DefaultModalProps } from '@Stores/modal';
import { useEffect, useRef, useState } from 'react';
import { UploadImageForm } from './components/UploadImageForm';
import { PolicyView } from './components/UploadPolicyView';
import { useConfirm } from '@Hooks/modal';

export function UploadViewDialog({ setCloseHandler, onClose }: DefaultModalProps) {
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
    <>
      {shouldShowPolicyView && <PolicyView onAgreePolicy={() => setHasAgreementOfPolicy(true)} onDegreePolicy={onClose} />}
      {!shouldShowPolicyView && <UploadImageForm onClose={onClose} onValueChanged={(value) => (dirtyRef.current = value)} />}
    </>
  );
}
