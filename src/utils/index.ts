import { SERVICE_ERROR_MESSAGE, ServiceErrorCode, ServiceErrorResponse } from '@Types/serviceError';
import { LoaderResponse, LoaderResponseStatus } from '@Types/loaderResponse';
import { AxiosError, isAxiosError } from 'axios';

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPayloadFromJWT(jwt: string) {
  return JSON.parse(atob(jwt.split('.')[1]).replaceAll('\\', '')) as {
    id: string;
    accountId: string;
    email: string;
    exp: Date;
    iat: Date;
  };
}

export type RequiredWith<T, K extends keyof T> = T & {
  [P in K]-?: T[P];
};

export const isAxiosErrorWithCustomCode = (error: unknown): error is RequiredWith<AxiosError<ServiceErrorResponse>, 'response'> => {
  return (
    typeof error === 'object' &&
    error !== null &&
    isAxiosError<ServiceErrorResponse>(error) &&
    !!error.response &&
    !!error.response.data.errorCode &&
    error.response.data.errorCode in SERVICE_ERROR_MESSAGE
  );
};

export function createSuccessLoaderResponse<T>(payload: T): LoaderResponse<T> {
  return { status: LoaderResponseStatus.SUCCESS, payload };
}

export function createErrorLoaderResponse<T = never>(payload: ServiceErrorResponse): LoaderResponse<T> {
  return { status: LoaderResponseStatus.ERROR, payload };
}

export type TryCatcherResult<T> = [T, null] | [null, ServiceErrorCode];

export const tryCatcher = async <T, _>(tryer: () => T | Promise<T>): Promise<TryCatcherResult<T>> => {
  try {
    const result = await tryer();
    return [result, null];
  } catch (error) {
    if (isAxiosErrorWithCustomCode(error)) {
      const { errorCode } = error.response.data;

      return [null, errorCode];
    }

    return [null, 'unknown_error' as ServiceErrorCode];
  }
};

export function clearSearchParams() {
  history.pushState(null, '', window.location.pathname);
}

export function getBase64Image(file: File) {
  return new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.addEventListener('load', () => {
      resolve(<string>fileReader.result);
    });

    fileReader.addEventListener('error', (error) => {
      reject(error);
    });

    fileReader.readAsDataURL(file);
  });
}

const MAX_FILE_SIZE = 1_000_000; // 16MB
// const MAX_FILE_SIZE = 2 ** 24; // 16MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const validateLocalImageFile = (imageFile: File) => {
  const isOversize = imageFile.size >= MAX_FILE_SIZE;

  if (isOversize) {
    return { isValid: false, message: '파일이 넘 커요' };
  }

  const isNotAcceptedTypes = imageFile.type in ACCEPTED_IMAGE_TYPES;

  if (isNotAcceptedTypes) {
    return { isValid: false, message: `.jpeg, .jpg, .png, .webp 확장자만 지원합니다.` };
  }

  return { isValid: true, message: null };
};

export const generateRandomId = () => Math.random().toString(32).substring(2);

const randomNames = [
  '알렉산더 맥퀸',
  '알렉산더 왕',
  '캘빈 클라인',
  '도미니코 돌체',
  '도나텔라 베르사체',
  '조르지오 아르마니',
  '후세인 샬라얀',
  '장 폴 고티에',
  '질 샌더',
  '지미 추',
  '존 갈리아노',
  '칼 라거펠트',
  '마크 제이콥스',
  '마이클 코스',
  '미우치아 프라다',
  '폴 스미스',
  '피비 필로',
  '피에르 가르뎅',
  '랄프 로렌',
  '렌조 로소',
  '리카르도 티시',
  '로베르토 카발리',
  '소니아 리키엘',
  '스테파노 가바나',
  '스텔라 맥카트니',
  '톰 브라운',
  '톰 포드',
  '발렌티노 가라바니',
  '비비안 웨스트우드',
  '요지 야마모토',
];

export const generateAnonName = () => `${randomNames[Math.floor(Math.random() * randomNames.length)]}`;
