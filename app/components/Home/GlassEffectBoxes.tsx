import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRangeStore } from "../../../store/rangeStore";

type BoxItem = {
  id: string;
  title: string;
  value: string;
  subText?: string;
  subColor?: string;
  badge?: {
    bg: string;
    icon: keyof typeof Ionicons.glyphMap;
  };
};

type Props = {
  monthlyIncome: number;
  monthlySpend: number;
  saving: number; // or monthlyRemaining if you have that
};

const formatINR = (n: number) => {
  try {
    return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
  } catch {
    return String(Math.round(n));
  }
};

const RANGE_LABEL: Record<string, string> = {
  D: "Daily",
  W: "Weekly",
  M: "Monthly",
  Y: "Yearly",
};

const RANGE_MULTIPLIER: Record<string, number> = {
  D: 1 / 30,
  W: 1 / 4,
  M: 1,
  Y: 12,
};

const GlassEffectBoxes: React.FC<Props> = ({ monthlyIncome, monthlySpend, saving }) => {
  const activeRange = useRangeStore((s) => s.activeRange);
  const multiplier = RANGE_MULTIPLIER[activeRange];
  const label = RANGE_LABEL[activeRange];

  const income = monthlyIncome * multiplier;
  const spend = monthlySpend * multiplier;
  const savedAmt = saving * multiplier;
  const remaining = Math.max(income - spend, 0);

  const savingsPct = income > 0 ? (savedAmt / income) * 100 : 0;

  const data: BoxItem[] = useMemo(
    () => [
      {
        id: "income",
        title: `${label} Income`,
        value: `₹${formatINR(income)}`,
      },
      {
        id: "remaining",
        title: `${label} Remaining`,
        value: `₹${formatINR(remaining)}`,
        subText: spend > 0 ? "After spending" : "No spending yet",
        subColor: spend > 0 ? "rgba(255,255,255,0.75)" : "#ff3b30",
        badge: { bg: "#ff3b30", icon: "trending-down" },
      },
      {
        id: "spent",
        title: `${label} Spent`,
        value: `₹${formatINR(spend)}`,
        subText: `${label} Total`,
        subColor: "#34c759",
        badge: { bg: "#34c759", icon: "trending-up" },
      },
      {
        id: "savings",
        title: "Savings Progress",
        value: `${savingsPct.toFixed(1)}%`,
        subText: `₹${formatINR(savedAmt)} saved`,
        subColor: "rgba(255,255,255,0.75)",
      },
    ],
    [income, spend, savedAmt, remaining, savingsPct, label]
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.grid}>
        {data.map((item) => (
          <View key={item.id} style={styles.cardOuter}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />

            <LinearGradient
              colors={["rgba(255,255,255,0.28)", "rgba(255,255,255,0.00)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.topHighlight}
            />

            <LinearGradient
              colors={["rgba(0,0,0,0.00)", "rgba(0,0,0,0.60)"]}
              start={{ x: 0.5, y: 0.2 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.bottomShadow}
            />

            <View style={styles.cardContent}>
              {item.badge ? (
                <View style={[styles.badge, { backgroundColor: item.badge.bg }]}>
                  <Ionicons name={item.badge.icon} size={18} color="#000" />
                </View>
              ) : null}

              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.value}>{item.value}</Text>

              {item.subText ? (
                <Text style={[styles.subText, { color: item.subColor || "#aaa" }]}>
                  {item.subText}
                </Text>
              ) : null}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default GlassEffectBoxes;

const styles = StyleSheet.create({
  wrapper: { paddingTop: 6 },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  cardOuter: {
    width: "48%",
    height: 118,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    backgroundColor: "rgba(255,255,255,0.04)",
    shadowColor: "#000",
    shadowOpacity: 0.45,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },

  topHighlight: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 8,
  },

  bottomShadow: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
  },

  cardContent: { flex: 1, padding: 14 },

  badge: {
    position: "absolute",
    right: 12,
    top: 36,
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 12,
    fontFamily: "Poppins-Medium",
    marginBottom: 10,
  },

  value: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 6,
  },

  subText: { fontSize: 12, fontFamily: "Poppins-Regular" },
});