import { FormControl, FormField, FormItem, FormMessage } from '@Components/ui/form';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { AccountSchema } from '../_accountSchema';
import { Control } from 'react-hook-form';

interface TGenderField {
  control: Control<AccountSchema>;
}

type GenderFieldProps = TGenderField;

export function GenderField({ control }: GenderFieldProps) {
  return (
    <FormField
      control={control}
      name="gender"
      render={({ field }) => (
        <FormItem className="space-y-1">
          <p className="text-h6 font-semibold">성별</p>

          <FormControl>
            <RadioGroup.Root defaultValue="men" className="flex w-full flex-row gap-5" value={field.value} onValueChange={field.onChange}>
              <RadioGroup.Item
                value="MALE"
                className="flex flex-1 items-center justify-center rounded-lg bg-gray-200 py-3 text-black transition-colors data-[state=checked]:bg-violet-500 data-[state=checked]:text-white">
                <p>남자</p>
              </RadioGroup.Item>
              <RadioGroup.Item
                value="FEMALE"
                className="flex flex-1 items-center justify-center rounded-lg bg-gray-200 py-3 text-black transition-colors data-[state=checked]:bg-violet-500 data-[state=checked]:text-white">
                <p>여자</p>
              </RadioGroup.Item>
            </RadioGroup.Root>
          </FormControl>

          <p className="pl-1 text-xs text-gray-600">성별을 선택해주세요. 사진의 필터링에 활용되니 사실과 같게 선택해주세요!</p>

          <FormMessage className="text-pink-400" />
        </FormItem>
      )}
    />
  );
}
