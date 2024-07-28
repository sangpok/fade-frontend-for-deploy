import { useModalActions } from '@Hooks/modal';
import { MdOutlineNotificationsNone } from 'react-icons/md';
import { NotificationDialog } from './NotificationDialog';
import { Button } from './ui/button';

export function ShowNotificationButton() {
  const { showModal } = useModalActions();

  const handleClick = async () => {
    await showModal({ type: 'fullScreenDialog', animateType: 'slideInFromRight', Component: NotificationDialog });
  };

  return (
    <Button variants="ghost" size="icon" onClick={handleClick}>
      <MdOutlineNotificationsNone className="size-6" />
    </Button>
  );
}
