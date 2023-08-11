import { CurrentUser } from "@/types";
import { create } from "zustand";
import { produce } from "immer";

type AuthState = {
  currentUser: CurrentUser | null;
  setCurrentUser: (user: CurrentUser) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  setCurrentUser: (user) =>
    set(
      produce((state: AuthState) => {
        state.currentUser = user;
      })
    ),
}));
