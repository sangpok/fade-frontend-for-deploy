import { getBase64Image, validateLocalImageFile } from '@Utils/index';
import { ChangeEvent, useRef, useState } from 'react';
import { MdAddPhotoAlternate } from 'react-icons/md';
import { UploadGuideBottomSheet } from './UploadGuideBottomSheet';
import { useModalActions } from '@Hooks/modal';

export function InputImageFile(props: { value: string; onChange: (value: string) => void }) {
  const { showModal } = useModalActions();

  const [imageData, setImageData] = useState<string | null>(null); // base64 data
  const inputRef = useRef<HTMLInputElement>(null);

  const hasImageData = imageData !== null;
  const hasNoImageData = imageData === null;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const doneSelectImageFile = event.currentTarget.files !== null;

    if (!doneSelectImageFile) {
      return;
    }

    const currentImageFile = event.currentTarget.files![0];
    const { isValid, message } = validateLocalImageFile(currentImageFile);

    if (!isValid) {
      alert(message);
      return;
    }

    getBase64Image(currentImageFile)
      .then((imageData) => {
        inputRef.current!.value = '';
        setImageData(imageData);
        props.onChange(imageData);
      })
      .catch((error) => console.error(error));
  };

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

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        className="m group flex aspect-[2.2/1] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-gray-200"
        onKeyUp={(e) => ['Enter', ' '].includes(e.key) && handleSelectImageClick()}
        onClick={handleSelectImageClick}>
        {hasNoImageData && (
          <MdAddPhotoAlternate className="size-20 text-gray-500 transition-transform pointerdevice:group-hover:scale-125 pointerdevice:group-active:scale-95" />
        )}
        {hasImageData && <img src={imageData} className="h-full object-contain" />}
        <input ref={inputRef} type="file" id="image" name="image" accept=".jpg, jpeg, .png, .webp" onChange={handleChange} onClick={(e) => e.stopPropagation()} hidden />
      </div>
    </>
  );
}
