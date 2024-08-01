import { axios } from '@Libs/axios';
import { ReportResult } from '@Pages/Root/voteFAP/components/ReportBottomSheet';

type RequestReportFeedPayload = { feedId: number } & ReportResult;

export function requestReportFeed({ feedId, reportDetails: details, selectedReportType: type }: RequestReportFeedPayload) {
  return axios.post(`/reports`, { feedId, type, details });
}
