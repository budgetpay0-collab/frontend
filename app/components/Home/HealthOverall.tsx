// components/Home/HealthOverall.tsx
import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import rawData from "../../../store/data.json";

type Category = {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  color: string;
  icon?: string;
};

const formatINR = (n: number) => {
  const v = Number(n) || 0;
  try {
    return `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(v)}`;
  } catch {
    return `₹${Math.round(v)}`;
  }
};

function mapIconToIonicon(id: string, icon?: string): keyof typeof Ionicons.glyphMap {
  switch (id) {
    case "travel":
      return "airplane";
    case "shopping":
      return "cart";
    case "food":
      return "fast-food";
    case "rent":
      return "home";
    default:
      break;
  }
  const s = (icon || "").toLowerCase();
  if (s.includes("air")) return "airplane";
  if (s.includes("shop")) return "cart";
  if (s.includes("food")) return "fast-food";
  if (s.includes("home")) return "home";
  return "pricetag";
}

function getStatus(allocated: number, spent: number) {
  const remaining = (Number(allocated) || 0) - (Number(spent) || 0);
  if (remaining >= 200) return { label: "Great", color: "#22C55E" };
  if (remaining >= 0) return { label: "Good", color: "#3B82F6" };
  return { label: "Poor", color: "#FF3B30" };
}

const HealthOverall = () => {
  const categories: Category[] = (rawData as any)?.categories ?? [];

  const rows = useMemo(() => {
    return categories.map((c) => {
      const allocated = Number(c.allocated) || 0;
      const spent = Number(c.spent) || 0;
      const remaining = allocated - spent;
      const status = getStatus(allocated, spent);
      return {
        ...c,
        allocated,
        spent,
        remaining,
        statusLabel: status.label,
        statusColor: status.color,
      };
    });
  }, [categories]);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Monthly Category Health Overview</Text>

      {/* ✅ Outer padding prevents left/right cutting */}
      <View style={styles.outerPad}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ✅ Card keeps rounded corners; table has minWidth so columns never squeeze */}
          <View style={styles.card}>
            <View style={styles.table}>
              {/* Header */}
              <View style={[styles.row, styles.headerRow]}>
                <Text style={[styles.hCell, styles.colCategory]}>Category</Text>
                <Text style={[styles.hCell, styles.colAllocated]}>Allocated</Text>
                <Text style={[styles.hCell, styles.colSpent]}>Spent</Text>
                <Text style={[styles.hCell, styles.colRemaining]}>Remaining</Text>
                <Text style={[styles.hCell, styles.colStatus]}>Status</Text>
              </View>

              {/* Rows */}
              {rows.map((r) => {
                const remainingColor =
                  r.remaining < 0 ? "#FF3B30" : r.remaining > 0 ? "#22C55E" : "#FFFFFF";

                return (
                  <View key={r.id} style={[styles.row, styles.dataRow]}>
                    {/* Category */}
                    <View style={[styles.cell, styles.colCategory, styles.catCell]}>
                      <Ionicons
                        name={mapIconToIonicon(r.id, r.icon)}
                        size={16}
                        color={r.color || "#fff"}
                        style={{ marginRight: 8 }}
                      />
                      <Text
                        style={[styles.catText, { color: r.color || "#fff" }]}
                        numberOfLines={1}
                      >
                        {r.name}
                      </Text>
                    </View>

                    {/* Allocated */}
                    <Text style={[styles.cell, styles.colAllocated]}>
                      {formatINR(r.allocated)}
                    </Text>

                    {/* Spent */}
                    <Text style={[styles.cell, styles.colSpent]}>{formatINR(r.spent)}</Text>

                    {/* Remaining */}
                    <Text style={[styles.cell, styles.colRemaining, { color: remainingColor }]}>
                      {r.remaining < 0 ? `-${formatINR(Math.abs(r.remaining)).slice(1)}` : formatINR(r.remaining)}
                    </Text>

                    {/* Status */}
                    <Text style={[styles.cell, styles.colStatus, { color: r.statusColor }]}>
                      {r.statusLabel}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default HealthOverall;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 14,
    alignSelf: "stretch",
  },

  title: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
    marginBottom: 10,
  },

  // ✅ makes sure table never touches edges of screen
  outerPad: {
    paddingHorizontal: 6,
  },

  // ✅ keep extra right padding so last column doesn't clip while scrolling
  scrollContent: {
    paddingRight: 12,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    borderRadius: 14,
    overflow: "hidden",
  },

  // ✅ critical: table width bigger than screen so scroll happens, no squeeze/cut
  table: {
    minWidth: 520, // adjust if you add more columns
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerRow: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.16)",
  },

  dataRow: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.10)",
  },

  hCell: {
    color: "rgba(255,255,255,0.92)",
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },

  cell: {
    color: "rgba(255,255,255,0.80)",
    fontFamily: "Poppins-Medium",
    fontSize: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },

  // Column widths as fixed px (best for horizontal scroll tables)
  colCategory: {
    width: 160,
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.16)",
  },
  colAllocated: {
    width: 90,
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.16)",
  },
  colSpent: {
    width: 70,
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.16)",
  },
  colRemaining: {
    width: 95,
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.16)",
  },
  colStatus: {
    width: 85,
  },

  catCell: {
    flexDirection: "row",
    alignItems: "center",
  },

  catText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
    flexShrink: 1,
  },
});