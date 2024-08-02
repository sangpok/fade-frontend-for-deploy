import { Skeleton } from '@Components/ui/skeleton';

export default function Page() {
  return (
    <div className="flex h-full flex-col bg-gray-100">
      <div className="flex flex-col items-center justify-center gap-5 rounded-b-2xl bg-white pb-5 pt-10">
        <Skeleton className="size-[7.75rem]" />

        <div className="flex flex-col items-center justify-center gap-1">
          <Skeleton className="h-6 w-[16rem]" />

          <div className="space-x-1 text-detail">
            <Skeleton className="h-4 w-[8rem]" />
          </div>
        </div>

        <Skeleton className="h-14 w-[5.5rem]" />
      </div>

      <div className="flex min-h-1 flex-1 flex-col">
        <ul className="min-h-1 flex-1 space-y-3 overflow-y-scroll px-5 py-3">
          <Skeleton className="size-12 w-full" />
          <Skeleton className="size-12 w-full" />
          <Skeleton className="size-12 w-full" />
          <Skeleton className="size-12 w-full" />
          <Skeleton className="size-12 w-full" />
        </ul>
      </div>
    </div>
  );
}
