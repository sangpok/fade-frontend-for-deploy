import { useModalActions } from '@Hooks/modal';
import { UploadViewDialog } from '@Pages/Root/_dialogs/UploadDialog/dialog';
import { cn } from '@Utils/index';
import { IconType } from 'react-icons/lib';
import { MdAccountBox, MdAdd, MdHowToVote, MdOutlineGridOn, MdPerson } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavItem {
  link: string | null;
  IconComponent: IconType;
}

const navList: NavItem[] = [
  {
    link: '/archive',
    IconComponent: MdOutlineGridOn,
  },
  {
    link: '/vote-fap',
    IconComponent: MdHowToVote,
  },
  {
    link: null,
    IconComponent: MdAdd,
  },
  {
    link: '/feed',
    IconComponent: MdAccountBox,
  },
  {
    link: '/mypage',
    IconComponent: MdPerson,
  },
];

export function NavBar() {
  const location = useLocation();
  const createNavItem = (navItem: NavItem) => <NavItem key={navItem.link} {...navItem} isActive={navItem.link ? location.pathname.startsWith(navItem.link) : false} />;

  return (
    <nav className="bg-white">
      <ul className="flex flex-row">{navList.map(createNavItem)}</ul>
    </nav>
  );
}

type NavItemProps = { isActive: boolean } & NavItem;

function NavItem({ link, IconComponent, isActive }: NavItemProps) {
  const navigate = useNavigate();

  const buttonClassName = cn('block h-full w-full py-5 group', {
    ['text-purple-700']: isActive,
  });

  if (link) {
    return (
      <li className="flex-1">
        <button type="button" className={buttonClassName} onClick={() => navigate(link)}>
          <IconComponent className="mx-auto size-6 transition-transform pointerdevice:group-hover:rotate-3 pointerdevice:group-hover:scale-125 pointerdevice:group-active:scale-95" />
        </button>
      </li>
    );
  }

  return <UploadImageButton buttonClassName={buttonClassName} IconComponent={IconComponent} />;
}

function UploadImageButton({ buttonClassName, IconComponent }: { buttonClassName: string; IconComponent: IconType }) {
  const { showModal } = useModalActions();

  const handleClick = async () => {
    return await startUploadImageFlow();
  };

  const startUploadImageFlow = async () => {
    return showModal({ type: 'fullScreenDialog', Component: UploadViewDialog });
  };

  return (
    <li className="flex-1">
      <button type="button" className={buttonClassName} onClick={handleClick}>
        <IconComponent className="mx-auto size-6" />
      </button>
    </li>
  );
}
