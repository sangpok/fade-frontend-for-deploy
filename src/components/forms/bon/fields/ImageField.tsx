import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@Components/ui/form';
import { Image } from '@Components/ui/image';
import { Control } from 'react-hook-form';
import { BoNSchema } from '../_bonSchema';
import { InputImageFile } from '../_components/InputImageFile';

interface TImageField {
  control: Control<BoNSchema>;
  editable?: boolean;
  defaultImage?: string;
}

type ImageFieldProps = TImageField;

export function ImageField({ control, editable = true, defaultImage = '' }: ImageFieldProps) {
  return (
    <FormField
      control={control}
      name="attachmentId"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-lg font-semibold">{editable ? '사진 추가' : '사진'}</FormLabel>

          <div>
            {!editable && (
              <>
                <div className="relative aspect-[2.2/1] w-full cursor-not-allowed overflow-hidden rounded-lg bg-gray-200">
                  <Image src={defaultImage} size="contain" />
                  <div className="absolute inset-0 bg-gray-500/50" />
                </div>

                <p className="mt-1 pl-2 text-xs text-gray-600">※ 업로드 후에는 사진 수정이 불가능해요!</p>
              </>
            )}

            {editable && (
              <>
                <FormControl>
                  <InputImageFile value={field.value} onChange={field.onChange} />
                </FormControl>

                <p className="mt-1 pl-2 text-xs text-gray-600">※ 업로드 후에는 사진 수정이 불가하니 가이드에 맞추어 신중히 업로드해주세요!</p>
              </>
            )}
          </div>

          <FormMessage className="text-pink-400" />
        </FormItem>
      )}
    />
  );
}
