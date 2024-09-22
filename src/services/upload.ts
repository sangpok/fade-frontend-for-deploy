import axiosInstance from 'axios';
import { axios } from '@Libs/axios';

type GetPresignedURLResponse = { presignURL: string; attachmentId: number };

export async function requestGetPresignedURL(checksum?: string) {
  return await axios.post<GetPresignedURLResponse>(`/attachments/presign-url`, { checksum });
}

type UploadImageToPresignedURLPayload = { presignedURL: string; imageFile: Blob };

export async function requestUploadImageToPresignedURL({ presignedURL, imageFile }: UploadImageToPresignedURLPayload) {
  return await axiosInstance.put(presignedURL, imageFile, { headers: { 'Content-Type': imageFile.type } });
}
