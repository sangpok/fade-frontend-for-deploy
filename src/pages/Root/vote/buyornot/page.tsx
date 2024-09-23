import { SpinLoading } from '@Components/SpinLoading';
import { Image } from '@Components/ui/image';
import { useModalActions } from '@Hooks/modal';
import { useHeader } from '@Hooks/useHeader';
import { useInfiniteObserver } from '@Hooks/useInfiniteObserver';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { requestGetBoNList } from '@Services/bon';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { TBoNItem } from '@Types/model';
import { cn } from '@Utils/index';
import { Suspense, useState } from 'react';
import { MdEdit } from 'react-icons/md';
import { VoteSubPageList } from '../_components/VoteSubPageList';
import { BoNDetailModal } from './_components/BoNDetailModal';
import { SelectBox } from './_components/SelectBox';
import { UploadBoNModal } from './_components/UploadBoNModal';

export default function Page() {
  useHeader({ title: () => <VoteSubPageList /> });

  const [sortTypeFilter, setSortTypeFilter] = useState('recent');
  const [searchTypeFilter, setSearchTypeFilter] = useState('all');

  return (
    <>
      <FlexibleLayout.Root className="relative flex flex-col gap-3 bg-gray-50 p-5">
        <PostFilter onSortChange={(value) => setSortTypeFilter(value)} onSearchTypeChange={(value) => setSearchTypeFilter(value)} />
        <Suspense
          fallback={
            <div id="bonList" className="grid grid-cols-2 gap-4">
              <div className="aspect-square w-full animate-pulse rounded-sm bg-gray-200" />
              <div className="aspect-square w-full animate-pulse rounded-sm bg-gray-200" />
              <div className="aspect-square w-full animate-pulse rounded-sm bg-gray-200" />
              <div className="aspect-square w-full animate-pulse rounded-sm bg-gray-200" />
            </div>
          }>
          <BoNPostList sortTypeFilter={sortTypeFilter} searchTypeFilter={searchTypeFilter} />
        </Suspense>
      </FlexibleLayout.Root>

      <CreateBoNPostButton />
    </>
  );
}

function CreateBoNPostButton() {
  const { showModal } = useModalActions();

  const handleClick = () => {
    showModal({
      type: 'fullScreenDialog',
      animateType: 'slideUp',
      Component: UploadBoNModal,
    });
  };

  return (
    <div className="absolute bottom-20 right-5">
      <button type="button" className="block rounded-full bg-gray-900 p-4 shadow-bento" onClick={handleClick}>
        <MdEdit className="size-6 text-white" />
      </button>
    </div>
  );
}

const sortKeyValue: Record<string, string> = {
  recent: '최신순',
  popular: '인기순',
};

const searchTypeKeyValue: Record<string, string> = {
  all: '전체',
  voted: '참여한 투표',
  not_voted: '참여하지 않은 투표',
  my_bon: '내가 올린 투표',
};

interface TPostFilter {
  onSortChange: (value: string) => void;
  onSearchTypeChange: (value: string) => void;
}

type PostFilterProps = TPostFilter;

function PostFilter({ onSearchTypeChange, onSortChange }: PostFilterProps) {
  return (
    <div className="flex flex-row gap-4">
      <SelectBox items={sortKeyValue} defaultValue="recent" onValueChange={onSortChange} />
      <SelectBox items={searchTypeKeyValue} defaultValue="all" onValueChange={onSearchTypeChange} />
    </div>
  );
}

interface TBoNPostList {
  sortTypeFilter: string;
  searchTypeFilter: string;
}

type BoNPostListProps = TBoNPostList;

function BoNPostList({ searchTypeFilter, sortTypeFilter }: BoNPostListProps) {
  const { data, fetchNextPage, isFetching } = useSuspenseInfiniteQuery({
    queryKey: ['bon', { sort: sortTypeFilter, searchType: searchTypeFilter }],
    queryFn: ({ pageParam }) => requestGetBoNList({ nextCursor: pageParam, limit: 10, sortType: sortTypeFilter, searchType: searchTypeFilter }),
    initialPageParam: -1,
    getNextPageParam({ data: { nextCursor } }) {
      return nextCursor !== null ? nextCursor : undefined;
    },
  });

  useInfiniteObserver({
    parentNodeId: 'bonList',
    onIntersection: fetchNextPage,
  });

  return (
    <div className="space-y-4">
      <div id="bonList" className="grid grid-cols-2 gap-4">
        {data.pages.map((page) => page.data.bonList.map((bonItem) => <BoNPostItem key={bonItem.id} {...bonItem} />))}
      </div>
      {isFetching && <SpinLoading />}
      {/* <p className="text-sm text-gray-600">모든 Buy or Not 투표를 불러왔습니다.</p> */}
    </div>
  );
}

type BoNPostItemProps = TBoNItem;

function BoNPostItem({ id, commentCount, hasVoted, imageURL, isHot, title, voteCount }: BoNPostItemProps) {
  const { showModal } = useModalActions();

  const handleClick = () => {
    showModal({
      type: 'fullScreenDialog',
      animateType: 'slideInFromRight',
      props: { bonId: id },
      Component: BoNDetailModal,
    });
  };

  return (
    <div
      role="button"
      className={cn('flex cursor-pointer flex-col gap-2 rounded-lg border border-gray-200 bg-white py-5', { ['border-red-400']: isHot, ['opacity-55']: hasVoted })}
      onClick={handleClick}>
      <p className={cn('text-center font-semibold')}>
        {isHot && '🔥 '}
        {title}
      </p>
      <div className="aspect-[4/3]">
        <Image src={imageURL} size="cover" />
      </div>
      <span className="ml-2 text-gray-400">
        투표 {voteCount}회 ・ 댓글 {commentCount}개
      </span>
    </div>
  );
}
