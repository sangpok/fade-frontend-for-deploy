import { Button } from '@Components/ui/button';
import { useToastActions } from '@Hooks/toast';
import { queryClient } from '@Libs/queryclient';
import { requestBookmarkFeed } from '@Services/feed';
import { useMutation } from '@tanstack/react-query';
import { cn } from '@Utils/index';
import { useEffect, useState } from 'react';
import { MdBookmark } from 'react-icons/md';
import { VscLoading } from 'react-icons/vsc';

interface TBookmarkButton {
  feedId: number;
  defaultBookmarkStatus: boolean;
  onToggle?: (value: boolean) => void;
  size?: 'default' | 'lg';
  shadow?: boolean;
}

type BookmarkButtonProps = TBookmarkButton;

export function BookmarkButton({ feedId, defaultBookmarkStatus, size = 'default', shadow = false, onToggle }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(defaultBookmarkStatus);
  const { showToast } = useToastActions();

  const { mutate: bookmarkFeed, isPending } = useMutation({
    mutationKey: ['bookmarkFeed'],
    mutationFn: requestBookmarkFeed,
  });

  useEffect(() => {
    setIsBookmarked(defaultBookmarkStatus);
  }, [defaultBookmarkStatus]);

  const handleClick = () => {
    setIsBookmarked((prev) => !prev);

    bookmarkFeed(
      {
        feedId,
        wouldBookmark: !defaultBookmarkStatus,
      },
      {
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ['user', 'me', 'bookmark'], refetchType: 'all' });
          onToggle && onToggle(!defaultBookmarkStatus);
        },
        onError() {
          setIsBookmarked((prev) => !prev);
          showToast({ type: 'error', title: '북마크에 실패했어요.' });
        },
      }
    );
  };

  return (
    <Button
      variants="white"
      interactive="onlyScale"
      className={cn({
        ['bg-purple-500']: isBookmarked,
        ['border border-gray-100 py-1']: size === 'default',
        ['shadow-bento']: shadow,
      })}
      disabled={isPending}
      onClick={handleClick}>
      {isPending && <VscLoading className={cn('size-6 animate-spin text-gray-600')} />}
      {!isPending && (
        <MdBookmark
          className={cn('size-6 text-gray-600 transition-colors', {
            ['text-white']: isBookmarked,
          })}
        />
      )}
    </Button>
  );
}
