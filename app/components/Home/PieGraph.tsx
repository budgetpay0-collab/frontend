import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

import rawData from "../../../store/data.json";

type Category = {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  color: string;
  icon?: string;
};

const PieGraph = () => {
  const categories: Category[] = (rawData as any)?.categories ?? [];

  const totalAllocated = useMemo(() => {
    return categories.reduce((sum, c) => sum + (Number(c.allocated) || 0), 0);
  }, [categories]);

  const pieData = useMemo(() => {
    return categories
      .map((c) => {
        const val = Number(c.allocated) || 0; // ✅ allocated (change to c.spent if needed)
        const percent =
          totalAllocated > 0 ? Math.round((val / totalAllocated) * 100) : 0;

        return {
          value: val,
          color: c.color || "#999",
          text: `${percent}%`,
        };
      })
      .filter((x) => x.value > 0);
  }, [categories, totalAllocated]);

  return (
    <View style={styles.outerCard}>
      {/* Glass blur background */}
      <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />

      {/* Top glossy highlight */}
      <LinearGradient
        colors={["rgba(255,255,255,0.28)", "rgba(255,255,255,0.00)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.topHighlight}
      />

      {/* Bottom shadow depth */}
      <LinearGradient
        colors={["rgba(0,0,0,0.00)", "rgba(0,0,0,0.60)"]}
        start={{ x: 0.5, y: 0.2 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.bottomShadow}
      />

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Budget Allocation</Text>

        <View style={styles.chartWrap}>
          <PieChart
            data={pieData}
            radius={140}
            strokeWidth={2}
            strokeColor={"#000"} // gap between slices
            showText
            textColor="#fff"
            textSize={14}
            textBackgroundColor="transparent"
          />
        </View>
      </View>
    </View>
  );
};

export default PieGraph;

const styles = StyleSheet.create({
  outerCard: {
    borderRadius: 42,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    backgroundColor: "rgba(255,255,255,0.04)",
    shadowColor: "#000",
    shadowOpacity: 0.45,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    alignSelf: "stretch",
    marginTop:10
  },

  content: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    alignItems: "center",
  },

  title: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 10,
  },

  chartWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 8,
  },

  topHighlight: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 10,
  },

  bottomShadow: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 90,
  },
});