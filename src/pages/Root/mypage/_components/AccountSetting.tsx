import { AccountEditForm } from '@Components/forms/account/AccountEditForm';
import { BackButton } from '@Components/ui/button';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { DefaultModalProps } from '@Stores/modal';
import { UserDetail } from '@Types/User';
import testImage from '@Assets/test_fashion_image.jpg';

export function AccountSetting({ onClose }: DefaultModalProps) {
  /** TODO: 유저 정보 가져오기 */

  const userDetails: UserDetail = {
    accountId: 'fade_1234',
    email: 'dd@dd.com',
    id: 0,
    profileImageId: 0,
    profileImageURL: testImage,
    gender: 'men',
  };

  return (
    <FlexibleLayout.Root>
      <FlexibleLayout.Header>
        <header className="relative py-2">
          <BackButton onClick={onClose} />
          <p className="text-center text-2xl font-semibold">계정 관리</p>
        </header>
      </FlexibleLayout.Header>

      <FlexibleLayout.Content className="flex flex-col p-5 pt-10">
        <AccountEditForm defaultUserDetails={userDetails} onSubmited={() => {}} />
      </FlexibleLayout.Content>
    </FlexibleLayout.Root>
  );
}
