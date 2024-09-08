import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  username: string;
  role: "player" | "creator" | null;
  login: (username: string, role: "player" | "creator") => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      username: "",
      role: null,
      login: (username, role) => set({ username, role }),
      logout: () => set({ username: "", role: null }),
    }),
    { name: "user" }
  )
);
