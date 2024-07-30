import { AccountEditForm } from '@Components/forms/account/AccountEditForm';
import { BackButton } from '@Components/ui/button';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { axios } from '@Libs/axios';
import { queryClient } from '@Libs/queryclient';
import { requestRefreshToken } from '@Services/auth';
import { DefaultModalProps } from '@Stores/modal';
import { useMutation } from '@tanstack/react-query';
import { TMyUserDetail } from '@Types/model';

type AccountSettingProps = { details: TMyUserDetail };

export function AccountSetting({ details: userDetails, onClose }: DefaultModalProps<void, AccountSettingProps>) {
  const { mutate: refreshToken } = useMutation({
    mutationKey: ['refreshToken'],
    mutationFn: requestRefreshToken,
  });

  const handleSubmited = () => {
    refreshToken(null as unknown as void, {
      onSuccess({ data: { accessToken } }) {
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        queryClient.invalidateQueries({ queryKey: ['user', 'me', 'detail'] });
        onClose();
      },
    });
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
        <AccountEditForm defaultUserDetails={userDetails} onSubmited={handleSubmited} />
      </FlexibleLayout.Content>
    </FlexibleLayout.Root>
  );
}
