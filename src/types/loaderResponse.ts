/**
 * React Router Dom의 Loader는 첫 라우팅 단계에서 호출된다.
 * 오류가 났을 때, errorElement가 렌더링되는 것이 기본.
 * errorElement는 해당 컴포넌트 대신 렌더링되는 것이므로,
 * UI 내에서 에러를 처리한다면 Safey하게 데이터로 넘겨줘야 한다.
 * 이를 위한 LoaderResponse이다.
 */

import { ServiceErrorResponse } from './serviceError';

export const enum LoaderResponseStatus {
  'SUCCESS' = 'success',
  'ERROR' = 'error',
}

export type SuccessLoaderResponse<T> = {
  status: LoaderResponseStatus.SUCCESS;
  payload: T;
};

export type ErrorLoaderResponse = {
  status: LoaderResponseStatus.ERROR;
  payload: ServiceErrorResponse;
};

export type LoaderResponse<T> = SuccessLoaderResponse<T> | ErrorLoaderResponse;
