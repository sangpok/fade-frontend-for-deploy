export interface User {
  id: string;
  email: string;
  accountId: string;
  gender?: string;
}

export type AuthTokens = {
  accessToken: string;
  csrfToken: string;
};
