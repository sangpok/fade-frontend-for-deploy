import testImage from '@Assets/test_fashion_image.jpg';
import { Button } from '@Components/ui/button';
import { FormControl, FormField, FormItem } from '@Components/ui/form';
import { Control } from 'react-hook-form';
import { MdCameraAlt } from 'react-icons/md';
import { AccountSchema } from '../_accountSchema';

interface TProfileImageIdField {
  control: Control<AccountSchema>;
}

type ProfileImageIdFieldProps = TProfileImageIdField;

/** TODO: 프로필 이미지 업로드 로직 추가 */

export function ProfileImageField({ control }: ProfileImageIdFieldProps) {
  return (
    <FormField
      control={control}
      name="profileImageId"
      render={({ field }) => (
        <FormItem className="space-y-1">
          <p className="text-h6 font-semibold">프로필 사진</p>
          <FormControl>
            <div style={{ backgroundImage: `url('${testImage}')` }} className="relative mx-auto size-32 rounded-lg bg-cover bg-center bg-no-repeat">
              <Button variants="ghost" size="icon" className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3">
                <div className="rounded-full bg-gray-100 p-1">
                  <MdCameraAlt className="size-5 text-gray-400" />
                </div>
              </Button>
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
