import { FadeLogo } from '@Components/FadeLogo';
import { useModalActions } from '@Hooks/modal';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { cn } from '@Utils/index';
import { motion } from 'framer-motion';
import { PropsWithChildren, useState } from 'react';
import { MdChevronRight } from 'react-icons/md';
import { TermOfPIPA } from './TermOfPIPA';
import { TermOfService } from './TermOfService';

type AgreementList = {
  tos: boolean /** 이용약관 */;
  pipa: boolean /** 개인정보 수집 및 이용 동의 */;
  youthage: boolean /** 만 14세(형사미성년자) 이상 확인 */;
};

export default function AgreementsView({ onAgree }: { onAgree: () => void }) {
  /* #region Agreements */
  const [agreements, setAgreements] = useState<AgreementList>({
    tos: false,
    pipa: false,
    youthage: false,
  });

  const hasAllAgreement = Object.values(agreements).every((value) => value);

  const toggleAgreement = (field: keyof AgreementList) => {
    setAgreements((prevAgreements) => ({ ...prevAgreements, [field]: !prevAgreements[field] }));
  };

  const toogleAgreeAll = () => {
    hasAllAgreement && setAgreements({ tos: false, pipa: false, youthage: false });
    !hasAllAgreement && setAgreements({ tos: true, pipa: true, youthage: true });
  };
  /* #endregion */

  /* #region Modals */
  const { showModal } = useModalActions();

  const showTOS = async () => {
    return await showModal({ type: 'fullScreenDialog', animateType: 'slideInFromRight', Component: TermOfService });
  };

  const showPIPA = async () => {
    return await showModal({ type: 'fullScreenDialog', animateType: 'slideInFromRight', Component: TermOfPIPA });
  };
  /* #endregion */

  const handleTOSClick = async () => {
    !agreements.tos && (await showTOS());
    toggleAgreement('tos');
  };

  const handlePIPAClick = async () => {
    !agreements.pipa && (await showPIPA());
    toggleAgreement('pipa');
  };

  return (
    <FlexibleLayout.Root>
      <FlexibleLayout.Header>
        <header className="space-y-5 p-5">
          <FadeLogo />

          <div className="space-y-2">
            <p className="text-2xl font-semibold">서비스 약관에 동의해주세요!</p>
            <p className="text-gray-600">FADE를 이용하기 위해서는 아래 약관에 대한 동의가 필요해요.</p>
          </div>
        </header>
      </FlexibleLayout.Header>

      <FlexibleLayout.Content />

      <FlexibleLayout.Footer>
        <section className="space-y-5 p-5">
          <div>
            <AgreeAllTosButton isActive={hasAllAgreement} onClick={() => toogleAgreeAll()} />

            <ToggleTosButton isActive={agreements.tos} onClick={handleTOSClick}>
              이용약관 동의
            </ToggleTosButton>

            <ToggleTosButton isActive={agreements.pipa} onClick={handlePIPAClick}>
              개인정보 수집 및 이용 동의
            </ToggleTosButton>

            <ToggleTosButton isActive={agreements.youthage} hasRightIcon={false} onClick={() => toggleAgreement('youthage')}>
              만 14세 이상 확인
            </ToggleTosButton>
          </div>

          <button
            className="w-full rounded-lg bg-purple-500 py-3 text-xl font-semibold text-white transition-colors disabled:bg-gray-300 disabled:text-gray-500"
            disabled={!hasAllAgreement}
            onClick={() => onAgree()}>
            다음
          </button>
        </section>
      </FlexibleLayout.Footer>
    </FlexibleLayout.Root>
  );
}

function AgreeAllTosButton({ isActive, onClick }: { isActive: boolean; onClick: () => void }) {
  return (
    <button className="flex w-full flex-row items-center gap-2 rounded-lg border border-purple-200 px-5 py-4" onClick={onClick}>
      <div
        className={cn('rounded-full border border-purple-100 bg-purple-50 transition-colors', {
          ['border-purple-500 bg-purple-500 text-white']: isActive,
        })}>
        <CheckIcon isActive={isActive} />
      </div>

      <p className="text-xl font-semibold">약관 전체 동의</p>
    </button>
  );
}

type ToogleButtonProps = {
  isActive: boolean;
  isRequired?: boolean;
  hasRightIcon?: boolean;
  onClick: () => void;
};

function ToggleTosButton({ isActive, onClick, isRequired = true, hasRightIcon = true, children }: PropsWithChildren<ToogleButtonProps>) {
  return (
    <button className="flex w-full flex-row gap-2 px-5 py-4" onClick={onClick}>
      <div
        className={cn('rounded-full border border-purple-100 bg-purple-50 transition-colors', {
          ['border-purple-500 bg-purple-500 text-white']: isActive,
        })}>
        <CheckIcon isActive={isActive} />
      </div>

      <div className="flex flex-1 flex-row items-center justify-center space-x-1">
        {isRequired && <p className="min-w-fit text-purple-200">(필수)</p>}
        <p className="w-full text-left">{children}</p>
      </div>

      {hasRightIcon && <MdChevronRight className="size-6 text-purple-200" />}
    </button>
  );
}

function CheckIcon({ isActive }: { isActive: boolean }) {
  return (
    <div className="grid size-6 place-items-center">
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.path animate={{ pathLength: isActive ? 1 : 0 }} d="M2 6L6.5 10L14 2" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
