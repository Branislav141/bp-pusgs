import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TokenStoreState {
  token: string | null;
}

export const useTokenStore = create<TokenStoreState>()(
  persist(
    (_set) => ({
      token: null,
    }),
    {
      name: "token-storage",
    }
  )
);

export const setToken = (token: string | null) =>
  useTokenStore.setState(() => ({ token }));

export const removeToken = () =>
  useTokenStore.setState(() => ({ token: null }));
