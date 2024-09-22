import { Button } from '@Components/ui/button';
import { Form } from '@Components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToastActions } from '@Hooks/toast';
import { useMutation } from '@tanstack/react-query';
import { ServiceErrorResponse } from '@Types/serviceError';
import { isAxiosError } from 'axios';
import { useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { uploadBoNSchema, UploadBoNSchema } from './_bonSchema';
import { requestCreateBoN } from '@Services/bon';
import { TitleField } from './fields/TitleField';
import { ContentsField } from './fields/ContentField';
import { ImageField } from './fields/ImageField';

interface TUploadBoN {
  onValueChanged: (isChanged: boolean) => void;
  onSubmitSuccess: () => void;
}

type UploadBoNProps = TUploadBoN;

export function UploadBoNForm({ onValueChanged, onSubmitSuccess }: UploadBoNProps) {
  const startTransition = useTransition()[1];

  const { showToast } = useToastActions();

  const { mutate: createBoN, isPending } = useMutation({
    mutationKey: ['createBoN'],
    mutationFn: requestCreateBoN,
  });

  const form = useForm<UploadBoNSchema>({
    resolver: zodResolver(uploadBoNSchema),
    defaultValues: {
      title: '',
      contents: '',
      attachmentId: -1,
    },
    mode: 'onChange',
  });

  const { isDirty, isValid } = form.formState;

  /** 정보 입력 후 나가기 방지 */
  useEffect(() => {
    onValueChanged(isDirty);
  }, [isDirty]);

  function handleSubmitAfterValidation(values: UploadBoNSchema) {
    startTransition(() => {
      createBoN(values, {
        onError(error) {
          showErrorToast(error);
        },
        onSuccess() {
          showToast({ title: '투표가 게시되었습니다.', type: 'success' });
          onSubmitSuccess();
        },
      });
    });
  }

  const showErrorToast = (error: Error) => {
    if (isAxiosError<ServiceErrorResponse>(error) && error.response) {
      const { errorCode } = error.response!.data.result;

      // TODO: 투표 업로드에 대한 커스텀 오류 처리
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
            <TitleField control={form.control} />
            <ContentsField control={form.control} />
            <ImageField control={form.control} />
          </div>

          {/* 원래 isPending은 없어도 되는데 자세한건 Button 컴포넌트 주석 참고 */}
          <Button type="submit" variants="secondary" className="w-full text-lg" disabled={!isValid}>
            업로드
          </Button>
        </fieldset>
      </form>
    </Form>
  );
}
