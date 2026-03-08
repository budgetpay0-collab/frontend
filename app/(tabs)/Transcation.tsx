// Transcation.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
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

  const [transactions, setTransactions] = useState<any[]>([]);


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

      Alert.alert("Success", "Transaction Added");
      fetchTransactions();
      getCategories(USER_ID)
      setHydration(!hydration)
      resetModal();
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

      Alert.alert("Success", "Transaction Updated");
      fetchTransactions();
      getCategories(USER_ID)
      setHydration(!hydration)
      resetModal();
    } catch (err) {
      console.warn(err);
    }
  };

  /* ================= DELETE ================= */

  const deleteTransaction = async (id: string) => {
    Alert.alert("Delete", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Yes",
        onPress: async () => {
          try {
            await axios.delete(
              `${cbaseURL}/delete-transaction/${USER_ID}/${id}`
            );
            fetchTransactions();
          } catch (err) {
            console.warn(err);
          }
        },
      },
    ]);
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

  /* ================= SUMMARY ================= */

  const totalAmount = transactions.reduce(
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
                <SearchNdFilter />

                <TransactionSummary
                  totalTransactions={transactions.length}
                  totalAmount={totalAmount}
                  averageAmount={
                    transactions.length
                      ? totalAmount / transactions.length
                      : 0
                  }
                />

                <TransactionList
                  data={transactions}
                  onEdit={handleEdit}
                  onDelete={(item: any) => deleteTransaction(item._id)}
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

      {/* ================= MODAL ================= */}

      {/* <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={resetModal}
            style={styles.modalOverlay}
          >
            <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>
                  {isEditing ? "Edit Transaction" : "Add Transaction"}
                </Text>

                <TextInput
                  placeholder="Transaction Name"
                  placeholderTextColor="#777"
                  value={transactionName}
                  onChangeText={setTransactionName}
                  style={styles.modalInput}
                />

                <TextInput
                  placeholder="Amount"
                  placeholderTextColor="#777"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                  style={styles.modalInput}
                />

                <Text style={{ color: "white", marginTop: 12 }}>
                  Select Category
                </Text>

                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={categories}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => {
                    const isSelected = category === item.name;

                    return (
                      <TouchableOpacity
                        onPress={() => setCategory(item.name)}
                        style={[
                          styles.categoryChip,
                          isSelected && styles.categoryChipSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.categoryText,
                            isSelected && styles.categoryTextSelected,
                          ]}
                        >
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />

                <TouchableOpacity
                  onPress={
                    isEditing
                      ? updateTransaction
                      : createTransaction
                  }
                  style={[
                    styles.btnBase,
                    styles.btnSolid,
                    { marginTop: 18, width: "100%" },
                  ]}
                >
                  <Text style={styles.btnSolidText}>
                    {isEditing ? "Update" : "Save"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={resetModal}
                  style={{ marginTop: 12, alignSelf: "center" }}
                >
                  <Text style={{ color: "#aaa" }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal> */}
      <Modal visible={modalVisible} transparent animationType="slide">
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{ flex: 1 }}
  >
    <View style={styles.modalOverlay}>
      {/* Dismiss area */}
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={1}
        onPress={resetModal}
      />

      {/* Modal content — sibling, not child of dismiss area */}
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>
          {isEditing ? "Edit Transaction" : "Add Transaction"}
        </Text>

        <TextInput
          placeholder="Transaction Name"
          placeholderTextColor="#777"
          value={transactionName}
          onChangeText={setTransactionName}
          style={styles.modalInput}
        />

        <TextInput
          placeholder="Amount"
          placeholderTextColor="#777"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          style={styles.modalInput}
        />

        <Text style={{ color: "white", marginTop: 12 }}>
          Select Category
        </Text>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            const isSelected = category === item.name;
            return (
              <TouchableOpacity
                onPress={() => setCategory(item.name)}
                style={[
                  styles.categoryChip,
                  isSelected && styles.categoryChipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextSelected,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        <TouchableOpacity
          onPress={isEditing ? updateTransaction : createTransaction}
          style={[styles.btnBase, styles.btnSolid, { marginTop: 18, width: "100%" }]}
        >
          <Text style={styles.btnSolidText}>
            {isEditing ? "Update" : "Save"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={resetModal}
          style={{ marginTop: 12, alignSelf: "center" }}
        >
          <Text style={{ color: "#aaa" }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </KeyboardAvoidingView>
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


  modalOverlay: {
  flex: 1,
  backgroundColor: "#00000099",
  justifyContent: "flex-end", // keep this

  },

  modalContainer: {
    backgroundColor: "#111",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  modalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },

  modalInput: {
    backgroundColor: "#1A1A1A",
    color: "white",
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
  },

  categoryChip: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: "#1A1A1A",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#333",
  },

  categoryChipSelected: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },

  categoryText: {
    color: "white",
    fontWeight: "600",
  },

  categoryTextSelected: {
    color: "#000",
  },
});
