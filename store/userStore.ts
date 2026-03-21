import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

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
  goal?: number;
  _id :any;
  
}

/* ================= STORE ================= */

interface UserStore {
  user: User | null;

  setUser: (user: User) => void;
  updateUser: (data: Partial<User>) => void;
  clearUser: () => void;
  fetchUser: (id: string) => Promise<void>;
  hydration : boolean;
  setHydration : (props :boolean)=>void
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

      // Fetch latest user from server and update store
      fetchUser: async (id: string) => {
        try {
          const { baseURL } = await import("./baseURL");
          
          const response = await axios.get(`${baseURL.nihal}/user/${id}`);
         
          set({ user: response.data });
        } catch {}
      },
        hydration : true,
        setHydration : (props : boolean) =>set({hydration : props})

    }),
    {
      name: "user-storage", // AsyncStorage key
      storage: createJSONStorage(() => AsyncStorage),

      // Optional: persist only user
      partialize: (state) => ({ user: state.user }),
    }
  )
);
