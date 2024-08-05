import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

interface TUseInfiniteObserver {
  parentNodeId: string;
  targetMode?: 'firstChild' | 'lastChild';
  onIntersection: () => void;
}

type UseInfiniteObserverProps = TUseInfiniteObserver;

export function useInfiniteObserver({ parentNodeId, targetMode = 'lastChild', onIntersection }: UseInfiniteObserverProps) {
  const intersectionObserver = useRef(new IntersectionObserver(([{ isIntersecting }]) => isIntersecting && onIntersection(), { threshold: 0.1 }));

  const mutationObserver = useRef(
    new MutationObserver((mutations) => {
      intersectionObserver.current.disconnect();

      const {
        addedNodes: [targetNode],
      } = mutations.at(targetMode === 'lastChild' ? -1 : 0)!;

      intersectionObserver.current.observe(targetNode as Element);
    })
  );

  const startObserve = useCallback(() => {
    const targetParentNode = document.getElementById(parentNodeId);

    if (targetParentNode === null) {
      return;
    }

    mutationObserver.current.observe(targetParentNode, { childList: true });

    targetMode === 'lastChild' && intersectionObserver.current.observe(targetParentNode.lastElementChild || targetParentNode);
    targetMode === 'firstChild' && intersectionObserver.current.observe(targetParentNode.firstElementChild || targetParentNode);
  }, [parentNodeId]);

  useLayoutEffect(() => {
    startObserve();
  }, [parentNodeId]);

  const disconnect = useCallback(() => {
    mutationObserver.current.disconnect();
    intersectionObserver.current.disconnect();
  }, []);

  const resetObserve = useCallback(() => {
    disconnect();
    startObserve();
  }, []);

  useEffect(() => {
    return () => disconnect();
  }, []);

  return { startObserve, disconnect, resetObserve };
}
