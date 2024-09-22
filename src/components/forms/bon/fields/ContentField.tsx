import { FormControl, FormField, FormItem } from '@Components/ui/form';
import { Control } from 'react-hook-form';
import { BoNSchema } from '../_bonSchema';

interface TContentsField {
  control: Control<BoNSchema>;
}

type ContentsFieldProps = TContentsField;

export function ContentsField({ control }: ContentsFieldProps) {
  return (
    <FormField
      control={control}
      name="contents"
      render={({ field }) => (
        <FormItem className="space-y-1">
          <FormControl>
            <textarea placeholder="설명을 입력해주세요 (최대 200자)" {...field} className="peer h-[10.3125rem] w-full resize-none" maxLength={200} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
