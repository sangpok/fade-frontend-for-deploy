import { OUTFIT_STYLE_LIST } from '@/constants';
import { ItemBadge } from '@Components/ItemBadge';
import { ReportButton } from '@Components/ReportButton';
import { SubscribeButton } from '@Components/SubscribeButton';
import { Avatar } from '@Components/ui/avatar';
import { Image } from '@Components/ui/image';
import { useConfirm, useModalActions } from '@Hooks/modal';
import { useToastActions } from '@Hooks/toast';
import { queryClient } from '@Libs/queryclient';
import { requestDeleteMyFeed } from '@Services/feed';
import { useMutation } from '@tanstack/react-query';
import { isTMyFeed, isTVoteHistoryFeed, TFAPArchivingFeed, TFeed, TFeedAdittionalDetail, TOutfitItem } from '@Types/model';
import { cn } from '@Utils/index';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { MdBookmark, MdHowToVote, MdMoreHoriz, MdReport } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { BookmarkButton } from './BookmarkButton';
import { EditFeedDialog } from './EditFeedDialog';
import { EditMyFeedBottomSheet } from './EditMyFeedBottomSheet';
import { FeedDetailDialgoViewType } from './FeedDetailDialog';
import { OutfitCard } from './OutfitCard';
import { OutfitDialog } from './OutfitDialog';
import { Button } from './ui/button';

interface TFeedDetailCard {
  feedIndex?: number;
  viewType?: FeedDetailDialgoViewType;
  isStartAnimtionEnd?: boolean;
  onUsernameClicked?: () => void;
  onFeedEdited?: () => void;
  onFeedDeleted?: () => void;
  onFeedReported?: () => void;
}

type FeedDetailCardProps = TFeedDetailCard & TFeed;

export function FeedDetailCard({ feedIndex, viewType = 'default', onUsernameClicked, onFeedEdited, onFeedDeleted, onFeedReported, ...feedDetail }: FeedDetailCardProps) {
  const isDefaultType = viewType === 'default';
  const isFAPType = viewType === 'fapArchiving' && TFAPArchivingFeed(feedDetail);
  const isVoteType = viewType === 'voteHistory' && isTVoteHistoryFeed(feedDetail);

  const isMineType = isTMyFeed(feedDetail);

  const { id: feedId, imageURL, isFAPFeed, isMine, outfits, styleIds } = feedDetail;

  const haveStyleIds = styleIds.length !== 0;
  const haveOutfits = outfits.length !== 0;
  const haveOutfitsMoreThanOwn = outfits.length > 1;

  const handleFeedEdited = () => {
    onFeedEdited && onFeedEdited();
  };

  const handleFeedDeleted = () => {
    onFeedDeleted && onFeedDeleted();
  };

  return (
    <div data-feed-index={feedIndex} className="flex h-full snap-start">
      <section className="relative flex h-full w-full flex-col gap-3 p-5">
        {isFAPFeed && <Image src={'/assets/fap_badge.png'} className={cn('absolute right-5 top-5 size-8', { ['right-[3.75rem]']: isMine })} local />}
        {isMine && <FeedMoreButton feedDetail={feedDetail} onFeedEdited={handleFeedEdited} onFeedDeleted={handleFeedDeleted} />}
        {isFAPType && <p className="text-h6">{format(feedDetail.fapSelectedAt, 'yyyy년 M월 dd일 eeee', { locale: ko })}</p>}
        {isVoteType && <p className="text-h6">{format(feedDetail.votedAt, 'yyyy년 M월 dd일 eeee', { locale: ko })}</p>}
        {isDefaultType && <p className="text-h6">{format(feedDetail.createdAt, 'yyyy년 M월 dd일 eeee', { locale: ko })}</p>}

        <Image
          src={imageURL}
          className={cn('relative w-full flex-1 rounded-lg bg-gray-200', {
            ['border-2 border-purple-500']: isFAPFeed,
          })}
          size="contain">
          {!isMine && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cn('absolute right-4 top-4')}>
              <ReportButton feedId={feedId} onReportEnd={onFeedReported} />
            </motion.div>
          )}
        </Image>

        {isMineType && <FeedAdiitionalDetails {...feedDetail} />}
        {!isMineType && <MemberDetailCard {...feedDetail} onUsernameClicked={() => onUsernameClicked && onUsernameClicked()} />}
        {haveStyleIds && <StyleCard {...feedDetail} />}
        {haveOutfits && <OutfitCard {...outfits.sort((a, b) => a.categoryId - b.categoryId).at(0)!} />}
        {haveOutfitsMoreThanOwn && <ShowAllOutfitsButton outfits={outfits} />}
      </section>
    </div>
  );
}

interface TFeedMoreButton {
  feedDetail: TFeed;
  onFeedEdited: () => void;
  onFeedDeleted: () => void;
}

type FeedMoreButtonProps = TFeedMoreButton;

function FeedMoreButton({ feedDetail, onFeedEdited, onFeedDeleted }: FeedMoreButtonProps) {
  const { showModal } = useModalActions();
  const confirm = useConfirm();
  const { showToast } = useToastActions();

  const { mutate: deleteMyFeed } = useMutation({
    mutationKey: ['deleteMyFeed'],
    mutationFn: requestDeleteMyFeed,
  });

  const handleClick = async () => {
    const result = await showModal<{ menuId: number }>({
      type: 'bottomSheet',
      Component: EditMyFeedBottomSheet,
    });

    if (result === undefined) {
      return;
    }

    const doesEditClick = result.menuId === 0;
    const doesDeleteClick = result.menuId === 1;

    doesEditClick && startEditFeedFlow();
    doesDeleteClick && startDeleteFeedFlow();
  };

  const startEditFeedFlow = async () => {
    const result = await showModal<boolean>({
      type: 'fullScreenDialog',
      animateType: 'slideInFromRight',
      Component: EditFeedDialog,
      props: { defaultFeedDetails: feedDetail },
    });

    if (result) {
      onFeedEdited();
      queryClient.invalidateQueries({ queryKey: ['user', feedDetail.memberId, 'feed'], refetchType: 'all' });
    }
  };

  const startDeleteFeedFlow = async () => {
    const result = await confirm(
      feedDetail.isFAPFeed
        ? {
            title: 'FA:P 선정 사진 삭제',
            description: 'FA:P 선정 사진 3회 삭제 시 이용이 제한됩니다.\n정말 삭제하시겠습니까?\n\nFA:P 선정 사진 삭제 횟수 0/3',
          }
        : {
            title: '사진 삭제',
            description: '사진 삭제 시 복구가 불가능합니다.\n정말 삭제하시겠습니까?',
          }
    );

    if (!result) {
      return;
    }

    deleteMyFeed(
      { feedId: feedDetail.id },
      {
        onSuccess() {
          onFeedDeleted();
          queryClient.invalidateQueries({ queryKey: ['user', feedDetail.memberId, 'feed'], refetchType: 'all' });
          queryClient.invalidateQueries({ queryKey: ['archiving'], refetchType: 'all' });

          showToast({ type: 'success', title: '사진을 삭제했습니다.' });
        },
        onError() {
          showToast({ type: 'error', title: '사진 삭제에 실패했어요.' });
        },
      }
    );
  };

  return (
    <Button variants="ghost" size="icon" className="absolute right-5 top-5" onClick={handleClick}>
      <MdMoreHoriz className="size-5" />
    </Button>
  );
}

function UsernameButton({ userId, username, onClicked, isMine }: { userId: number; username: string; onClicked: () => void; isMine: boolean }) {
  const navigate = useNavigate();

  return (
    <div className="flex-1 text-left">
      <Button
        variants="ghost"
        interactive="onlyScale"
        className="px-0 py-1 font-normal"
        onClick={() => {
          onClicked();
          !isMine && navigate('/user', { state: { userId } });
        }}>
        {username}
      </Button>
    </div>
  );
}

function StyleCard({ styleIds }: TFeed) {
  return (
    <div>
      <ul className="flex flex-row gap-2 overflow-y-scroll whitespace-nowrap">
        {styleIds
          .sort((a, b) => a - b)
          .map((value, index) => (
            <ItemBadge key={`style-badge-${index}`} variants="primary">
              {OUTFIT_STYLE_LIST.at(value)}
            </ItemBadge>
          ))}
      </ul>
    </div>
  );
}

interface TMemberDetailCard {
  onUsernameClicked: () => void;
}

type MemberDetailCardProps = TMemberDetailCard & TFeed;

function MemberDetailCard({ profileImageURL, memberId, isSubscribed, isBookmarked, id, username, isMine, onUsernameClicked }: MemberDetailCardProps) {
  return (
    <div className="flex flex-row items-center justify-center gap-3 rounded-lg bg-white">
      <Avatar src={profileImageURL} size="32" />
      <UsernameButton userId={memberId} username={username} onClicked={onUsernameClicked} isMine={isMine} />
      <SubscribeButton userId={memberId} initialSubscribedStatus={isSubscribed} onToggle={() => {}} />
      <BookmarkButton feedId={id} defaultBookmarkStatus={isBookmarked} />
    </div>
  );
}

function FeedAdiitionalDetails({ bookmarkCount, fadeInCount, reportCount }: TFeedAdittionalDetail) {
  return (
    <ul className="flew-row flex gap-2">
      <FeedAdiitionalDetailItem IconRender={<MdHowToVote className="mx-auto size-5" />} detailName="FADE IN" count={fadeInCount} />
      <FeedAdiitionalDetailItem IconRender={<MdBookmark className="mx-auto size-5 text-purple-500" />} detailName="북마크" count={bookmarkCount} />
      <FeedAdiitionalDetailItem IconRender={<MdReport className="mx-auto size-5 text-pink-400" />} detailName="신고" count={reportCount} />
    </ul>
  );
}

function FeedAdiitionalDetailItem({ IconRender, detailName, count }: { IconRender: ReactNode; detailName: string; count: number }) {
  return (
    <li className="gap borer-gray-200 flex flex-1 flex-col items-center justify-center gap-1 rounded-lg border py-3">
      <div className="space-y-0.5">
        {IconRender}
        <p>{detailName}</p>
      </div>

      <span className="font-semibold">{count}</span>
    </li>
  );
}

interface TShowAllOutfitsButton {
  outfits: TOutfitItem[];
}

type ShowAllOutfitsButtonProps = TShowAllOutfitsButton;

function ShowAllOutfitsButton({ outfits }: ShowAllOutfitsButtonProps) {
  const { showModal } = useModalActions();

  const handleClick = () => {
    showModal({ type: 'fullScreenDialog', Component: OutfitDialog, animateType: 'slideInFromRight', props: { outfits } });
  };

  return (
    <Button variants="ghost" onClick={handleClick}>
      착장 정보 전체보기
    </Button>
  );
}
