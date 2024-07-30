import { Button } from '@Components/ui/button';
import { FormControl, FormField, FormItem } from '@Components/ui/form';
import { useToastActions } from '@Hooks/toast';
import { requestGetPresignedURL, requestUploadImageToPresignedURL } from '@Services/upload';
import { useMutation, useQuery } from '@tanstack/react-query';
import { calculateFileHash, getBase64Image, validateLocalImageFile } from '@Utils/index';
import { ChangeEvent, forwardRef, useEffect, useRef, useState } from 'react';
import { Control } from 'react-hook-form';
import { MdCameraAlt } from 'react-icons/md';
import { VscLoading } from 'react-icons/vsc';
import { AccountSchema } from '../_accountSchema';

interface TProfileImageIdField {
  defaultImageURL?: string;
  control: Control<AccountSchema>;
}

type ProfileImageIdFieldProps = TProfileImageIdField;

export function ProfileImageField({ defaultImageURL, control }: ProfileImageIdFieldProps) {
  const [isPending, setIsPending] = useState(false);

  const [imageData, setImageData] = useState<string | null>(null); // base64 data
  const inputRef = useRef<HTMLInputElement>(null);

  const hasImageData = imageData !== null;
  // const hasNoImageData = imageData === null;

  const selectImageFile = () => {
    inputRef.current!.click();
  };

  /**@param imageData Base64 이미지 데이터 */
  const handleUploadStart = (imageData: string) => {
    setIsPending(true);
    setImageData(imageData);
  };

  const handleUploadError = () => {
    setIsPending(false);
    setImageData(null);
    inputRef.current!.value = '';
  };

  return (
    <FormField
      control={control}
      name="profileImageId"
      render={({ field }) => (
        <FormItem className="space-y-1">
          <p className="text-h6 font-semibold">프로필 사진</p>
          <FormControl>
            <div
              style={{ backgroundImage: `url('${hasImageData ? imageData : defaultImageURL}')` }}
              className="relative mx-auto size-32 rounded-lg bg-gray-200 bg-cover bg-center bg-no-repeat">
              <Button
                type="button"
                variants="ghost"
                size="icon"
                className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3"
                disabled={isPending}
                onClick={selectImageFile}>
                <div className="rounded-full bg-gray-100 p-1">
                  {isPending && <VscLoading className="size-5 animate-spin" />}
                  {!isPending && <MdCameraAlt className="size-5 text-gray-400" />}
                </div>
              </Button>

              <FileHandler
                ref={inputRef}
                onUploadStart={handleUploadStart}
                onUploadSuccess={(attachmentId) => {
                  setIsPending(false);
                  field.onChange(attachmentId);
                }}
                onUploadError={handleUploadError}
              />
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}

type FileHandlerProps = {
  onUploadStart: (imageData: string) => void;
  onUploadSuccess: (attachmentId: number) => void;
  onUploadError: () => void;
};

const FileHandler = forwardRef<HTMLInputElement, FileHandlerProps>(({ onUploadStart, onUploadSuccess, onUploadError }: FileHandlerProps, ref) => {
  const { showToast } = useToastActions();

  const imageFileRef = useRef<File | null>(null);
  const [imageHash, setImageHash] = useState('');

  const presignedURLQuery = useQuery({
    queryKey: ['getPresignedURL', imageHash],
    queryFn: () => requestGetPresignedURL(),
    enabled: imageHash !== '',
    retry: false,
  });

  const presignedURLMutation = useMutation({
    mutationKey: ['uploadImageToPresignedURL'],
    mutationFn: requestUploadImageToPresignedURL,
  });

  /** Presigend URL을 성공적으로 얻었을 때 */
  useEffect(() => {
    if (!presignedURLQuery.isSuccess) {
      return;
    }

    const { attachmentId, presignURL: presignedURL } = presignedURLQuery.data.data;
    const { mutate: uploadImageToPresignedURL } = presignedURLMutation;

    uploadImageToPresignedURL(
      {
        presignedURL,
        imageFile: imageFileRef.current!,
      },
      {
        onSuccess: () => onUploadSuccess(attachmentId),
        onError: (error) => causeErrorFlow(error),
      }
    );
  }, [presignedURLQuery.isSuccess]);

  /** Presigend URL을 얻지 못 했을 때 */
  useEffect(() => {
    if (!presignedURLQuery.isError) {
      return;
    }

    causeErrorFlow(presignedURLQuery.error);
  }, [presignedURLQuery.isError]);

  const causeErrorFlow = (error: Error) => {
    imageFileRef.current = null;

    setImageHash('');
    showErrorToast(error);
    onUploadError();
  };

  const showErrorToast = (error: Error) => {
    // if (isAxiosError<ServiceErrorResponse>(error) && error.response) {
    //   const { errorCode } = error.response!.data.result;

    //   if (errorCode === 'ALREADY_EXISTS_ATTACHMENT') {
    //     showToast({ type: 'error', title: '이미 업로드된 사진이에요.' });
    //     return;
    //   }
    // }

    showToast({ type: 'error', title: `알 수 없는 오류(${error.name})`, description: error.message });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    /** 예외 처리 1. 파일을 선택했는가? */
    const doneSelectImageFile = event.currentTarget.files !== null;

    if (!doneSelectImageFile) {
      return;
    }

    /** 예외 처리 2. 적절한 이미지 파일을 선택했는가? */
    const currentImageFile = event.currentTarget.files![0];
    const { isValid, message } = validateLocalImageFile(currentImageFile);

    if (!isValid) {
      return showToast({ type: 'error', title: message });
    }

    /** 업로드를 위한 계산 로직을 진행합니다. */
    readyToUpload(currentImageFile);
  };

  const readyToUpload = async (imageFile: File) => {
    try {
      const [imageData, imageHash] = await Promise.all([getBase64Image(imageFile), calculateFileHash(imageFile)]);
      startUploadFlow(imageFile, imageData, imageHash);
    } catch {
      showToast({ type: 'error', title: '업로드에 필요한 값을 계산하다가 오류가 발생했어요.' });
    }
  };

  const startUploadFlow = (imageFile: File, imageData: string, imageHash: string) => {
    imageFileRef.current = imageFile;
    setImageHash(imageHash);
    onUploadStart(imageData);
  };

  return <input ref={ref} type="file" id="image" name="image" accept=".jpg, jpeg, .png, .webp" onChange={handleChange} onClick={(e) => e.stopPropagation()} hidden />;
});
