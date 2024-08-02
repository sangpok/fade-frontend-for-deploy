import { Skeleton } from '@Components/ui/skeleton';
import { FlexibleLayout } from './FlexibleLayout';

export default function SkeletonUI() {
  return (
    <FlexibleLayout.Root className="w-full flex-1">
      <FlexibleLayout.Header>
        <header className="relative py-2">
          <Skeleton className="absolute left-5 top-1/2 size-8 -translate-y-1/2" />
          <Skeleton className="mx-auto size-8 w-1/2" />
          <Skeleton className="absolute right-5 top-1/2 size-8 -translate-y-1/2" />
        </header>
      </FlexibleLayout.Header>

      <FlexibleLayout.Content className="p-5">
        <Skeleton className="h-full w-full" />
      </FlexibleLayout.Content>

      <FlexibleLayout.Footer>
        <div className="flex flex-row gap-5 px-5 pb-5">
          <Skeleton className="size-11 flex-1" />
          <Skeleton className="size-11 flex-1" />
          <Skeleton className="size-11 flex-1" />
          <Skeleton className="size-11 flex-1" />
          <Skeleton className="size-11 flex-1" />
        </div>
      </FlexibleLayout.Footer>
    </FlexibleLayout.Root>
  );
}
