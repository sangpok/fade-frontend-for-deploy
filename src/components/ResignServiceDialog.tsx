import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { DefaultModalProps } from '@Stores/modal';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { PropsWithChildren, useState } from 'react';
import { motion } from 'framer-motion';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { cn } from '@Utils/index';
import { useConfirm } from '@Hooks/modal';

const resignReasonTexts = [
  '서비스를 더 이상 이용하지 않아요.',
  '서비스에 너무 많은 시간을 소요해요.',
  '얻고 싶은 정보를 얻을 수 없어요.',
  '비매너 유저가 많아요.',
  '탈퇴 후 재가입하고 싶어요.',
  '기타',
];

type TResignReason = {
  type: string;
  detail: string;
};

export default function ResignServiceView({ onClose }: DefaultModalProps) {
  const [viewId, setViewId] = useState(0);
  const confirm = useConfirm();

  const isSelectView = viewId === 0;
  const isConfirmView = viewId === 1;

  const [resignReason, setResignReason] = useState<TResignReason>({ type: '0', detail: '' });
  const isOtherSelected = +resignReason.type === resignReasonTexts.length - 1;
  const isDetailInputed = resignReason.detail !== '';

  const [isConfirm, setIsConfirm] = useState(false);

  const isNotConfirmed = isConfirmView && !isConfirm;
  const doesNotInputOtherDetail = isSelectView && isOtherSelected && !isDetailInputed;
  const wouldCTADisabled = isNotConfirmed || doesNotInputOtherDetail;

  const handleCTAClick = async () => {
    if (isSelectView) {
      return setViewId(1);
    }

    await confirm({ title: '잠깐만요.. 정말 탈퇴하시겠어요?', description: '탈퇴 이후 재가입이 불가능하며 동일한 계정 ID의 사용이 불가합니다.' });
  };

  return (
    <FlexibleLayout.Root>
      <FlexibleLayout.Header>
        <header className="relative px-5 py-4">
          <BackButton onClick={onClose} />
          <p className="text-center text-2xl font-semibold">계정 관리</p>
        </header>
      </FlexibleLayout.Header>

      <FlexibleLayout.Content>
        {isSelectView && (
          <ResignReasonSelectView
            isOtherSelected={isOtherSelected}
            resignReason={resignReason}
            onReasonUpdate={(field) => setResignReason((prev) => ({ ...prev, ...field }))}
          />
        )}
        {isConfirmView && <ResignConfirmView isConfirm={isConfirm} onConfirmToggle={() => setIsConfirm(!isConfirm)} />}
      </FlexibleLayout.Content>

      <FlexibleLayout.Footer>
        <div className="p-5">
          <button
            onClick={handleCTAClick}
            disabled={wouldCTADisabled}
            className={cn('w-full rounded-lg bg-black py-2 text-h5 text-white transition-colors disabled:bg-gray-200 disabled:text-gray-400', {
              ['bg-pink-600']: isConfirmView,
            })}>
            {isSelectView && '다음'}
            {isConfirmView && 'FADE에서 탈퇴하기'}
          </button>
        </div>
      </FlexibleLayout.Footer>
    </FlexibleLayout.Root>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="group absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg p-2 touchdevice:active:bg-gray-100 pointerdevice:hover:bg-gray-100"
      onClick={onClick}>
      <MdChevronLeft className="size-6 transition-transform touchdevice:group-active:scale-95 pointerdevice:group-active:scale-95" />
    </button>
  );
}

function ResignReasonSelectView({
  resignReason,
  isOtherSelected,
  onReasonUpdate,
}: {
  resignReason: TResignReason;
  isOtherSelected: boolean;
  onReasonUpdate: (fields: Partial<TResignReason>) => void;
}) {
  const textLength = resignReason.detail?.length || 0;

  return (
    <div className="p-5">
      <p className="text-h3 font-semibold">탈퇴 사유를 선택해주세요</p>
      <RadioGroup.Root defaultValue="men" className="flex w-full flex-col" value={resignReason.type} onValueChange={(value) => onReasonUpdate({ type: value })}>
        {resignReasonTexts.map((resignReasonText, index) => (
          <ResignReasonItem value={String(index)} reason={resignReasonText} />
        ))}

        <div
          className="group flex h-20 w-full resize-none flex-col rounded-lg bg-gray-100 p-3 transition-colors aria-disabled:bg-gray-300"
          aria-disabled={!isOtherSelected}>
          <textarea
            className="h-full w-full resize-none bg-transparent align-text-top outline-none transition-colors disabled:bg-gray-300 disabled:text-gray-500"
            placeholder="상세 사유를 입력해주세요."
            value={resignReason.detail || ''}
            onChange={(e) => onReasonUpdate({ detail: e.target.value })}
            maxLength={100}
            disabled={!isOtherSelected}
          />
          <p className="text-right text-xs text-gray-400">{textLength > 100 ? 100 : textLength} / 100</p>
        </div>
      </RadioGroup.Root>
    </div>
  );
}

function ResignReasonItem({ value, reason }: { value: string; reason: string }) {
  return (
    <RadioGroup.Item value={value} className="group flex flex-row items-center space-x-2 py-5">
      <div className="grid size-6 place-items-center rounded-full border border-purple-100 bg-purple-50 transition-colors group-data-[state='checked']:border-purple-500 group-data-[state='checked']:bg-purple-500">
        <RadioGroup.Indicator className={`block size-2 rounded-full group-data-[state='checked']:bg-white`} />
      </div>

      <p>{reason}</p>
    </RadioGroup.Item>
  );
}

function ResignConfirmView({ isConfirm, onConfirmToggle }: { isConfirm: boolean; onConfirmToggle: () => void }) {
  return (
    <div className="space-y-2 p-5">
      <p className="text-h3 font-semibold">탈퇴 후 정보 처리 고지</p>

      <ol className="list-decimal pl-[1rem] text-h6">
        <li>소셜 로그인 정보 삭제(로그인 연동 해제) </li>
        <li>성별 정보 삭제 </li>
        <li>앱 내 올린 모든 사진 및 북마크, 구독 목록 등 삭제</li>
        <li>계정 ID 보관 (추후 같은 ID로 재가입 불가)</li>
        <li>자동으로 수집되는 방문 정보 보관</li>
      </ol>

      <ToggleTosButton isActive={isConfirm} onClick={onConfirmToggle} hasRightIcon={false}>
        확인했습니다.
      </ToggleTosButton>
    </div>
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
    <button className="mx-auto flex w-fit flex-row gap-2 px-5 py-4" onClick={onClick}>
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
        <motion.path
          animate={{ pathLength: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
          d="M2 6L6.5 10L14 2"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
