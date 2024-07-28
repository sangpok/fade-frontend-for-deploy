import { FadeLogo } from '@Components/FadeLogo';
import { AccountInitializeForm } from '@Components/forms/account/AccountInitializeForm';
import { useAuthActions } from '@Hooks/auth';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { AuthTokens } from '@Types/User';
import { useNavigate } from 'react-router-dom';

export default function AccountInitializeView({ accessToken }: { accessToken: string }) {
  const navigate = useNavigate();
  const { signIn } = useAuthActions();

  const handleSubmited = (values: AuthTokens) => {
    signIn(values);
    navigate('/', { replace: true });
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

      <FlexibleLayout.Content className="p-5">
        <AccountInitializeForm accessToken={accessToken} onSubmited={handleSubmited} />
      </FlexibleLayout.Content>
    </FlexibleLayout.Root>
  );
}
