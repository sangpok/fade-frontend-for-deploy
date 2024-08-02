import { Grid } from './ui/grid';
import { Skeleton } from './ui/skeleton';

export function UserDetailSkeletonUI() {
  return (
    <div className="space-y-5 p-5">
      <div className="flex flex-row items-center gap-3">
        <Skeleton className="size-[4.5rem]" />

        <div className="flex flex-1 flex-col justify-center space-y-1">
          <Skeleton className="h-[1.125rem] w-32" />
          <Skeleton className="h-[1.125rem] w-16" />
        </div>
      </div>

      <div className="flex flex-col">
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}

export function UserFeedsSkeletonUI() {
  return (
    <div className="h-full space-y-10 p-1">
      <Grid cols={3}>
        <Skeleton className="aspect-[3/4] flex-1" />
        <Skeleton className="aspect-[3/4] flex-1" />
        <Skeleton className="aspect-[3/4] flex-1" />
        <Skeleton className="aspect-[3/4] flex-1" />
        <Skeleton className="aspect-[3/4] flex-1" />
        <Skeleton className="aspect-[3/4] flex-1" />
      </Grid>
    </div>
  );
}
