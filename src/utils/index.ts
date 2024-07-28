import { LoaderResponse, LoaderResponseStatus } from '@Types/loaderResponse';
import { ServiceErrorResponse } from '@Types/serviceError';
import { GenderType } from '@Types/User';
import { isAxiosError } from 'axios';
import { type ClassValue, clsx } from 'clsx';
import { isAfter, isBefore, isSameMonth, isSameYear } from 'date-fns';
import { sha256 } from 'js-sha256';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPayloadFromJWT(jwt: string) {
  return JSON.parse(atob(jwt.split('.')[1]).replaceAll('\\', '')) as {
    id: string;
    username: string; // accountId
    genderType: GenderType;
    exp: Date;
    iat: Date;
  };
}

export function createSuccessLoaderResponse<T>(payload: T): LoaderResponse<T> {
  return { status: LoaderResponseStatus.SUCCESS, payload };
}

export function createErrorLoaderResponse<T = never>(payload: ServiceErrorResponse): LoaderResponse<T> {
  return { status: LoaderResponseStatus.ERROR, payload };
}

export type TryCatcherResult<T> = [T, null] | [null, ServiceErrorResponse];

export const tryCatcher = async <T>(tryer: () => T | Promise<T>): Promise<TryCatcherResult<T>> => {
  try {
    const result = await tryer();
    return [result, null];
  } catch (error) {
    if (isAxiosError<ServiceErrorResponse>(error)) {
      /** API 오류 */
      if (error.response) {
        return [null, error.response.data];
      }

      /** 네트워크 오류(disconnected, timeout, cors, etc...) */
      if (error.request) {
        // console.error(error);
        throw error;
      }

      /** 설정 문제이거나 클라이언트 코드 문제임 */
      // console.error(error);
      throw error;
    }

    /** 클라이언트 코드 문제임 */
    // console.error(error);
    throw error;
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

// const MAX_FILE_SIZE = 1_000_000; // 16MB
// const MAX_FILE_SIZE = 2 ** 24; // 16MB
const MAX_FILE_SIZE = 16 * 1024 * 1024; // 16MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

type ValidationResult = { isValid: true; message: null } | { isValid: false; message: string };

export const validateLocalImageFile = (imageFile: File): ValidationResult => {
  const isAcceptedTypes = ACCEPTED_IMAGE_TYPES.includes(imageFile.type);

  if (!isAcceptedTypes) {
    return { isValid: false, message: `.jpeg, .jpg, .png, .webp 확장자만 지원합니다.` };
  }

  const isOversize = imageFile.size >= MAX_FILE_SIZE;

  if (isOversize) {
    return { isValid: false, message: '파일이 넘 커요' };
  }

  return { isValid: true, message: null };
};

export const generateRandomId = () => Math.random().toString(32).substring(2);

const randomNames = [
  '레오나르도 다 빈치',
  '미켈란젤로',
  '라파엘로',
  '티치아노',
  '산드로 보티첼리',
  '엘 그레코',
  '디에고 벨라스케스',
  '렘브란트 반 레인',
  '얀 베르메르',
  '피터 폴 루벤스',
  '앤서니 반 다이크',
  '카라바조',
  '니콜라 푸생',
  '프란시스코 고야',
  '베르니니',
  '자크 루이 다비드',
  '윌리엄 블레이크',
  '수르바란',
  '얀 반 에이크',
  '한스 홀바인',
  '안드레아 만테냐',
  '알브레히트 뒤러',
  '로렌초 기베르티',
  '마사초',
  '도나텔로',
  '프라 안젤리코',
  '안토니오 팔라디오',
  '틴토레토',
  '페르메이오르',
  '루카 시뇨렐리',
  '도메니코 기를란다요',
  '피에트로 페루지노',
  '조르조 바사리',
  '프랑수아 부셰',
  '토마스 게인즈버러',
  '조슈아 레이놀즈',
  '바흐',
  '헨델',
  '요제프 하이든',
  '루트비히 판 베토벤',
  '모차르트',
  '프란츠 슈베르트',
  '펠릭스 멘델스존',
  '로베르트 슈만',
  '요하네스 브람스',
  '구스타프 말러',
  '리하르트 바그너',
  '프레데리크 쇼팽',
  '프란츠 리스트',
  '클라우드 드뷔시',
  '가브리엘 포레',
  '카미유 생상스',
  '주세페 베르디',
  '지아코모 푸치니',
  '빈센트 반 고흐',
  '클로드 모네',
  '폴 세잔',
  '로트렉',
  '폴 고갱',
  '조르주 쇠라',
  '오귀스트 르누아르',
  '에드가 드가',
  '구스타프 클림트',
  '제임스 맥닐 휘슬러',
  '에두아르 마네',
  '카미유 피사로',
  '앙리 마티스',
  '줄스 브레튼',
  '귀스타브 쿠르베',
  '장 프랑수아 밀레',
  '에두아르 드 퓌리오',
  '앙리 루소',
  '토마스 모어',
  '존 밀턴',
  '조나단 스위프트',
  '다니엘 디포',
  '사무엘 리처드슨',
  '헨리 필딩',
  '로렌스 스턴',
  '조지프 애디슨',
  '리처드 스틸',
  '조지 크랩',
  '로버트 번스',
  '월터 스콧',
  '제인 오스틴',
  '에밀리 브론테',
  '샬롯 브론테',
  '앤 브론테',
  '찰스 디킨스',
  '새커리',
  '토머스 하디',
  '루이스 캐럴',
  '조지 엘리엇',
  '윌리엄 워즈워스',
  '콜리지',
  '존 키츠',
];

export const generateAnonName = () => `${randomNames[Math.floor(Math.random() * randomNames.length)]}`;

export async function calculateFileHash(file: File) {
  const arrayBuffer = await file.arrayBuffer();

  const hashBuffer = sha256.arrayBuffer(arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}

export async function prefetchImages(images: string[]): Promise<void> {
  await Promise.all(
    images.map(
      (image) =>
        new Promise((resolve, reject) => {
          const prefetchImage = new Image();

          prefetchImage.addEventListener('load', () => resolve(null));
          prefetchImage.addEventListener('error', () => reject(null));
          prefetchImage.src = image;
        })
    )
  );
}

export async function prefetchImageAndGetObjectUrl(src: string): Promise<string> {
  try {
    const response = await fetch(src);
    const blob = await response.blob();

    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error fetching image:', error);
    throw error;
  }
}

export function isBetweenDate(pre: Date, cur: Date, post: Date) {
  return sameOrAfter(cur, pre) && sameOrBefore(cur, post);
}

export function sameOrBefore(d1 = new Date(), d2 = new Date()) {
  return isSameYear(d1, d2) && isSameMonth(d1, d2) ? true : isBefore(d1, d2) ? true : false;
}

export function sameOrAfter(d1 = new Date(), d2 = new Date()) {
  return isSameYear(d1, d2) && isSameMonth(d1, d2) ? true : isAfter(d1, d2) ? true : false;
}

export function getRelativeTimeLabel(date: Date) {
  const rtf = new Intl.RelativeTimeFormat('ko', { numeric: 'auto' });
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.ceil(diffDays / 7);
  const diffMonths = Math.ceil(diffDays / 30);

  if (Math.abs(diffDays) < 7) {
    return rtf.format(diffDays, 'day');
  } else if (Math.abs(diffWeeks) < 4) {
    return rtf.format(diffWeeks, 'week');
  } else {
    return rtf.format(diffMonths, 'month');
  }
}

export function objectToQueryParam(obj: object) {
  const params = [];

  for (const [key, value] of Object.entries(obj)) {
    if (value === 0 || (value && (!Array.isArray(value) || value.length > 0))) {
      let paramValue;

      if (Array.isArray(value)) {
        paramValue = value.join(',');
      } else if (typeof value === 'object') {
        paramValue = JSON.stringify(value);
      } else {
        paramValue = value;
      }

      params.push(`${encodeURIComponent(key)}=${encodeURIComponent(paramValue)}`);
    }
  }

  return params.length > 0 ? params.join('&') : '';
}
