import { VscLoading } from 'react-icons/vsc';

export function SpinLoading() {
  return (
    <div className="flex w-full items-center justify-center p-5">
      <VscLoading className="size-6 animate-spin" />
    </div>
  );
}
