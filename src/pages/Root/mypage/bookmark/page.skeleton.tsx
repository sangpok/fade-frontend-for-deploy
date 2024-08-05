import { Grid } from '@Components/ui/grid';
import { Skeleton } from '@Components/ui/skeleton';
import { useHeader } from '@Hooks/useHeader';

export default function Page() {
  useHeader({ title: '북마크' });

  return (
    <Grid cols={3}>
      <Skeleton className="aspect-[3/4] flex-1" />
      <Skeleton className="aspect-[3/4] flex-1" />
      <Skeleton className="aspect-[3/4] flex-1" />
      <Skeleton className="aspect-[3/4] flex-1" />
      <Skeleton className="aspect-[3/4] flex-1" />
      <Skeleton className="aspect-[3/4] flex-1" />
    </Grid>
  );
}
