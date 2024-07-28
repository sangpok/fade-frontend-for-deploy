import { useModalActions } from '@Hooks/modal';
import { ReportBottomSheet, ReportResult } from '@Pages/Root/voteFAP/components/ReportBottomSheet';
import { MdReport } from 'react-icons/md';
import { Button } from './ui/button';
import { useMutation } from '@tanstack/react-query';
import { useToastActions } from '@Hooks/toast';

interface ReportButtonProps {
  feedId: number;
  onReportEnd?: (result?: ReportResult) => void;
}

export function ReportButton({ feedId, onReportEnd }: ReportButtonProps) {
  const { showModal } = useModalActions();
  const { showToast } = useToastActions();

  const { mutate: reportFeed, isPending } = useMutation({
    mutationKey: ['reportFeed'],
    mutationFn: ({ feedId }: { feedId: number }) => new Promise((resolve) => resolve(feedId)),
  });

  const handleReportClick = async () => {
    const reportResult = await startReportFlow();

    if (!reportResult) {
      return;
    }

    reportFeed(
      { feedId },
      {
        onSuccess() {
          showToast({ type: 'basic', title: `${feedId}번 피드를 신고하였습니다.` });
          onReportEnd && onReportEnd(reportResult);
        },
        onError() {
          showToast({ type: 'error', title: '신고 실패', description: '신고에 실패하였습니다.' });
        },
      }
    );
  };

  const startReportFlow = async () => {
    // TODO: Report에 사진 ID? 유저 ID? 넘겨주긴 해야 함
    return await showModal<ReportResult>({ type: 'bottomSheet', Component: ReportBottomSheet });
  };

  return (
    <Button variants="white" interactive="onlyScale" className="px-2 py-1 font-normal" disabled={isPending} onClick={handleReportClick}>
      <div className="flex flex-row items-center justify-center gap-1">
        <MdReport className="inline-block size-[1.125rem]" />
        <span>신고하기</span>
      </div>
    </Button>
  );
}
