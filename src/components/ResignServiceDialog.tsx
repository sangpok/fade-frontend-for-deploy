import { BackButton, Button } from '@Components/ui/button';
import { Textarea } from '@Components/ui/textarea';
import { useAuthActions } from '@Hooks/auth';
import { useConfirm } from '@Hooks/modal';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { axios } from '@Libs/axios';
import { requestResignService } from '@Services/member';
import { DefaultModalProps } from '@Stores/modal';
import { cn } from '@Utils/index';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { PropsWithChildren, useState } from 'react';
import { MdChevronRight } from 'react-icons/md';

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

export default function ResignServiceDialog({ onClose }: DefaultModalProps) {
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

  const { signOut } = useAuthActions();

  const { mutate: resignService } = useMutation({
    mutationKey: ['resignService'],
    mutationFn: requestResignService,
  });

  const handleCTAClick = async () => {
    if (isSelectView) {
      return setViewId(1);
    }

    const result = await confirm({ title: '잠깐만요.. 정말 탈퇴하시겠어요?', description: '탈퇴 이후 재가입이 불가능하며 동일한 계정 ID의 사용이 불가합니다.' });

    if (!result) {
      return;
    }

    resignService(null as unknown as void, {
      onSuccess() {
        axios.defaults.headers.common.Authorization = '';
        localStorage.clear();
        signOut();
        location.reload();
      },
    });
  };

  return (
    <FlexibleLayout.Root>
      <FlexibleLayout.Header>
        <header className="relative py-2">
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
          <Button variants={isConfirm ? 'destructive' : 'secondary'} onClick={handleCTAClick} disabled={wouldCTADisabled} className={cn('w-full text-lg')}>
            {isSelectView && '다음'}
            {isConfirmView && 'FADE에서 탈퇴하기'}
          </Button>
        </div>
      </FlexibleLayout.Footer>
    </FlexibleLayout.Root>
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
  return (
    <div className="p-5">
      <p className="text-h3 font-semibold">탈퇴 사유를 선택해주세요</p>
      <RadioGroup.Root defaultValue="men" className="flex w-full flex-col" value={resignReason.type} onValueChange={(value) => onReasonUpdate({ type: value })}>
        {resignReasonTexts.map((resignReasonText, index) => (
          <ResignReasonItem key={`reason-${index}`} value={String(index)} reason={resignReasonText} />
        ))}

        <Textarea
          className="h-20"
          placeholder="상세 사유를 입력해주세요."
          value={resignReason.detail || ''}
          onChange={(detail) => onReasonUpdate({ detail })}
          maxLength={100}
          disabled={!isOtherSelected}
        />
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
