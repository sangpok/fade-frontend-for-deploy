import { FeedDetailDialog } from '@Components/FeedDetailDialog';
import { Avatar } from '@Components/ui/avatar';
import { Button } from '@Components/ui/button';
import { Image } from '@Components/ui/image';
import { useModalActions } from '@Hooks/modal';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { DefaultModalProps } from '@Stores/modal';
import { TFeed } from '@Types/model';
import { forwardRef } from 'react';
import { FaCrown } from 'react-icons/fa6';
import { MdClose } from 'react-icons/md';

export type LastFAPModalProps = {
  feed: TFeed;
};

export const LastFAPModal = forwardRef<HTMLDivElement, DefaultModalProps<void, LastFAPModalProps>>(
  ({ feed, onClose }: DefaultModalProps<void, LastFAPModalProps>, ref) => {
    const { showModal } = useModalActions();

    const handleClick = () => {
      showModal({ type: 'fullScreenDialog', animateType: 'slideInFromRight', Component: FeedDetailDialog, props: { feeds: [feed] } });
      onClose();
    };

    return (
      <FlexibleLayout.Root
        style={{
          backgroundImage: `image-set(url('/assets/fap_modal_bg.jpg') 1x, url('/assets/fap_modal_bg@2.jpg') 2x, url('/assets/fap_modal_bg@3.jpg') 3x)`,
        }}
        ref={ref}
        className="h-[32rem] rounded-2xl bg-cover bg-center bg-no-repeat">
        <FlexibleLayout.Header>
          <header className="relative p-5">
            <p className="text-2xl font-semibold">어제의 FA:P</p>
            <CloseButton onClick={onClose} />
          </header>
        </FlexibleLayout.Header>

        <FlexibleLayout.Content className="flex flex-col gap-8 p-5">
          <div className="relative mx-auto aspect-[3/4] h-full w-fit overflow-hidden rounded-lg border-2 border-purple-500 bg-gray-100 shadow-xl">
            <Image src={feed.imageURL} />
            <Image src="/assets/fap_badge.png" className="absolute right-3 top-3 size-10" local />
          </div>

          <div className="mx-auto flex flex-row items-center gap-3">
            <div className="relative">
              <Avatar src={feed.profileImageURL} size="40" />
              <FaCrown className="absolute -left-3 -top-4 size-6 -rotate-[25deg] text-yellow-700" />
            </div>

            <span className="text-h6 font-semibold">{feed.username}</span>
          </div>

          <Button variants="secondary" className="text-xl" onClick={handleClick}>
            보러가기
          </Button>
        </FlexibleLayout.Content>
      </FlexibleLayout.Root>
    );
  }
);

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="group absolute right-3 top-1/2 -translate-y-1/2" onClick={onClick}>
      <Button variants="ghost" className="icon">
        <MdClose className="size-6 text-gray-500" />
      </Button>
    </div>
  );
}
