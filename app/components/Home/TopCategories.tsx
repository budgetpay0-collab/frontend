import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
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
  try {
    return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
  } catch {
    return String(Math.round(n));
  }
};

// map your data.json "icon" -> Ionicons names
function mapIconToIonicon(id: string, icon?: string): keyof typeof Ionicons.glyphMap {
  // prefer id mapping (stable)
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

  // fallback based on string icon (if provided)
  const s = (icon || "").toLowerCase();
  if (s.includes("air")) return "airplane";
  if (s.includes("shop")) return "cart";
  if (s.includes("food")) return "fast-food";
  if (s.includes("home")) return "home";
  return "pricetag";
}

const TopCategories = () => {
  const [activeTab, setActiveTab] = useState<"top" | "quick">("top");

  const categories: Category[] = (rawData as any)?.categories ?? [];

  // top spend categories sorted by spent desc
  const sorted = useMemo(() => {
    return [...categories]
      .map((c) => ({
        ...c,
        spent: Number(c.spent) || 0,
      }))
      .sort((a, b) => (b.spent || 0) - (a.spent || 0));
  }, [categories]);

  const maxSpent = useMemo(() => {
    return sorted.reduce((m, c) => Math.max(m, Number(c.spent) || 0), 0) || 1;
  }, [sorted]);

  return (
    <View style={styles.outerCard}>
      {/* <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} /> */}

     

     {/* Tabs (Horizontal Scroll) */}
<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.tabsRow}
>
  <TouchableOpacity
    activeOpacity={0.9}
    onPress={() => setActiveTab("top")}
    style={[
      styles.pill,
      activeTab === "top" ? styles.pillActive : styles.pillInactive,
    ]}
  >
    <Text
      style={[
        styles.pillText,
        activeTab === "top" ? styles.pillTextActive : styles.pillTextInactive,
      ]}
    >
      Top Spending Categories
    </Text>
    <Text
      style={[
        styles.pillIcon,
        activeTab === "top" ? styles.pillTextActive : styles.pillTextInactive,
      ]}
    >
      ˄˅
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    activeOpacity={0.9}
    onPress={() => setActiveTab("quick")}
    style={[
      styles.pill,
      activeTab === "quick" ? styles.pillActive : styles.pillInactive,
    ]}
  >
    <Text
      style={[
        styles.pillText,
        activeTab === "quick" ? styles.pillTextActive : styles.pillTextInactive,
      ]}
    >
      Quick Stats
    </Text>
    <Ionicons
      name="pulse"
      size={18}
      color={activeTab === "quick" ? "#000" : "rgba(255,255,255,0.85)"}
      style={{ marginLeft: 8 }}
    />
  </TouchableOpacity>

  {/* ✅ You can add more tabs later easily */}
</ScrollView>

      {/* Content */}
      {activeTab === "top" ? (
        <View style={styles.list}>
          {sorted.map((c) => {
            const pct = Math.max(0, Math.min(1, (Number(c.spent) || 0) / maxSpent));
            const fillW = `${pct * 100}%`;

            return (
              <View key={c.id} style={styles.item}>
                <View style={styles.itemTopRow}>
                  <View style={styles.leftRow}>
                    <Ionicons
                      name={mapIconToIonicon(c.id, c.icon)}
                      size={18}
                      color={c.color || "#fff"}
                      style={{ marginRight: 8 }}
                    />
                    <Text style={[styles.name, { color: c.color || "#fff" }]}>{c.name}</Text>
                  </View>

                  <Text style={styles.amount}>₹{formatINR(Number(c.spent) || 0)}</Text>
                </View>

                {/* progress */}
                <View style={styles.track}>
                  <View style={[styles.fill, { width: fillW, backgroundColor: c.color || "#22C55E" }]} />
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <View style={styles.quickWrap}>
          {/* simple quick stats */}
          <View style={styles.quickRow}>
            <Text style={styles.quickLabel}>Total categories</Text>
            <Text style={styles.quickValue}>{sorted.length}</Text>
          </View>
          <View style={styles.quickRow}>
            <Text style={styles.quickLabel}>Highest spend</Text>
            <Text style={styles.quickValue}>
              ₹{formatINR(maxSpent)}
            </Text>
          </View>
          <View style={styles.quickRow}>
            <Text style={styles.quickLabel}>Top category</Text>
            <Text style={styles.quickValue}>{sorted[0]?.name ?? "-"}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default TopCategories;

const styles = StyleSheet.create({
  outerCard: {
    // borderRadius: 18,
    overflow: "hidden",
    // borderWidth: 1,
    // borderColor: "rgba(255,255,255,0.18)",
    // backgroundColor: "rgba(255,255,255,0.04)",
    // shadowColor: "#000",
    // shadowOpacity: 0.45,
    // shadowRadius: 14,
    // shadowOffset: { width: 0, height: 8 },
    // elevation: 8,
    alignSelf: "stretch",
    paddingBottom: 14,
    paddingTop: 15,
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
    height: 120,
  },

  tabsRow: {
    flexDirection: "row",
    gap: 12,
    // paddingHorizontal: 12,/
    marginBottom: 8,
  },

  pill: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  pillActive: {
    backgroundColor: "#22C55E",
  },
  pillInactive: {
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  pillText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
  },
  pillTextActive: {
    color: "#000",
  },
  pillTextInactive: {
    color: "rgba(255,255,255,0.90)",
  },
  pillIcon: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },

  list: {
    // paddingHorizontal: 14,
    paddingTop: 6,
  },

  item: {
    marginBottom: 16,
  },

  itemTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  leftRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  name: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
  },

  amount: {
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
  },

  track: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.75)",
    overflow: "hidden",
  },

  fill: {
    height: 10,
    borderRadius: 999,
  },

  quickWrap: {
    paddingHorizontal: 14,
    paddingTop: 6,
    gap: 12,
  },

  quickRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  quickLabel: {
    color: "rgba(255,255,255,0.75)",
    fontFamily: "Poppins-Medium",
    fontSize: 14,
  },

  quickValue: {
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
  },
});