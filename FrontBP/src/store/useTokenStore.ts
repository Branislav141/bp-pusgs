import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TokenStoreState {
  token: string | null;
  accountType: string | null;
}

export const useTokenStore = create<TokenStoreState>()(
  persist(
    (_set) => ({
      token: null,
      accountType: null,
    }),
    {
      name: "token-storage",
    }
  )
);

export const setToken = (token: string | null) =>
  useTokenStore.setState((state) => ({ ...state, token }));

export const setUserAccountType = (accountType: string | null) =>
  useTokenStore.setState((state) => ({ ...state, accountType }));

export const removeToken = () =>
  useTokenStore.setState((state) => ({
    ...state,
    token: null,
    userAccountType: null,
  }));
