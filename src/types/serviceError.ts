import { HttpStatusCode } from 'axios';

/**
 * 서비스 내 핸들링하는 에러는 ServiceErrorCode에 해당함.
 * API가 실패한다면 ServiceErrorResponse 응답을 반환함.
 *
 * 이때, ErrorCodeDataMap에 존재하는 errorCode라면 data를 반환하고, 해당 data 타입을 특정시켜줌.
 * 존재하지 않은 data는 null로 반환.
 *
 * isErrorWithData()는 이를 타입가드하는 함수.
 */

/** 스프링 서버 내부 에러 코드 */
export type TokenErrorCode = 'TOKEN_SIGNATURE_ERROR' | 'TOKEN_EXPIRED_ERROR' | 'TOKEN_NOT_EXIST';
export type MemberErrorCode = 'MEMBER_NOT_FOUND' | 'ALREADY_EXIST_MEMBER_ID' | 'ALREADY_EXIST_MEMBER' | 'INVALID_MEMBER_ID_AND_PASSWORD';
export type FeedErrorCode = 'NOT_FOUND_FEED' | 'FEED_UPDATE_DENIED' | 'FEED_DELETE_DENIED';
export type VoteErrorCode = 'DUPLICATE_VOTE_ERROR';
export type SocialLoginErrorCode = 'NOT_MATCH_SOCIAL_MEMBER' | 'SIGN_IN_WITH_RESIGNED_MEMBER';
export type AttachmentErrorCode = 'ALREADY_EXISTS_ATTACHMENT' | 'NOT_FOUND_ATTACHMENT';
export type CategoryErrorCode = 'NOT_FOUND_CATEGORY';
export type StyleErrorCode = 'NOT_FOUND_STYLE';

export type ServiceErrorCode =
  | TokenErrorCode
  | MemberErrorCode
  | FeedErrorCode
  | VoteErrorCode
  | SocialLoginErrorCode
  | AttachmentErrorCode
  | CategoryErrorCode
  | StyleErrorCode;

type ErrorCodeDataMap = {
  NOT_MATCH_SOCIAL_MEMBER: { socialAccessToken: string };
};

type ErrorData<T extends ServiceErrorCode> = T extends keyof ErrorCodeDataMap ? ErrorCodeDataMap[T] : null;

/** 에러 발생 시 보내주는 응답 */
export type ServiceErrorResponse<T extends ServiceErrorCode = ServiceErrorCode> = {
  statusCode: HttpStatusCode;
  message: string;
  result: {
    errorCode: T;
    data: ErrorData<T>;
  };
};

/** 타입 가드 함수 */
export function isErrorWithData<T extends keyof ErrorCodeDataMap>(
  result: ServiceErrorResponse['result'],
  errorCode: T
): result is { errorCode: T; data: ErrorCodeDataMap[T] } {
  return result.errorCode === errorCode;
}

/**
  //TOKEN
  TOKEN_SIGNATURE_ERROR(HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰 입니다."),
  TOKEN_EXPIRED_ERROR(HttpStatus.UNAUTHORIZED, "토큰이 만료 되었습니다."),
  TOKEN_NOT_EXIST(HttpStatus.UNAUTHORIZED, "토큰이 존재하지 않습니다."),

  //MEMBER
  MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "회원 정보를 찾을 수 없습니다."),
  ALREADY_EXIST_MEMBER_ID(HttpStatus.CONFLICT, "이미 사용중인 아이디입니다."),
  ALREADY_EXIST_MEMBER(HttpStatus.CONFLICT, "이미 존재하는 사용자입니다."),
  INVALID_MEMBER_ID_AND_PASSWORD(HttpStatus.BAD_REQUEST, "아이디 혹은 비밀번호를 확인해주세요."),

  //FEED
  NOT_FOUND_FEED(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다."),
  FEED_UPDATE_DENIED(HttpStatus.FORBIDDEN, "게시글 수정 권한이 없습니다."),
  FEED_DELETE_DENIED(HttpStatus.FORBIDDEN, "게시글 삭제 권한이 없습니다."),

  //VOTE
  DUPLICATE_VOTE_ERROR(HttpStatus.BAD_REQUEST, "중복된 투표입니다."),

  //SOCIAL LOGIN
  NOT_MATCH_SOCIAL_MEMBER(HttpStatus.UNAUTHORIZED, ""),

  //ATTACHMENT
  ALREADY_EXISTS_ATTACHMENT(HttpStatus.CONFLICT, "이미 동일한 이미지로 업로드된 파일이 존재합니다."),
  NOT_FOUND_ATTACHMENT(HttpStatus.NOT_FOUND, "존재하지 않는 파일입니다."),

  //CATEGORY
  NOT_FOUND_CATEGORY(HttpStatus.NOT_FOUND, "카테고리 정보를 찾을 수 없습니다."),

  //STYLE
  NOT_FOUND_STYLE(HttpStatus.NOT_FOUND, "스타일 정보를 찾을 수 없습니다.")
 */
