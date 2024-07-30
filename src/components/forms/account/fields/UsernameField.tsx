import { FormControl, FormField, FormItem, FormMessage } from '@Components/ui/form';
import { Input } from '@Components/ui/Input';
import { cn } from '@Utils/index';
import { Control } from 'react-hook-form';
import { AccountSchema } from '../_accountSchema';

interface TUsernameField {
  control: Control<AccountSchema>;
  invalid: boolean;
}

type UsernameFieldProps = TUsernameField;

export function UsernameField({ control, invalid }: UsernameFieldProps) {
  return (
    <FormField
      control={control}
      name="username"
      render={({ field }) => (
        <FormItem className="space-y-1">
          <p className="text-h6 font-semibold">계정 ID</p>
          <FormControl>
            <Input placeholder="계정 ID" {...field} className="peer aria-[invalid=true]:border-pink-400" />
          </FormControl>

          <div className="pl-1 text-xs text-gray-600">
            {invalid && <FormMessage className="text-xs text-pink-400" />}
            {!invalid && field.value === '' && <p>사용할 계정 ID를 입력해주세요.</p>}
            {!invalid && field.value !== '' && <p>사용할 수 있는 ID입니다.</p>}

            <ul className={cn('list-disc pl-5', { ['text-pink-400']: invalid })}>
              <li>영문자, 숫자, 마침표 및 밑줄만 사용 가능</li>
              <li>최소 4자, 최대 30자</li>
            </ul>
          </div>
        </FormItem>
      )}
    />
  );
}
