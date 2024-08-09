import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { DefaultModalProps } from '@Stores/modal';
import { TFeed } from '@Types/model';
import { FeedDetailCard } from './FeedDetailCard';
import { BackButton } from './ui/button';

export type FeedDetailDialgoViewType = 'default' | 'fapArchiving' | 'voteHistory';

interface TFeedDetailDialog {
  feeds: TFeed[];
  defaultViewIndex: number;
  viewType?: FeedDetailDialgoViewType;
}

type FeedDialogDialogProps = DefaultModalProps<void, TFeedDetailDialog>;

export function FeedDetailDialog({ feeds, defaultViewIndex = 0, viewType = 'default', isStartAnimtionEnd, onClose }: FeedDialogDialogProps) {
  return (
    <FlexibleLayout.Root>
      <FlexibleLayout.Header>
        <header className="relative py-2">
          <BackButton onClick={onClose} />
          <p className="text-center text-2xl font-semibold">사진 상세</p>
        </header>
      </FlexibleLayout.Header>

      <FlexibleLayout.Content>
        <Feeds
          feeds={feeds}
          viewType={viewType}
          defaultViewIndex={defaultViewIndex}
          onUsernameClicked={onClose}
          isStartAnimtionEnd={isStartAnimtionEnd}
          onFeedEdited={onClose}
          onFeedDeleted={onClose}
        />
      </FlexibleLayout.Content>
    </FlexibleLayout.Root>
  );
}

interface TFeeds {
  feeds: TFeed[];
  defaultViewIndex: number;
  viewType: FeedDetailDialgoViewType;
  isStartAnimtionEnd: boolean;
  onUsernameClicked: () => void;
  onFeedEdited: () => void;
  onFeedDeleted: () => void;
}

type FeedsProps = TFeeds;

function Feeds({ feeds, defaultViewIndex, viewType, isStartAnimtionEnd, onUsernameClicked, onFeedEdited, onFeedDeleted }: FeedsProps) {
  const beforeFeeds = feeds
    .slice(0, defaultViewIndex)
    .map((feedDetail) => (
      <FeedDetailCard
        key={feedDetail.id}
        {...feedDetail}
        viewType={viewType}
        isStartAnimtionEnd={isStartAnimtionEnd}
        onUsernameClicked={onUsernameClicked}
        onFeedEdited={onFeedEdited}
        onFeedDeleted={onFeedDeleted}
      />
    ));

  const afterFeeds = feeds
    .slice(defaultViewIndex + 1)
    .map((feedDetail) => (
      <FeedDetailCard
        key={feedDetail.id}
        {...feedDetail}
        viewType={viewType}
        isStartAnimtionEnd={isStartAnimtionEnd}
        onUsernameClicked={onUsernameClicked}
        onFeedEdited={onFeedEdited}
        onFeedDeleted={onFeedDeleted}
      />
    ));

  const targetFeed = feeds[defaultViewIndex];

  return (
    <div id="feedList" className="h-full snap-y snap-mandatory overflow-y-scroll">
      {isStartAnimtionEnd && beforeFeeds}
      <FeedDetailCard
        key={targetFeed.id}
        {...targetFeed}
        viewType={viewType}
        isStartAnimtionEnd={isStartAnimtionEnd}
        onUsernameClicked={onUsernameClicked}
        onFeedEdited={onFeedEdited}
        onFeedDeleted={onFeedDeleted}
      />
      {isStartAnimtionEnd && afterFeeds}
    </div>
  );
}
