import * as Select from '@radix-ui/react-select';
import { MdCheck, MdChevronRight } from 'react-icons/md';

interface TSelectBox {
  items: Record<string, string>;
  defaultValue: string;
  onValueChange: (value: string) => void;
}

type SelectBoxProps = TSelectBox;

export function SelectBox({ defaultValue, items, onValueChange }: SelectBoxProps) {
  return (
    <Select.Root defaultValue={defaultValue} onValueChange={onValueChange}>
      <Select.Trigger className="group relative flex-1 rounded-lg border bg-white py-1 text-center transition-colors data-[state='open']:border-purple-400">
        <Select.Value placeholder="-" />
        <Select.Icon asChild>
          <MdChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 rotate-90 transition-transform group-data-[state='open']:-rotate-90" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content position="popper" sideOffset={12} className="w-[var(--radix-select-trigger-width)] shadow-md">
          <Select.ScrollUpButton />
          <Select.Viewport className="flex w-full flex-col gap-2 rounded-md border bg-white px-2 py-2">
            {Object.entries(items).map(([key, value]) => (
              <Select.Item
                key={key}
                value={key}
                className="relative w-full cursor-pointer rounded-sm px-2 py-1 text-center transition-colors data-[state='checked']:font-semibold pointerdevice:hover:bg-gray-100">
                <Select.ItemText>{value}</Select.ItemText>
                <Select.ItemIndicator className="absolute right-2 top-1/2 -translate-y-1/2">
                  <MdCheck />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
