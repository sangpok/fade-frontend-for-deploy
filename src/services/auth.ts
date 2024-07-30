import { axios } from '@Libs/axios';
import { AuthTokens } from '@Types/model';

/**
 * 서비스 로직에서 응답 및 오류를 처리하는 방법:
 * axios에서는 200 코드 외에는 전부 throw AxiosError를 던집니다.
 * 이를 핸들링해서 safey하게 처리하는 건 호출부에서 담당합니다.
 *
 * React Query에서는 throw 에러를 처리할 수 있고,
 * 서비스 로직을 직접 호출 시 따로 핸들링이 필요합니다. -> tryCatcher()를 활용
 *
 * 때문에 서비스 로직 내 함수는 axios를 호출하기만 합니다.
 */

type RefreshTokenResponse = AuthTokens;

/** RefreshToken으로 AccessToken을 요청 */
export async function requestRefreshToken() {
  return await axios.post<RefreshTokenResponse>('/auth/token');
}

export const enum SignUpType {
  KAKAO = 'KAKAO',
}

type SignUpPayload = { signUpType: SignUpType; accessToken: string; username: string; gender: string };
type SignUpResponse = AuthTokens;

/** 회원가입 요청 */
export async function requestSignUp(payload: SignUpPayload) {
  return await axios.post<SignUpResponse>(`/auth/social-login/${payload.signUpType}/signup`, {
    socialAccessToken: payload.accessToken,
    username: payload.username,
    genderType: payload.gender,
  });
}

type SignInWithCodePayload = { authorizationCode: string };
type SignInWithCodeReponse = AuthTokens;

/** 인가 코드로 로그인 요청 */
export async function requestSignInWithCode({ authorizationCode }: SignInWithCodePayload) {
  return await axios.post<SignInWithCodeReponse>(`/auth/social-login/KAKAO/signin`, {
    code: authorizationCode,
    redirectUri: import.meta.env.VITE_KAKAO_REDIRECT_URL,
  });
}

/** 로그아웃 요청 */
export async function requestSignOut() {
  return await axios.post<null>(`/auth/signout`);
}
