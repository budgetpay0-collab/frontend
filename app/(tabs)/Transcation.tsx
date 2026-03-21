// Transcation.tsx
import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Pressable,
  Modal,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import axios from "axios";

import TopHeadder from "../components/Transaction/TopHeadder";
import Header from "../components/Transaction/Header";
import SearchNdFilter from "../components/Transaction/SearchNdFilter";
import TransactionSummary from "../components/Transaction/TransactionSummary";
import TransactionList from "../components/Transaction/TransactionList";

import { baseURL } from "@/store/baseURL";
import { useUserStore } from "@/store/userStore";
import { useCategoryStore } from "@/store/categoryStore";

const cbaseURL = baseURL.nihal;

const GREEN = "#24C97A";

const Transcation = () => {
  const insets = useSafeAreaInsets();
  const USER = useUserStore((s)=>s.user);
  const USER_ID = USER?._id; // Replace with dynamic user ID
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [successModal, setSuccessModal] = useState<{ visible: boolean; type: "added" | "updated" }>({ visible: false, type: "added" });

  const [transactions, setTransactions] = useState<any[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedSort, setSelectedSort] = useState("Newest first");


  const [amount, setAmount] = useState("");
  const [transactionName, setTransactionName] = useState("");
  const [category, setCategory] = useState("");
  const setHydration = useUserStore((s)=>s.setHydration)
  const hydration = useUserStore((s)=>s.hydration)
  const getCategories = useCategoryStore((s)=>s.fetchCategories)
  const categories = useCategoryStore((s)=>s.categories)  
  /* ================= FETCH TRANSACTIONS ================= */

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(
        `${cbaseURL}/fetch-transactions/${USER_ID}`
      );
      console.log("Fetched transactions", res.data);
      setTransactions(res.data.data || []);
    } catch (err) {
      console.warn("Fetch transaction error", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);




  useEffect(() => {
    if (modalVisible) getCategories(USER_ID);
  }, [modalVisible]);



  const createTransaction = async () => {
    try {
      const response = await axios.post(
        `${cbaseURL}/create-transaction/${USER_ID}`,
        {
          amount: Number(amount),
          transactionName,
          category,
        }
      );

      fetchTransactions();
      getCategories(USER_ID);
      setHydration(!hydration);
      resetModal();
      setSuccessModal({ visible: true, type: "added" });
    } catch (err) {
      console.warn(err);
    }
  };

  /* ================= UPDATE ================= */

  const updateTransaction = async () => {
    if (!selectedId) return;

    try {
      await axios.put(
        `${cbaseURL}/update-transaction/${USER_ID}/${selectedId}`,
        {
          amount: Number(amount),
          transactionName,
          category,
        }
      );

      fetchTransactions();
      getCategories(USER_ID);
      setHydration(!hydration);
      resetModal();
      setSuccessModal({ visible: true, type: "updated" });
    } catch (err) {
      console.warn(err);
    }
  };

  /* ================= DELETE ================= */

  const deleteTransaction = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    const id = deleteConfirmId;
    setDeleteConfirmId(null);
    try {
      await axios.delete(`${cbaseURL}/delete-transaction/${USER_ID}/${id}`);
      fetchTransactions();
    } catch (err) {
      console.warn(err);
    }
  };

  /* ================= EDIT HANDLER ================= */

  const handleEdit = (item: any) => {
    setIsEditing(true);
    setSelectedId(item._id);
    setAmount(String(item.amount));
    setTransactionName(item.transactionName);
    setCategory(item.category);
    setModalVisible(true);
  };

  /* ================= RESET ================= */

  const resetModal = () => {
    setModalVisible(false);
    setIsEditing(false);
    setSelectedId(null);
    setAmount("");
    setTransactionName("");
    setCategory("");
  };

  /* ================= FILTER / SORT ================= */

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((t) =>
        t.transactionName.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "All Categories") {
      result = result.filter((t) => t.category === selectedCategory);
    }

    if (selectedFilter) {
      const now = new Date();
      if (selectedFilter === "This week") {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        result = result.filter(
          (t) => t.createdAt && new Date(t.createdAt) >= weekAgo
        );
      } else if (selectedFilter === "This month") {
        result = result.filter((t) => {
          if (!t.createdAt) return false;
          const d = new Date(t.createdAt);
          return (
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()
          );
        });
      } else if (selectedFilter === "Above ₹500") {
        result = result.filter((t) => Number(t.amount) > 500);
      } else if (selectedFilter === "Below ₹500") {
        result = result.filter((t) => Number(t.amount) < 500);
      }
    }

    if (selectedSort === "Newest first") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
    } else if (selectedSort === "Oldest first") {
      result.sort(
        (a, b) =>
          new Date(a.createdAt || 0).getTime() -
          new Date(b.createdAt || 0).getTime()
      );
    } else if (selectedSort === "Amount high → low") {
      result.sort((a, b) => Number(b.amount) - Number(a.amount));
    } else if (selectedSort === "Amount low → high") {
      result.sort((a, b) => Number(a.amount) - Number(b.amount));
    }

    return result;
  }, [transactions, searchQuery, selectedCategory, selectedFilter, selectedSort]);

  const isFiltered =
    searchQuery.trim() !== "" ||
    selectedCategory !== "All Categories" ||
    selectedFilter !== "" ||
    selectedSort !== "Newest first";

  /* ================= SUMMARY ================= */

  const totalAmount = filteredTransactions.reduce(
    (acc, curr) => acc + Number(curr.amount),
    0
  );

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right"]}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0B0B" />

      <View style={styles.container}>
        <View style={styles.container}>
          <FlatList
            data={transactions}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => null} // we render list inside TransactionList
            ListHeaderComponent={
              <>
                <TopHeadder />
                {/* <Header /> */}
                <SearchNdFilter
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  categoryLabel={selectedCategory}
                  onPickCategory={setSelectedCategory}
                  filterLabel={selectedFilter || "FILTERS"}
                  onPickFilter={setSelectedFilter}
                  sortLabel={selectedSort === "Newest first" ? "SORT" : selectedSort}
                  onPickSort={setSelectedSort}
                />

                <TransactionSummary
                  totalTransactions={filteredTransactions.length}
                  totalAmount={totalAmount}
                  averageAmount={
                    filteredTransactions.length
                      ? totalAmount / filteredTransactions.length
                      : 0
                  }
                />

                <TransactionList
                  data={filteredTransactions}
                  onEdit={handleEdit}
                  onDelete={(item: any) => deleteTransaction(item._id)}
                  isFiltered={isFiltered}
                />

                <View style={styles.btnRow}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => setModalVisible(true)}
                    style={[styles.btnBase, styles.btnSolid]}
                  >
                    <Text style={styles.btnSolidText}>
                      + Add Transaction
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            }
            contentContainerStyle={{
              paddingTop: insets.top,
              paddingBottom: insets.bottom + 22,
            }}
            showsVerticalScrollIndicator={false}
          />
        </View>

      </View>

      {/* ================= ADD / EDIT MODAL ================= */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={resetModal} />

            <View style={styles.modalContainer}>
              {/* Handle bar */}
              <View style={styles.handleBar} />

              {/* Header row */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {isEditing ? "Edit Transaction" : "Add Transaction"}
                </Text>
                <TouchableOpacity onPress={resetModal} style={styles.modalCloseBtn}>
                  <Feather name="x" size={18} color="rgba(255,255,255,0.6)" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalDivider} />

              {/* Transaction Name */}
              <Text style={styles.inputLabel}>Transaction Name</Text>
              <TextInput
                placeholder="e.g. Grocery shopping"
                placeholderTextColor="rgba(255,255,255,0.25)"
                value={transactionName}
                onChangeText={setTransactionName}
                style={styles.modalInput}
              />

              {/* Amount */}
              <Text style={styles.inputLabel}>Amount (₹)</Text>
              <TextInput
                placeholder="0"
                placeholderTextColor="rgba(255,255,255,0.25)"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                style={styles.modalInput}
              />

              {/* Category */}
              <Text style={styles.inputLabel}>Category</Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={categories}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ paddingVertical: 4 }}
                renderItem={({ item }) => {
                  const isSelected = category === item.name;
                  return (
                    <TouchableOpacity
                      onPress={() => setCategory(item.name)}
                      style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
                    >
                      <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected]}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />

              {/* Action button */}
              <TouchableOpacity
                onPress={isEditing ? updateTransaction : createTransaction}
                style={[styles.btnBase, styles.btnSolid, { marginTop: 20, width: "100%" }]}
              >
                <Text style={styles.btnSolidText}>
                  {isEditing ? "Update Transaction" : "Add Transaction"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ================= DELETE CONFIRM MODAL ================= */}
      <Modal visible={deleteConfirmId !== null} transparent animationType="fade">
        <Pressable style={styles.centerOverlay} onPress={() => setDeleteConfirmId(null)}>
          <Pressable style={styles.dialogCard} onPress={(e) => e.stopPropagation()}>
            <View style={[styles.dialogIconWrap, styles.dialogIconRed]}>
              <Feather name="trash-2" size={26} color="#FF5C5C" />
            </View>
            <Text style={styles.dialogTitle}>Delete Transaction</Text>
            <Text style={styles.dialogSubtitle}>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </Text>
            <View style={styles.dialogBtnRow}>
              <TouchableOpacity
                onPress={() => setDeleteConfirmId(null)}
                style={[styles.dialogBtn, styles.dialogBtnOutline]}
              >
                <Text style={styles.dialogBtnOutlineText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmDelete}
                style={[styles.dialogBtn, styles.dialogBtnRed]}
              >
                <Feather name="trash-2" size={15} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.dialogBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ================= SUCCESS MODAL ================= */}
      <Modal visible={successModal.visible} transparent animationType="fade">
        <Pressable style={styles.centerOverlay} onPress={() => setSuccessModal({ visible: false, type: "added" })}>
          <Pressable style={styles.dialogCard} onPress={(e) => e.stopPropagation()}>
            <View style={[styles.dialogIconWrap, styles.dialogIconGreen]}>
              <Feather name="check" size={26} color={GREEN} />
            </View>
            <Text style={styles.dialogTitle}>
              {successModal.type === "added" ? "Transaction Added!" : "Transaction Updated!"}
            </Text>
            <Text style={styles.dialogSubtitle}>
              {successModal.type === "added"
                ? "Your transaction has been recorded successfully."
                : "Your transaction has been updated successfully."}
            </Text>
            <TouchableOpacity
              onPress={() => setSuccessModal({ visible: false, type: "added" })}
              style={[styles.dialogBtn, styles.dialogBtnGreen, { width: "100%" }]}
            >
              <Text style={styles.dialogBtnText}>Done</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default Transcation;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0B0B0B" },
  container: { flex: 1, backgroundColor: "#0B0B0B" },
  content: { gap: 14 },

  btnRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 14,
  },

  btnBase: {
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },

  btnSolid: {
    backgroundColor: GREEN,
  },

  btnSolidText: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
  },


  /* ── Add / Edit bottom sheet ── */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "flex-end",
  },

  modalContainer: {
    backgroundColor: "#131416",
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 99,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignSelf: "center",
    marginBottom: 16,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  modalTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontFamily: "Poppins-SemiBold",
  },

  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.07)",
    alignItems: "center",
    justifyContent: "center",
  },

  modalDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.07)",
    marginBottom: 16,
  },

  inputLabel: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 11,
    fontFamily: "Poppins-SemiBold",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 6,
    marginTop: 14,
  },

  modalInput: {
    backgroundColor: "#1C1E21",
    color: "#FFFFFF",
    padding: 14,
    borderRadius: 12,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: "#1C1E21",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  categoryChipSelected: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },

  categoryText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    fontFamily: "Poppins-SemiBold",
  },

  categoryTextSelected: {
    color: "#000",
  },

  /* ── Centered dialog (delete / success) ── */
  centerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.72)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },

  dialogCard: {
    backgroundColor: "#131416",
    borderRadius: 22,
    padding: 26,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  dialogIconWrap: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    borderWidth: 1,
  },

  dialogIconRed: {
    backgroundColor: "rgba(255,92,92,0.12)",
    borderColor: "rgba(255,92,92,0.22)",
  },

  dialogIconGreen: {
    backgroundColor: "rgba(36,201,122,0.12)",
    borderColor: "rgba(36,201,122,0.22)",
  },

  dialogTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 8,
    textAlign: "center",
  },

  dialogSubtitle: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },

  dialogBtnRow: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },

  dialogBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  dialogBtnOutline: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    backgroundColor: "rgba(255,255,255,0.04)",
  },

  dialogBtnOutlineText: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
  },

  dialogBtnRed: {
    backgroundColor: "#FF5C5C",
  },

  dialogBtnGreen: {
    backgroundColor: GREEN,
  },

  dialogBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
  },
});
