import React, { use, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Text,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import Header from "../components/Budget/Header";
import GlassEffectBoxes from "../components/Budget/GlassEffectBoxes";
import OverallBudgetProgress from "../components/Budget/OverallBudgetProgress";
import DynamicCategory from "../components/Budget/DynamicCategory";
import { baseURL } from "@/store/baseURL";
import { useUserStore } from "@/store/userStore";
import { useCategoryStore } from "@/store/categoryStore";

const baseURLValue = baseURL.nihal;


const COLORS = [
  "#60A5FA",
  "#F87171",
  "#28F07B",
  "#FBBF24",
  "#A78BFA",
  "#F472B6",
  "#22D3EE",
];

const ICONS = [
  "home-variant",
  "food",
  "car",
  "school",
  "shopping",
  "heart",
  "wallet",
  "account",
  "briefcase",
  "airplane",
];

const Budget = () => {
  
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const user = useUserStore((s) => s.user);
  const userId = user?._id; // Replace with dynamic user ID
  

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [allocated, setAllocated] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);

  /* ================= FETCH ================= */

  const fetchCategories = useCategoryStore((s) => s.fetchCategories);
  const categories = useCategoryStore((s) => s.categories);
  const monthlyIncome = useCategoryStore((s) => s.monthlyIncome);
  const monthlySpend = useCategoryStore((s) => s.monthlySpend);
 const addCategory = useCategoryStore((s) => s.addCategory);
 const handleDeleteCategory = useCategoryStore((s) => s.deleteCategory);
  useEffect(() => {
    fetchCategories(userId);
  }, []);

  /* ================= ADD CATEGORY ================= */

  const handleAddCategory = async () => {
    if (!categoryName || !allocated) {
      Alert.alert("Validation", "Please fill all required fields");
      return;
    }

    try {
      setActionLoading(true);

      const newCategory = {
        id: categoryName.toLowerCase().replace(/\s/g, "-"),
        name: categoryName,
        allocated: Number(allocated),
        spent: 0,
        color: selectedColor,
        icon: selectedIcon,
      };

      await addCategory(userId, newCategory);
      setModalVisible(false);
      resetForm();
    } catch (err: any) {
      if (err?.response?.status === 409) {
        Alert.alert("Duplicate", "Category already exists");
      } else {
        Alert.alert("Error", "Could not add category");
      }
    } finally {
      setActionLoading(false);
    }
  };

  const resetForm = () => {
    setCategoryName("");
    setAllocated("");
    setSelectedColor(COLORS[0]);
    setSelectedIcon(ICONS[0]);
  };

  /* ================= DELETE ================= */

  const deleteCategory = async (name: string) => {
    try {
      setActionLoading(true);

      await handleDeleteCategory(userId, name);     
    } catch {
      Alert.alert("Error", "Could not delete category");
    } finally {
      setActionLoading(false);
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#16C784" />
        </View>
      </SafeAreaView>
    );
  }

  /* ================= UI ================= */

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Header />

          <GlassEffectBoxes
            monthlyAllocated={monthlyIncome}
            monthlySpent={monthlySpend}
          />

          <OverallBudgetProgress
            monthlyAllocated={monthlyIncome}
            monthlySpent={monthlySpend}
          />

          <View style={styles.divider} />

          {categories.length === 0 ? (
            <Text style={styles.emptyText}>No Categories Found</Text>
          ) : (
            <DynamicCategory
              categories={categories}
              onDelete={deleteCategory}
            />
          )}

          <View style={styles.addBtnWrap}>
            <Pressable
              onPress={() => setModalVisible(true)}
              style={({ pressed }) => [
                styles.addBtn,
                pressed && styles.addBtnPressed,
              ]}
            >
              <Text style={styles.addBtnText}>+ Add Categories</Text>
            </Pressable>
          </View>
        </ScrollView>

        {/* ================= MODAL ================= */}

        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <View style={styles.modalOverlay}>
              {/* Dismiss on backdrop tap */}
              <Pressable style={{ flex: 1 }} onPress={() => setModalVisible(false)} />

              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Add Category</Text>

                <TextInput
                  placeholder="Category Name"
                  placeholderTextColor="#999"
                  style={styles.input}
                  value={categoryName}
                  onChangeText={setCategoryName}
                />

                <TextInput
                  placeholder="Allocated Amount"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  style={styles.input}
                  value={allocated}
                  onChangeText={setAllocated}
                />

                <Text style={styles.sectionTitle}>Select Color</Text>
                <View style={styles.colorRow}>
                  {COLORS.map((color) => (
                    <Pressable
                      key={color}
                      onPress={() => setSelectedColor(color)}
                      style={[
                        styles.colorCircle,
                        { backgroundColor: color },
                        selectedColor === color && styles.colorSelected,
                      ]}
                    />
                  ))}
                </View>

                <Text style={styles.sectionTitle}>Select Icon</Text>
                <FlatList
                  horizontal
                  data={ICONS}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => setSelectedIcon(item)}
                      style={[
                        styles.iconWrap,
                        selectedIcon === item && styles.iconSelected,
                      ]}
                    >
                      <MaterialCommunityIcons name={item} size={26} color="white" />
                    </Pressable>
                  )}
                />

                <Pressable onPress={handleAddCategory} style={styles.saveBtn}>
                  {actionLoading ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                    <Text style={styles.saveBtnText}>Save</Text>
                  )}
                </Pressable>

                <Pressable
                  onPress={() => setModalVisible(false)}
                  style={styles.cancelBtn}
                >
                  <Text style={{ color: "#aaa" }}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default Budget;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#101010" },
  container: { flex: 1, backgroundColor: "#101010" },
  scrollContent: { paddingBottom: 22 },
  divider: { backgroundColor: "white", height: 0.5, opacity: 0.2 },
  addBtnWrap: { alignItems: "center", marginTop: 12, paddingVertical: 18 },
  addBtn: {
    backgroundColor: "#16C784",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addBtnPressed: { opacity: 0.9 },
  addBtnText: {
    color: "#06140F",
    fontFamily: "Poppins-SemiBold",
    fontSize: 13.5,
  },
  loaderWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "white", textAlign: "center", marginTop: 20, opacity: 0.6 },

modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.7)",
},
  modalContainer: {
    backgroundColor: "#1B1B1B",
    padding: 20,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  modalTitle: { color: "white", fontSize: 18, marginBottom: 15 },
  input: {
    backgroundColor: "#2A2A2A",
    padding: 12,
    borderRadius: 10,
    color: "white",
    marginBottom: 12,
  },
  sectionTitle: { color: "white", marginVertical: 8 },
  colorRow: { flexDirection: "row", marginBottom: 10 },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  colorSelected: { borderWidth: 2, borderColor: "white" },
  iconWrap: {
    padding: 10,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: "#2A2A2A",
  },
  iconSelected: { borderWidth: 1, borderColor: "#16C784" },
  saveBtn: {
    backgroundColor: "#16C784",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
  },
  saveBtnText: { color: "#000", fontWeight: "bold" },
  cancelBtn: { alignItems: "center", marginTop: 10 },
});
