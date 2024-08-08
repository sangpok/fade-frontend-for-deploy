import { Avatar } from '@Components/ui/avatar';
import { BackButton, Button } from '@Components/ui/button';
import { useDebounce } from '@Hooks/useDebounce';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { requestSearchUser } from '@Services/member';
import { DefaultModalProps } from '@Stores/modal';
import { useQuery } from '@tanstack/react-query';
import { TMatchedUser } from '@Types/model';
import { loadLocalData, saveLocalData } from '@Utils/index';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { MdCancel, MdClose, MdSearch, MdWarning } from 'react-icons/md';
import { VscLoading } from 'react-icons/vsc';
import { useNavigate } from 'react-router-dom';

/** TODO: localStorage Hook 만들어서 관리하기 */

export function SearchAccountView({ onClose }: DefaultModalProps) {
  const navigate = useNavigate();

  const [targetUsername, setTargetUsername] = useState('');
  const [isDebouncePending, debouncedUsername] = useDebounce(targetUsername, 350);
  const [results, setResults] = useState<TMatchedUser[]>([]);

  const [searchHistory, setSearchHistory] = useState<TMatchedUser[]>(JSON.parse(loadLocalData('FADE_SEARCH_HISTORY') || '[]') as TMatchedUser[]);

  const { data, isPending: isQueryPending } = useQuery({
    queryKey: ['search', 'user', debouncedUsername],
    queryFn: () => requestSearchUser({ username: debouncedUsername }),
    enabled: debouncedUsername !== '' && !isDebouncePending,
  });

  useEffect(() => {
    if (!isQueryPending && data) {
      setResults(data.data.matchedMembers);
    }
  }, [isQueryPending]);

  const handleResultUserItemClick = (userDetail: TMatchedUser) => {
    const hasAlreadyUser = searchHistory.find(({ id }) => id === userDetail.id);

    if (hasAlreadyUser) {
      saveLocalData('FADE_SEARCH_HISTORY', JSON.stringify([userDetail, ...searchHistory.filter(({ id }) => id !== userDetail.id)]));
    } else {
      if (searchHistory.length > 4) {
        saveLocalData('FADE_SEARCH_HISTORY', JSON.stringify([userDetail, ...searchHistory.slice(0, -1)]));
      } else {
        saveLocalData('FADE_SEARCH_HISTORY', JSON.stringify([userDetail, ...searchHistory]));
      }
    }

    navigate(`/user`, { state: { userId: userDetail.id } });
    onClose();
  };

  const handleHistoryUserItemClick = (userId: number) => {
    const matchedItem = searchHistory.find(({ id }) => id === userId)!;
    const newHistory: TMatchedUser[] = [matchedItem, ...searchHistory.filter(({ id }) => id !== userId)];

    saveLocalData('FADE_SEARCH_HISTORY', JSON.stringify(newHistory));
    setSearchHistory(newHistory);

    navigate('/user', { state: { userId } });
    onClose();
  };

  const handleHistoryUserItemDelete = (userId: number) => {
    const newHistory: TMatchedUser[] = [...searchHistory.filter(({ id }) => id !== userId)];

    saveLocalData('FADE_SEARCH_HISTORY', JSON.stringify(newHistory));
    setSearchHistory(newHistory);
  };

  const isHistoryView = debouncedUsername === '';
  const isResultView = debouncedUsername !== '';

  return (
    <FlexibleLayout.Root>
      <FlexibleLayout.Header>
        <header className="relative flex items-center justify-center py-2">
          <BackButton onClick={() => onClose()} />
          <span className="mx-auto text-h3 font-semibold">계정 검색</span>
        </header>

        <div className="border-b border-b-gray-200 p-5">
          <SearchInput
            value={targetUsername}
            isPending={isDebouncePending || (debouncedUsername !== '' && isQueryPending)}
            onChange={setTargetUsername}
            onClear={() => setTargetUsername('')}
            onSubmit={() => console.log(targetUsername)}
          />
        </div>
      </FlexibleLayout.Header>

      <FlexibleLayout.Content>
        <AnimatePresence initial={false} mode="wait">
          {isHistoryView && (
            <motion.div key={`search-history-view`} initial={{ opacity: 0, y: '12px' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '12px' }}>
              <SearchHistoryList searchHistory={searchHistory} onUserItemClick={handleHistoryUserItemClick} onUserItemDelete={handleHistoryUserItemDelete} />
            </motion.div>
          )}
          {isResultView && (
            <motion.div key={`search-result-view`} initial={{ opacity: 0, y: '12px' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '12px' }} className="h-full">
              <SearchResultView matchedMembers={results} isPending={isQueryPending} onUserItemClicked={handleResultUserItemClick} />
            </motion.div>
          )}
        </AnimatePresence>
      </FlexibleLayout.Content>
    </FlexibleLayout.Root>
  );
}

interface TSearchInput {
  value: string;
  isPending: boolean;
  onChange: (value: string) => void;
  onClear: () => void;
  onSubmit: () => void;
}

type SearchInputProps = TSearchInput;

function SearchInput({ value, isPending, onChange, onClear, onSubmit }: SearchInputProps) {
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
        className="w-full appearance-none bg-transparent outline-none"
        placeholder="계정명(ID) 입력"
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
      />

      <AnimatePresence>
        {hasValue && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex justify-center">
            <Button variants="ghost" onClick={handleClear} className="p-0">
              <MdCancel className="size-5 text-gray-600" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <Button variants="ghost" className="min-w-fit p-0" onClick={onSubmit}>
        {isPending && <VscLoading className="size-6 animate-spin text-gray-600" />}
        {!isPending && <MdSearch className="size-6 text-gray-600" />}
      </Button>
    </div>
  );
}

interface TSearchHistoryList {
  searchHistory: TMatchedUser[];
  onUserItemClick: (userId: number) => void;
  onUserItemDelete: (userId: number) => void;
}

type SearchHistoryListProps = TSearchHistoryList;

function SearchHistoryList({ searchHistory, onUserItemClick, onUserItemDelete }: SearchHistoryListProps) {
  const hasSearchHistory = searchHistory.length !== 0;

  return (
    <div className="space-y-3 px-3 py-5">
      <p className="pl-2 text-h6 font-semibold">최근 검색</p>

      <ul>
        {!hasSearchHistory && <p className="pl-2 text-gray-700">최근 검색한 유저가 없습니다.</p>}

        {hasSearchHistory &&
          searchHistory.map((userDetail) => (
            <li key={`search-histroy-${userDetail.id}`} className="flex flex-row items-center gap-3">
              <UserItem {...userDetail} onClick={onUserItemClick} />

              <Button variants="ghost" size="icon" onClick={() => onUserItemDelete(userDetail.id)}>
                <MdClose className="size-3 text-gray-500" />
              </Button>
            </li>
          ))}
      </ul>
    </div>
  );
}

interface TUserItem {
  onClick: (userId: number) => void;
}

type UserItemPRops = TUserItem & TMatchedUser;

function UserItem({ id, profileImageURL, username, onClick }: UserItemPRops) {
  return (
    <button
      className="group flex flex-1 flex-row items-center gap-3 rounded-lg p-2 touchdevice:active:bg-gray-200 pointerdevice:hover:bg-gray-100 pointerdevice:active:bg-gray-200"
      onClick={() => onClick(id)}>
      <Avatar src={profileImageURL} size="40" />
      <p>{username}</p>
    </button>
  );
}

interface TSearchResultView {
  matchedMembers: TMatchedUser[];
  isPending: boolean;
  onUserItemClicked: (userDetail: TMatchedUser) => void;
}

type SearchResultViewProps = TSearchResultView;

function SearchResultView({ matchedMembers, isPending, onUserItemClicked }: SearchResultViewProps) {
  const hasMatchedUsers = matchedMembers.length !== 0;

  return (
    <div className="space-y-3 px-3 py-5">
      <p className="pl-2 text-h6 font-semibold">계정</p>

      {!isPending && !hasMatchedUsers && <NoSearchResult />}
      {hasMatchedUsers && (
        <ul>
          {matchedMembers.map((userDetail) => (
            <li key={`search-result-${userDetail.username}`} className="flex flex-row items-center gap-3">
              <UserItem {...userDetail} onClick={() => onUserItemClicked(userDetail)} />
            </li>
          ))}
        </ul>
      )}
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
