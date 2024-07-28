import { FeedDetailDialog } from '@Components/FeedDetailDialog';
import { Button } from '@Components/ui/button';
import { Grid } from '@Components/ui/grid';
import { Image } from '@Components/ui/image';
import { useModalActions } from '@Hooks/modal';
import { useInfiniteObserver } from '@Hooks/useInfiniteObserver';
import { requestGetAllFashionFeed } from '@Services/feed';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { TAllFashionFeed } from '@Types/model';
import { cn } from '@Utils/index';
import { Suspense, useEffect, useState } from 'react';
import { VscLoading } from 'react-icons/vsc';
import { FilterType, SelectFilterDialog, SelectFilterDialogProps } from './SelectFilterDialog';
import { SpinLoading } from '@Components/SpinLoading';

export function AllArchivingView() {
  const [filters, setFilters] = useState<FilterType>({
    gender: null,
    selectedStyles: [],
  });

  const handleFilterChanged = (newFilter: FilterType) => {
    setFilters(newFilter);
  };

  return (
    <div className="flex w-full flex-col p-1">
      {/* TODO: 나중에 스크롤 애니메이션 달아보기 */}
      <div className="w-full bg-white p-5">
        <SelectFilterButton filters={filters} onFilterChanged={handleFilterChanged} />
      </div>

      <Suspense fallback={<SpinLoading />}>
        <FeedList filters={filters} />
      </Suspense>
    </div>
  );
}

interface TFeedList {
  filters: FilterType;
}

type FeedListProps = TFeedList;

function FeedList({ filters }: FeedListProps) {
  const { data, isPending, fetchNextPage, isFetchingNextPage, hasNextPage } = useSuspenseInfiniteQuery({
    queryKey: ['archiving', 'all', { ...filters }],
    queryFn: ({ pageParam }) => requestGetAllFashionFeed({ nextCursor: pageParam, filters }),
    getNextPageParam(lastPage) {
      return lastPage.nextCursor !== null ? lastPage.nextCursor : undefined;
    },
    initialPageParam: 0,
  });

  const { disconnect: disconnectObserver, resetObserve } = useInfiniteObserver({
    parentNodeId: `feedList`,
    onIntersection: fetchNextPage,
  });

  useEffect(() => {
    resetObserve();
  }, [filters]);

  useEffect(() => {
    !hasNextPage && disconnectObserver();
  }, [hasNextPage]);

  return (
    <div className="h-full min-h-1 flex-1 overflow-y-scroll">
      <div className="w-full flex-1 gap-1">
        <Grid id={`feedList`} cols={3} className="w-full">
          {data?.pages.map(({ feeds }) => feeds.map((feed, index) => <FeedItem key={`item-${feed.feedId}`} feeds={feeds} index={index} {...feed} />))}
        </Grid>
      </div>

      {isFetchingNextPage && (
        <div className="flex w-full items-center justify-center p-5">
          <VscLoading className="size-6 animate-spin" />
        </div>
      )}

      {!isPending && !hasNextPage && <p className="text-detail text-gray-700">모든 페이더들의 패션을 불러왔어요.</p>}
    </div>
  );
}

interface TFeedItem {
  feeds: TAllFashionFeed[];
  index: number;
}

type FeedItemProps = TFeedItem & TAllFashionFeed;

function FeedItem({ feeds, index, ...feed }: FeedItemProps) {
  const { showModal } = useModalActions();

  const handleClick = async () => {
    await showModal({ type: 'fullScreenDialog', animateType: 'slideInFromRight', Component: FeedDetailDialog, props: { feeds, defaultViewIndex: index } });
  };

  return (
    <div key={`item-${feed.feedId}`} className="group aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-lg" onClick={handleClick}>
      <Image src={feed.imageURL} className="h-full w-full transition-transform group-hover:scale-105" />
    </div>
  );
}

interface TSelectFilterButton {
  filters: FilterType;
  onFilterChanged: (newFilters: FilterType) => void;
}

type SelectFilterButtonProps = TSelectFilterButton;

function SelectFilterButton({ filters, onFilterChanged }: SelectFilterButtonProps) {
  const { showModal } = useModalActions();

  const hasFilters = filters.gender !== null || filters.selectedStyles.length !== 0;

  const handleClick = async () => {
    const selectFilterResult = await showModal<FilterType>({
      type: 'fullScreenDialog',
      animateType: 'slideInFromRight',
      Component: SelectFilterDialog,
      props: { defaultFilter: filters } as SelectFilterDialogProps,
    });

    selectFilterResult && onFilterChanged(selectFilterResult);
  };

  return (
    <Button
      variants="secondary"
      className={cn('w-full bg-gray-100 text-gray-900', {
        ['bg-purple-50']: hasFilters,
      })}
      onClick={handleClick}>
      {hasFilters && '필터 적용중'}
      {!hasFilters && '필터'}
    </Button>
  );
}
