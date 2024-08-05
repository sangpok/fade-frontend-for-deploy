import { Skeleton } from '@Components/ui/skeleton';
import { useHeader } from '@Hooks/useHeader';

export default function Page() {
  useHeader({ title: '구독' });

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-row gap-3 p-4">
        <Skeleton className="h-[3.125rem] flex-1" />
        <Skeleton className="h-[3.125rem] flex-1" />
        <Skeleton className="h-[3.125rem] flex-1" />
        <Skeleton className="h-[3.125rem] flex-1" />
        <Skeleton className="h-[3.125rem] flex-1" />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="flex-1" />
      </div>
    </div>
  );
}
