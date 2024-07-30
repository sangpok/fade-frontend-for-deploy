import testFashionImage1 from '@Assets/test_fashion_image.jpg';
import testFashionImage10 from '@Assets/test_fashion_image_10.jpg';
import testFashionImage2 from '@Assets/test_fashion_image_2.jpg';
import testFashionImage3 from '@Assets/test_fashion_image_3.jpg';
import testFashionImage4 from '@Assets/test_fashion_image_4.jpg';
import testFashionImage5 from '@Assets/test_fashion_image_5.webp';
import testFashionImage6 from '@Assets/test_fashion_image_6.jpg';
import testFashionImage7 from '@Assets/test_fashion_image_7.jpg';
import testFashionImage8 from '@Assets/test_fashion_image_8.jpg';
import testFashionImage9 from '@Assets/test_fashion_image_9.jpg';

const testFahsionImages = [
  testFashionImage1,
  testFashionImage2,
  testFashionImage3,
  testFashionImage4,
  testFashionImage5,
  testFashionImage6,
  testFashionImage7,
  testFashionImage8,
  testFashionImage9,
  testFashionImage10,
];

import {
  GenderType,
  TAllFashionFeedDTO,
  TBookmarkFeedDTO,
  TFAPArchivingFeedDTO,
  TFeedUserDetail,
  TMyFeedDTO,
  TMyUserDetail,
  TSubscribeFeedDTO,
  TSubscriberDTO,
  TVoteCandidateDTO,
  TVoteHistoryFeedDTO,
} from '@Types/model';
import { addDays, addHours } from 'date-fns';

const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomElements = <T>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
const getRandomGender = (): GenderType => getRandomElement(['MALE', 'FEMALE']);
const getRandomUsername = () => `user${getRandomInt(1000, 9999)}`;

function encodeJWT(payload: TMyUserDetail, secret: string, exp: Date) {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const { introduceContent, ...source } = payload;

  const encodedHeader = btoa(JSON.stringify(header)).replace(/=+$/, '');
  const encodedPayload = btoa(JSON.stringify({ ...source, iat: new Date().toUTCString(), exp })).replace(/=+$/, '');

  const signature = btoa(secret).replace(/=+$/, '');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

const createJWT = (userData: TMyUserDetail, expiresIn: Date) => encodeJWT(userData, 'JWT_SECRET', expiresIn);

export const createAccessToken = (userData: TMyUserDetail) => createJWT(userData, addHours(new Date(), 1));
export const createRefreshToken = (userData: TMyUserDetail) => createJWT(userData, addDays(new Date(), 14));

// 상수
const BRAND_NAMES = ['나이키', '아디다스', '구찌', '샤넬', '루이비통', '프라다', '에르메스', '발렌시아가', '버버리', '카르티에'];
const PRODUCT_DETAILS = [
  '클래식 티셔츠',
  '슬림핏 청바지',
  '오버사이즈 후드티',
  '가죽 재킷',
  '니트 스웨터',
  '플리스 집업',
  '캐주얼 셔츠',
  '롱 원피스',
  '미니스커트',
  '트렌치코트',
  '데님 자켓',
  '카고 팬츠',
  '크롭티',
  '와이드 팬츠',
  '블레이저',
  '슬립 원피스',
  '맨투맨',
  '레깅스',
  '베스트',
  '카디건',
];

// 기본 더미 데이터 생성 함수
const createBaseDummyData = (): Omit<TFAPArchivingFeedDTO, 'isFAPFeed' | 'fapSelectedAt'> => ({
  id: getRandomInt(1, 1000000),
  memberId: getRandomInt(1, 10000),
  imageURL: testFahsionImages[getRandomInt(0, testFahsionImages.length - 1)],
  styleIds: getRandomElements(
    Array.from({ length: 8 }, (_, i) => ({ id: i })),
    getRandomInt(1, 10)
  ),
  outfits: Array.from({ length: getRandomInt(1, 5) }, () => ({
    id: getRandomInt(1, 1000),
    brandName: getRandomElement(BRAND_NAMES),
    details: getRandomElement(PRODUCT_DETAILS),
    categoryId: getRandomInt(0, 7),
  })),
  createdAt: new Date(Date.now() - getRandomInt(0, 30 * 24 * 60 * 60 * 1000)),
  username: `user${getRandomInt(1, 1000)}`,
  profileImageURL: testFahsionImages[getRandomInt(0, testFahsionImages.length - 1)],
  isSubscribed: Math.random() < 0.5,
  isBookmarked: Math.random() < 0.5,
  isMine: Math.random() < 0.1,
  votedAt: Math.random() < 0.7 ? new Date(Date.now() - getRandomInt(0, 7 * 24 * 60 * 60 * 1000)) : undefined,
});

// TVoteCandidateDTO 더미 데이터 생성 함수
export const createVoteCandidateDTODummies = (count: number): TVoteCandidateDTO[] =>
  Array.from({ length: count }, () => {
    const baseData = createBaseDummyData();
    //@ts-expect-error 쓰지 않는 변수
    const { styleIds, isFAPFeed, isMine, ...voteCandidateData } = baseData;
    return voteCandidateData;
  });

// TFAPArchivingFeedDTO 더미 데이터 생성 함수
export const createFAPArchivingFeedDTODummies = (baseDate: Date): TFAPArchivingFeedDTO[] => {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dummies: TFAPArchivingFeedDTO[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    if (Math.random() < 0.1) continue; // 10% 확률로 해당 일의 데이터 생략

    const baseData = createBaseDummyData();

    const additionalData = baseData.isMine
      ? {
          fadeInCount: getRandomInt(0, 1000),
          bookmarkCount: getRandomInt(0, 500),
          reportCount: getRandomInt(0, 50),
        }
      : {};

    const dummy: TFAPArchivingFeedDTO = {
      ...baseData,
      ...additionalData,
      isFAPFeed: true,
      fapSelectedAt: new Date(year, month, day),
    };
    dummies.push(dummy);
  }

  return dummies.toSorted((a, b) => a.fapSelectedAt.getDate() - b.fapSelectedAt.getDate());
};

// TAllFashionFeedDTO 더미 데이터 생성 함수
export const createAllFashionFeedDTODummies = (count: number): TAllFashionFeedDTO[] =>
  Array.from({ length: count }, () => {
    const baseData = createBaseDummyData();

    const additionalData = baseData.isMine
      ? {
          fadeInCount: getRandomInt(0, 1000),
          bookmarkCount: getRandomInt(0, 500),
          reportCount: getRandomInt(0, 50),
        }
      : {};

    return {
      ...baseData,
      ...additionalData,
      isFAPFeed: Math.random() < 0.2, // 20% 확률로 FAP 피드
    };
  });

// TMyFeedDTO 더미 데이터 생성 함수
export const createMyFeedDTODummies = (count: number): TMyFeedDTO[] =>
  Array.from({ length: count }, () => ({
    ...createBaseDummyData(),
    isMine: true,
    isSubscribed: false,
    isFAPFeed: Math.random() < 0.2, // 20% 확률로 FAP 피드
    fadeInCount: getRandomInt(0, 1000),
    bookmarkCount: getRandomInt(0, 500),
    reportCount: getRandomInt(0, 50),
  }));

// TVoteHistoryFeedDTO 더미 데이터 생성 함수
export const createVoteHistoryFeedDTODummies = (count: number): TVoteHistoryFeedDTO[] =>
  Array.from({ length: count }, () => ({
    ...createBaseDummyData(),
    isFAPFeed: Math.random() < 0.2, // 20% 확률로 FAP 피드
    voteType: Math.random() < 0.5 ? 'FADE_IN' : 'FADE_OUT',
    votedAt: new Date(Date.now() - getRandomInt(0, 30 * 24 * 60 * 60 * 1000)),
  }));

// TSubscribeFeedDTO 더미 데이터 생성 함수
export const createSubscribeFeedDTODummies = (count: number): TSubscribeFeedDTO[] =>
  Array.from({ length: count }, () => {
    const baseData = createBaseDummyData();
    //@ts-expect-error 쓰지 않는 변수
    const { isFAPFeed, isMine, isSubscribed, ...subscribeFeed } = baseData;

    return {
      ...subscribeFeed,
      isMine: false,
      isSubscribed: true,
      isFAPFeed: Math.random() < 0.2,
    };
  });

// TBookmarkFeedDTO 더미 데이터 생성 함수
export const createBookmarkFeedDTODummies = (count: number): TBookmarkFeedDTO[] =>
  Array.from({ length: count }, () => {
    const baseData = createBaseDummyData();

    return {
      ...baseData,
      isBookmarked: true,
      isFAPFeed: Math.random() < 0.2,
    };
  });

// TMyUserDetail 더미 데이터 생성 함수
export const createMyUserDetailDummies = (count: number): TMyUserDetail[] =>
  Array.from({ length: count }, () => ({
    id: getRandomInt(1, 10000),
    username: getRandomUsername(),
    profileImageURL: testFahsionImages[getRandomInt(0, testFahsionImages.length - 1)],
    genderType: getRandomGender(),
    subscribedCount: getRandomInt(0, 1000),
    introduceContent: `안녕하세요. ${getRandomUsername()}입니다. 패션에 관심이 많습니다.`,
    fapSelectedCount: getRandomInt(0, 50),
  }));

// TFeedUserDetail 더미 데이터 생성 함수
export const createFeedUserDetailDummies = (count: number): TFeedUserDetail[] =>
  Array.from({ length: count }, () => ({
    id: getRandomInt(1, 10000),
    username: getRandomUsername(),
    profileImageURL: testFahsionImages[getRandomInt(0, testFahsionImages.length - 1)],
    genderType: getRandomGender(),
    subscribedCount: getRandomInt(0, 1000),
    introduceContent: `패션 좋아하는 ${getRandomUsername()}입니다. 팔로우 해주세요!`,
    isSubscribed: Math.random() < 0.5,
  }));

// TSubscriberDTO 더미 데이터 생성 함수
export const createSubscriberDTODummies = (count: number): TSubscriberDTO[] =>
  Array.from({ length: count }, () => ({
    id: getRandomInt(1, 10000),
    username: getRandomUsername(),
    profileImageURL: testFahsionImages[getRandomInt(0, testFahsionImages.length - 1)],
  }));
