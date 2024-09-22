import { Button } from '@Components/ui/button';
import { useToastActions } from '@Hooks/toast';
import { DefaultModalProps } from '@Stores/modal';
import { useEffect, useRef, useState } from 'react';
import { Cropper, ReactCropperElement } from 'react-cropper';
import { MdChevronLeft } from 'react-icons/md';
import { VscLoading } from 'react-icons/vsc';
import './cropper.css';

type ImageCropperModalProps = DefaultModalProps<unknown, { imageFile: File }>;

export function ImageCropperModal({ imageFile, onClose }: ImageCropperModalProps) {
  const { showToast } = useToastActions();
  const [doesConverting, setDoesConverting] = useState(false);

  const cropperRef = useRef<ReactCropperElement>(null);
  const fileImageURL = URL.createObjectURL(imageFile);

  useEffect(() => {
    return () => URL.revokeObjectURL(fileImageURL);
  });

  async function dataURLtoBlob(dataURL: string) {
    return new Promise<Blob>((resolve, reject) => {
      const arr = dataURL.split(',');
      const matches = arr[0].match(/:(.*?);/);
      const mime = matches && matches.length >= 2 ? matches[1] : null;

      // MIME 타입이 없을 때 크롭 리셋
      if (!mime) {
        const cropperInstance = cropperRef.current!.cropper;
        cropperInstance.reset();
        reject();
        return;
      }

      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      resolve(new Blob([u8arr], { type: mime }));
    });
  }

  const handleApplyClick = () => {
    const cropper = cropperRef.current!.cropper;
    const croppedDataURL = cropper.getCroppedCanvas().toDataURL();

    setDoesConverting(true);

    dataURLtoBlob(croppedDataURL)
      .then((convertedBlob) => onClose(convertedBlob))
      .catch(() => {
        showToast({
          type: 'error',
          title: '이미지 크기 조절 오류',
          description: '다시 시도해주세요.',
        });

        setDoesConverting(false);
      });
  };

  return (
    <div className="relative flex flex-1 flex-col">
      <div className="flex flex-row justify-between p-2">
        <Button variants="ghost" size="icon" onClick={() => onClose()} disabled={doesConverting}>
          <MdChevronLeft className="size-6" />
        </Button>

        <Button variants="ghost" onClick={handleApplyClick} disabled={doesConverting}>
          {!doesConverting && '확인'}
          {doesConverting && <VscLoading className="animate-spin" />}
        </Button>
      </div>

      <Cropper
        src={fileImageURL}
        className="flex-1"
        zoomTo={0.5}
        initialAspectRatio={1}
        viewMode={1}
        minCropBoxHeight={10}
        minCropBoxWidth={10}
        background={false}
        responsive={true}
        autoCropArea={1}
        checkOrientation={false}
        guides={true}
        ref={cropperRef}
      />
    </div>
  );
}
