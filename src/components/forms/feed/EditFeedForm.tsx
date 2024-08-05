import { Button } from '@Components/ui/button';
import { Form } from '@Components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToastActions } from '@Hooks/toast';
import { requestUpdateMyFeed } from '@Services/feed';
import { useMutation } from '@tanstack/react-query';
import { TMyFeed } from '@Types/model';
import { ServiceErrorResponse } from '@Types/serviceError';
import { isAxiosError } from 'axios';
import { useEffect, useTransition } from 'react';
import { Control, useForm } from 'react-hook-form';
import { EditFeedSchema, editFeedSchema, FeedSchema } from './_feedSchema';
import { ImageField } from './fields/ImageField';
import { OutfitField } from './fields/OutfitField';
import { StylesField } from './fields/StyleField';

interface TEditFeed {
  defaultFeedDetails: TMyFeed;
  onValueChanged: (isChanged: boolean) => void;
  onSubmitSuccess: () => void;
}

type EditFeedProps = TEditFeed;

export function EditFeedForm({ defaultFeedDetails: { id: feedId, imageURL, styleIds, outfits }, onValueChanged, onSubmitSuccess }: EditFeedProps) {
  const startTransition = useTransition()[1];

  const { showToast } = useToastActions();

  const { mutate: updateMyFeed, isPending } = useMutation({
    mutationKey: ['updateMyFeed'],
    mutationFn: requestUpdateMyFeed,
  });

  const form = useForm<EditFeedSchema>({
    resolver: zodResolver(editFeedSchema),
    defaultValues: { styleIds, outfits },
    mode: 'onChange',
  });

  const { styleIds: watchedStyleIds, outfits: watchedOutfits } = form.watch();
  const { isValid } = form.formState;

  const isDirty =
    (() => {
      if (watchedStyleIds.length !== styleIds.length) {
        return true;
      }

      const sortedA = watchedStyleIds.toSorted((a, b) => a - b);
      const sortedB = styleIds.toSorted((a, b) => a - b);

      for (let i = sortedA.length; i--; ) {
        if ((sortedA[i] | sortedB[i]) !== sortedA[i]) {
          return true;
        }
      }

      return false;
    })() ||
    (() => {
      if (watchedOutfits.length !== outfits.length) {
        return true;
      }

      const sortedA = watchedOutfits.toSorted(({ categoryId: a }, { categoryId: b }) => a - b);
      const sortedB = outfits.toSorted(({ categoryId: a }, { categoryId: b }) => a - b);

      for (let i = sortedA.length; i--; ) {
        if (sortedA[i].details !== sortedB[i].details || sortedA[i].brandName !== sortedB[i].brandName) {
          return true;
        }
      }

      return false;
    })();

  /** 정보 입력 후 나가기 방지 */
  useEffect(() => {
    onValueChanged(isDirty);
  }, [isDirty]);

  function handleSubmitAfterValidation(values: EditFeedSchema) {
    startTransition(() => {
      updateMyFeed(
        { feedId, ...values },
        {
          onError(error) {
            showErrorToast(error);
          },
          onSuccess() {
            showToast({ title: '사진을 성공적으로 수정하였습니다.', type: 'success' });
            onSubmitSuccess();
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
          <div className="flex min-h-1 flex-1 flex-col gap-5 overflow-y-scroll">
            <ImageField control={form.control as unknown as Control<FeedSchema>} editable={false} defaultImage={imageURL} />
            <StylesField selectedStyles={watchedStyleIds} control={form.control as unknown as Control<FeedSchema>} />
            <OutfitField control={form.control as unknown as Control<FeedSchema>} />
          </div>

          {/* 원래 isPending은 없어도 되는데 자세한건 Button 컴포넌트 주석 참고 */}
          <Button type="submit" variants="secondary" className="w-full text-lg" disabled={!isValid || !isDirty}>
            완료
          </Button>
        </fieldset>
      </form>
    </Form>
  );
}
