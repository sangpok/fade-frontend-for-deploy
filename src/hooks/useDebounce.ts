import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number): [boolean, T] {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isPending, setisPending] = useState(false);

  useEffect(() => {
    setisPending(true);
    const handlerId = setTimeout(() => {
      setDebouncedValue(value);
      setisPending(false);
    }, delay);
    return () => clearTimeout(handlerId);
  }, [value, delay]);

  return [isPending, debouncedValue];
}
