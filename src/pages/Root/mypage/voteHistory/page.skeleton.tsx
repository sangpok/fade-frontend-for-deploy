import { Grid } from '@Components/ui/grid';
import { Skeleton } from '@Components/ui/skeleton';
import { useHeader } from '@Hooks/useHeader';

export default function Page() {
  useHeader({ title: '투표 내역' });

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-row items-center gap-3 bg-white px-5 py-3">
        <Skeleton className="h-[2.125rem] flex-1" />
        <Skeleton className="h-full w-[8rem] rounded-full" />
      </div>

      <div id="feedList" className="flex-1 space-y-[3.75rem] overflow-y-scroll p-5">
        <section className="space-y-2">
          <Skeleton className="h-5 w-[16rem]" />
          <Grid id="feedList" cols={5}>
            <Skeleton className="aspect-[3/4] flex-1" />
            <Skeleton className="aspect-[3/4] flex-1" />
            <Skeleton className="aspect-[3/4] flex-1" />
            <Skeleton className="aspect-[3/4] flex-1" />
            <Skeleton className="aspect-[3/4] flex-1" />
            <Skeleton className="aspect-[3/4] flex-1" />
            <Skeleton className="aspect-[3/4] flex-1" />
            <Skeleton className="aspect-[3/4] flex-1" />
            <Skeleton className="aspect-[3/4] flex-1" />
            <Skeleton className="aspect-[3/4] flex-1" />
          </Grid>
        </section>

        <section className="space-y-2">
          <Skeleton className="h-5 w-[16rem]" />
          <Grid id="feedList" cols={5}>
            <Skeleton className="aspect-[3/4] flex-1" />
            <Skeleton className="aspect-[3/4] flex-1" />
            <Skeleton className="aspect-[3/4] flex-1" />
            <Skeleton className="aspect-[3/4] flex-1" />
            <Skeleton className="aspect-[3/4] flex-1" />
            <Skeleton className="aspect-[3/4] flex-1" />
            <Skeleton className="aspect-[3/4] flex-1" />
            <Skeleton className="aspect-[3/4] flex-1" />
            <Skeleton className="aspect-[3/4] flex-1" />
            <Skeleton className="aspect-[3/4] flex-1" />
          </Grid>
        </section>
      </div>
    </div>
  );
}
