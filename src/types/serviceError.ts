/** 스프링 서버 내부 에러 코드 */
export type ServiceErrorCode = 'custom_error_code_1' | 'custom_error_code_2' | 'no_signed_up_user' | 'no_refresh_token' | 'unknown_error' | 'account_already_exists';

/** 스프링 서버 내부 에러 코드 메시지 */
export const SERVICE_ERROR_MESSAGE: Record<ServiceErrorCode, string> = {
  custom_error_code_1: '먼가 잘못됨 클남1',
  custom_error_code_2: '먼가 잘못됨 클남2',
  no_signed_up_user: '가입한 유저가 아닙니다.',
  no_refresh_token: '리프래시 토큰이 업서요',
  unknown_error: '알 수 없는 오류',
  account_already_exists: '이미 있는 계정ID여유',
};

/** 에러 발생 시 같이 보내주는 응답 */
export type ServiceErrorResponse = {
  errorCode: ServiceErrorCode;
};
