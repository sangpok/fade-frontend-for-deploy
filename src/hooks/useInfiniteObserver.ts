import { useEffect, useMemo } from 'react';

interface TUseInfiniteObserver {
  parentNodeId: string;
  targetMode?: 'firstChild' | 'lastChild';
  onIntersection: () => void;
}

type UseInfiniteObserverProps = TUseInfiniteObserver;

export function useInfiniteObserver({ parentNodeId, targetMode, onIntersection }: UseInfiniteObserverProps) {
  const intersectionObserver = useMemo(
    () =>
      new IntersectionObserver(
        ([intersection]) => {
          const { isIntersecting } = intersection;
          isIntersecting && onIntersection();
        },
        { threshold: 0.1 }
      ),
    [parentNodeId]
  );

  const mutationObserver = useMemo(
    () =>
      new MutationObserver((mutations) => {
        intersectionObserver.disconnect();

        const [targetNode] = targetMode === 'lastChild' ? mutations.pop()!.addedNodes : mutations.at(0)!.addedNodes;
        intersectionObserver.observe(targetNode as Element);
      }),
    [parentNodeId]
  );

  const startObserve = () => {
    const targetParentNode = document.getElementById(parentNodeId);

    if (targetParentNode === null) {
      return;
    }

    mutationObserver.observe(targetParentNode!, { childList: true });

    if (targetMode === 'lastChild') {
      intersectionObserver.observe(targetParentNode!.lastElementChild || targetParentNode!);
    }

    if (targetMode === 'firstChild') {
      intersectionObserver.observe(targetParentNode!.firstElementChild || targetParentNode!);
    }
  };

  const disconnect = () => {
    mutationObserver.disconnect();
    intersectionObserver.disconnect();
  };

  const resetObserve = () => {
    disconnect();
    startObserve();
  };

  useEffect(() => {
    return () => disconnect();
  }, []);

  return { startObserve, disconnect, resetObserve };
}
