// components/Home/HealthOverall.tsx
import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCategoryStore } from "@/store/categoryStore";

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
  }

  const s = (icon || "").toLowerCase();
  if (s.includes("air")) return "airplane";
  if (s.includes("shop")) return "cart";
  if (s.includes("food")) return "fast-food";
  if (s.includes("home")) return "home";

  return "pricetag";
}

function getStatus(allocated: number, spent: number) {
  const remaining = allocated - spent;

  if (remaining >= 200) return { label: "Great", color: "#22C55E" };
  if (remaining >= 0) return { label: "Good", color: "#3B82F6" };

  return { label: "Poor", color: "#FF3B30" };
}

const HealthOverall = () => {
  const categories = useCategoryStore((s) => s.categories);

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

  const isEmpty = categories.length === 0;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Monthly Category Health Overview</Text>

      {isEmpty ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyCard}>
            <View style={styles.iconCircle}>
              <Ionicons name="analytics-outline" size={32} color="#22C55E" />
            </View>

            <Text style={styles.emptyTitle}>No category health data</Text>

            <Text style={styles.emptySub}>
              Create categories and start adding transactions to see spending
              health insights.
            </Text>

            <View style={styles.dottedRow}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.outerPad}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
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
                    r.remaining < 0
                      ? "#FF3B30"
                      : r.remaining > 0
                      ? "#22C55E"
                      : "#FFFFFF";

                  return (
                    <View key={r.id} style={[styles.row, styles.dataRow]}>
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

                      <Text style={[styles.cell, styles.colAllocated]}>
                        {formatINR(r.allocated)}
                      </Text>

                      <Text style={[styles.cell, styles.colSpent]}>
                        {formatINR(r.spent)}
                      </Text>

                      <Text
                        style={[
                          styles.cell,
                          styles.colRemaining,
                          { color: remainingColor },
                        ]}
                      >
                        {r.remaining < 0
                          ? `-${formatINR(Math.abs(r.remaining)).slice(1)}`
                          : formatINR(r.remaining)}
                      </Text>

                      <Text
                        style={[
                          styles.cell,
                          styles.colStatus,
                          { color: r.statusColor },
                        ]}
                      >
                        {r.statusLabel}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        </View>
      )}
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

  /* EMPTY STATE */

  emptyContainer: {
    paddingHorizontal: 20,
  },

  emptyCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    paddingVertical: 36,
    paddingHorizontal: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(34,197,94,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 17,
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
    marginBottom: 6,
  },

  emptySub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    lineHeight: 18,
    maxWidth: 260,
  },

  dottedRow: {
    flexDirection: "row",
    marginTop: 16,
    gap: 8,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.35)",
  },

  /* TABLE */

  outerPad: {
    paddingHorizontal: 6,
  },

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

  table: {
    minWidth: 520,
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

  colCategory: { width: 160 },
  colAllocated: { width: 90 },
  colSpent: { width: 70 },
  colRemaining: { width: 95 },
  colStatus: { width: 85 },

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