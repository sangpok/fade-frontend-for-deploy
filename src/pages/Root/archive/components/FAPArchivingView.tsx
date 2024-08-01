import { FeedDetailDialog } from '@Components/FeedDetailDialog';
import { Button } from '@Components/ui/button';
import { Grid } from '@Components/ui/grid';
import { Image } from '@Components/ui/image';
import { useModalActions } from '@Hooks/modal';
import { requestFAPArchiving } from '@Services/feed';
import { useQuery } from '@tanstack/react-query';
import { TFAPArchivingFeed } from '@Types/model';
import { cn, isBetweenDate } from '@Utils/index';
import { addMonths, format, getDate, getDaysInMonth, getWeeksInMonth, isSameMonth, isSameYear, startOfDay, subMonths } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

const MIN_DATE = new Date('2024-01-01');
const MAX_DATE = new Date();

export function FAPArchivingView() {
  const [calenderDate, setCalenderDate] = useState(format(new Date(), 'yyyy-MM'));

  const updateDate = (newDate: Date | null) => {
    /** Webkit에서 삭제 버튼 눌렀을 때 */
    if (newDate === null) {
      return setCalenderDate(format(new Date(), 'yyyy-MM'));
    }

    /** 유효성 검사 */
    if (!isBetweenDate(MIN_DATE, newDate, MAX_DATE)) {
      return setCalenderDate(format(new Date(), 'yyyy-MM'));
    }

    setCalenderDate(format(newDate, 'yyyy-MM'));
  };

  return (
    <div className="flex flex-1 flex-col p-5">
      <CalendarDateSelector
        calenderDate={calenderDate}
        onMonthSelected={updateDate}
        onPreMonthClicked={() => updateDate(subMonths(calenderDate, 1))}
        onNextMonthClicked={() => updateDate(addMonths(calenderDate, 1))}
      />

      <DayOfWeeksHeader />
      <FAPFeeds calenderDate={calenderDate} />
    </div>
  );
}

interface TCalendarDateSelector {
  calenderDate: string;
  onPreMonthClicked: () => void;
  onMonthSelected: (date: Date | null) => void;
  onNextMonthClicked: () => void;
}

type CalendarDateSelectorProps = TCalendarDateSelector;

function CalendarDateSelector({ calenderDate, onMonthSelected, onNextMonthClicked, onPreMonthClicked }: CalendarDateSelectorProps) {
  const isMinDate = isSameYear(calenderDate, MIN_DATE) && isSameMonth(calenderDate, MIN_DATE);
  const isMaxDate = isSameYear(calenderDate, MAX_DATE) && isSameMonth(calenderDate, MAX_DATE);

  return (
    <div className="relative flex justify-center rounded-lg border border-gray-200 py-2">
      <Button variants="ghost" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2" disabled={isMinDate} onClick={() => onPreMonthClicked()}>
        <MdChevronLeft className="size-6" />
      </Button>

      {/* 나중에 Date Picker 진짜 바꿔야겠다 ... 개열받네 */}
      <div id="date_picker">
        <input
          type="month"
          className="relative whitespace-nowrap rounded-lg bg-gray-100 px-4 py-[.375rem] text-h6"
          value={calenderDate}
          onInput={(e) => onMonthSelected(e.currentTarget.valueAsDate)}
          min={format(MIN_DATE, 'yyyy-MM')}
          max={format(MAX_DATE, 'yyyy-MM')}
        />
      </div>

      <Button variants="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2" disabled={isMaxDate} onClick={() => onNextMonthClicked()}>
        <MdChevronRight className="size-6" />
      </Button>
    </div>
  );
}

function DayOfWeeksHeader() {
  return (
    <div>
      <ul className="flex flex-row py-5">
        {['일', '월', '화', '수', '목', '금', '토'].map((dayOfWeek, index) => (
          <li
            key={`dayOfWeek-${index}`}
            className={cn('flex-1 text-center', {
              ['text-pink-400']: index === 0,
              ['text-purple-900']: index === 6,
            })}>
            {dayOfWeek}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface TFAPFeeds {
  calenderDate: string;
}

type FAPFeedsProps = TFAPFeeds;

function FAPFeeds({ calenderDate }: FAPFeedsProps) {
  const { data } = useQuery({
    queryKey: ['archiving', 'fap', calenderDate],
    queryFn: () => requestFAPArchiving({ selectedDate: calenderDate }),
  });

  const weeksInMonth = getWeeksInMonth(calenderDate);
  const daysInMonth = getDaysInMonth(calenderDate);
  const firstDayOfWeek = format(startOfDay(calenderDate), 'e');

  const feeds = data?.feeds;

  return (
    <Grid cols={7} rows={weeksInMonth} className="flex-1">
      <AnimatePresence initial={false}>
        {Array.from({ length: daysInMonth }, (_, index) => (
          <DayItem
            key={`day-${index}`}
            feeds={feeds}
            feed={feeds?.find((feed) => getDate(feed.fapSelectedAt) === index + 1)}
            day={index + 1}
            firstDayOfWeek={firstDayOfWeek}
          />
        ))}
      </AnimatePresence>
    </Grid>
  );
}

interface TDayItem {
  day: number;
  feeds: TFAPArchivingFeed[] | undefined;
  feed: TFAPArchivingFeed | undefined;
  firstDayOfWeek: string;
}

type DayItemProps = TDayItem;

function DayItem({ day, feed, feeds, firstDayOfWeek }: DayItemProps) {
  const { showModal } = useModalActions();

  const handleClick = async () => {
    if (!feed) {
      return;
    }

    await showModal({ type: 'fullScreenDialog', animateType: 'slideInFromRight', Component: FeedDetailDialog, props: { feeds, defaultViewIndex: day - 1 } });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-full w-full flex-col"
      style={{ gridColumnStart: day === 1 ? firstDayOfWeek : undefined }}
      onClick={handleClick}>
      <span className="ml-1">{day}</span>
      <div className={cn('group h-full w-full overflow-hidden rounded-lg bg-gray-200', { ['cursor-pointer']: !!feed, ['animate-pulse']: !feeds })}>
        {feed && <Image src={feed.imageURL} className="transition-transform group-hover:scale-105" />}
      </div>
    </motion.div>
  );
}
