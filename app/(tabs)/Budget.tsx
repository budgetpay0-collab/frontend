import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "../components/Budget/Header";
import GlassEffectBoxes from "../components/Budget/GlassEffectBoxes";
import OverallBudgetProgress from "../components/Budget/OverallBudgetProgress";
import DynamicCategory from "../components/Budget/DynamicCategory";

import data from "../../store/data.json";

const Budget = () => {
  const monthlyIncome = data.user.monthlyIncome;
  const monthlySpend = data.user.monthlySpend;

  const onAddCategories = () => {
    // TODO: navigate/open modal
    // router.push("/(tabs)/budget/add-category")
    console.log("Add Categories");
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="never"
          overScrollMode="never"
          bounces={false}
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

          <DynamicCategory categories={data.categories} />

          {/* ✅ Add button at the end */}
          <View style={styles.addBtnWrap}>
            <Pressable
              onPress={onAddCategories}
              android_ripple={{ color: "rgba(255,255,255,0.18)" }}
              style={({ pressed }) => [
                styles.addBtn,
                pressed && styles.addBtnPressed,
              ]}
            >
              <Text style={styles.addBtnText}>+ Add Categories</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Budget;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#101010",
  },
  container: {
    flex: 1,
    backgroundColor: "#101010",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 22, // ✅ small but enough space for button
  },
  divider: {
    backgroundColor: "white",
    height: 0.5,
    opacity: 0.2,
  },

  // ✅ Button styles (like screenshot)
  addBtnWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    paddingVertical: 18,
  },
  addBtn: {
    backgroundColor: "#16C784", // nice green
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 160,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  addBtnText: {
    color: "#06140F",
    fontFamily: "Poppins-SemiBold",
    fontSize: 13.5,
  },
});