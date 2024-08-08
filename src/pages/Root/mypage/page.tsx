import { ShowNotificationButton } from '@Components/ShowNotificationButton';
import { Avatar } from '@Components/ui/avatar';
import { useConfirm, useModalActions } from '@Hooks/modal';
import { useHeader } from '@Hooks/useHeader';
import { requestGetMyDetails } from '@Services/member';
import { useAuthStore } from '@Stores/auth';
import { useQuery } from '@tanstack/react-query';
import { TMyUserDetail } from '@Types/model';
import { useEffect } from 'react';
import { IconType } from 'react-icons/lib';
import { MdBook, MdBookmark, MdHowToVote, MdPerson } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { AccountSetting } from './_components/AccountSetting';
import { ServicePolicyDialog } from './_components/ServicePolicyDialog';

type MenuType = 'subpage' | 'dialog';

interface TMyPageMenuBase {
  id: number;
  type: MenuType;
  path: string | null;
  IconComponent: IconType;
  name: string;
}

interface TMyPageMenuSubpage extends TMyPageMenuBase {
  type: 'subpage';
  path: string;
}

interface TMyPageMenuDialog extends TMyPageMenuBase {
  type: 'dialog';
  path: null;
}

type MyPageMenu = TMyPageMenuSubpage | TMyPageMenuDialog;

const mypageMenus: MyPageMenu[] = [
  {
    id: 0,
    type: 'subpage',
    path: '/mypage/feed',
    IconComponent: MdPerson,
    name: '내 피드',
  },
  {
    id: 1,
    type: 'subpage',
    path: '/mypage/vote-history',
    IconComponent: MdHowToVote,
    name: '투표 내역',
  },
  {
    id: 2,
    type: 'subpage',
    path: '/mypage/bookmark',
    IconComponent: MdBookmark,
    name: '북마크',
  },
  {
    id: 3,
    type: 'dialog',
    path: null,
    IconComponent: MdBook,
    name: '서비스 정책',
  },
];

export default function Page() {
  const { showModal } = useModalActions();
  const updateUserDetails = useAuthStore((state) => state.updateUserDetails);

  const { data, isFetched } = useQuery({
    queryKey: ['user', 'me', 'detail'],
    queryFn: () => requestGetMyDetails(),
  });

  const navigate = useNavigate();

  useHeader({ title: '마이페이지', rightSlot: () => <ShowNotificationButton /> });

  useEffect(() => {
    if (!isFetched || !data) {
      return;
    }

    updateUserDetails({ userDetails: { ...data.data } });
  }, [isFetched]);

  const handleMenuClick = ({ path, type }: MyPageMenu) => {
    if (type === 'subpage') {
      return navigate(path);
    }

    if (type === 'dialog') {
      showModal({ type: 'fullScreenDialog', animateType: 'slideInFromRight', Component: ServicePolicyDialog });
    }
  };

  return (
    <div className="flex h-full flex-col bg-gray-100">
      <MyDetails details={data?.data} />

      <div className="flex min-h-1 flex-1 flex-col">
        <ul className="min-h-1 flex-1 space-y-3 overflow-y-scroll px-5 py-3">
          {mypageMenus.map((menuItem) => (
            <li key={`menu-${menuItem.id}`} onClick={() => handleMenuClick(menuItem)} className="flex cursor-pointer flex-row gap-1 rounded-lg bg-white px-5 py-3">
              <menuItem.IconComponent className="size-5 text-purple-500" />
              <span>{menuItem.name}</span>
            </li>
          ))}
        </ul>

        <LogoutButton />
      </div>
    </div>
  );
}

function MyDetails({ details }: { details: TMyUserDetail | undefined }) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 rounded-b-2xl bg-white pb-5 pt-10">
      <Avatar src={details?.profileImageURL} size="124" />

      <div className="flex flex-col items-center justify-center gap-1">
        <p className="text-h4 font-semibold">안녕하세요, {details?.username}님!</p>

        <div className="space-x-1 text-detail">
          <span className="text-gray-500">{details?.genderType === 'MALE' ? '남자' : '여자'}</span>
          <span>·</span>
          <span>FA:P 선정 {details?.selectedFAPCount === undefined ? '-' : details?.selectedFAPCount}회</span>
        </div>
      </div>

      <ManageAccountButton details={details} />
    </div>
  );
}

function ManageAccountButton({ details }: { details: TMyUserDetail | undefined }) {
  const { showModal } = useModalActions();

  const handleClick = async () => {
    await showModal({ type: 'fullScreenDialog', animateType: 'slideInFromRight', Component: AccountSetting, props: { details } });
  };

  return (
    <button className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-detail" onClick={handleClick} disabled={details === undefined}>
      계정 관리
    </button>
  );
}

function LogoutButton() {
  const navigate = useNavigate();
  const confirm = useConfirm();

  const handleClick = async () => {
    const result = await confirm({ title: '로그아웃 하시겠습니까?', description: '언제든 다시 로그인 할 수 있어요.' });

    if (result) {
      window.dispatchEvent(new CustomEvent('mockingEnd'));
      navigate('/auth/signout', { replace: true });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-1">
      <button className="font-semibold underline" onClick={handleClick}>
        로그아웃
      </button>

      <p className="text-detail text-gray-500">FADE팀 admin@fade.com</p>
    </div>
  );
}
