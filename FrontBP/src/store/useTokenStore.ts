import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TokenStoreState {
  token: string | null;
  accountType: string | null;
  mapaCoordinates: [number, number] | null; // Promenjen tip podataka ovde
}

export const useTokenStore = create<TokenStoreState>()(
  persist(
    (_set) => ({
      token: null,
      accountType: null,
      mapaCoordinates: null,
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

export const setmapaCoordinates = (
  mapaCoordinates: [number, number] | null // Promenjen tip podataka ovde
) => useTokenStore.setState((state) => ({ ...state, mapaCoordinates }));

export const removeToken = () =>
  useTokenStore.setState((state) => ({
    ...state,
    token: null,
    userAccountType: null,
  }));
