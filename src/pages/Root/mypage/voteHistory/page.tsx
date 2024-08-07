import { FeedDetailDialog } from '@Components/FeedDetailDialog';
import { SpinLoading } from '@Components/SpinLoading';
import { Grid } from '@Components/ui/grid';
import { Image } from '@Components/ui/image';
import { useModalActions } from '@Hooks/modal';
import { useHeader } from '@Hooks/useHeader';
import { useInfiniteObserver } from '@Hooks/useInfiniteObserver';
import { requestGetVoteHistory } from '@Services/vote';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { TVoteHistoryFeed } from '@Types/model';
import { cn } from '@Utils/index';
import { format, isBefore } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { Suspense, useEffect, useRef, useState } from 'react';
import { MdChevronLeft } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import './dateStyle.css';

export default function Page() {
  useHeader({ title: '투표 내역', leftSlot: () => <BackButton /> });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const selectedDateLabel = format(selectedDate, 'yyyy-MM-dd');

  const [searchMode, setSearchMode] = useState<'onlyDown' | 'bidirection'>('onlyDown');

  const [isFadeInMode, setIsFadeInMode] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-row items-center gap-3 bg-white px-5 py-3">
        <input
          id="datePicker"
          type="date"
          value={format(selectedDate, 'yyyy-MM-dd')}
          onInput={(e) => {
            setSelectedDate(e.currentTarget.valueAsDate || selectedDate);
            setSearchMode('bidirection');
          }}
          className="relative flex-1 appearance-none rounded-lg border-none bg-gray-100 bg-none px-3 py-1 outline-none"
        />
        <FadeInModeToggleButton isFadeInMode={isFadeInMode} onToggle={() => setIsFadeInMode((prev) => !prev)} />
      </div>

      <Suspense fallback={'로딩중'}>
        {searchMode === 'bidirection' && <p>기능 준비중입니다...</p>}
        {searchMode === 'onlyDown' && <VoteHistoryOnlyDownView isFadeInMode={isFadeInMode} selectedDateLabel={selectedDateLabel} />}
      </Suspense>
    </div>
  );
}

interface TVoteHistoryList {
  selectedDateLabel: string;
  isFadeInMode: boolean;
}

type VoteHistoryOnlyDownViewProps = TVoteHistoryList;

function VoteHistoryOnlyDownView({ selectedDateLabel, isFadeInMode }: VoteHistoryOnlyDownViewProps) {
  const { data, fetchNextPage, hasNextPage, hasPreviousPage, isFetchingNextPage, isFetchingPreviousPage, isPending } = useSuspenseInfiniteQuery({
    queryKey: ['user', 'me', 'voteHistory', 'onlyDown', '0', { selectedDateLabel }],
    queryFn: ({ pageParam: nextCursor }) => {
      return requestGetVoteHistory({ nextCursor, scrollType: '0' });
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => (lastPage.nextCursorToDownScroll !== null ? lastPage.nextCursorToDownScroll : undefined),
  });

  const voteHistoryFeeds = ([] as TVoteHistoryFeed[]).concat(...data.pages.map((page) => page.feeds));
  const dailyVoteHistories = getDailyVoteHistories(voteHistoryFeeds);

  const hasNoVoteHistory = !hasNextPage && !hasPreviousPage && !isPending && data && data.pages.at(0)?.feeds.length === 0;

  useInfiniteObserver({
    parentNodeId: 'feedList',
    onIntersection: fetchNextPage,
  });

  if (hasNoVoteHistory) {
    return (
      <div className="flex-1 space-y-[3.75rem] overflow-y-scroll p-5">
        <p>투표 내역이 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      {isFetchingPreviousPage && <SpinLoading />}

      <div id="feedList" className="flex-1 space-y-[3.75rem] overflow-y-scroll p-5">
        {Object.entries(dailyVoteHistories)
          .toSorted(([a], [b]) => (isBefore(a, b) ? 1 : -1))
          .map(([votedAt, feeds]) => (
            <VoteHistoryItem key={`history-item-${0}-${votedAt}`} votedAt={votedAt} feeds={feeds} isFadeInMode={isFadeInMode} />
          ))}
        {isFetchingNextPage && <SpinLoading />}
      </div>

      {!hasNextPage && <p className="pl-5 text-detail text-gray-700">마지막 이전 투표 내역을 불러왔습니다.</p>}
    </>
  );
}

// function VoteHistoryList({ selectedDateLabel, isFadeInMode }: VoteHistoryListProps) {
//   const { data } = useSuspenseInfiniteQuery({
//     queryKey: ['user', 'me', 'voteHistory', 'bidirection', { selectedDateLabel }],
//     queryFn: () => {
//       return requestGetVoteHistory({
//         nextCursor: selectedDateLabel,
//         scrollType: '2',
//       });
//     },
//     initialPageParam: null as string | null,
//     getNextPageParam: (lastPage) => lastPage.nextCursorToDownScroll || undefined,
//     getPreviousPageParam: (firstPage) => firstPage.nextCursorToUpScroll || undefined,
//   });

//   return <AwaitedBidirectionView initialHistories={data} selectedDateLabel={selectedDateLabel} isFadeInMode={isFadeInMode} />;
// }

// function AwaitedBidirectionView({
//   initialHistories,
//   selectedDateLabel,
//   isFadeInMode,
// }: {
//   initialHistories: InfiniteData<GetVoteHistoryResponse, unknown>;
//   selectedDateLabel: string;
//   isFadeInMode: boolean;
// }) {
//   const [scrollType, setScrollType] = useState('0');

//   const { data, fetchNextPage, fetchPreviousPage, hasNextPage, hasPreviousPage, isFetched, isFetchingNextPage, isFetchingPreviousPage, isPending } =
//     useSuspenseInfiniteQuery({
//       queryKey: ['user', 'me', 'voteHistory', 'bidirection', { selectedDateLabel, scrollType }],
//       queryFn: ({ pageParam }) => {
//         return requestGetVoteHistory({ nextCursor: pageParam.nextCursor, scrollType: pageParam.scrollType });
//       },
//       initialPageParam: null as { nextCursor: string; scrollType: string } | null,
//       getNextPageParam: (lastPage) => (lastPage.nextCursorToDownScroll ? { nextCursor: lastPage.nextCursorToDownScroll, scrollType: '0' } : undefined),
//       getPreviousPageParam: (firstPage) => (firstPage.nextCursorToUpScroll ? { nextCursor: firstPage.nextCursorToUpScroll, scrollType: '1' } : undefined),
//       initialData: initialHistories,
//     });

//   const lastFirstVotedAt = useRef<Date | null>(null);
//   console.log(lastFirstVotedAt);

//   const firstChildObserver = useRef(
//     new IntersectionObserver(
//       ([{ isIntersecting }]) =>
//         isIntersecting &&
//         (() => {
//           setScrollType('1');
//           fetchPreviousPage();
//         })(),
//       { threshold: 0.1 }
//     )
//   );

//   const lastChildObserver = useRef(
//     new IntersectionObserver(
//       ([{ isIntersecting }]) =>
//         isIntersecting &&
//         (() => {
//           setScrollType('0');
//           fetchNextPage();
//         })(),
//       { threshold: 0.1 }
//     )
//   );

//   const voteHistoryFeeds = ([] as TVoteHistoryFeed[]).concat(...data.pages.map((page) => page.feeds));
//   const dailyVoteHistories = getDailyVoteHistories(voteHistoryFeeds);

//   const hasNoVoteHistory = !hasNextPage && !hasPreviousPage && !isPending && data && data.pages.at(0)?.feeds.length === 0;

//   const feedListRef = useRef<HTMLDivElement>(null);
//   const firstChildRef = useRef<HTMLDivElement>(null);
//   const lastChildRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     firstChildObserver.current.observe(firstChildRef.current!);
//     lastChildObserver.current.observe(lastChildRef.current!);

//     return () => {
//       firstChildObserver.current.disconnect();
//       lastChildObserver.current.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     !hasPreviousPage && firstChildObserver.current.disconnect();
//     !hasNextPage && lastChildObserver.current.disconnect();

//     if (hasPreviousPage) {
//       firstChildObserver.current.disconnect();
//       lastFirstVotedAt.current = data.pages[0].feeds[0].votedAt;
//       firstChildObserver.current.observe(firstChildRef.current!);
//     }
//   }, [hasNextPage, hasPreviousPage]);

//   if (hasNoVoteHistory) {
//     return (
//       <div className="flex-1 space-y-[3.75rem] overflow-y-scroll p-5">
//         <p>투표 내역이 없습니다.</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       {!hasPreviousPage && scrollType === '1' && <p className="pl-5 text-detail text-gray-700">마지막 최근 투표 내역을 불러왔습니다.</p>}

//       <div ref={feedListRef} className="flex-1 space-y-[3.75rem] overflow-y-scroll p-5">
//         {isFetchingPreviousPage && <SpinLoading />}

//         <div ref={firstChildRef} />

//         {Object.entries(dailyVoteHistories)
//           .toSorted(([a], [b]) => (isBefore(a, b) ? 1 : -1))
//           .map(([votedAt, feeds]) => (
//             <VoteHistoryItem
//               key={`history-item-${'bidirection'}-${votedAt}`}
//               votedAt={votedAt}
//               feeds={feeds}
//               isFadeInMode={isFadeInMode}
//               focus={selectedDateLabel === votedAt || lastFirstVotedAt.current === votedAt}
//             />
//           ))}

//         <div ref={lastChildRef} />

//         {isFetchingNextPage && <SpinLoading />}
//       </div>

//       {!hasNextPage && scrollType === '0' && <p className="pl-5 text-detail text-gray-700">마지막 이전 투표 내역을 불러왔습니다.</p>}
//     </>
//   );
// }

function getDailyVoteHistories(feeds: TVoteHistoryFeed[]) {
  const dailyVoteHistories: Record<string, TVoteHistoryFeed[]> = {};

  feeds.forEach((feed) => {
    const votedAt = format(feed.votedAt, 'yyyy-MM-dd');
    dailyVoteHistories[votedAt] = [...(dailyVoteHistories[votedAt] || []), feed];
  });

  return dailyVoteHistories;
}

function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      className="group cursor-pointer rounded-lg p-2 touchdevice:active:bg-gray-100 pointerdevice:hover:bg-gray-100"
      onClick={() => navigate('/mypage', { replace: true })}>
      <MdChevronLeft className="size-6 transition-transform group-active:scale-95" />
    </button>
  );
}

function FadeInModeToggleButton({ isFadeInMode, onToggle }: { isFadeInMode: boolean; onToggle: () => void }) {
  return (
    <button
      className={cn('rounded-3xl bg-gray-200 p-1 shadow-inner transition-colors', {
        ['pr-8']: !isFadeInMode,
        ['bg-purple-500 pl-8']: isFadeInMode,
      })}
      onClick={() => onToggle()}>
      <motion.div layout className="rounded-3xl bg-white px-3 py-2">
        <Image src={'/assets/fade_in_btn.png'} className="h-[.75rem] w-[3.875rem]" local />
      </motion.div>
    </button>
  );
}

function VoteHistoryItem({ votedAt, isFadeInMode, feeds, focus }: { votedAt: string; isFadeInMode: boolean; feeds: TVoteHistoryFeed[]; focus?: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const votedAtLabel = format(votedAt, 'yyyy년 M월 d일');

  useEffect(() => {
    focus && sectionRef.current?.scrollIntoView({ behavior: 'instant' });
  }, [focus]);

  return (
    <section ref={sectionRef} className="space-y-2">
      <h6 className="text-h6 font-semibold">{votedAtLabel}</h6>
      <AnimatePresence>
        <Grid id="feedList" cols={5}>
          {feeds.map((feed, index) => {
            if (isFadeInMode) {
              return feed.voteType === 'FADE_IN' && <FeedItem key={`feed-item-${feed.id}-${index}`} {...feed} feeds={feeds} index={index} />;
            } else {
              return <FeedItem key={`feed-item-${feed.id}-${index}`} {...feed} feeds={feeds} index={index} />;
            }
          })}
        </Grid>
      </AnimatePresence>
    </section>
  );
}
interface TFeedItem {
  feeds: TVoteHistoryFeed[];
  index: number;
}

type FeedItemProps = TFeedItem & TVoteHistoryFeed;

function FeedItem({ feeds, index, ...feed }: FeedItemProps) {
  const { showModal } = useModalActions();

  const handleClick = async () => {
    await showModal({
      type: 'fullScreenDialog',
      animateType: 'slideInFromRight',
      Component: FeedDetailDialog,
      props: {
        feeds,
        defaultViewIndex: index,
        viewType: 'voteHistory',
      },
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="group aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-lg"
      onClick={handleClick}>
      <Image src={feed.imageURL} className="h-full w-full transition-transform group-hover:scale-105" />
    </motion.div>
  );
}
