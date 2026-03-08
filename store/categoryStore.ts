import { create } from "zustand";
import axios from "axios";
import { Alert } from "react-native";
import { baseURL } from "./baseURL";

const baseURLValue = baseURL.nihal;

interface Category {
  _id: string;
  id: string;
  name: string;
  allocated: number;
  spent: number;
  color: string;
  icon: string;
}

interface CategoryStore {
  categories: Category[];
  monthlyIncome: number;
  monthlySpend: number;
  loading: boolean;
  actionLoading: boolean;

  fetchCategories: (userId: string) => Promise<void>;
  addCategory: (userId: string, category: any) => Promise<void>;
  deleteCategory: (userId: string, name: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  monthlyIncome: 0,
  monthlySpend: 0,
  loading: false,
  actionLoading: false,

  /* ================= FETCH ================= */

  fetchCategories: async (userId) => {
    try {
      set({ loading: true });

      const res = await axios.get(`${baseURLValue}/categories/${userId}`);

      if (res.status === 200) { 
        const categories = res.data;

        const totalAllocated = categories.reduce(
          (sum: number, cat: any) => sum + cat.allocated,
          0
        );

        const totalSpent = categories.reduce(
          (sum: number, cat: any) => sum + cat.spent,
          0
        );

        set({
          categories,
          monthlyIncome: totalAllocated,
          monthlySpend: totalSpent,
        });
      }
    } catch (err) {
      Alert.alert("Error", "Failed to fetch categories");
    } finally {
      set({ loading: false });
    }
  },

  /* ================= ADD ================= */

  addCategory: async (userId, categoryData) => {
    try {
      set({ actionLoading: true });

      const res = await axios.post(`${baseURLValue}/category/add`, {
        userId,
        ...categoryData,
      });
      console.log(res.data.data)
      if (res.status === 201) {
        const categories = [...get().categories, res.data.data];

        const totalAllocated = categories.reduce(
          (sum: number, cat: any) => sum + cat.allocated,
          0
        );

        const totalSpent = categories.reduce(
          (sum: number, cat: any) => sum + cat.spent,
          0
        );

        set({
          categories,
          monthlyIncome: totalAllocated,
          monthlySpend: totalSpent,
        });
      }
    } catch (err: any) {
      if (err?.response?.status === 409) {
        Alert.alert("Duplicate", "Category already exists");
      } else {
        Alert.alert("Error", "Could not add category");
      }
    } finally {
      set({ actionLoading: false });
    }
  },

  /* ================= DELETE ================= */

  deleteCategory: async (userId, name) => {
    try {
      set({ actionLoading: true });

      await axios.post(`${baseURLValue}/category/delete`, {
        userId,
        name,
      });

      const categories = get().categories.filter((cat) => cat.name !== name);

      const totalAllocated = categories.reduce(
        (sum: number, cat: any) => sum + cat.allocated,
        0
      );

      const totalSpent = categories.reduce(
        (sum: number, cat: any) => sum + cat.spent,
        0
      );

      set({
        categories,
        monthlyIncome: totalAllocated,
        monthlySpend: totalSpent,
      });
    } catch {
      Alert.alert("Error", "Could not delete category");
    } finally {
      set({ actionLoading: false });
    }
  },
}));