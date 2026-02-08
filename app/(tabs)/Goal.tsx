// screens/Goal.tsx
import React from "react";
import { StyleSheet, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TopHeader from "../components/Goal/TopHeader";
import MonthlyGoal from "../components/Goal/MonthlyGoal";
import Card from "../components/Goal/Card";
import SavingTip from "../components/Goal/SavingTip";

const Goal = () => {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
      >
        <TopHeader />

        <MonthlyGoal current={5000} target={10000} />

        <Card
          monthEndDate="15/05/2026"
          daysLeft={15}
          dailyTarget={2000}
          incomePercent={33.8}
        />

        <Image
          source={require("../../assets/images/line.png")}
          style={styles.image}
          resizeMode="contain"
        />

        <SavingTip />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Goal;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0B0B0B" }, // ✅ IMPORTANT
  scroll: { flex: 1 },

  scrollContent: {
    paddingBottom: 0, // ✅ remove extra end blank
  },

  image: {
    width: "100%",
    height: 80,
    marginTop: 16,
  },
});