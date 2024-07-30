import { OUTFIT_STYLE_LIST } from '@/constants';
import fapBadgeImage from '@Assets/fap_badge.png';
import { ItemBadge } from '@Components/ItemBadge';
import { ReportButton } from '@Components/ReportButton';
import { SubscribeButton } from '@Components/SubscribeButton';
import { Avatar } from '@Components/ui/avatar';
import { Image } from '@Components/ui/image';
import { isTMyFeed, isTVoteHistoryFeed, TFeed, TFeedAdittionalDetail } from '@Types/model';
import { cn } from '@Utils/index';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { ReactNode, useEffect, useRef } from 'react';
import { MdBookmark, MdHowToVote, MdReport } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { BookmarkButton } from './BookmarkButton';
import { OutfitCard } from './OutfitCard';
import { Button } from './ui/button';

interface TFeedDetailCard {
  focus?: boolean;
  isStartAnimtionEnd?: boolean;
  onUsernameClicked?: () => void;
}

type FeedDetailCardProps = TFeedDetailCard & TFeed;

export function FeedDetailCard({ focus, isStartAnimtionEnd, onUsernameClicked, ...feedDetail }: FeedDetailCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVoteType = isTVoteHistoryFeed(feedDetail);
  const isMineType = isTMyFeed(feedDetail);

  const { id: feedId, imageURL, isFAPFeed, isMine, outfits, styleIds } = feedDetail;

  const haveStyleIds = styleIds.length !== 0;

  const haveOutfits = outfits.length !== 0;
  const haveOutfitsMoreThanOwn = outfits.length > 1;

  useEffect(() => {
    if (containerRef.current == null) {
      return;
    }

    if (isStartAnimtionEnd && focus) {
      containerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [focus, containerRef.current, isStartAnimtionEnd]);

  return (
    <div ref={containerRef} className="flex h-full snap-start">
      <section className="relative flex h-full w-full flex-col gap-3 p-5">
        {isFAPFeed && <Image src={fapBadgeImage} className="absolute right-5 top-3 size-10" />}
        {isVoteType && <p className="text-h6">{format(feedDetail.votedAt, 'yyyy년 M월 dd일 eeee', { locale: ko })}</p>}
        {!isVoteType && <p className="text-h6">{format(feedDetail.createdAt, 'yyyy년 M월 dd일 eeee', { locale: ko })}</p>}

        <Image
          src={imageURL}
          className={cn('relative w-full flex-1 rounded-lg bg-gray-200', {
            ['border-2 border-purple-500']: isFAPFeed,
          })}
          size="contain">
          {!isMine && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cn('absolute right-4 top-4')}>
              <ReportButton feedId={feedId} />
            </motion.div>
          )}
        </Image>

        {isMineType && <FeedAdiitionalDetails {...feedDetail} />}
        {!isMineType && <MemberDetailCard {...feedDetail} onUsernameClicked={() => onUsernameClicked && onUsernameClicked()} />}
        {haveStyleIds && <StyleCard {...feedDetail} />}
        {haveOutfits && <OutfitCard {...outfits.at(0)!} wouldShowDetail={false} />}
        {haveOutfitsMoreThanOwn && <ShowAllOutfitsButton />}
      </section>
    </div>
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
        {styleIds.map((value, index) => (
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

function ShowAllOutfitsButton() {
  return <Button variants="ghost">착장 정보 전체보기</Button>;
}
