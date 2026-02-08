import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* ================= TYPES ================= */

export interface User {
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  isActive: boolean;
  lastLoginAt?: Date;
  income: number;
  monthlySpend: number;
  _id :any
}

/* ================= STORE ================= */

interface UserStore {
  user: User | null;

  setUser: (user: User) => void;
  updateUser: (data: Partial<User>) => void;
  clearUser: () => void;
}

/* ================= IMPLEMENTATION ================= */

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,

      // Set full user (login / signup)
      setUser: (user) =>
        set({
          user,
        }),

      // Update partial user fields
      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),

      // Clear user (logout)
      clearUser: () =>
        set({
          user: null,
        }),
    }),
    {
      name: "user-storage", // AsyncStorage key
      storage: createJSONStorage(() => AsyncStorage),

      // Optional: persist only user
      partialize: (state) => ({ user: state.user }),
    }
  )
);
