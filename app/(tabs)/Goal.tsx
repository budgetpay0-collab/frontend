// screens/Goal.tsx
import React, { useMemo } from "react";
import { StyleSheet, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TopHeader from "../components/Goal/TopHeader";
import MonthlyGoal from "../components/Goal/MonthlyGoal";
import Card from "../components/Goal/Card";
import SavingTip from "../components/Goal/SavingTip";
import { useCategoryStore } from "@/store/categoryStore";
import { useUserStore } from "@/store/userStore";

const Goal = () => {
  const categories = useCategoryStore((state) => state.categories);
  const user = useUserStore((state) => state.user);

  const { totalSpent } = useMemo(() => {
    return categories.reduce(
      (acc, category) => ({
        totalAllocated: acc.totalAllocated + (category.allocated ?? 0),
        totalSpent: acc.totalSpent + (category.spent ?? 0),
      }),
      { totalAllocated: 0, totalSpent: 0 }
    );
  }, [categories]);

  const income = user?.income ?? 0;
  const goal = user?.goal ?? 0;
  const moneyLeft = income - totalSpent;

  const { monthEndDate, daysLeft, dailyTarget, incomePercent } = useMemo(() => {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const dd = String(lastDay.getDate()).padStart(2, "0");
    const mm = String(lastDay.getMonth() + 1).padStart(2, "0");
    const yyyy = lastDay.getFullYear();
    const monthEndDate = `${dd}/${mm}/${yyyy}`;
    const daysLeft = lastDay.getDate() - now.getDate() + 1;
    const dailyTarget = goal > 0 ? goal / 30 : 0;
    const incomePercent = income > 0 ? (goal / income) * 100 : 0;
    return { monthEndDate, daysLeft, dailyTarget, incomePercent };
  }, [goal, income]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
      >
        <TopHeader />

        <MonthlyGoal moneyLeft={moneyLeft} goal={goal} income={income} totalSpent={totalSpent} />

        <Card
          monthEndDate={monthEndDate}
          daysLeft={daysLeft}
          dailyTarget={dailyTarget}
          incomePercent={incomePercent}
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
  safe: { flex: 1, backgroundColor: "#0B0B0B" },
  scroll: { flex: 1 },
  scrollContent: {
    paddingBottom: 0,
  },
  image: {
    width: "100%",
    height: 80,
    marginTop: 16,
  },
});