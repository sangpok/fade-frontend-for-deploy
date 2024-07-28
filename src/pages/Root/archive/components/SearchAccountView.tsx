import testImage from '@Assets/test_fashion_image.jpg';
import { BackButton } from '@Components/ui/button';
import { Avatar } from '@Components/ui/avatar';
import { Button } from '@Components/ui/button';
import { useDebounce } from '@Hooks/useDebounce';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { DefaultModalProps } from '@Stores/modal';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { MdCancel, MdClose, MdSearch, MdWarning } from 'react-icons/md';
import { VscLoading } from 'react-icons/vsc';

interface TSearchResultItem {
  userId: number;
  accountId: string;
  profileURL: string;
}

type SearchResults = TSearchResultItem[];

const searchResults: SearchResults = [{ userId: 0, accountId: 'fade_1234', profileURL: testImage }];

export function SearchAccountView({ onClose }: DefaultModalProps) {
  const [targetAccountId, setTargetAccountId] = useState('');
  const [isPending, debouncedAccountId] = useDebounce(targetAccountId, 350);

  const isHistoryView = debouncedAccountId === '';
  const isResultView = debouncedAccountId !== '';

  return (
    <FlexibleLayout.Root>
      <FlexibleLayout.Header>
        <header className="relative flex items-center justify-center py-2">
          <BackButton onClick={() => onClose()} />
          <span className="mx-auto text-h3 font-semibold">계정 검색</span>
        </header>

        <div className="border-b border-b-gray-200 p-5">
          <SearchInput
            value={targetAccountId}
            isPending={isPending}
            onChange={setTargetAccountId}
            onClear={() => setTargetAccountId('')}
            onSubmit={() => console.log(targetAccountId)}
          />
        </div>
      </FlexibleLayout.Header>

      <FlexibleLayout.Content>
        <AnimatePresence mode="wait">
          {isHistoryView && (
            <motion.div key={'search-history-view'} initial={{ opacity: 0, y: '12px' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '12px' }}>
              <SearchHistoryList />
            </motion.div>
          )}
          {isResultView && (
            <motion.div key={'search-result-view'} initial={{ opacity: 0, y: '12px' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '12px' }} className="h-full">
              <SearchResultList matchedUsers={searchResults} />
            </motion.div>
          )}
        </AnimatePresence>
      </FlexibleLayout.Content>
    </FlexibleLayout.Root>
  );
}

function SearchInput({
  value,
  isPending,
  onChange,
  onClear,
  onSubmit,
}: {
  value: string;
  isPending: boolean;
  onChange: (value: string) => void;
  onClear: () => void;
  onSubmit: () => void;
}) {
  const hasValue = value !== '';
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onClear();
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-row gap-3 rounded-2xl border border-gray-200 bg-gray-100 px-5 py-3 focus-within:border-gray-400">
      <input
        ref={inputRef}
        className="flex-1 appearance-none border-none bg-transparent outline-none"
        placeholder="계정명(ID) 입력"
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
      />

      <AnimatePresence>
        {hasValue && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <Button variants="ghost" onClick={handleClear} className="p-0">
              <MdCancel className="size-5 text-gray-600" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <Button variants="ghost" className="p-0" onClick={onSubmit}>
        {isPending && <VscLoading className="size-6 animate-spin text-gray-600" />}
        {!isPending && <MdSearch className="size-6 text-gray-600" />}
      </Button>
    </div>
  );
}

function SearchHistoryList() {
  const searchHistory = searchResults;

  return (
    <div className="space-y-3 px-3 py-5">
      <p className="pl-2 text-h6 font-semibold">최근 검색</p>

      <ul>
        {searchHistory.map((userDetail) => (
          <li key={`search-histroy-${userDetail.accountId}`} className="flex flex-row items-center gap-3">
            <AccountItem {...userDetail} onClick={(userId) => console.log({ userId })} />

            <button className="group cursor-pointer rounded-lg p-2 touchdevice:active:bg-gray-100 pointerdevice:hover:bg-gray-100">
              <MdClose className="size-3 text-gray-500 transition-transform group-active:scale-95" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AccountItem({ userId, profileURL, accountId, onClick }: { userId: number; profileURL: string; accountId: string; onClick: (userId: number) => void }) {
  return (
    <button
      className="group flex flex-1 flex-row items-center gap-3 rounded-lg p-2 touchdevice:active:bg-gray-200 pointerdevice:hover:bg-gray-100 pointerdevice:active:bg-gray-200"
      onClick={() => onClick(userId)}>
      <Avatar src={profileURL} size="40" />
      <p>{accountId}</p>
    </button>
  );
}

function SearchResultList({ matchedUsers }: { matchedUsers: SearchResults }) {
  const hasNoResult = true;

  if (hasNoResult) {
    return <NoSearchResult />;
  }

  return (
    <div className="space-y-3 px-3 py-5">
      <p className="pl-2 text-h6 font-semibold">계정</p>

      <ul>
        {matchedUsers.map((userDetail) => (
          <li key={`search-histroy-${userDetail.accountId}`} className="flex flex-row items-center gap-3">
            <AccountItem {...userDetail} onClick={(userId) => console.log({ userId })} />

            <Button variants="ghost" className="p-2">
              <MdClose className="size-3 text-gray-500" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NoSearchResult() {
  return (
    <div className="grid h-full place-items-center">
      <div className="grid place-items-center">
        <MdWarning className="size-20 text-purple-100" />
        <p className="text-h6 font-semibold">검색 결과가 없어요.</p>
      </div>
    </div>
  );
}
