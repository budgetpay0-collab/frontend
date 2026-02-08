import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  monthlyAllocated: number; // ₹2000
  monthlySpent: number;     // ₹2000
};

const formatINR = (n: number) => {
  try {
    return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
  } catch {
    return String(Math.round(n));
  }
};

const GlassEffectBoxes: React.FC<Props> = ({ monthlyAllocated, monthlySpent }) => {
  const remaining = Math.max(monthlyAllocated - monthlySpent, 0);
  const usagePct = monthlyAllocated > 0 ? (monthlySpent / monthlyAllocated) * 100 : 0;

  const data = useMemo(
    () => [
      { id: "allocated", title: "Monthly Allocated", value: `₹${formatINR(monthlyAllocated)}` },
      { id: "spent", title: "Monthly Spent", value: `₹${formatINR(monthlySpent)}` },
      { id: "remaining", title: "Remaining", value: `₹${formatINR(remaining)}` },
      { id: "usage", title: "Usage", value: `${usagePct.toFixed(2)}%` },
    ],
    [monthlyAllocated, monthlySpent, remaining, usagePct]
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.grid}>
        {data.map((item) => (
          <View key={item.id} style={styles.cardOuter}>
            {/* Glass blur */}
            <BlurView intensity={22} tint="dark" style={StyleSheet.absoluteFill} />

            {/* Top rim highlight */}
            <LinearGradient
              colors={["rgba(255,255,255,0.18)", "rgba(255,255,255,0.00)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.topHighlight}
            />

            {/* Inner depth */}
            <LinearGradient
              colors={["rgba(255,255,255,0.06)", "rgba(0,0,0,0.55)"]}
              start={{ x: 0.2, y: 0.0 }}
              end={{ x: 0.6, y: 1 }}
              style={styles.depth}
            />

            {/* Soft edge vignette */}
            <LinearGradient
              colors={["rgba(0,0,0,0.00)", "rgba(0,0,0,0.65)"]}
              start={{ x: 0.5, y: 0.25 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.bottomShadow}
            />

            <View style={styles.cardContent}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default GlassEffectBoxes;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  cardOuter: {
    width: "48%",
    height: 118,
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 14,

    // glass border like screenshot
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",

    backgroundColor: "rgba(255,255,255,0.03)",

    // shadow
    shadowColor: "#000",
    shadowOpacity: 0.55,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },

  topHighlight: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 10,
  },

  depth: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },

  bottomShadow: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 72,
  },

  cardContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    justifyContent: "space-between",
  },

  title: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    letterSpacing: 0.2,
  },

  value: {
    color: "#FFFFFF",
    fontSize: 24,
    fontFamily: "Poppins-SemiBold",
    letterSpacing: 0.2,
  },
});