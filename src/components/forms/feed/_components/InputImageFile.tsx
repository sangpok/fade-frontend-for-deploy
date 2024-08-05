import { useModalActions } from '@Hooks/modal';
import { useToastActions } from '@Hooks/toast';
import { requestGetPresignedURL, requestUploadImageToPresignedURL } from '@Services/upload';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ServiceErrorResponse } from '@Types/serviceError';
import { calculateFileHash, cn, getBase64Image, validateLocalImageFile } from '@Utils/index';
import { isAxiosError } from 'axios';
import { ChangeEvent, forwardRef, useEffect, useRef, useState } from 'react';
import { MdAddPhotoAlternate } from 'react-icons/md';
import { UploadGuideBottomSheet } from '../../../UploadGuideBottomSheet';

export function InputImageFile(props: { value: number; onChange: (value: number) => void }) {
  const { showModal } = useModalActions();
  const [isPending, setIsPending] = useState(false);

  const [imageData, setImageData] = useState<string | null>(null); // base64 data
  const inputRef = useRef<HTMLInputElement>(null);

  const hasImageData = imageData !== null;
  const hasNoImageData = imageData === null;

  const selectImageFile = () => {
    inputRef.current!.click();
  };

  const handleSelectImageClick = async () => {
    if (hasNoImageData) {
      await showUploadGuide();
    }

    selectImageFile();
  };

  const showUploadGuide = async () => {
    return showModal({ type: 'bottomSheet', Component: UploadGuideBottomSheet });
  };

  /**@param imageData Base64 이미지 데이터 */
  const handleUploadStart = (imageData: string) => {
    setIsPending(true);
    setImageData(imageData);
  };

  /** @param attachmentId S3에 올라간 이미지 파일 아이디 */
  const handleUploadSuccess = (attachmentId: number) => {
    setIsPending(false);
    props.onChange(attachmentId);
  };

  const handleUploadError = () => {
    setIsPending(false);
    setImageData(null);
    inputRef.current!.value = '';
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn('group relative flex aspect-[2.2/1] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-gray-200', {
        ['animate-pulse']: isPending,
      })}
      onKeyUp={(e) => ['Enter', ' '].includes(e.key) && handleSelectImageClick()}
      onClick={handleSelectImageClick}
      aria-disabled={isPending}>
      {isPending && <PendingIcon />}
      {hasNoImageData && <NoImageIcon />}
      {hasImageData && <img src={imageData} className="h-full object-contain" />}

      <FileHandler ref={inputRef} onUploadStart={handleUploadStart} onUploadSuccess={handleUploadSuccess} onUploadError={handleUploadError} />
    </div>
  );
}

function PendingIcon() {
  /* TODO: 로딩 아이콘으로 바꿔야 함 */
  return <p className="absolute right-3 top-2 animate-spin">😇</p>;
}

function NoImageIcon() {
  return (
    <MdAddPhotoAlternate className="size-20 text-gray-500 transition-transform touchdevice:group-active:scale-75 pointerdevice:group-hover:scale-125 pointerdevice:group-active:scale-95" />
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
    queryFn: () => requestGetPresignedURL(imageHash),
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
    if (isAxiosError<ServiceErrorResponse>(error) && error.response) {
      const { errorCode } = error.response!.data.result;

      if (errorCode === 'ALREADY_EXISTS_ATTACHMENT') {
        showToast({ type: 'error', title: '이미 업로드된 사진이에요.' });
        return;
      }
    }

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
