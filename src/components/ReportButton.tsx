import { useModalActions } from '@Hooks/modal';
import { useToastActions } from '@Hooks/toast';
import { queryClient } from '@Libs/queryclient';
import { ReportBottomSheet, ReportResult } from '@Pages/Root/vote/fap/components/ReportBottomSheet';
import { requestReportFeed } from '@Services/report';
import { useMutation } from '@tanstack/react-query';
import { MdReport } from 'react-icons/md';
import { Button } from './ui/button';

interface ReportButtonProps {
  feedId: number;
  onReportEnd?: (result?: ReportResult) => void;
}

export function ReportButton({ feedId, onReportEnd }: ReportButtonProps) {
  const { showModal } = useModalActions();
  const { showToast } = useToastActions();

  const { mutate: reportFeed, isPending } = useMutation({
    mutationKey: ['reportFeed'],
    mutationFn: requestReportFeed,
  });

  const handleReportClick = async () => {
    const reportResult = await startReportFlow();

    if (!reportResult) {
      return;
    }

    reportFeed(
      { feedId, ...reportResult },
      {
        onSuccess() {
          showToast({ type: 'basic', title: `${feedId}번 피드를 신고하였습니다.` });

          queryClient.invalidateQueries({ queryKey: ['archiving'], refetchType: 'all' });
          queryClient.invalidateQueries({ queryKey: ['subscribe', 'list'], refetchType: 'all' });
          queryClient.invalidateQueries({ queryKey: ['user', 'me', 'voteHistory'], refetchType: 'all' });
          queryClient.invalidateQueries({ queryKey: ['user', 'me', 'bookmark'], refetchType: 'all' });

          onReportEnd && onReportEnd(reportResult);
        },
        onError() {
          showToast({ type: 'error', title: '신고 실패', description: '신고에 실패하였습니다.' });
        },
      }
    );
  };

  const startReportFlow = async () => {
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
