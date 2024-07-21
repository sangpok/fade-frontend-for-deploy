import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { FadeLogo } from '@Components/FadeLogo';
import { Input } from '@Components/ui/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthActions } from '@Hooks/auth';
import { useToastActions } from '@Hooks/toast';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { requestSignUp, SignUpType } from '@Services/authAPI';
import { cn, tryCatcher } from '@Utils/index';
import { useTransition } from 'react';
import { Control, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

export default function InitializeAccountView({ authorizationCode }: { authorizationCode: string }) {
  const navigate = useNavigate();

  const { showToast } = useToastActions();
  const { signIn } = useAuthActions();

  const handleSubmit = async (values: InitializeAccountFormSchema) => {
    const [response, errorCode] = await tryCatcher(() =>
      requestSignUp({
        ...values,
        signUpType: SignUpType.KAKAO,
        authorizationCode,
      })
    );

    if (response) {
      signIn(response.data);
      return navigate('/', { replace: true });
    }

    if (errorCode) {
      if (errorCode === 'account_already_exists') {
        return showToast({ type: 'error', title: '이미 존재하는 ID입니다.' });
      }

      throw new Error(errorCode);
    }
  };

  return (
    <FlexibleLayout.Root>
      <FlexibleLayout.Header>
        <header className="space-y-5 px-5 py-4">
          <FadeLogo />
          <div className="space-y-2">
            <p className="whitespace-pre-line text-2xl font-semibold">{`투표로 만들어가는 패션 트렌드, FADE\n새로운 페이더가 된 걸 환영해요!`}</p>
            <p className="text-gray-600">FADE를 시작하기 전에, 간단한 계정 설정을 해주세요.</p>
          </div>
        </header>
      </FlexibleLayout.Header>

      <FlexibleLayout.Content>
        <InitializeAccountForm onSubmit={handleSubmit} />
      </FlexibleLayout.Content>
    </FlexibleLayout.Root>
  );
}

const accountIdRegExp = new RegExp(/^[a-zA-Z0-9._]{4,15}$/);

const formSchema = z.object({
  accountId: z.string().regex(accountIdRegExp, '사용할 수 없는 ID입니다.'),
  sex: z.enum(['men', 'women'], { message: '성별을 선택해주세요.' }),
});

type InitializeAccountFormSchema = z.infer<typeof formSchema>;

function InitializeAccountForm({ onSubmit }: { onSubmit: (values: InitializeAccountFormSchema) => void }) {
  const [pending, startTransition] = useTransition();

  const form = useForm<InitializeAccountFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountId: '',
      sex: 'men',
    },
    mode: 'onChange',
  });

  const { isValid, errors } = form.formState;
  const couldSubmit = isValid && !pending;

  function handleSubmitAfterValidation(values: InitializeAccountFormSchema) {
    startTransition(() => {
      onSubmit(values);
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitAfterValidation)} className="h-full space-y-8">
        <fieldset className="flex h-full flex-col gap-5" disabled={pending}>
          <div className="flex flex-1 flex-col gap-5">
            <AccountIdField control={form.control} invalid={!!errors?.accountId} />
            <SexField control={form.control} />
          </div>

          <button
            className="w-full self-end rounded-lg bg-purple-500 py-3 text-xl font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
            disabled={!couldSubmit}>
            FADE 시작하기
          </button>
        </fieldset>
      </form>
    </Form>
  );
}

function AccountIdField({ control, invalid }: { control: Control<InitializeAccountFormSchema>; invalid: boolean }) {
  return (
    <FormField
      control={control}
      name="accountId"
      render={({ field }) => (
        <FormItem className="space-y-1">
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

function SexField({ control }: { control: Control<InitializeAccountFormSchema> }) {
  return (
    <FormField
      control={control}
      name="sex"
      render={({ field }) => (
        <FormItem className="space-y-1">
          <FormControl>
            <RadioGroup.Root defaultValue="men" className="flex w-full flex-row gap-5" value={field.value} onValueChange={field.onChange}>
              <RadioGroup.Item
                value="men"
                className="flex flex-1 items-center justify-center rounded-lg bg-gray-200 py-3 text-black transition-colors data-[state=checked]:bg-violet-500 data-[state=checked]:text-white">
                <p>남자</p>
              </RadioGroup.Item>
              <RadioGroup.Item
                value="women"
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
