import { OUTFIT_STYLE_LIST } from '@/constants';
import { ItemBadge } from '@Components/ItemBadge';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@Components/ui/form';
import { useModalActions } from '@Hooks/modal';
import { Control } from 'react-hook-form';
import { MdChevronRight } from 'react-icons/md';
import { SelectStyleView } from '../_components/SelectStyleView';
import { FeedSchema } from '../_feedSchema';

interface TStylesField {
  selectedStyles: number[];
  control: Control<FeedSchema>;
}

type StylesFieldProps = TStylesField;

export function StylesField({ selectedStyles, control }: StylesFieldProps) {
  const hasSelectedStyles = selectedStyles.length !== 0;

  return (
    <FormField
      control={control}
      name="styleIds"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="mb-3 text-lg font-semibold">스타일</FormLabel>

          {hasSelectedStyles && (
            <ul className="flex flex-row flex-wrap gap-x-2 gap-y-3">
              {selectedStyles
                .sort((a, b) => a - b)
                .map((selectedStyle) => (
                  <li key={selectedStyle}>
                    <ItemBadge variants="primary">{OUTFIT_STYLE_LIST[selectedStyle]}</ItemBadge>
                  </li>
                ))}
            </ul>
          )}

          <FormControl>
            <SelectStyleButton selectedStyles={selectedStyles} onStylesSelected={field.onChange} />
          </FormControl>
          <FormMessage className="text-pink-400" />
        </FormItem>
      )}
    />
  );
}

function SelectStyleButton({ selectedStyles, onStylesSelected }: { selectedStyles: number[]; onStylesSelected: (selectedStyles: number[]) => void }) {
  const { showModal } = useModalActions();

  const handleClick = async () => {
    const selectResult = await startSelectStyleFlow(selectedStyles);
    selectResult && onStylesSelected(selectResult);
  };

  const startSelectStyleFlow = async (defaultStyles: number[]) => {
    return showModal<number[]>({
      type: 'fullScreenDialog',
      animateType: 'slideInFromRight',
      Component: SelectStyleView,
      props: { defaultStyles },
    });
  };

  return (
    <button type="button" className="relative block w-full rounded-lg border border-purple-50 bg-white py-3" onClick={handleClick}>
      스타일 선택하기
      <MdChevronRight className="absolute right-3 top-1/2 size-6 -translate-y-1/2" />
    </button>
  );
}
