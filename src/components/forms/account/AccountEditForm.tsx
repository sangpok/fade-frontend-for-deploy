import { Button } from '@Components/ui/button';
import { Form } from '@Components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToastActions } from '@Hooks/toast';
import { requestUpdateUserDetails } from '@Services/member';
import { useMutation } from '@tanstack/react-query';
import { ServiceErrorResponse } from '@Types/serviceError';
import { UserDetail } from '@Types/User';
import { isAxiosError } from 'axios';
import { useTransition } from 'react';
import { Control, useForm } from 'react-hook-form';
import { VscLoading } from 'react-icons/vsc';
import { accountEditSchema, AccountEditSchema, AccountSchema } from './_accountSchema';
import { AccountIdField } from './fields/AccountIdField';
import { ProfileImageField } from './fields/ProfileImageField';

interface TAccountEditForm {
  defaultUserDetails: UserDetail;
  onSubmited: (values: AccountEditSchema) => void;
}

type AccountEditFormProps = TAccountEditForm;

export function AccountEditForm({ defaultUserDetails, onSubmited }: AccountEditFormProps) {
  const startTransition = useTransition()[1];

  const { showToast } = useToastActions();

  const { mutate: updateUserDetails, isPending } = useMutation({
    mutationKey: ['updateUserDetails'],
    mutationFn: requestUpdateUserDetails,
  });

  const form = useForm<AccountEditSchema>({
    resolver: zodResolver(accountEditSchema),
    defaultValues: {
      profileImageId: defaultUserDetails.profileImageId,
      accountId: defaultUserDetails.accountId,
    },
    mode: 'onChange',
  });

  const { isValid, errors } = form.formState;
  const couldSubmit = isValid;

  function handleSubmitAfterValidation(values: AccountEditSchema) {
    startTransition(() => {
      updateUserDetails(values, {
        onSuccess() {
          onSubmited(values);
        },
        onError(error) {
          showErrorToast(error);
        },
      });
    });
  }

  const showErrorToast = (error: Error) => {
    if (isAxiosError<ServiceErrorResponse>(error) && error.response) {
      const { errorCode } = error.response!.data.result;

      /** TODO: 에러 분기 */
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
            <ProfileImageField control={form.control as unknown as Control<AccountSchema>} />
            <AccountIdField control={form.control as unknown as Control<AccountSchema>} invalid={!!errors?.accountId} />
          </div>

          <Button type="submit" className="text-xl" disabled={!couldSubmit}>
            {isPending && (
              <div className="flex flex-row items-center justify-center gap-2">
                <VscLoading className="inline-block size-5 animate-spin" />
                <span>전송 중...</span>
              </div>
            )}
            {!isPending && '수정하기'}
          </Button>
        </fieldset>
      </form>
    </Form>
  );
}
