import { Button } from '@Components/ui/button';
import { DefaultModalProps } from '@Stores/modal';
import { useEffect, useRef } from 'react';
import { Cropper, ReactCropperElement } from 'react-cropper';
import { MdChevronLeft } from 'react-icons/md';
import './cropper.css';

type ImageCropperModalProps = DefaultModalProps<unknown, { imageFile: File }>;

export function ImageCropperModal({ imageFile, onClose }: ImageCropperModalProps) {
  const cropperRef = useRef<ReactCropperElement>(null);
  const croppedDataBlob = useRef<Blob>(new Blob());

  const fileImageURL = URL.createObjectURL(imageFile);

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(fileImageURL);
    };
  });

  function dataURLtoBlob(dataURL: string) {
    const arr = dataURL.split(',');
    const matches = arr[0].match(/:(.*?);/);
    const mime = matches && matches.length >= 2 ? matches[1] : null;

    // MIME 타입이 없을 때 크롭 리셋
    if (!mime) {
      const cropperInstance = cropperRef.current?.cropper;
      cropperInstance?.reset();
      return;
    }

    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  const handleCrop = () => {
    const cropper = cropperRef?.current?.cropper;
    const croppedDataURL = cropper?.getCroppedCanvas().toDataURL();

    if (croppedDataBlob.current !== undefined) {
      croppedDataBlob.current = dataURLtoBlob(croppedDataURL!)!;
    }
  };

  return (
    <div className="relative flex flex-1 flex-col">
      <div className="flex flex-row justify-between p-2">
        <Button variants="ghost" size="icon" onClick={() => onClose()}>
          <MdChevronLeft className="size-6" />
        </Button>

        <Button
          variants="ghost"
          onClick={() => {
            onClose(croppedDataBlob.current);
          }}>
          확인
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
        crop={handleCrop}
        ref={cropperRef}
      />
    </div>
  );
}
