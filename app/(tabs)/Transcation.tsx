// Transcation.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import TopHeadder from "../components/Transaction/TopHeadder";
import Header from "../components/Transaction/Header";
import SearchNdFilter from "../components/Transaction/SearchNdFilter";
import TransactionSummary from "../components/Transaction/TransactionSummary";
import TransactionList from "../components/Transaction/TransactionList";
import data from '../../store/data.json'

const Transcation = () => {
  const insets = useSafeAreaInsets();

  const onImport = () => {
    // TODO: open import flow
  };

  const onAddTransaction = () => {
    // TODO: navigate to add transaction screen
  };

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right"]}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0B0B" />

      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            {
              paddingTop: insets.top,
              paddingBottom: insets.bottom + 22,
            },
          ]}
        >
          <TopHeadder />
          <Header />
          <SearchNdFilter />
          <TransactionSummary
  totalTransactions={data.totalTransactions}
  totalAmount={data.totalAmount}
  averageAmount={data.averageAmount}
/>
          <TransactionList />

          {/* ✅ Bottom buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onImport}
              style={[styles.btnBase, styles.btnOutline]}
            >
              <Text style={styles.btnOutlineText}>Import</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onAddTransaction}
              style={[styles.btnBase, styles.btnSolid]}
            >
              <Text style={styles.btnSolidText}>+ Add Transaction</Text>
            </TouchableOpacity>
          </View>

          {/* little extra breathing space */}
          <View style={{ height: 6 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Transcation;

const GREEN = "#24C97A";

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0B0B0B",
  },
  container: {
    flex: 1,
    backgroundColor: "#0B0B0B",
  },

  content: {
    // paddingHorizontal: 16,
    gap: 14, // if your RN doesn't support gap, wrap each section with marginBottom
  },

  btnRow: {
    flexDirection: "row",
    gap: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 6,
  },

  btnBase: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  btnOutline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: GREEN,
  },
  btnOutlineText: {
    color: GREEN,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  btnSolid: {
    backgroundColor: GREEN,
  },
  btnSolidText: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
});