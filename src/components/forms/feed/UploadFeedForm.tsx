import { Button } from '@Components/ui/button';
import { Form } from '@Components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToastActions } from '@Hooks/toast';
import { requestCreateFeed } from '@Services/feed';
import { useMutation } from '@tanstack/react-query';
import { ServiceErrorResponse } from '@Types/serviceError';
import { isAxiosError } from 'axios';
import { useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { UploadFeedSchema, uploadFeedSchema } from './_feedSchema';
import { ImageField } from './fields/ImageField';
import { OutfitField } from './fields/OutfitField';
import { StylesField } from './fields/StyleField';

interface TUploadFeed {
  onValueChanged: (isChanged: boolean) => void;
  onSubmitSuccess: () => void;
}

type UploadFeedProps = TUploadFeed;

export function UploadFeedForm({ onValueChanged, onSubmitSuccess }: UploadFeedProps) {
  const startTransition = useTransition()[1];

  const { showToast } = useToastActions();

  const { mutate: createFeed, isPending } = useMutation({
    mutationKey: ['createFeed'],
    mutationFn: requestCreateFeed,
  });

  const form = useForm<UploadFeedSchema>({
    resolver: zodResolver(uploadFeedSchema),
    defaultValues: {
      attachmentId: -1,
      styleIds: [],
      outfits: [],
    },
    mode: 'onChange',
  });

  const { styleIds } = form.watch();
  const { isDirty, isValid } = form.formState;

  /** 정보 입력 후 나가기 방지 */
  useEffect(() => {
    onValueChanged(isDirty);
  }, [isDirty]);

  function handleSubmitAfterValidation(values: UploadFeedSchema) {
    startTransition(() => {
      createFeed(values, {
        onError(error) {
          showErrorToast(error);
        },
        onSuccess() {
          showToast({ title: '사진을 성공적으로 업로드하였습니다.', type: 'success' });
          onSubmitSuccess();
        },
      });
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
            <ImageField control={form.control} />
            <StylesField selectedStyles={styleIds} control={form.control} />
            <OutfitField control={form.control} />
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
