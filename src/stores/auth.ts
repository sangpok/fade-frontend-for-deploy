import { TUserDetail } from '@Types/model';
import { getPayloadFromJWT } from '@Utils/index';
import { create } from 'zustand';

export type AuthStore = {
  user: TUserDetail;
  accessToken: string | null;
  csrfToken: string | null;
  iat: Date | null;
  exp: Date | null;
  isAuthentication: boolean;

  setUser: ({ user }: { user: TUserDetail }) => void;
  setAccessToken: ({ accessToken }: { accessToken: string }) => void;
  setCSRFToken: ({ csrfToken }: { csrfToken: string }) => void;
  setTokens: ({ accessToken, csrfToken }: { accessToken: string; csrfToken: string }) => void;
  setIsAuthentication: ({ isAuthentication }: { isAuthentication: boolean }) => void;
  setAuthFromToken: ({ accessToken }: { accessToken: string }) => void;

  resetAuth: () => void;
};

const initialUserDetail: TUserDetail = {
  id: -1,
  username: '',
  genderType: 'MALE',
  profileImageURL: undefined,
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: initialUserDetail,
  accessToken: null,
  csrfToken: null,
  iat: null,
  exp: null,
  isAuthentication: false,

  setUser({ user }) {
    set({ user });
  },

  setAccessToken({ accessToken }) {
    set({ accessToken });
  },

  setCSRFToken({ csrfToken }) {
    set({ csrfToken });
  },

  setTokens({ accessToken, csrfToken }) {
    get().setAccessToken({ accessToken });
    get().setCSRFToken({ csrfToken });
  },

  setIsAuthentication({ isAuthentication }) {
    set({ isAuthentication });
  },

  setAuthFromToken({ accessToken }) {
    const { id, username, genderType, exp, iat } = getPayloadFromJWT(accessToken);

    const newUser: Partial<TUserDetail> = { id: +id, username, genderType };
    set(({ user }) => ({
      isAuthentication: true,
      user: { ...user, ...newUser },
      exp,
      iat,
    }));
  },

  resetAuth() {
    set({ user: initialUserDetail, isAuthentication: false, accessToken: null, csrfToken: null, iat: null, exp: null });
  },
}));
