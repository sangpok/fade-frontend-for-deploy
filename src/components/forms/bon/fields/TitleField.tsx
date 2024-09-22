import { FormControl, FormField, FormItem } from '@Components/ui/form';
import { Control } from 'react-hook-form';
import { BoNSchema } from '../_bonSchema';

interface TTitleField {
  control: Control<BoNSchema>;
}

type TitleFieldProps = TTitleField;

export function TitleField({ control }: TitleFieldProps) {
  return (
    <FormField
      control={control}
      name="title"
      render={({ field }) => (
        <FormItem className="space-y-1">
          <FormControl>
            <input placeholder="제목 입력(최대 10자)" {...field} className="peer w-full text-h5 font-semibold" maxLength={10} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
