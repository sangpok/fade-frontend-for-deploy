import { Skeleton } from '@Components/ui/skeleton';
import { useHeader } from '@Hooks/useHeader';

export default function Page() {
  useHeader({ title: 'FA:P 아카이브' });

  return (
    <div className="flex h-full flex-col gap-5 px-5">
      <div className="flex flex-row gap-5 pt-5">
        <Skeleton className="size-8 flex-1" />
        <Skeleton className="size-8 flex-1" />
      </div>

      <Skeleton className="h-[3.6875rem] w-full" />
      <Skeleton className="size-1 h-full w-full flex-1" />
    </div>
  );
}
