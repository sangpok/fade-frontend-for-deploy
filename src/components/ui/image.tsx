import { cn, prefetchImages } from '@Utils/index';
import { PropsWithChildren, useEffect, useState } from 'react';
import { MdOutlineImageNotSupported } from 'react-icons/md';

interface ImageProps {
  src: string;
  className?: string;
  alt?: string;
  size?: 'cover' | 'contain';
}

export function Image({ children, src, className, alt, size = 'cover' }: PropsWithChildren<ImageProps>) {
  const [imageURL, setImageURL] = useState('');
  const [isError, setIsError] = useState(false);

  const hasNoImageURL = imageURL === '';

  useEffect(() => {
    prefetchImages([src])
      .then(() => setImageURL(src))
      .catch(() => setIsError(true));
  }, [src]);

  return (
    <div
      role="img"
      aria-label={alt}
      style={{ backgroundImage: imageURL ? `url('${imageURL}')` : 'none' }}
      className={cn('relative grid h-full w-full place-content-center bg-center bg-no-repeat', className, {
        ['bg-cover']: size === 'cover',
        ['bg-contain']: size === 'contain',
      })}>
      {hasNoImageURL && <div className="absolute inset-0 animate-pulse bg-gray-200" />}
      {isError && <MdOutlineImageNotSupported className="size-4 text-pink-400" />}
      {children}
    </div>
  );
}

/** 아래의 코드는 Lazy와 Caching을 이용한 Image 컴포넌트인데... 이상하게 너무 버벅여서 일단 내버려뒀음. 아마 Blob을 생성하는 과정에서 무언가 있는 것 같은데 ..... 최적화 때 둘러보는 걸로. */

// export function Image({ children, src, className, alt, size = 'cover' }: PropsWithChildren<ImageProps>) {
//   const imageRef = useRef<HTMLDivElement>(null);
//   const [isInView, setIsInView] = useState(false);
//   const [isPending, startTransition] = useTransition();

//   const { data: objectURL, isError } = useQuery({
//     queryKey: ['cache', 'image', src],
//     queryFn: () => prefetchImageAndGetObjectUrl(src),
//     staleTime: Infinity,
//     enabled: isInView,
//   });

//   const hasNoObjectURL = objectURL === undefined;

//   useEffect(() => {
//     const intersectionObserver = new IntersectionObserver(([{ isIntersecting }]) => {
//       if (isIntersecting) {
//         startTransition(() => {
//           setIsInView(true);
//         });
//         intersectionObserver.disconnect();
//       }
//     });

//     intersectionObserver.observe(imageRef.current!);

//     return () => {
//       // objectURL && URL.revokeObjectURL(objectURL);
//       intersectionObserver.disconnect();
//     };
//   }, []);

//   return (
//     <div
//       ref={imageRef}
//       role="img"
//       aria-label={alt}
//       style={{ backgroundImage: objectURL ? `url('${objectURL}')` : 'none' }}
//       className={cn('relative h-full w-full bg-center bg-no-repeat', className, {
//         ['bg-cover']: size === 'cover',
//         ['bg-contain']: size === 'contain',
//       })}>
//       {(hasNoObjectURL || isPending) && <div className="absolute inset-0 animate-pulse bg-gray-200" />}
//       {isError && <MdOutlineImageNotSupported className="size-4 text-pink-400" />}
//       {children}
//     </div>
//   );
// }
