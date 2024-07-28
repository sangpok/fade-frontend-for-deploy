import { useEffect, useMemo } from 'react';

export function useInfiniteObserver({ parentNodeId, onIntersection }: { parentNodeId: string; onIntersection: () => void }) {
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
        const [lastNode] = mutations.pop()!.addedNodes;

        intersectionObserver.disconnect();
        intersectionObserver.observe(lastNode as Element);
      }),
    [parentNodeId]
  );

  const startObserve = () => {
    const targetParentNode = document.getElementById(parentNodeId);

    if (targetParentNode === null) {
      return;
    }

    mutationObserver.observe(targetParentNode!, { childList: true });
    intersectionObserver.observe(targetParentNode!.lastElementChild || targetParentNode!);
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
