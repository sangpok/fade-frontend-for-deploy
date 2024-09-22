import { Skeleton } from '@Components/ui/skeleton';
import { useHeader } from '@Hooks/useHeader';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';

export default function Page() {
  useHeader({ title: 'Buy or Not' });

  return (
    <FlexibleLayout.Root className="gap-3 p-5">
      <FlexibleLayout.Header>
        <Skeleton className="h-[3.125rem]" />
      </FlexibleLayout.Header>

      <FlexibleLayout.Content className="flex flex-col gap-5 overflow-visible">
        <Skeleton className="h-full w-full" />

        <div className="space-y-3">
          <Skeleton className="h-12" />
          <Skeleton className="h-11" />
        </div>
      </FlexibleLayout.Content>
    </FlexibleLayout.Root>
  );
}
