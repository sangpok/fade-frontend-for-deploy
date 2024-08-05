import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { DefaultModalProps } from '@Stores/modal';
import { forwardRef, PropsWithChildren } from 'react';
import { MdClose, MdDelete, MdEditSquare } from 'react-icons/md';
import { Button } from './ui/button';

export const EditMyFeedBottomSheet = forwardRef<HTMLDivElement, DefaultModalProps>(({ onClose }: DefaultModalProps, ref) => {
  return (
    <FlexibleLayout.Root ref={ref} className="h-fit">
      <FlexibleLayout.Header>
        <header className="relative flex flex-row items-center justify-between px-5 pt-4">
          <p className="text-xl font-semibold">사진 상세 메뉴</p>
          <Button variants="ghost" size="icon" onClick={() => onClose()}>
            <MdClose className="size-6 text-gray-600" />
          </Button>
        </header>
      </FlexibleLayout.Header>

      <FlexibleLayout.Content className="p-5">
        <ul className="space-y-4">
          <MenuItem onClick={() => onClose({ menuId: 0 })}>
            <MdEditSquare className="size-6" />
            <span className="flex-1 text-left">스타일 및 착장 정보 수정하기</span>
          </MenuItem>

          <MenuItem onClick={() => onClose({ menuId: 1 })}>
            <MdDelete className="size-6 text-pink-400" />
            <span className="text-pink-400">사진 삭제하기</span>
          </MenuItem>
        </ul>
      </FlexibleLayout.Content>
    </FlexibleLayout.Root>
  );
});

interface TMenuItem {
  onClick: () => void;
}

type MenuItemProps = PropsWithChildren<TMenuItem>;

function MenuItem({ children, onClick }: MenuItemProps) {
  return (
    <li className="flex w-full cursor-pointer flex-row items-center gap-2 rounded-lg bg-gray-100 px-5 py-4" onClick={onClick}>
      {children}
    </li>
  );
}
