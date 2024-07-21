import { User } from '@Types/User';
import { getPayloadFromJWT } from '@Utils/index';
import { create } from 'zustand';

export type AuthStore = {
  user: User | null;
  accessToken: string | null;
  csrfToken: string | null;
  iat: Date | null;
  exp: Date | null;

  setUser: ({ user }: { user: User }) => void;
  setAccessToken: ({ accessToken }: { accessToken: string }) => void;
  setCSRFToken: ({ csrfToken }: { csrfToken: string }) => void;
  setTokens: ({ accessToken, csrfToken }: { accessToken: string; csrfToken: string }) => void;
  setAuthFromToken: ({ accessToken }: { accessToken: string }) => void;

  resetAuth: () => void;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
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

  setAuthFromToken({ accessToken }) {
    const { accountId, email, exp, iat, id } = getPayloadFromJWT(accessToken);

    const newUser = { id, email, accountId };
    set({ user: newUser, exp, iat });
  },

  resetAuth() {
    set({ user: null, accessToken: null, csrfToken: null, iat: null, exp: null });
  },
}));
