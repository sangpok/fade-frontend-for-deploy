import { SpinLoading } from '@Components/SpinLoading';
import { BackButton, Button } from '@Components/ui/button';
import { Image } from '@Components/ui/image';
import { useConfirm } from '@Hooks/modal';
import { useToastActions } from '@Hooks/toast';
import { useInfiniteObserver } from '@Hooks/useInfiniteObserver';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { queryClient } from '@Libs/queryclient';
import {
  requestAddBoNComment,
  requestDeleteBoN,
  requestDeleteBoNComment,
  requestGetBoNComment,
  requestGetBoNDetail,
  requestLikeBoNComment,
  requestVoteBoN,
} from '@Services/bon';
import { DefaultModalProps } from '@Stores/modal';
import { InfiniteData, useMutation, useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
import { BoNVotedValue, TBoNComment, TBoNDetail } from '@Types/model';
import { cn } from '@Utils/index';
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { motion } from 'framer-motion';
import { produce, WritableDraft } from 'immer';
import { ComponentProps, FormEvent, Suspense, useState } from 'react';
import { MdCheck, MdDelete } from 'react-icons/md';
import { VscHeart, VscHeartFilled, VscLoading } from 'react-icons/vsc';

interface TBoNDetailModal {
  bonId: number;
}

type BoNDetailModalProps = DefaultModalProps<void, TBoNDetailModal>;

export function BoNDetailModal({ bonId, onClose }: BoNDetailModalProps) {
  return (
    <FlexibleLayout.Root>
      <FlexibleLayout.Header>
        <header className="relative flex items-center justify-center border-b border-b-gray-200 py-2">
          <BackButton onClick={() => onClose()} />
          <span className="mx-auto text-h5 font-semibold">투표 상세</span>
        </header>
      </FlexibleLayout.Header>

      <Suspense fallback={<>로딩중 ...</>}>
        <FlexibleLayout.Content className="space-y-2 bg-gray-100">
          <BoNContent bonId={bonId} onDelete={onClose} />
          <BestCommentList bonId={bonId} />
          <AllCommentList bonId={bonId} />
        </FlexibleLayout.Content>

        <FlexibleLayout.Footer>
          <CommentBox bonId={bonId} />
        </FlexibleLayout.Footer>
      </Suspense>
    </FlexibleLayout.Root>
  );
}

interface TCommentBox {
  bonId: number;
}

type CommentBoxProps = TCommentBox;

function CommentBox({ bonId }: CommentBoxProps) {
  const {
    data: {
      data: { hasCommented, isMine, myVotedValue },
    },
  } = useSuspenseQuery({
    queryKey: ['bon', 'detail', bonId],
    queryFn: () => requestGetBoNDetail({ bonId }),
  });

  const { mutate: addBoNComment } = useMutation({
    mutationKey: ['addBoNComment'],
    mutationFn: requestAddBoNComment,
    onMutate() {
      const newBoNComment: TBoNComment = {
        anonName: '-',
        contents,
        createdAt: new Date(),
        hasLiked: false,
        id: Math.floor(Math.random() * 1000000),
        isBestComment: false,
        isMine: true,
        likeCount: 0,
        votedValue: myVotedValue,
      };

      /** 댓글 Optimistic Update */
      queryClient.setQueryData<InfiniteData<AxiosResponse<{ comments: TBoNComment[] }>>>(['bon', 'detail', bonId, 'comment', 'default'], (oldComments) =>
        produce(oldComments, (draft) => {
          if (draft) {
            draft.pages.unshift({
              data: { comments: [newBoNComment] },
              status: 200,
              statusText: 'OK',
              headers: {},
              config: {} as WritableDraft<InternalAxiosRequestConfig<unknown>>,
            });
          }
        })
      );

      /** 본문 댓글 수 Optimistic Update */
      queryClient.setQueryData<AxiosResponse<TBoNDetail>>(['bon', 'detail', bonId], (oldDetail) =>
        produce(oldDetail, (draft) => {
          if (draft?.data) {
            draft.data.commentCount += 1;
            draft.data.hasCommented = true;
          }
        })
      );

      setContents('');
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['bon', 'detail', bonId, 'comment'], refetchType: 'all' });
    },
  });

  const [contents, setContents] = useState('');

  const hasVoted = myVotedValue !== 'NOT';

  const handeSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    addBoNComment({ bonId, contents });
  };

  if (isMine) {
    return <></>;
  }

  return (
    <form onSubmit={handeSubmit} className="flex flex-row gap-3 p-2">
      <CommentInput
        className="w-full flex-1"
        placeholder={hasCommented ? '댓글은 하나만 남길 수 있어요.' : hasVoted ? '댓글을 입력해주세요.' : '투표하면 댓글을 남길 수 있어요.'}
        value={contents}
        onInput={({ target }) => setContents((target as HTMLInputElement).value)}
        disabled={!hasVoted || hasCommented}
      />
      <CommentSubmitButton disabled={!hasVoted || hasCommented || contents.length === 0} />
    </form>
  );
}

type CommentInputProps = ComponentProps<'input'>;
function CommentInput({ className, ...props }: CommentInputProps) {
  return (
    <input
      className={cn(
        'appearance-none rounded-lg border border-gray-200 px-4 py-2 text-gray-900 focus-within:border-purple-400 disabled:border-grey-200 disabled:bg-grey-300',
        className
      )}
      {...props}
    />
  );
}

type CommentSubmitProps = ComponentProps<'button'>;
function CommentSubmitButton({ className, disabled, ...props }: CommentSubmitProps) {
  return (
    <button
      type="submit"
      className={cn('min-w-fit rounded-lg bg-gray-900 px-4 py-2 font-medium text-white transition-colors disabled:bg-grey-300 disabled:text-gray-500', className)}
      disabled={disabled}
      {...props}>
      게시
    </button>
  );
}

interface TBoNContent {
  bonId: number;
  onDelete: () => void;
}

type BoNContentProps = TBoNContent;

function BoNContent({ bonId, onDelete }: BoNContentProps) {
  const {
    data: {
      data: {
        bonCount: { yes: yesCount, no: noCount },
        commentCount,
        contents,
        hasCommented,
        isMine,
        imageURL,
        myVotedValue,
        title,
        voteCount,
      },
    },
  } = useSuspenseQuery({
    queryKey: ['bon', 'detail', bonId],
    queryFn: () => requestGetBoNDetail({ bonId }),
  });

  return (
    <div className="space-y-3 bg-white p-5">
      <div className="space-y-2">
        <div className="flex flex-row justify-between">
          <p className="text-xl font-semibold">{title}</p>
          {isMine && <BoNDeleteButton bonId={bonId} onDelete={onDelete} />}
        </div>
        <p className="whitespace-pre-line">{contents}</p>
      </div>

      <div className="aspect-square overflow-hidden rounded-md">
        <Image src={imageURL} className="" />
      </div>

      <VoteButtonGroup bonId={bonId} initialVotedValue={myVotedValue} noCount={noCount} yesCount={yesCount} isMine={isMine} hasCommented={hasCommented} />

      <div className="pt-4">
        <span className="text-sm text-gray-400">
          투표 {voteCount}회 ・ 댓글 {commentCount}개
        </span>
      </div>
    </div>
  );
}

interface TBoNDeleteButton {
  bonId: number;
  onDelete: () => void;
}

type BoNDeleteButtonProps = TBoNDeleteButton;

function BoNDeleteButton({ bonId, onDelete }: BoNDeleteButtonProps) {
  const confirm = useConfirm();
  const { showToast } = useToastActions();

  const { mutate: deleteBoN, isPending } = useMutation({
    mutationKey: ['deleteBoN'],
    mutationFn: requestDeleteBoN,
  });

  const handleClick = async () => {
    const wouldDelete = await confirm({ title: '투표 삭제', description: '투표 삭제 시 복구가 불가능합니다.\n정말 삭제하시겠습니까?' });

    if (wouldDelete) {
      deleteBoN(
        { bonId },
        {
          onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['bon'], refetchType: 'all' });
            showToast({ type: 'basic', title: '투표가 삭제되었습니다.' });
            onDelete();
          },
        }
      );
    }
  };

  return (
    <Button variants="ghost" className="-translate-y-2 text-grey-500" onClick={handleClick} disabled={isPending}>
      {isPending && <VscLoading className="size-4 animate-spin" />}
      {!isPending && <MdDelete />}
    </Button>
  );
}

interface TVoteButtonGroup {
  bonId: number;
  initialVotedValue: BoNVotedValue;
  yesCount: number;
  noCount: number;
  isMine: boolean;
  hasCommented: boolean;
}

type TVoteButtonGroupProps = TVoteButtonGroup;

function VoteButtonGroup({ bonId, initialVotedValue, noCount, yesCount, isMine, hasCommented }: TVoteButtonGroupProps) {
  const [currentVotedValue, setCurrentVotedValue] = useState<BoNVotedValue>(initialVotedValue);

  const confirm = useConfirm();

  const hasVoted = currentVotedValue !== 'NOT';

  const { mutate: voteBoN } = useMutation({
    mutationKey: ['voteBoN'],
    mutationFn: requestVoteBoN,
    onMutate({ votedValue }) {
      const bonDetailResponse = queryClient.getQueryData<AxiosResponse<TBoNDetail>>(['bon', 'detail', bonId])!;

      const newBonDetailResponse: AxiosResponse<TBoNDetail> = {
        ...bonDetailResponse,
        data: {
          ...bonDetailResponse.data,
          myVotedValue: votedValue,
          voteCount: (() => {
            // 투표 처음 할 때
            if (!hasVoted) {
              return bonDetailResponse.data.voteCount + 1;
            }

            // 투표 취소
            if (votedValue === 'NOT') {
              return bonDetailResponse.data.voteCount - 1;
            }

            // 이전과 다른 투표
            return bonDetailResponse.data.voteCount;
          })(),
          bonCount: (() => {
            // 투표 처음 할 때
            if (!hasVoted) {
              return {
                yes: votedValue === 'YES' ? bonDetailResponse.data.bonCount.yes + 1 : bonDetailResponse.data.bonCount.yes,
                no: votedValue === 'NO' ? bonDetailResponse.data.bonCount.no + 1 : bonDetailResponse.data.bonCount.no,
              };
            }

            // 투표 취소
            if (votedValue === 'NOT') {
              return {
                yes: currentVotedValue === 'YES' ? bonDetailResponse.data.bonCount.yes - 1 : bonDetailResponse.data.bonCount.yes,
                no: currentVotedValue === 'NO' ? bonDetailResponse.data.bonCount.no - 1 : bonDetailResponse.data.bonCount.no,
              };
            }

            // 다른 거 투표 (YES -> NO)
            if (votedValue === 'NO') {
              return {
                yes: bonDetailResponse.data.bonCount.yes - 1,
                no: bonDetailResponse.data.bonCount.no + 1,
              };
            }

            // 다른 거 투표 (NO -> YES)
            return {
              yes: bonDetailResponse.data.bonCount.yes + 1,
              no: bonDetailResponse.data.bonCount.no - 1,
            };
          })(),
        },
      };

      queryClient.setQueryData(['bon', 'detail', bonId], newBonDetailResponse);
      setCurrentVotedValue(votedValue);

      return bonDetailResponse;
    },
  });

  const handleClick = (value: BoNVotedValue) => {
    if (isMine) {
      return;
    }

    if (hasCommented) {
      return confirm({ title: '댓글을 단 이후에는 투표를 수정할 수 없어요', description: '다른 투표를 하고 싶다면 댓글을 삭제해주세요.' });
    }

    if (hasVoted) {
      voteBoN({ bonId, votedValue: currentVotedValue === value ? 'NOT' : value });
    } else {
      voteBoN({ bonId, votedValue: value });
    }
  };

  return (
    <div className="flex flex-row gap-4">
      <BoNVoteButton
        bonId={bonId}
        variants={hasVoted ? 'afterVote' : 'beforeVote'}
        value="NO"
        checked={currentVotedValue === 'NO'}
        bonCount={[noCount, yesCount]}
        isMine={isMine}
        onClick={() => handleClick('NO')}
      />

      <BoNVoteButton
        bonId={bonId}
        variants={hasVoted ? 'afterVote' : 'beforeVote'}
        value="YES"
        checked={currentVotedValue === 'YES'}
        bonCount={[noCount, yesCount]}
        isMine={isMine}
        onClick={() => handleClick('YES')}
      />
    </div>
  );
}

interface TBoNVoteButton {
  bonId: number;
  variants: 'beforeVote' | 'afterVote';
  value: BoNVotedValue;
  bonCount?: [number, number];
  checked?: boolean;
  isMine?: boolean;
  onClick: () => void;
}

type BoNVoteButtonProps = TBoNVoteButton;

/**
 * 투표를 하지 않았으면
 *    votedCount 증가
 *    선택한 bonCount 증가
 *
 * 투표를 했으면
 *    같은 Value를 클릭했으면
 *      votedCount 감소
 *      선택한 bonCount 감소
 *    다른 Value를 클릭했으면
 *      votedCount 유지
 *      선택한 bonCount 유지
 *      다른 bonCount 증가
 */

function BoNVoteButton({ onClick, value, variants, bonCount: [noCount, yesCount] = [0, 0], checked, isMine = false }: BoNVoteButtonProps) {
  const voteCount = noCount + yesCount;

  const isBeforeVote = variants === 'beforeVote';
  const isAfterVote = variants === 'afterVote';

  const isNo = value === 'NO';
  const isYes = value === 'YES';

  const noRatio = Math.floor((noCount / (voteCount || 1)) * 100);
  const yesRatio = Math.floor((yesCount / (voteCount || 1)) * 100);

  const isLowerThenOther = (() => {
    if (isNo) {
      return noCount < yesCount;
    }

    if (isYes) {
      return noCount > yesCount;
    }
  })();

  const shouldShowRatio = isAfterVote || isMine;

  return (
    <button
      className={cn('relative h-11 flex-1 overflow-hidden rounded-full border border-gray-500 px-5 py-2 text-gray-900', {
        ['border-gray-500 text-gray-900']: isBeforeVote,
        ['border-blue-400 text-blue-400']: shouldShowRatio && value === 'NO',
        ['border-purple-400 text-purple-400']: shouldShowRatio && value === 'YES',
        ['border-gray-400 text-gray-400']: !isMine && isAfterVote && isLowerThenOther, // 우선순위
      })}
      onClick={onClick}>
      {shouldShowRatio && (
        <motion.div
          className={cn('absolute inset-0', {
            ['bg-blue-50']: value === 'NO',
            ['bg-purple-50']: value === 'YES',
            ['bg-gray-100']: !isMine && isLowerThenOther,
          })}
          initial={{ width: 0 }}
          animate={{ width: `${isNo ? noRatio : yesRatio}%` }}
        />
      )}

      <div
        className={cn('flew-row absolute flex items-center', {
          ['left-4 top-1/2 -translate-y-1/2']: shouldShowRatio,
          ['left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2']: !shouldShowRatio,
        })}>
        {checked && <MdCheck className="mr-2" />}
        <span className="capitalize">{value}</span>
      </div>

      {shouldShowRatio && <span className="absolute right-4 top-1/2 -translate-y-1/2">{isNo ? noRatio : yesRatio}%</span>}
    </button>
  );
}

function BestCommentList({ bonId }: { bonId: number }) {
  const { data, isSuccess } = useSuspenseInfiniteQuery({
    queryKey: ['bon', 'detail', bonId, 'comment', 'best'],
    queryFn: ({ pageParam }) => requestGetBoNComment({ bonId, nextCursor: pageParam, limit: 3, searchType: 'best' }),
    initialPageParam: -1,
    getNextPageParam({ data: { nextCursor } }) {
      return nextCursor !== null ? nextCursor : undefined;
    },
  });

  const hasNoBestComment = isSuccess && data.pages[0].data.comments.length === 0;

  if (hasNoBestComment) {
    return <></>;
  }

  return (
    <div className="bg-white py-5">
      <p className="pl-5 text-lg font-semibold">Best 댓글</p>

      <ul id="bestCommentList" className="divide-y divide-gray-200">
        {data.pages.map((page) => page.data.comments.map((comment) => <CommentItem key={comment.id} bonId={bonId} {...comment} />))}
      </ul>
    </div>
  );
}

function AllCommentList({ bonId }: { bonId: number }) {
  const { data, fetchNextPage, isFetching, isSuccess } = useSuspenseInfiniteQuery({
    queryKey: ['bon', 'detail', bonId, 'comment', 'default'],
    queryFn: ({ pageParam }) => requestGetBoNComment({ bonId, nextCursor: pageParam, limit: 10, searchType: 'all' }),
    initialPageParam: -1,
    getNextPageParam({ data: { nextCursor } }) {
      return nextCursor !== null ? nextCursor : undefined;
    },
  });

  useInfiniteObserver({
    parentNodeId: 'defaultCommentList',
    onIntersection: fetchNextPage,
  });

  const hasNoComments = isSuccess && data.pages[0].data.comments.length === 0;

  return (
    <div
      className={cn('bg-white py-5', {
        ['aspect-[2/1] w-full']: hasNoComments,
      })}>
      <p className="pl-5 text-lg font-semibold">전체 댓글</p>

      <ul id="defaultCommentList" className="divide-y divide-gray-200">
        {data.pages.map((page) => page.data.comments.map((comment) => <CommentItem key={comment.id} bonId={bonId} {...comment} />))}
      </ul>

      {hasNoComments && (
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-grey-500">아직 댓글이 없어요.</p>
        </div>
      )}

      {isFetching && <SpinLoading />}
    </div>
  );
}

interface TCommentItem {
  bonId: number;
}

type CommentItemProps = TBoNComment & TCommentItem;
type CommentResponseType = InfiniteData<AxiosResponse<{ comments: TBoNComment[] }>>;

function CommentItem({ bonId, anonName, contents, hasLiked, id, isBestComment, likeCount, votedValue, isMine }: CommentItemProps) {
  return (
    <div className="p-5">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <BoNBadge value={votedValue === 'yes' ? 'yes' : 'no'} />
          <span className="font-semibold">익명의 {anonName}</span>
          <div className="flex flex-row items-center gap-1 text-gray-400">
            <VscHeart />
            {likeCount}
          </div>
        </div>

        {!isMine && <CommentLikeButton bonId={bonId} commentId={id} hasLiked={hasLiked} />}
        {isMine && <CommentDeleteButton bonId={bonId} commentId={id} onDelete={() => {}} />}
      </div>

      <div className="flex flex-row gap-1">
        {isBestComment && <div>👑</div>}
        <p>{contents}</p>
      </div>
    </div>
  );
}
interface TCommentLikeButton {
  bonId: number;
  commentId: number;
  hasLiked: boolean;
}

type CommentLikeButtonProps = TCommentLikeButton;

function CommentLikeButton({ bonId, commentId, hasLiked }: CommentLikeButtonProps) {
  const { mutate: likeBoNComment } = useMutation({
    mutationKey: ['likeBoNComment'],
    mutationFn: requestLikeBoNComment,
    async onMutate({ doesLike }) {
      const commentQueryKey = ['bon', 'detail', bonId, 'comment', 'default'];
      const bestCommentQueryKey = ['bon', 'detail', bonId, 'comment', 'best'];

      await queryClient.cancelQueries({ queryKey: commentQueryKey });
      await queryClient.cancelQueries({ queryKey: bestCommentQueryKey });

      queryClient.setQueryData<CommentResponseType>(commentQueryKey, (oldComments) => updateCommentOptimistic(oldComments, doesLike));
      queryClient.setQueryData<CommentResponseType>(bestCommentQueryKey, (oldComments) => updateCommentOptimistic(oldComments, doesLike));
    },
  });

  const updateCommentOptimistic = (oldComments: CommentResponseType | undefined, doesLike: boolean) =>
    produce(oldComments, (draft) => {
      const pageIndex = draft!.pages.findIndex((page) => page.data.comments.some(({ id: targetId }) => targetId === commentId));

      if (pageIndex !== -1) {
        const commentIndex = draft!.pages[pageIndex].data.comments.findIndex(({ id: targetId }) => targetId === commentId);

        if (commentIndex !== -1) {
          draft!.pages[pageIndex].data.comments[commentIndex].hasLiked = doesLike;
          draft!.pages[pageIndex].data.comments[commentIndex].likeCount = doesLike
            ? draft!.pages[pageIndex].data.comments[commentIndex].likeCount + 1
            : draft!.pages[pageIndex].data.comments[commentIndex].likeCount - 1;
        }
      }
    });

  const handleClick = () => {
    likeBoNComment({
      bonId,
      commentId,
      doesLike: !hasLiked,
    });
  };

  return (
    <Button variants="ghost" onClick={handleClick}>
      {hasLiked && <VscHeartFilled className="size-4 fill-gray-900" />}
      {!hasLiked && <VscHeart className="size-4 fill-gray-900" />}
    </Button>
  );
}

interface TCommentDeleteButton {
  bonId: number;
  commentId: number;
  onDelete: () => void;
}

type CommentDeleteButtonProps = TCommentDeleteButton;

function CommentDeleteButton({ bonId, commentId, onDelete }: CommentDeleteButtonProps) {
  const confirm = useConfirm();
  const { showToast } = useToastActions();

  const { mutate: deleteBoNComment, isPending } = useMutation({
    mutationKey: ['deleteBoNComment'],
    mutationFn: requestDeleteBoNComment,
    async onMutate() {
      const commentQueryKey = ['bon', 'detail', bonId, 'comment', 'default'];
      const bestCommentQueryKey = ['bon', 'detail', bonId, 'comment', 'best'];

      await queryClient.cancelQueries({ queryKey: commentQueryKey });
      await queryClient.cancelQueries({ queryKey: bestCommentQueryKey });

      queryClient.setQueryData<CommentResponseType>(commentQueryKey, (oldComments) => updateCommentOptimistic(oldComments));
      queryClient.setQueryData<CommentResponseType>(bestCommentQueryKey, (oldComments) => updateCommentOptimistic(oldComments));
      queryClient.setQueryData<AxiosResponse<TBoNDetail>>(['bon', 'detail', bonId], (oldDetail) =>
        produce(oldDetail, (draft) => {
          draft!.data.commentCount--;
          draft!.data.hasCommented = false;
        })
      );
    },
  });

  const updateCommentOptimistic = (oldComments: CommentResponseType | undefined) =>
    produce(oldComments, (draft) => {
      const pageIndex = draft!.pages.findIndex((page) => page.data.comments.some(({ id: targetId }) => targetId === commentId));

      if (pageIndex !== -1) {
        const commentIndex = draft!.pages[pageIndex].data.comments.findIndex(({ id: targetId }) => targetId === commentId);

        if (commentIndex !== -1) {
          draft!.pages[pageIndex].data.comments.splice(commentIndex, 1);
        }
      }
    });

  const handleClick = async () => {
    const wouldDelete = await confirm({ title: '투표 삭제', description: '투표 삭제 시 복구가 불가능합니다.\n정말 삭제하시겠습니까?' });

    if (wouldDelete) {
      deleteBoNComment(
        { bonId, commentId },
        {
          onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['bon', 'detail', bonId, 'comment'], refetchType: 'all' });
            showToast({ type: 'basic', title: '댓글이 삭제되었습니다.' });
            onDelete();
          },
        }
      );
    }
  };

  return (
    <Button variants="ghost" className="-translate-y-2 text-grey-500" onClick={handleClick} disabled={isPending}>
      {isPending && <VscLoading className="size-4 animate-spin" />}
      {!isPending && <MdDelete />}
    </Button>
  );
}

interface TBoNBadge {
  value: 'yes' | 'no';
}

type BoNBadgeProps = TBoNBadge;

function BoNBadge({ value }: BoNBadgeProps) {
  return (
    <span
      className={cn('w-[3.25rem] rounded-full bg-pink-500 text-center capitalize text-white', {
        ['bg-blue-500']: value === 'yes',
      })}>
      {value}
    </span>
  );
}
