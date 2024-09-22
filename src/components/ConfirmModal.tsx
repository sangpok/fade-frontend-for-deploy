import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { DefaultModalProps } from '@Stores/modal';
import { MdWarning } from 'react-icons/md';
import { Button } from './ui/button';

type ConfirmProps = {
  title: string;
  description: string;
};

export function ConfirmModal({ title, description, onClose }: DefaultModalProps<boolean, ConfirmProps>) {
  return (
    <FlexibleLayout.Root className="h-fit">
      <FlexibleLayout.Content className="p-5 pt-10">
        <div className="space-y-8">
          <MdWarning className="mx-auto size-24 text-purple-100" />

          <div>
            <p className="text-center text-lg font-semibold">{title}</p>
            <p className="whitespace-pre-line text-center text-lg">{description}</p>
          </div>
        </div>
      </FlexibleLayout.Content>

      <FlexibleLayout.Footer>
        <div className="flex gap-3 p-4">
          <Button type="button" variants="ghost" className="flex-1 text-lg" onClick={() => onClose(false)}>
            취소
          </Button>

          <Button type="button" variants="destructive" className="flex-1 text-lg" onClick={() => onClose(true)}>
            확인
          </Button>
        </div>
      </FlexibleLayout.Footer>
    </FlexibleLayout.Root>
  );
}
