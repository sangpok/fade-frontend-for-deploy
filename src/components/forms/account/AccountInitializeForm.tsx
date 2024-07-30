import { Button } from '@Components/ui/button';
import { Form } from '@Components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToastActions } from '@Hooks/toast';
import { requestSignUp, SignUpType } from '@Services/auth';
import { useMutation } from '@tanstack/react-query';
import { AuthTokens } from '@Types/model';
import { ServiceErrorResponse } from '@Types/serviceError';
import { isAxiosError } from 'axios';
import { useTransition } from 'react';
import { Control, useForm } from 'react-hook-form';
import { VscLoading } from 'react-icons/vsc';
import { accountInitializeSchema, AccountInitializeSchema, AccountSchema } from './_accountSchema';
import { UsernameField } from './fields/UsernameField';
import { GenderField } from './fields/GenderField';

interface TAccountInitializeForm {
  accessToken: string;
  onSubmited: (values: AuthTokens) => void;
}

type AccountInitializeFormProps = TAccountInitializeForm;

export function AccountInitializeForm({ accessToken, onSubmited }: AccountInitializeFormProps) {
  const startTransition = useTransition()[1];

  const { showToast } = useToastActions();

  const { mutate: signUp, isPending } = useMutation({
    mutationKey: ['signup'],
    mutationFn: requestSignUp,
  });

  const form = useForm<AccountInitializeSchema>({
    resolver: zodResolver(accountInitializeSchema),
    defaultValues: {
      username: '',
      gender: 'MALE',
    },
    mode: 'onChange',
  });

  const { isValid, errors } = form.formState;
  const couldSubmit = isValid;

  function handleSubmitAfterValidation(values: AccountInitializeSchema) {
    startTransition(() => {
      signUp(
        {
          ...values,
          signUpType: SignUpType.KAKAO,
          accessToken,
        },
        {
          onSuccess(data) {
            onSubmited(data.data);
          },
          onError(error) {
            showErrorToast(error);
          },
        }
      );
    });
  }

  const showErrorToast = (error: Error) => {
    if (isAxiosError<ServiceErrorResponse>(error) && error.response) {
      const { errorCode } = error.response!.data.result;

      if (errorCode === 'ALREADY_EXIST_MEMBER_ID') {
        showToast({ type: 'error', title: '이미 존재하는 ID입니다.' });
        return;
      }
    }

    showToast({ type: 'error', title: `알 수 없는 오류(${error.name})`, description: error.message });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitAfterValidation)} className="h-full space-y-8">
        <fieldset className="flex h-full flex-col gap-5" disabled={isPending}>
          <div className="flex flex-1 flex-col gap-5">
            <UsernameField control={form.control as unknown as Control<AccountSchema>} invalid={!!errors?.username} />
            <GenderField control={form.control as unknown as Control<AccountSchema>} />
          </div>

          {/* 원래 isPending은 없어도 되는데 자세한건 Button 컴포넌트 주석 참고 */}
          <Button type="submit" className="text-xl" disabled={!couldSubmit || isPending}>
            {isPending && (
              <div className="flex flex-row items-center justify-center gap-2">
                <VscLoading className="inline-block size-5 animate-spin" />
                <span>전송 중...</span>
              </div>
            )}
            {!isPending && 'FADE 시작하기'}
          </Button>
        </fieldset>
      </form>
    </Form>
  );
}
