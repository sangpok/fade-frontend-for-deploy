import { Skeleton } from '@Components/ui/skeleton';

export default function Page() {
  return (
    <div className="relative flex h-full flex-col space-y-8 py-3">
      <div className="flex flex-row gap-3 px-3">
        <Skeleton className="size-10" />
        <Skeleton className="flex-1" />
        <Skeleton className="size-10 w-20" />
      </div>
      <div className="flex flex-row gap-3 px-3">
        <Skeleton className="size-10" />
        <Skeleton className="flex-1" />
        <Skeleton className="size-10 w-20" />
      </div>
      <div className="flex flex-row gap-3 px-3">
        <Skeleton className="size-10" />
        <Skeleton className="flex-1" />
        <Skeleton className="size-10 w-20" />
      </div>
      <div className="flex flex-row gap-3 px-3">
        <Skeleton className="size-10" />
        <Skeleton className="flex-1" />
        <Skeleton className="size-10 w-20" />
      </div>
      <div className="flex flex-row gap-3 px-3">
        <Skeleton className="size-10" />
        <Skeleton className="flex-1" />
        <Skeleton className="size-10 w-20" />
      </div>
      <div className="flex flex-row gap-3 px-3">
        <Skeleton className="size-10" />
        <Skeleton className="flex-1" />
        <Skeleton className="size-10 w-20" />
      </div>
    </div>
  );
}
