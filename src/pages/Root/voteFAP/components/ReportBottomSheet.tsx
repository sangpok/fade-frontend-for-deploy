import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { DefaultModalProps } from '@Stores/modal';
import { cn } from '@Utils/index';
import { forwardRef, useState } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

const enum ReportType {
  PORNO_OR_SEXUAL_IMAGE = 'PORNO_OR_SEXUAL_IMAGE',
  ILLEGAL_USE_OR_AI_IMAGE = 'ILLEGAL_USE_OR_AI_IMAGE',
  REPUGNANT_SYMBOL = 'REPUGNANT_SYMBOL',
  OTHER = 'OTHER',
}

const REPORT_TYPE_TEXT: Record<ReportType, string> = {
  PORNO_OR_SEXUAL_IMAGE: '음란물 또는 성적인 사진',
  ILLEGAL_USE_OR_AI_IMAGE: '도용 또는 AI 이미지',
  REPUGNANT_SYMBOL: '혐오 발언 또는 상징',
  OTHER: '기타',
};

const reportTypeList: ReportType[] = [ReportType.PORNO_OR_SEXUAL_IMAGE, ReportType.ILLEGAL_USE_OR_AI_IMAGE, ReportType.REPUGNANT_SYMBOL, ReportType.OTHER];

export type ReportResult = {
  selectedReportType: ReportType;
  reportDetails: string;
};

export const ReportBottomSheet = forwardRef<HTMLDivElement, DefaultModalProps<ReportResult>>(({ onClose }: DefaultModalProps<ReportResult>, ref) => {
  const [selectedReportType, setSelectedReportType] = useState<ReportType | null>(null);
  const [reportDetails, setReportDetails] = useState('');

  const isDetailsEmpty = reportDetails === '';
  const couldEnableReportButton = !isDetailsEmpty;

  const [currentStep, setCurrentStep] = useState(0);

  const isSelectStep = currentStep === 0;
  const isInputStep = currentStep === 1;

  const changeStep = (newStep: number) => {
    setCurrentStep(newStep);

    if (newStep === 0) {
      /** TODO: Dirty Field Alert */
      setReportDetails('');
    }
  };

  const handleSelect = (selectType: ReportType) => {
    setSelectedReportType(selectType);
    changeStep(1);
  };

  const handleReport = () => {
    if (selectedReportType === null) {
      throw new Error('never but for selectedReportType type-guard');
    }

    // TODO: 신고 해야 함
    onClose({ reportDetails, selectedReportType });
  };

  return (
    <FlexibleLayout.Root ref={ref} className="h-fit">
      <FlexibleLayout.Header>
        <header className="relative px-5 py-4">
          {isInputStep && (
            <button
              type="button"
              className="group absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg p-2 pointerdevice:hover:bg-gray-100"
              onClick={() => changeStep(0)}>
              <MdChevronLeft className="size-6 group-active:pointerdevice:scale-95" />
            </button>
          )}
          <p className="text-center text-2xl font-semibold">신고</p>
        </header>
      </FlexibleLayout.Header>

      <FlexibleLayout.Content className={cn('p-0', { ['p-5']: isInputStep })}>
        {isSelectStep && <SelectReportTypeList onSelect={handleSelect} />}
        {isInputStep && <InputReportDetail details={reportDetails} reportType={selectedReportType!} onChange={setReportDetails} />}
      </FlexibleLayout.Content>

      <FlexibleLayout.Footer>
        {isInputStep && (
          <div className="flex p-4">
            <button
              type="button"
              className="flex-1 rounded-lg bg-pink-600 py-2 text-xl text-white transition-colors disabled:bg-gray-300 disabled:text-gray-500"
              onClick={handleReport}
              disabled={!couldEnableReportButton}>
              신고하기
            </button>
          </div>
        )}
      </FlexibleLayout.Footer>
    </FlexibleLayout.Root>
  );
});

function SelectReportTypeList({ onSelect }: { onSelect: (selectType: ReportType) => void }) {
  return (
    <ul className="divide-y">
      {reportTypeList.map((reportType) => (
        <li key={reportType} onClick={() => onSelect(reportType)}>
          <button className="relative w-full p-5">
            <p className="text-left">{REPORT_TYPE_TEXT[reportType]}</p>
            <MdChevronRight className="absolute right-5 top-1/2 size-6 -translate-y-1/2 text-gray-500" />
          </button>
        </li>
      ))}
    </ul>
  );
}

function InputReportDetail({ details, reportType, onChange }: { details: string; reportType: ReportType; onChange: (value: string) => void }) {
  const textLength = details.length;

  return (
    <div>
      <p className="mb-2 font-semibold">{REPORT_TYPE_TEXT[reportType]}</p>
      <div className="flex h-[10rem] w-full resize-none flex-col rounded-lg bg-gray-100 p-3">
        <textarea
          className="h-full w-full resize-none bg-transparent align-text-top outline-none transition-colors disabled:bg-gray-300 disabled:text-gray-500"
          placeholder="신고 내용을 입력해주세요."
          value={details}
          onChange={(e) => onChange(e.target.value)}
          maxLength={200}
        />
        <p className="text-right text-xs text-gray-400">{textLength > 200 ? 200 : textLength} / 200</p>
      </div>
      <p className="text-xs text-gray-500">※ 신고한 사진은 회원님의 피드에 더이상 노출되지 않습니다.</p>
      <p className="text-xs text-gray-500">※ 신고 5회 누적 시 사진이 삭제됩니다.</p>
    </div>
  );
}
