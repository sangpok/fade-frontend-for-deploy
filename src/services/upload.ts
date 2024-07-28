import { axios } from '@Libs/axios';

type GetPresignedURLResponse = { presignURL: string; attachmentId: number };

export async function requestGetPresignedURL(checksum: string) {
  return await axios.post<GetPresignedURLResponse>(`/attachments/presign-url`, { checksum });
}

type UploadImageToPresignedURLPayload = { presignedURL: string; imageFile: File };

export async function requestUploadImageToPresignedURL({ presignedURL, imageFile }: UploadImageToPresignedURLPayload) {
  return await axios.put(presignedURL, imageFile, { baseURL: '' });
}
