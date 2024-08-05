const testFashionImage1 = '/assets/test_fashion_image.jpg';

import { TMyUserDetail, TVoteCandidateDTO } from '@Types/model';
import { ServiceErrorResponse } from '@Types/serviceError';
import { generateRandomId } from '@Utils/index';
import { HttpStatusCode } from 'axios';
import { addDays, isBefore, subDays } from 'date-fns';
import { HttpResponse, delay, http } from 'msw';
import {
  createAccessToken,
  createAllFashionFeedDTODummies,
  createBookmarkFeedDTODummies,
  createFAPArchivingFeedDTODummies,
  createFeedUserDetailDummies,
  createMyUserDetailDummies,
  createNotificationDummies,
  createRefreshToken,
  createSubscribeFeedDTODummies,
  createSubscriberDTODummies,
  createVoteCandidateDTODummies,
  createVoteHistoryFeedDTODummies,
} from './_utils';

const NETWORK_DELAY = 1000;
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const userData: TMyUserDetail = {
  id: 0,
  username: 'fade_1234',
  genderType: 'MALE',
  profileImageURL: testFashionImage1,
  introduceContent: '안녕',
  selectedFAPCount: 0,
  subscribedCount: 0,
};

export const handlers = [
  /**
   * MSW는 fetch 정책 상 Header에 Set-Cookie를 지정해주는 대신
   * document.cookie로 지정해주기 때문에, HttpOnly 속성을 넣으면 안 된다(😇)
   */
  http.post(`${BASE_URL}/auth/token`, async ({ request }) => {
    // const { refreshToken } = cookies;
    const { refreshToken } = (await request.json()) as { refreshToken: string };

    await delay(NETWORK_DELAY);
    /**
     * Case 1: Request with no Refresh Token
     * : 서비스를 처음 들어온 경우
     * */
    if (refreshToken === undefined) {
      return new HttpResponse(
        JSON.stringify({
          statusCode: HttpStatusCode.Unauthorized,
          message: '토큰이 존재하지 않습니다.',
          result: {
            errorCode: 'TOKEN_NOT_EXIST',
            data: null,
          },
        } as ServiceErrorResponse),
        { status: HttpStatusCode.Unauthorized }
      );
    }

    /**
     * Case 2: Request with Refresh Token
     * (1) 이전에 로그인 한 적 있고, 다시 재접속을 한 경우
     * (2) Access Token의 만료기간이 임박해서 호출한 경우
     * (3) Access Token의 만료기간이 지나서 호출한 경우
     * */
    return new HttpResponse(
      JSON.stringify({
        accessToken: createAccessToken(userData),
        refreshToken: createRefreshToken(userData),
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `refreshToken=${createRefreshToken(userData)}; Path=/; expires=${addDays(new Date(), 14).toUTCString()};`,
        },
      }
    );
  }),

  http.get(`${BASE_URL}/auth/signout`, async () => {
    await delay(NETWORK_DELAY);

    return new HttpResponse(null, {
      headers: {
        'Set-Cookie': `refreshToken=; Path=/; expires=${new Date(0).toUTCString()};`,
      },
    });
  }),

  http.post(`${BASE_URL}/auth/social-login/KAKAO/signup`, async ({ request }) => {
    await delay(NETWORK_DELAY);

    const requestPayload = (await request.json()) as { username: string };
    const alreadyExistUsername = requestPayload.username === 'asdf';

    if (alreadyExistUsername) {
      return HttpResponse.json(
        {
          statusCode: HttpStatusCode.Unauthorized,
          message: '',
          result: {
            errorCode: 'ALREADY_EXIST_MEMBER_ID',
            data: null,
          },
        } as ServiceErrorResponse,
        {
          status: HttpStatusCode.Unauthorized,
        }
      );
    }

    return new HttpResponse(
      JSON.stringify({
        accessToken: createAccessToken(userData),
        refreshToken: createRefreshToken(userData),
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `refreshToken=${createRefreshToken(userData)}; Path=/; expires=${addDays(new Date(), 14).toUTCString()};`,
        },
      }
    );
  }),

  http.post(`${BASE_URL}/auth/social-login/KAKAO/signin`, async () => {
    await delay(NETWORK_DELAY);
    const isSignedUpUser = false;

    if (isSignedUpUser) {
      return new HttpResponse(
        JSON.stringify({
          accessToken: createAccessToken(userData),
          refreshToken: createRefreshToken(userData),
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': `refreshToken=${createRefreshToken(userData)}; Path=/; expires=${addDays(new Date(), 14).toUTCString()};`,
          },
        }
      );
    }

    return HttpResponse.json(
      {
        statusCode: HttpStatusCode.Unauthorized,
        message: '',
        result: {
          errorCode: 'NOT_MATCH_SOCIAL_MEMBER',
          data: { socialAccessToken: createAccessToken(userData) },
        },
      } as ServiceErrorResponse<'NOT_MATCH_SOCIAL_MEMBER'>,
      {
        status: HttpStatusCode.Unauthorized,
      }
    );
  }),

  http.post(`${BASE_URL}/attachments/presign-url`, async ({ request }) => {
    await delay(NETWORK_DELAY);
    const { checksum } = (await request.json()) as { checksum: string };

    // 중복 사진이라면
    if (checksum === '1966ae1427bee21403a89a9565de6695532538459a3f7434280b7c863b901c41') {
      return HttpResponse.json(
        {
          statusCode: HttpStatusCode.Conflict,
          message: '이미 동일한 이미지로 업로드된 파일이 존재합니다.',
          result: {
            errorCode: 'ALREADY_EXISTS_ATTACHMENT',
            data: null,
          },
        } as ServiceErrorResponse,
        {
          status: HttpStatusCode.Conflict,
        }
      );
    }

    return HttpResponse.json({ presignURL: 'https://TEST_URL.com', attachmentId: 0 }, { status: HttpStatusCode.Ok });
  }),

  /** S3 Presigned URL */
  http.put(`https://test_url.com`, async () => {
    await delay(NETWORK_DELAY);
    return new HttpResponse('', { status: HttpStatusCode.Ok });
  }),

  http.post(`${BASE_URL}/feeds`, async () => {
    await delay(NETWORK_DELAY);
    const wouldCauseError = false;

    /** FEED_UPDATE_DENIED인데... 일어날 리가? */
    if (wouldCauseError) {
      return HttpResponse.json(
        {
          statusCode: HttpStatusCode.Forbidden,
          message: '게시글 수정 권한이 없습니다.',
          result: {
            errorCode: 'FEED_UPDATE_DENIED',
            data: null,
          },
        } as ServiceErrorResponse<'FEED_UPDATE_DENIED'>,
        {
          status: HttpStatusCode.Forbidden,
        }
      );
    }

    return HttpResponse.json({ feedId: 0 }, { status: HttpStatusCode.Ok });
  }),

  http.get(`${BASE_URL}/vote/candidates`, async () => {
    await delay(NETWORK_DELAY);

    return HttpResponse.json({ feeds: createVoteCandidateDTODummies(10) }, { status: HttpStatusCode.Ok });
  }),

  http.post(`${BASE_URL}/vote/candidates`, async () => {
    await delay(NETWORK_DELAY);

    return new HttpResponse('', { status: HttpStatusCode.Ok });
  }),

  http.post(`${BASE_URL}/subscribe/:toMemberId`, async () => {
    await delay(NETWORK_DELAY);

    return new HttpResponse('', { status: HttpStatusCode.Ok });
  }),

  http.delete(`${BASE_URL}/subscribe/:toMemberId`, async () => {
    await delay(NETWORK_DELAY);

    return new HttpResponse('', { status: HttpStatusCode.Ok });
  }),

  http.post(`${BASE_URL}/bookmark/:feedId`, async () => {
    await delay(NETWORK_DELAY);

    return new HttpResponse('', { status: HttpStatusCode.Ok });
  }),

  http.delete(`${BASE_URL}/bookmark/:feedId`, async () => {
    await delay(NETWORK_DELAY);

    return new HttpResponse('', { status: HttpStatusCode.Ok });
  }),

  http.get(`${BASE_URL}/archiving`, async ({ request }) => {
    const { searchParams } = new URL(request.url);
    const selectedDate = searchParams.get('selectedDate')!;

    await delay(NETWORK_DELAY);

    const feeds = createFAPArchivingFeedDTODummies(new Date(selectedDate));

    return HttpResponse.json({ feeds }, { status: HttpStatusCode.Ok });
  }),

  http.get(`${BASE_URL}/feeds`, async ({ request }) => {
    const { searchParams } = new URL(request.url);
    const fetchingType = searchParams.get('fetchingType')!;
    const limit = searchParams.get('limit') || '12';

    await delay(NETWORK_DELAY);

    if (fetchingType === 'SUBSCRIBE') {
      return HttpResponse.json({ feeds: createSubscribeFeedDTODummies(12), nextCursor: generateRandomId() }, { status: HttpStatusCode.Ok });
    }

    if (fetchingType === 'BOOKMARK') {
      return HttpResponse.json({ feeds: createBookmarkFeedDTODummies(12), nextCursor: generateRandomId() }, { status: HttpStatusCode.Ok });
    }

    return HttpResponse.json({ feeds: createAllFashionFeedDTODummies(+limit), nextCursor: generateRandomId() }, { status: HttpStatusCode.Ok });
  }),

  http.get(`${BASE_URL}/feeds/:feedId`, async () => {
    return HttpResponse.json(...createAllFashionFeedDTODummies(1), { status: HttpStatusCode.Ok });
  }),

  http.delete(`${BASE_URL}/feeds/:feedId`, async () => {
    return HttpResponse.json({}, { status: HttpStatusCode.Ok });
  }),

  http.patch(`${BASE_URL}/feeds/:feedId`, async () => {
    return HttpResponse.json({}, { status: HttpStatusCode.Ok });
  }),

  http.get(`${BASE_URL}/subscribe/subscribers`, async () => {
    // const { searchParams } = new URL(request.url);

    await delay(NETWORK_DELAY);

    const subscribers = createSubscriberDTODummies(12);

    return HttpResponse.json({ subscribers, nextCursor: generateRandomId(), totalSubscribers: 100 }, { status: HttpStatusCode.Ok });
  }),

  http.get(`${BASE_URL}/members/me`, async () => {
    await delay(NETWORK_DELAY);

    return HttpResponse.json(createMyUserDetailDummies(1)[0], { status: HttpStatusCode.Ok });
  }),

  http.patch(`${BASE_URL}/members/me`, async () => {
    await delay(NETWORK_DELAY);

    return HttpResponse.json({}, { status: HttpStatusCode.Ok });
  }),

  http.get(`${BASE_URL}/members/search`, async () => {
    await delay(NETWORK_DELAY);

    return HttpResponse.json({ matchedMembers: createMyUserDetailDummies(5) }, { status: HttpStatusCode.Ok });
  }),

  http.get(`${BASE_URL}/members/:memberId`, async () => {
    await delay(NETWORK_DELAY);

    return HttpResponse.json(createFeedUserDetailDummies(1)[0], { status: HttpStatusCode.Ok });
  }),

  http.get(`${BASE_URL}/vote/history`, async ({ request }) => {
    await delay(NETWORK_DELAY);

    const { searchParams } = new URL(request.url);
    // const limit = +(searchParams.get('limit') || 3);
    const scrollType = searchParams.get('scrollType');
    const baseDate = new Date(searchParams.get('nextCursor') || new Date());

    let dummies = null;

    if (scrollType === '0') {
      dummies = [
        ...createVoteHistoryFeedDTODummies(10, baseDate),
        ...createVoteHistoryFeedDTODummies(10, subDays(baseDate, 1)),
        ...createVoteHistoryFeedDTODummies(10, subDays(baseDate, 2)),
      ];
      console.log(dummies);
    }

    if (scrollType === '1') {
      dummies = [
        ...createVoteHistoryFeedDTODummies(10, addDays(baseDate, 2)),
        ...createVoteHistoryFeedDTODummies(10, addDays(baseDate, 1)),
        ...createVoteHistoryFeedDTODummies(10, baseDate),
      ];
    }

    if (scrollType === '2') {
      dummies = [
        ...createVoteHistoryFeedDTODummies(10, subDays(baseDate, 3)),
        ...createVoteHistoryFeedDTODummies(10, subDays(baseDate, 2)),
        ...createVoteHistoryFeedDTODummies(10, subDays(baseDate, 1)),
        ...createVoteHistoryFeedDTODummies(10, baseDate),
        ...createVoteHistoryFeedDTODummies(10, addDays(baseDate, 1)),
        ...createVoteHistoryFeedDTODummies(10, addDays(baseDate, 2)),
        ...createVoteHistoryFeedDTODummies(10, addDays(baseDate, 3)),
      ] as TVoteCandidateDTO[];
    }

    dummies!.sort(({ votedAt: a }, { votedAt: b }) => (isBefore(a!, b!) ? 1 : -1));

    const result = {
      feeds: dummies,
      nextCursorToUpScroll: scrollType === '0' ? null : dummies!.at(0)!.votedAt,
      nextCursorToDownScroll: scrollType === '1' ? null : dummies!.at(-1)!.votedAt,
      direction: scrollType,
    };

    return HttpResponse.json(result, { status: HttpStatusCode.Ok });
  }),

  http.get(`${BASE_URL}/notifications`, async () => {
    await delay(NETWORK_DELAY);

    return HttpResponse.json({ nextCursor: generateRandomId(), notifications: createNotificationDummies(10) }, { status: HttpStatusCode.Ok });
  }),

  http.post(`${BASE_URL}/notifications/read`, async () => {
    await delay(NETWORK_DELAY);

    return HttpResponse.json({}, { status: HttpStatusCode.Ok });
  }),

  http.post(`${BASE_URL}/reports`, async () => {
    await delay(NETWORK_DELAY);

    return HttpResponse.json({}, { status: HttpStatusCode.Ok });
  }),
];
